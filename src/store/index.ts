import { create } from 'zustand';
import { KaraokeState } from '../types';

const useKaraokeStore = create<KaraokeState>((set, get) => ({
  audioContext: null,
  audioBuffer: null,
  audioSource: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  lyrics: [],
  chords: [],
  currentLyricIndex: 0,
  currentChordIndex: 0,
  theme: 'light',
  fontSize: 'medium',

  startPlayback: () => {
    const { audioContext, audioBuffer, volume, currentTime } = get();
    if (!audioContext || !audioBuffer) return;

    // Resume AudioContext if it's suspended
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    // Stop any existing playback
    get().stopPlayback();

    // Create new audio source
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // Create gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;

    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start playback from current time
    source.start(0, currentTime);

    // Update state
    set({ 
      audioSource: source,
      isPlaying: true 
    });

    // Start time tracking
    const startTime = audioContext.currentTime - currentTime;
    const updateTime = () => {
      if (!get().isPlaying) return;
      
      const newCurrentTime = audioContext.currentTime - startTime;
      if (newCurrentTime <= audioBuffer.duration) {
        set({ currentTime: newCurrentTime });
        requestAnimationFrame(updateTime);
      } else {
        get().stopPlayback();
        set({ currentTime: 0 });
      }
    };
    requestAnimationFrame(updateTime);
  },

  pausePlayback: () => {
    const { audioContext } = get();
    if (audioContext) {
      audioContext.suspend();
      set({ isPlaying: false });
    }
  },

  stopPlayback: () => {
    const { audioSource } = get();
    if (audioSource) {
      audioSource.stop();
      audioSource.disconnect();
      set({ 
        audioSource: null,
        isPlaying: false 
      });
    }
  },

  setVolume: (newVolume: number) => {
    const { audioContext, audioSource } = get();
    if (!audioContext || !audioSource) return;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = newVolume;
    
    audioSource.disconnect();
    audioSource.connect(gainNode);
    gainNode.connect(audioContext.destination);

    set({ volume: newVolume });
  },

  seekTo: (time: number) => {
    const { audioBuffer, isPlaying } = get();
    if (!audioBuffer) return;

    const clampedTime = Math.max(0, Math.min(time, audioBuffer.duration));
    set({ currentTime: clampedTime });

    if (isPlaying) {
      get().stopPlayback();
      get().startPlayback();
    }
  }
}));

export default useKaraokeStore;