from flask import Flask, request, jsonify
import os
import numpy as np
import librosa
from pydub import AudioSegment, effects
import noisereduce as nr
import tensorflow as tf

app = Flask(__name__)

# Load the model
def load_model():
    saved_model_path = './lib/model8723.json'
    saved_weights_path = './lib/model8723_weights.weights.h5'

    with open(saved_model_path, 'r') as json_file:
        json_savedModel = json_file.read()

    model = tf.keras.models.model_from_json(json_savedModel)
    model.load_weights(saved_weights_path)
    model.compile(loss='categorical_crossentropy', optimizer='RMSProp', metrics=['categorical_accuracy'])
    return model

model = load_model()

def preprocess(file_path, frame_length=2048, hop_length=512):
    _, sr = librosa.load(path=file_path, sr=None)
    rawsound = AudioSegment.from_file(file_path, duration=None)
    normalizedsound = effects.normalize(rawsound, headroom=5.0)
    normal_x = np.array(normalizedsound.get_array_of_samples())
    final_x = nr.reduce_noise(normal_x, sr=sr)

    if final_x.dtype != np.float32:
        final_x = final_x.astype(np.float32)

    f1 = librosa.feature.rms(y=final_x, frame_length=frame_length, hop_length=hop_length).T
    f2 = librosa.feature.zero_crossing_rate(y=final_x, frame_length=frame_length, hop_length=hop_length).T
    f3 = librosa.feature.mfcc(y=final_x, sr=sr, n_mfcc=13, hop_length=hop_length).T

    X = np.concatenate((f1, f2, f3), axis=1)
    X_3D = np.expand_dims(X, axis=0)

    return X_3D

@app.route('/process_audio', methods=['POST'])
def process_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    file_path = './uploaded_audio.wav'
    file.save(file_path)

    x = preprocess(file_path)
    predictions = model.predict(x)
    max_emo = np.argmax(predictions)

    emotions = ['neutral', 'happy', 'calm', 'sad', 'angry', 'fearful', 'disgust', 'surprised']
    emotion = emotions[max_emo]

    return jsonify({'emotion': emotion})

if __name__ == '__main__':
    app.run(debug=True)
