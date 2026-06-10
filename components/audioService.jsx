import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export const playFeedbackSound = async (soundEnabled) => {
  if (!soundEnabled) return;

  try {
    const { sound } = await Audio.Sound.createAsync({ uri: 'https://firebasestorage.googleapis.com/v0/b/harbison-ai.firebasestorage.app/o/mixkit-modern-technology-select-3124.wav?alt=media&token=88bf284a-5ee0-420d-b79e-99f7d75d30f7' });
    await sound.playAsync();
  } catch (error) {
    console.log(error);
  }
};