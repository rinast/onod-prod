import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import styles from "./AudioPlayerDialogue.module.scss";
import { FaPlay, FaPause } from "react-icons/fa";

function Seekbar({ value, min, max, onInput }) {
  return (
    <input
      type="range"
      step="any"
      value={value}
      min={min}
      max={max}
      onInput={onInput}
      id="slider"
    />
  );
}

const AudioPlayer = forwardRef((props, ref) => {
  const [audio] = useState(new Audio(props.audio));
  const [playing, setPlaying] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const toggle = () => setPlaying(!playing);

  useImperativeHandle(ref, () => ({
    pauseAudio() {
      if (audio) {
        setPlaying(false);
      }
    }
  }))

  useEffect(() => {
    if (playing) {
      audio.currentTime = seekTime;
      audio.play();
    } else {
      audio.pause();
    }
    while (playing) {
      const intervalId = setInterval(() => {
        setSeekTime(audio.currentTime);
      }, 250);
      return () => clearInterval(intervalId);
    }
  }, [playing]);

  useEffect(() => {
    if (audio) {
      setLoaded(true);
    }
  })

  useEffect(() => {
    audio.addEventListener("ended", () => {
      setPlaying(false);
      setSeekTime(audio.duration);
    });
    if (loaded) {
      toggle();
    }

    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, [loaded]);

  return (
    <div
      className={
        props.small ? styles["player-wrap"] : styles["big-player-wrap"]
      }
    >
      <div
        id={styles.player}
        className={props.small ? styles["small-player"] : styles["big-player"]}
      >
        <div className={styles.info}>
          <Seekbar
            value={seekTime}
            min="0"
            max={audio.duration ? audio.duration : 100}
            onInput={(event) => setSeekTime(event.target.value)}
          />
          <div className={styles.controls}>
            <div
              className={styles.play}
              onClick={toggle}
            >
              {playing ? <FaPause /> : <FaPlay />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})

export default AudioPlayer;