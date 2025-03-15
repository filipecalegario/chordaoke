import React, { useCallback, useMemo } from 'react';
import { Upload, CheckCircle, AlertCircle, Play } from 'lucide-react';
import useKaraokeStore from '../store';
import { validateFiles } from '../utils/fileValidation';

interface UploadStatus {
  audio: { status: 'idle' | 'success' | 'error'; message: string };
  chords: { status: 'idle' | 'success' | 'error'; message: string };
  lyrics: { status: 'idle' | 'success' | 'error'; message: string };
}

const FileUpload: React.FC = () => {
  const [uploadStatus, setUploadStatus] = React.useState<UploadStatus>({
    audio: { status: 'idle', message: '' },
    chords: { status: 'idle', message: '' },
    lyrics: { status: 'idle', message: '' },
  });

  const { audioContext } = useKaraokeStore();

  const handleAudioUpload = useCallback(async (file: File) => {
    try {
      const validationResult = validateFiles.audio(file);
      if (!validationResult.isValid) {
        setUploadStatus(prev => ({
          ...prev,
          audio: { status: 'error', message: validationResult.message }
        }));
        return;
      }

      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext?.decodeAudioData(arrayBuffer);
      
      if (audioBuffer) {
        useKaraokeStore.setState({ 
          audioBuffer,
          duration: audioBuffer.duration
        });
        setUploadStatus(prev => ({
          ...prev,
          audio: { status: 'success', message: 'Audio file loaded successfully' }
        }));
      }
    } catch (error) {
      setUploadStatus(prev => ({
        ...prev,
        audio: { status: 'error', message: 'Failed to load audio file' }
      }));
    }
  }, [audioContext]);

  const handleJSONUpload = useCallback(async (file: File, type: 'chords' | 'lyrics') => {
    try {
      const validationResult = validateFiles.json(file);
      if (!validationResult.isValid) {
        setUploadStatus(prev => ({
          ...prev,
          [type]: { status: 'error', message: validationResult.message }
        }));
        return;
      }

      const text = await file.text();
      const data = JSON.parse(text);

      // Validate JSON structure
      if (type === 'chords' && !Array.isArray(data)) {
        throw new Error('Invalid chords file format');
      }
      if (type === 'lyrics' && !Array.isArray(data)) {
        throw new Error('Invalid lyrics file format');
      }

      useKaraokeStore.setState({ [type]: data });
      setUploadStatus(prev => ({
        ...prev,
        [type]: { status: 'success', message: `${type} file loaded successfully` }
      }));
    } catch (error) {
      setUploadStatus(prev => ({
        ...prev,
        [type]: { status: 'error', message: `Failed to load ${type} file` }
      }));
    }
  }, []);

  const renderUploadStatus = (type: keyof UploadStatus) => {
    const status = uploadStatus[type];
    return (
      <div className="mt-1 text-sm">
        {status.status === 'success' && (
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            {status.message}
          </div>
        )}
        {status.status === 'error' && (
          <div className="flex items-center text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {status.message}
          </div>
        )}
      </div>
    );
  };

  // Check if all files are successfully uploaded
  const allFilesUploaded = useMemo(() => {
    return (
      uploadStatus.audio.status === 'success' &&
      uploadStatus.chords.status === 'success' &&
      uploadStatus.lyrics.status === 'success'
    );
  }, [uploadStatus]);

  // Handle start playback
  const handleStartPlayback = () => {
    useKaraokeStore.setState({ isPlaybackMode: true });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-center">Upload Files</h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">
            Audio File (.mp3, .wav, .ogg)
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".mp3,.wav,.ogg"
              onChange={(e) => e.target.files?.[0] && handleAudioUpload(e.target.files[0])}
              className="hidden"
              id="audio-upload"
            />
            <label
              htmlFor="audio-upload"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 w-full"
            >
              <Upload className="w-5 h-5 mr-2" />
              Choose Audio File
            </label>
          </div>
          {renderUploadStatus('audio')}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Chords File (.json)
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={(e) => e.target.files?.[0] && handleJSONUpload(e.target.files[0], 'chords')}
              className="hidden"
              id="chords-upload"
            />
            <label
              htmlFor="chords-upload"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 w-full"
            >
              <Upload className="w-5 h-5 mr-2" />
              Choose Chords File
            </label>
          </div>
          {renderUploadStatus('chords')}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Lyrics File (.json)
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={(e) => e.target.files?.[0] && handleJSONUpload(e.target.files[0], 'lyrics')}
              className="hidden"
              id="lyrics-upload"
            />
            <label
              htmlFor="lyrics-upload"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 w-full"
            >
              <Upload className="w-5 h-5 mr-2" />
              Choose Lyrics File
            </label>
          </div>
          {renderUploadStatus('lyrics')}
        </div>

        <button
          onClick={handleStartPlayback}
          disabled={!allFilesUploaded}
          className={`mt-6 w-full flex items-center justify-center px-4 py-3 rounded-md text-white font-medium ${
            allFilesUploaded
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <Play className="w-5 h-5 mr-2" />
          Start Playback
        </button>
      </div>
    </div>
  );
};

export default FileUpload;