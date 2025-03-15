interface ValidationResult {
  isValid: boolean;
  message: string;
}

const MAX_AUDIO_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_JSON_SIZE = 2 * 1024 * 1024;   // 2MB

const ALLOWED_AUDIO_TYPES = [
  'audio/mp3',
  'audio/mpeg',           // Standard MIME type for MP3
  'audio/wav',
  'audio/wave',          // Alternative MIME type for WAV
  'audio/x-wav',         // Alternative MIME type for WAV
  'audio/ogg',
  'audio/vorbis',        // Alternative MIME type for OGG
  'application/ogg'      // Alternative MIME type for OGG
];
const ALLOWED_JSON_TYPE = 'application/json';

export const validateFiles = {
  audio: (file: File): ValidationResult => {
    if (!file) {
      return { isValid: false, message: 'No file selected' };
    }

    // Check file extension as a fallback
    const extension = file.name.toLowerCase().split('.').pop();
    const isValidExtension = ['mp3', 'wav', 'ogg'].includes(extension || '');

    if (!ALLOWED_AUDIO_TYPES.includes(file.type) && !isValidExtension) {
      return { 
        isValid: false, 
        message: 'Invalid file type. Please upload an MP3, WAV, or OGG file' 
      };
    }

    if (file.size > MAX_AUDIO_SIZE) {
      return { 
        isValid: false, 
        message: 'File size exceeds 20MB limit' 
      };
    }

    return { isValid: true, message: 'File is valid' };
  },

  json: (file: File): ValidationResult => {
    if (!file) {
      return { isValid: false, message: 'No file selected' };
    }

    if (file.type !== ALLOWED_JSON_TYPE) {
      return { 
        isValid: false, 
        message: 'Invalid file type. Please upload a JSON file' 
      };
    }

    if (file.size > MAX_JSON_SIZE) {
      return { 
        isValid: false, 
        message: 'File size exceeds 2MB limit' 
      };
    }

    return { isValid: true, message: 'File is valid' };
  }
};