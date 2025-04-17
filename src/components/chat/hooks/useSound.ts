import { useState, useCallback, useEffect } from 'react';

interface UseSoundProps {
  enabled?: boolean;
  soundUrl?: string;
}

export const useSound = ({ enabled = true, soundUrl = '/sounds/notification.mp3' }: UseSoundProps = {}) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(enabled);

  // Initialize audio only on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audioElement = new Audio(soundUrl);
      audioElement.volume = 0.5;
      setAudio(audioElement);

      return () => {
        audioElement.pause();
        audioElement.currentTime = 0;
      };
    }
  }, [soundUrl]);

  const playSound = useCallback(() => {
    if (isEnabled && audio) {
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.warn('Failed to play sound:', error);
      });
    }
  }, [audio, isEnabled]);

  const toggleSound = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  return {
    playSound,
    toggleSound,
    isEnabled
  };
}; 