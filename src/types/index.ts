export interface Syllable {
  syllable: string;
  start: number;
  end: number;
}

export interface Word {
  word: string;
  start: number;
  end: number;
  score: number;
  syllables: Syllable[];
}

export interface LyricLine {
  start: number;
  end: number;
  text: string;
  language: string;
  words: Word[];
}

export interface Chord {
  start: number;
  end: number;
  start_bar: number;
  start_beat: number;
  end_bar: number;
  end_beat: number;
  chord_majmin: string;
  bass: string | null;
  bass_nashville: string | null;
  chord_complex_jazz: string;
  chord_simple_jazz: string;
  chord_basic_jazz: string;
  chord_complex_pop: string;
  chord_simple_pop: string;
  chord_basic_pop: string;
  chord_complex_nashville: string;
  chord_simple_nashville: string;
  chord_basic_nashville: string;
}

export interface KaraokeState {
  audioContext: AudioContext | null;
  audioBuffer: AudioBuffer | null;
  audioSource: AudioBufferSourceNode | null;
  isPlaying: boolean;
  isPlaybackMode: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  lyrics: LyricLine[];
  chords: Chord[];
  currentLyricIndex: number;
  currentChordIndex: number;
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  startPlayback: () => void;
  pausePlayback: () => void;
  stopPlayback: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
}