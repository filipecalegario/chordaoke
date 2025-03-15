import React from 'react';
import useKaraokeStore from '../store';
import { LyricLine, Word } from '../types';

const LyricDisplay: React.FC = () => {
  const { lyrics, currentTime } = useKaraokeStore();

  const getCurrentAndUpcomingLines = (): LyricLine[] => {
    if (!lyrics.length) return [];

    const currentLineIndex = lyrics.findIndex(
      line => currentTime >= line.start && currentTime < line.end
    );

    if (currentLineIndex === -1) {
      const nextLineIndex = lyrics.findIndex(line => currentTime < line.start);
      if (nextLineIndex === -1) return [];
      return lyrics.slice(nextLineIndex, nextLineIndex + 3);
    }

    return lyrics.slice(currentLineIndex, currentLineIndex + 3);
  };

  const isWordActive = (word: Word): boolean => {
    return currentTime >= word.start && currentTime < word.end;
  };

  const displayLines = getCurrentAndUpcomingLines();

  return (
    <div className="h-[70vh] bg-white dark:bg-gray-900 p-8 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full space-y-6">
        {displayLines.map((line, index) => (
          <div
            key={line.start}
            className={`text-2xl leading-relaxed transition-all duration-200 ${
              index === 0 ? 'font-bold' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {line.words.map((word) => (
              <span
                key={word.start}
                className={`transition-all duration-200 ${
                  isWordActive(word)
                    ? 'text-blue-600 dark:text-blue-400 scale-110 inline-block origin-left'
                    : ''
                }`}
              >
                {word.word}{' '}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LyricDisplay;