import React, { useEffect } from 'react';
import ChordDisplay from './components/ChordDisplay';
import LyricDisplay from './components/LyricDisplay';
import Controls from './components/Controls';
import FileUpload from './components/FileUpload';
import useKaraokeStore from './store';

function App() {
  const { isPlaying } = useKaraokeStore();

  const initializeAudio = async () => {
    const audioContext = new AudioContext();
    useKaraokeStore.setState({ audioContext });
  };

  useEffect(() => {
    initializeAudio();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col h-screen">
        {!isPlaying && <FileUpload />}
        <div className={`flex flex-col h-screen ${isPlaying ? '' : 'opacity-50'}`}>
          <ChordDisplay />
          <LyricDisplay />
          <Controls />
        </div>
      </div>
    </div>
  );
}

export default App;