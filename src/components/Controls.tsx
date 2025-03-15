import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import useKaraokeStore from '../store';

const Controls: React.FC = () => {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    audioBuffer,
    startPlayback,
    pausePlayback,
    setVolume,
    seekTo
  } = useKaraokeStore();

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!audioBuffer) return;
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  };

  const handleSeek = (value: number[]) => {
    seekTo(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    useKaraokeStore.setState({ isMuted: newVolume === 0 });
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(volume || 1);
      useKaraokeStore.setState({ isMuted: false });
    } else {
      setVolume(0);
      useKaraokeStore.setState({ isMuted: true });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="max-w-3xl mx-auto flex items-center gap-4">
        <button
          onClick={handlePlayPause}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!audioBuffer}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>

        <span className="text-sm font-mono min-w-[80px]">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <Slider.Root
          className="relative flex-1 flex items-center h-5 select-none touch-none"
          value={[currentTime]}
          max={duration}
          step={0.1}
          onValueChange={handleSeek}
          disabled={!audioBuffer}
        >
          <Slider.Track className="relative h-1 grow rounded-full bg-gray-200 dark:bg-gray-700">
            <Slider.Range className="absolute h-full rounded-full bg-blue-500" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-3 h-3 bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Time"
          />
        </Slider.Root>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={!audioBuffer}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <Slider.Root
            className="relative w-24 flex items-center h-5 select-none touch-none"
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            disabled={!audioBuffer}
          >
            <Slider.Track className="relative h-1 grow rounded-full bg-gray-200 dark:bg-gray-700">
              <Slider.Range className="absolute h-full rounded-full bg-blue-500" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-3 h-3 bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Volume"
            />
          </Slider.Root>
        </div>
      </div>
    </div>
  );
};

export default Controls;