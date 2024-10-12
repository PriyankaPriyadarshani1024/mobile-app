import { View, Text, FlatList, StyleSheet, Image, Button } from 'react-native';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Client, Storage } from 'appwrite';
import * as Sharing from 'expo-sharing';
import { appwriteConfig } from '../../lib/appwrite'
import phoneNumbers from './gadians.jsx';
import { Twilio } from 'twilio';
import LocationLink from './location.jsx';
import axios from 'axios';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import '@tensorflow/tfjs-react-native';

const initTensorFlow = async () => {
  await tf.ready();  // Initializes TensorFlow.js
  console.log('TensorFlow.js is ready');
};

export default function Home() {
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [recording, setRecording] = useState(null);
  const [emotion, setEmotion] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFile, setRecordedFile] = useState(null);
  const [locationLink, setLocationLink] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState(['+94779178033']);  // Sample phone numbers
  const audioRecorderPlayer = new AudioRecorderPlayer();


  const tfLite = new Tflite();

const loadModel = () => {
  tfLite.loadModel({
    model: '../lib/model.tflite', // place the model in android/app/src/main/assets for Android
    onLoad: (err, res) => {
      if (err) {
        console.error("Error loading model:", err);
      } else {
        console.log("Model loaded successfully!");
      }
    },
  });
};



const client = new Twilio(accountSid, authToken);

  useEffect(() => {
    // Get location (replace with your actual location fetching logic)
    navigator.geolocation.getCurrentPosition(
      position => {
        setLocationLink(`https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`);
      },
      error => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      } else {
        console.log('Permission to access microphone denied');
      }
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording finished, saved at', uri);
    return uri;
  };
  const sendAudioToBackend = async (audioUri) => {
    const response = await fetch('http://localhost:5000/process-voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audioFilePath: audioUri,
        phoneNumbers: ['+123456789'],  // Fetch phone numbers from `gadians.jsx`
        locationLink: 'https://maps.google.com/?q=...',  // Fetch location from `location.jsx`
      }),
    });
  
    const data = await response.json();
    console.log("Response from server:", data);
  };

  function sendSMS(emotion) {
    const message = `User is feeling ${emotion}. Location: ${locationLink}`;
    phoneNumbers.forEach(phone => {
      client.messages.create({
        body: message,
        from: '+18507808516',
        to: phone,
      })
      .then(message => console.log(`Message sent to ${phone}: ${message.sid}`))
      .catch(error => console.error('Error sending SMS:', error));
    });
  }


  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
          <Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>
          <Button style={styles.button} onPress={() => Sharing.shareAsync(recordingLine.file)} title="Share"></Button>
        </View>
      );
    });
  }


  const processVoiceRecording = async (audioUri) => {
    const audioTensor = preprocessAudio(audioUri);
    
    // Assuming your model input is processed properly
    tfLite.runModelOnAudio({
      path: audioUri,  // Path to the recorded audio file
      inputShape: [1, 257, 15],  // Update with the correct input shape of your model
    }, (err, res) => {
      if (err) {
        console.error("Error running model:", err);
      } else {
        console.log("Model Prediction:", res);
        // Handle the emotion prediction and SMS logic here
      }
    });
  };

  const preprocessAudio = (audioUri) => {
    // Implement audio preprocessing steps (if needed)
    return audioUri;  // This is a placeholder
  };
  
  useEffect(() => {
    loadModel();
  }, []);

  return (
    <>
      <SafeAreaView className="bg-pink-200" h-full>
        <FlatList
          ListHeaderComponent={() => (
            <View className="flex my-6 px-4 space-y-6">
              <View className="flex justify-between items-start flex-row mb-6">
                <View>
                  <Text className="font-pmedium text-2xl text-pink-950">
                    Welcome Back
                  </Text>
                  <Text className="text-4xl font-psemibold text-white">
                    SafeConnect
                  </Text>
                </View>
                <View className="mt-1.5">
                  <Image
                    source={images.cards}
                    className="w-10 h-11"
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
      <View>
      <Button title="Record Audio" onPress={startRecording} />
      <Button title="Stop Recording" onPress={stopRecording} />
    </View>

    <StatusBar backgroundColor="#FBDFDBFF" style="#4F2730" />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  fill: {
    flex: 1,
    marginHorizontal: 20,
  },
  button: {
    margin: 16,
  },
});

