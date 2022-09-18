import React, { useEffect, useState } from "react";
import styles from "./AudioPlayer.module.scss";
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

export default function AudioPlayer(props) {
  const [audio] = useState(new Audio(props.audio));
  const [playing, setPlaying] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  const toggle = () => setPlaying(!playing);

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
    audio.addEventListener("ended", () => {
      setPlaying(false);
      setSeekTime(audio.duration);
      props.setAllSelected(true);
    });
    if (imgLoaded) {
      toggle();
    }
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, [imgLoaded]);

  return (
    <div className={props.small ? styles["player-wrap"] : styles["big-player-wrap"]}>
      <div
        id={styles.player}
        className={props.small ? styles["small-player"] : styles["big-player"]}
      >
        {/* <div
        className={styles.album}
        style={{ background: `url(${props.img}) no-repeat center center` }}
      ></div> */}
        <div className={styles.album}>
          <img
            style={imgLoaded ? {} : { display: "none" }}
            src={props.img}
            alt="Vocab illustration"
            onLoad={() => {
              setImgLoaded(true);
              props.setImgLoaded(true);
            }}
          />
        </div>
        <div className={styles.info}>
          <Seekbar
            value={seekTime}
            min="0"
            max={audio.duration ? audio.duration : 100}
            onInput={(event) => setSeekTime(event.target.value)}
          />
          <div className={styles.controls}>
            <div className={styles.play} onClick={toggle}>
              {playing ? <FaPause /> : <FaPlay />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
