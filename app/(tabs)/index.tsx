import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

interface VoiceNote {
  id: string;
  title: string;
  filePath: string;
  date: string;
}

export default function App() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string>('');
  const [recordingTitle, setRecordingTitle] = useState<string>('');
  const [recordings, setRecordings] = useState<VoiceNote[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // Request permissions on load
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow microphone access to record audio.');
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const { recording } = await Audio.Recording.createAsync(
        {
          android: {
            extension: '.m4a',
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          },
          ios: {
            extension: '.m4a',
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          web: {}, 
        }
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  // Stop recording and save the file
  const stopRecording = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI() || '';
        setRecordingUri(uri);
        setIsRecording(false);
        saveRecording(uri);
      } catch (error) {
        console.error('Failed to stop recording:', error);
      }
    }
  };

  // Save the recording to the list
  const saveRecording = (uri: string) => {
    if (!recordingTitle.trim()) {
      Alert.alert('Error', 'Please provide a title for the recording.');
      return;
    }

    const newRecording: VoiceNote = {
      id: Date.now().toString(),
      title: recordingTitle,
      filePath: uri,
      date: new Date().toLocaleString(),
    };

    setRecordings([...recordings, newRecording]);
    setRecordingTitle(''); 
  };

  // Delete a recording
  const deleteRecording = (id: string) => {
    const updatedRecordings = recordings.filter((item) => item.id !== id);
    setRecordings(updatedRecordings);
  };

  // Play a recording
  const playRecording = async (uri: string) => {
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({ uri });
      await soundObject.playAsync();
    } catch (error) {
      console.error('Failed to play recording:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Voice Note App</Text>

      <TextInput
        style={styles.titleInput}
        placeholder="Enter recording title"
        value={recordingTitle}
        onChangeText={setRecordingTitle}
      />

     <View style={styles.buttons}>
          {isRecording ? (
            <TouchableOpacity
              style={styles.button}
              onPress={stopRecording}
            >
              <Text style={styles.buttonText}>Stop Recording</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={startRecording}
            >
              <Text style={styles.buttonText}>Start Recording</Text>
            </TouchableOpacity>
          )}
      </View>

      {recordingUri ? (
        <Text style={styles.uriText}>Recording saved at: {recordingUri}</Text>
      ) : null}

      <Text style={styles.subHeader}>Recorded Notes</Text>

      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recordingItem}>
            <Text style={styles.recordingTitle}>{item.title}</Text>
            <Text style={styles.recordingDate}>{item.date}</Text>

         <View style={styles.recordingButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => playRecording(item.filePath)}
           >
           <Text style={styles.buttonText}>Play</Text>
         </TouchableOpacity>
         
         <TouchableOpacity
           style={styles.button}
           onPress={() => deleteRecording(item.id)}
         >
           <Text style={styles.buttonText}>Delete</Text>
         </TouchableOpacity>
         </View>

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#BDBDBD',
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },

  titleInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },

  buttons: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: 'black',
  },

  button: {
    backgroundColor: 'black',  
    padding: 10,
    borderRadius: 5, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',  
    fontSize: 16,
  },

  uriText: {
    marginTop: 10,
    color: '#333',
  },

  recordingItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },

  recordingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recordingDate: {
    fontSize: 14,
    color: '#555',
  },
  
  recordingButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    backgroundColor: '#ffffff',
  },
});
