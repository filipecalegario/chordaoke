import React, { useMemo, useCallback } from 'react';
import useKaraokeStore from '../store';
import { LyricLine, Word } from '../types';

const WordComponent = React.memo(({ word, isActive }: { word: Word; isActive: boolean }) => (
  <>
    <span
      className={`inline-block transition-colors duration-200 ease-out ${
        isActive ? 'text-blue-600 dark:text-blue-400 font-medium' : ''
      }`}
      style={{
        willChange: 'color',
        transform: 'translateZ(0)'
      }}
    >
      {word.word}
    </span>
    {' '}
  </>
));

WordComponent.displayName = 'WordComponent';

const LineComponent = React.memo(
  ({ line, isCurrentLine, currentTime }: { line: LyricLine; isCurrentLine: boolean; currentTime: number }) => {
    const isWordActive = useCallback(
      (word: Word): boolean => {
        return currentTime >= word.start && currentTime < word.end;
      },
      [currentTime]
    );

    return (
      <div
        className={`text-2xl leading-relaxed ${
          isCurrentLine ? 'font-bold' : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        {line.words.map((word) => (
          <WordComponent key={word.start} word={word} isActive={isWordActive(word)} />
        ))}
      </div>
    );
  }
);

LineComponent.displayName = 'LineComponent';

const LyricDisplay: React.FC = () => {
  const { lyrics, currentTime } = useKaraokeStore();

  // Memoize the current and upcoming lines to prevent unnecessary recalculations
  const displayLines = useMemo(() => {
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
  }, [lyrics, currentTime]);

  return (
    <div className="h-[70vh] bg-white dark:bg-gray-900 p-8 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full space-y-6">
        {displayLines.map((line, index) => (
          <LineComponent 
            key={line.start} 
            line={line} 
            isCurrentLine={index === 0} 
            currentTime={currentTime} 
          />
        ))}
      </div>
    </div>
  );
};

export default LyricDisplay;