import React, { Component } from 'react';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View, 
  Image
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

export default class App extends Component {
  state = {
    isPlaying: false,
    playbackInstance: null,
    volume: 1.0,
    currentTrackIndex: 0,
    isBuffering: false,
  }

	async componentDidMount() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playThroughEarpieceAndroid: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
    this.loadAudio();
  }

  handlePlayPause = async () => {
    const { isPlaying, playbackInstance } = this.state;
    isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync();
    this.setState({
      isPlaying: !isPlaying
    });
  }

  onPlaybackStatusUpdate = (status) => {
    this.setState({
      isBuffering: status.isBuffering
    });
  }

  async loadAudio() {
    const playbackInstance = new Audio.Sound();
		const status = {
			shouldPlay: this.state.isPlaying,
			volume: this.state.volume,
    };
    playbackInstance
      .setOnPlaybackStatusUpdate(
        this.onPlaybackStatusUpdate
      );
    await playbackInstance.loadAsync(require('./music/ukulele.mp3'), status, false);
    this.setState({
      playbackInstance
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Aloha Music</Text>
        <Image source={require("./images/ukulele.png")} style={styles.image} />
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.control}
            onPress={this.handlePlayPause}
          >
            {this.state.isPlaying ?
              <Feather name="pause" size={32} color="#563822"/> :
              <Feather name="play" size={32} color="#563822"/>
            }
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4e3cf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#da9547',
    width: 300,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
  },
  image: {
    height: 500,
    width: 300,
    marginTop: 30,
    marginBottom: 30,
  },
  buffer: {
    color: '#563822',
    width: 300,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  }

});

