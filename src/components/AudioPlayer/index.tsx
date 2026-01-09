import { useState } from "react";

import image from "../../assets/iamge.png";
import { useAudioControls } from "../../hooks/useAudioControls";
import { Play, Pause, Minus, Plus } from "lucide-react";
import styles from "./AudioPlayer.module.css";
export function AudioPlayer({ audioSrc }: { audioSrc: string }) {
  const [minimize, setMinimize] = useState(false);

  const {
    ref: audioRef,
    minutes,
    seconds,

    handleAudio,
    handlePlay,
    handlePause,
    isPlaying,
  } = useAudioControls();

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSrc}
        onPlay={handlePlay}
        onPause={handlePause}
        // autoPlay
        loop
      />
      {minimize ? (
        <div className={styles.plus} onClick={() => setMinimize(false)}>
          <Plus />
        </div>
      ) : (
        <div className={styles.audioWrapper}>
          <div className={styles.container}>
            <div className={styles.minus}>
              <p>Thank God</p>
              <Minus
                onClick={() => setMinimize(!minimize)}
                style={{
                  cursor: "pointer",
                }}
              />
            </div>

            <img src={image} width={48} height={48} draggable="false" />

            <div className={styles.controls}>
              {isPlaying ? (
                <Pause onClick={handleAudio} />
              ) : (
                <Play onClick={handleAudio} />
              )}

              <p>
                {minutes}:{seconds}/2:53
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
