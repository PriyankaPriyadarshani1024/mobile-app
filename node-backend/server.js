// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());

// Parse incoming JSON requests
app.use(bodyParser.json());

// Load TensorFlow model
const loadModel = async() => {
    const model = await tf.loadLayersModel('file://../lib/model8723.json'); // Use file URL for local model
    return model;
};

let model;
loadModel().then(loadedModel => {
    model = loadedModel;
});

// Twilio configuration


// Process voice, predict emotion, and send SMS
app.post('/process-voice', async(req, res) => {
    const { audioFilePath, phoneNumbers, locationLink } = req.body;

    // Preprocess the audio file (assuming it's already uploaded)
    const inputTensor = await preprocessAudio(audioFilePath);

    // Get the emotion prediction from the model
    const prediction = model.predict(inputTensor);
    const emotion = prediction.argMax(-1).dataSync()[0];

    const emotions = ['neutral', 'happy', 'calm', 'sad', 'angry', 'fearful', 'disgust', 'surprised'];
    const detectedEmotion = emotions[emotion];

    // Send SMS to each phone number
    phoneNumbers.forEach(phoneNumber => {
        twilioClient.messages.create({
            body: `Emotion detected: ${detectedEmotion}\nLocation: ${locationLink}`,
            from: '+18507808516', // Twilio phone number
            to: phoneNumber
        }).then(message => {
            console.log(`Message sent to ${phoneNumber}`);
        }).catch(err => {
            console.log('Error sending message:', err);
        });
    });

    res.json({ emotion: detectedEmotion, message: 'SMS sent successfully to contacts!' });
});

// Preprocess audio file
const preprocessAudio = async(filePath) => {
    // Convert audio to WAV format using ffmpeg (if not already in WAV format)
    const wavFilePath = filePath.replace(path.extname(filePath), '.wav');

    await new Promise((resolve, reject) => {
        ffmpeg(filePath)
            .output(wavFilePath)
            .on('end', resolve)
            .on('error', reject)
            .run();
    });

    // Load the audio file (you could use librosa in Python for feature extraction, or implement directly in Node.js)
    const audioData = fs.readFileSync(wavFilePath);
    const tensorData = tf.node.decodeWav(audioData); // Decodes WAV file into TensorFlow tensor

    // Preprocess the audio data into features
    const processedData = preprocessFeatures(tensorData);
    return processedData;
};

// Feature extraction (dummy function - replace with real feature extraction)
const preprocessFeatures = (tensorData) => {
    // Implement actual feature extraction for audio (e.g., MFCC, Spectrogram)
    const features = tensorData.slice([0, 0], [tensorData.shape[0], 13]); // Example: extract the first 13 MFCC coefficients
    return features.expandDims(0); // Add batch dimension for prediction
};

// Start the server
app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});