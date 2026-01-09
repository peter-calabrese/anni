import { useCallback, useEffect, useRef, useState } from "react";

export const useAudioControls = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const onTimeUpdate = () => {
    const a = audioRef.current;
    if (!a) return;
    setTime(a.currentTime);
  };

  const ref = useCallback((node: HTMLAudioElement | null) => {
    if (audioRef.current) {
      audioRef.current.removeEventListener("timeupdate", onTimeUpdate);
    }

    audioRef.current = node;

    if (node) {
      node.addEventListener("timeupdate", onTimeUpdate);
      setTime(node.currentTime);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      
      console.log("play");
      audioRef.current.play();
    }
  }, [audioRef]);

  const handleAudio = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");

  return {
    ref,
    minutes,
    seconds,
    handleAudio,
    handlePlay,
    handlePause,
    isPlaying,
  };
};
