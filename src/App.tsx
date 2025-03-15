import React, { useEffect } from 'react';
import ChordDisplay from './components/ChordDisplay';
import LyricDisplay from './components/LyricDisplay';
import Controls from './components/Controls';
import FileUpload from './components/FileUpload';
import useKaraokeStore from './store';

function App() {
  const { isPlaybackMode, audioBuffer, lyrics, chords } = useKaraokeStore();

  const initializeAudio = async () => {
    const audioContext = new AudioContext();
    useKaraokeStore.setState({ audioContext });
  };

  useEffect(() => {
    initializeAudio();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {!isPlaybackMode ? (
        // Upload Page
        <div className="flex items-center justify-center min-h-screen py-8">
          <FileUpload />
        </div>
      ) : (
        // Playback Page
        <div className="flex flex-col h-screen">
          <div className="p-4">
            <Controls />
          </div>
          <div className="p-4">
            <ChordDisplay />
          </div>
          <div className="flex-grow overflow-auto">
            <LyricDisplay />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;