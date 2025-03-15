import React from 'react';
import useKaraokeStore from '../store';
import { Chord } from '../types';

const ChordDisplay: React.FC = () => {
  const { chords, currentTime } = useKaraokeStore();
  
  const getCurrentAndNextChords = (): [Chord | null, Chord | null] => {
    if (!chords.length) return [null, null];

    const currentChord = chords.find(
      chord => currentTime >= chord.start && currentTime < chord.end
    ) || null;
    
    const nextChordIndex = chords.findIndex(
      chord => chord.start > currentTime
    );
    const nextChord = nextChordIndex !== -1 ? chords[nextChordIndex] : null;
    
    return [currentChord, nextChord];
  };

  const [currentChord, nextChord] = getCurrentAndNextChords();

  return (
    <div className="h-[30vh] bg-gray-100 dark:bg-gray-800 p-4 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="font-mono text-4xl font-bold transition-all duration-200 transform">
          <span className="text-blue-600 dark:text-blue-400">
            {currentChord?.chord_simple_pop || '-'}
          </span>
        </div>
        <div className="font-mono text-xl text-gray-500 dark:text-gray-400">
          Next: {nextChord?.chord_simple_pop || '-'}
        </div>
      </div>
    </div>
  );
};

export default ChordDisplay;