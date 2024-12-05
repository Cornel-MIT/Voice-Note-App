import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { PermissionsAndroid, Platform } from 'react-native';

const audioRecorderPlayer = new AudioRecorderPlayer();

type VoiceNote = {
  id: string;
  filePath: string;
  date: Date;
};

export default function HomeScreen() {
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);
      }
    };
    requestPermissions();
  }, []);

  const startRecording = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      setIsRecording(true);
      console.log('Recording started: ', result);
    } catch (error) {
      Alert.alert('Error', 'Could not start recording.');
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setIsRecording(false);
      console.log('Recording stopped: ', result);

      setVoiceNotes((prevNotes) => [
        ...prevNotes,
        { id: Date.now().toString(), filePath: result, date: new Date() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Could not stop recording.');
    }
  };

  const playVoiceNote = async (filePath: string) => {
    try {
      const result = await audioRecorderPlayer.startPlayer(filePath);
      setIsPlaying(true);
      console.log('Playing: ', result);
  
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.currentPosition === e.duration) {
          stopPlayback();
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Could not play the audio.');
    }
  };
  

  const stopPlayback = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      setIsPlaying(false);
      console.log('Playback stopped.');
    } catch (error) {
      Alert.alert('Error', 'Could not stop playback.');
    }
  };

  const deleteVoiceNote = (id: string) => {
    setVoiceNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Voice Notes</Text>

      <FlatList
        data={voiceNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              {item.date.toLocaleDateString()} - {item.date.toLocaleTimeString()}
            </Text>
            <View style={styles.noteActions}>
              <Button
                title={isPlaying ? 'Stop' : 'Play'}
                onPress={() =>
                  isPlaying ? stopPlayback() : playVoiceNote(item.filePath)
                }
              />
              <Button title="Delete" color="red" onPress={() => deleteVoiceNote(item.id)} />
            </View>
          </View>
        )}
      />

      <View style={styles.controls}>
        <Button
          title={isRecording ? 'Stop Recording' : 'Start Recording'}
          onPress={isRecording ? stopRecording : startRecording}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  noteContainer: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  noteText: {
    fontSize: 16,
    marginBottom: 10,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controls: {
    marginTop: 20,
  },
});
