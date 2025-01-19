# SafeConnect - Women's Safety App

## Overview

**SafeConnect** is a mobile application designed to ensure the safety of women by providing real-time audio streaming and distress signal functionalities. The app captures surrounding sounds or noise in potentially unsafe situations, processes the audio for emotion detection, and sends alerts to emergency contacts. The system differentiates between casual situations (e.g., laughter) and emergency situations (e.g., distress or fear) through emotion analysis, helping in timely intervention.

## Features

- **Sign In/Sign Up**: Users can sign in to their accounts or sign up if they don’t have one.
- **Guardians Management**: Users can add, edit, and delete emergency contacts (guardians) from the app. These contacts will receive alerts when the user is in distress.
- **Emotion Detection**: The app records audio when the user feels unsafe and analyzes it for signs of distress, using emotion recognition models.
- **SMS Alerts**: Based on the detected emotion, the app sends an SMS to the user's saved contacts, alerting them with a "I am in danger" message.
- **Real-Time Notification**: The app gives a 10-second prompt before sending the alert SMS, ensuring that the user has a chance to cancel the alert if it was triggered by accident. If no action is taken, the alert is automatically sent.

## Tech Stack

- **Frontend**: React Native
- **Backend**: Python with Appwrite for backend services (user authentication, data storage)
- **Emotion Detection**: TensorFlow Lite for emotion detection using recorded audio.
- **Database**: Appwrite for storing user and guardian information.
- **SMS Sending**: Integrated SMS functionality to send distress alerts.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) - Required to run React Native.
- [Expo](https://expo.dev/) - For building the app.
- [Appwrite](https://appwrite.io/) - To handle user authentication and manage database operations.

### Clone the Repository

```bash
git clone https://github.com/yourusername/SafeConnect.git
cd SafeConnect
