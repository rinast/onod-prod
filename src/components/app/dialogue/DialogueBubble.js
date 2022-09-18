import React, {useState, useEffect} from "react";
import styles from "./DialogueBubble.module.scss";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import man from "../../../images/man.png";
import woman from "../../../images/woman.png";

export default function DialogueBubble(props) {
  const [playIsVisible, setPlayIsVisible] = useState(true);

  function playExample(event) {
    event.target.closest("div").querySelector("audio").addEventListener("ended", () => {
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
  };

  if (props.nr % 2 === 0) {
    return (
      <div className={styles["dialogue-left"]}>
        <FaVolumeUp
          id={styles["play-example"]}
          className={playIsVisible ? styles["inline-icon"]  : styles["hidden-icon"] }
          onClick={playExample}
        />
        <FaVolumeMute
          id={styles["mute-example"]}
          className={playIsVisible ? styles["hidden-icon"] : styles["inline-icon"]}
          onClick={playExample}
        />
        <audio id="example-audio" src={props.audio}></audio>
        <img className={`${styles["pic-left"]} ${styles["profile-pic"]}`} alt="Female Speaker" src={woman} />
        <span className={styles["dialogue-text"]}>{props.text}</span>
        <div className={styles["left-point"]}></div>
      </div>
    );
  }
  else {
    return (
      <div className={styles["dialogue-right"]}>
        <FaVolumeUp
          id={styles["play-example"]}
          className={playIsVisible ? styles["inline-icon"]  : styles["hidden-icon"]}
          onClick={playExample}
        />
        <FaVolumeMute
          id={styles["mute-example"]}
          className={playIsVisible ? styles["hidden-icon"] : styles["inline-icon"]}
          onClick={playExample}
        />
        <audio id="example-audio" src={props.audio}></audio>
        <img className={`${styles["pic-right"]} ${styles["profile-pic"]}`} alt="Male Speaker" src={man} />
        <span className={styles["dialogue-text"]}>{props.text}</span>
        <div className={styles["right-point"]}></div>
      </div>
    );
  }
}
