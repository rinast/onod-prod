import React, { useState, useEffect, useRef } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import styles from "./ReadingAudio.module.scss";

export default function ReadingBodyAudio(props) {
  const [playIsVisible, setPlayIsVisible] = useState(true);

  function playExample(event) {
    event.target
      .closest("div")
      .querySelector("audio")
      .addEventListener("ended", () => {
        setPlayIsVisible(true);
      });
    if (playIsVisible) {
      if (props.pauseFullAudio) {
        props.pauseFullAudio();
      }
      event.target.closest("div").querySelector("audio").play();
    } else {
      event.target.closest("div").querySelector("audio").pause();
    }
    setPlayIsVisible(!playIsVisible);
  }

  return (
    <>
      <FaVolumeUp
        id={styles["play-example"]}
        className={
          playIsVisible ? styles["inline-icon"] : styles["hidden-icon"]
        }
        onClick={playExample}
      />
      <FaVolumeMute
        id={styles["mute-example"]}
        className={
          playIsVisible ? styles["hidden-icon"] : styles["inline-icon"]
        }
        onClick={playExample}
      />
      <audio id="example-audio" src={props.audio}></audio>
    </>
  );
}
