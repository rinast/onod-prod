import React, { useState, useEffect } from "react";
import AudioPlayer from "./AudioPlayer";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

export default function VocabDef(props) {
  const [playIsVisible, setPlayIsVisible] = useState(true);

  useEffect(() => {
    props.setResult(true);
    props.setChecked(true);
  });

  const pull_data = (data) => {
    props.setImgLoaded(true); // LOGS DATA FROM CHILD (My name is Dean Winchester... &)
    setTimeout(() => {
      props.setAllSelected(true);
    }, 5000)
  };

  const playExample = () => {
    if (playIsVisible) {
      document.getElementById("example-audio").play();
    } else {
      document.getElementById("example-audio").pause();
    }
    setPlayIsVisible(!playIsVisible);
  };

  useEffect(() => {
    if (props.exampleAudio) {
      document.getElementById("example-audio").addEventListener("ended", () => {
        setPlayIsVisible(true);
      });
      return () => {
        if (document.getElementById("example-audio") != null) {
          document
            .getElementById("example-audio")
            .removeEventListener("ended", () => setPlayIsVisible(true));
        }
      };
    }
  });

  return (
    <div className="lesson-content-inside-wrap">
      <AudioPlayer
        img={props.img}
        audio={props.audio}
        setImgLoaded={pull_data}
        small={true}
        setAllSelected={props.setAllSelected}
      />
      <p className="vocab-def-korean">
        {props.korean} /<span className="vocab-def-roman"> {props.roman}</span>
      </p>
      <p className="vocab-def-english">{props.english}</p>
      <hr className="vocab-def-divider" />
      <p className="secondary-heading">Example:</p>
      <div style={{ display: "flex" }}>
        <FaVolumeUp
          id="play-example"
          className={playIsVisible ? "inline-icon" : "hidden-icon"}
          onClick={playExample}
        />
        <FaVolumeMute
          id="mute-example"
          className={playIsVisible ? "hidden-icon" : "inline-icon"}
          onClick={playExample}
        />
        <audio id="example-audio" src={props.exampleAudio}></audio>
        <div className="example-div-text">
          <p className="vocab-example-korean">
            {props.exampleKor} /
            <span className="vocab-example-roman"> {props.exampleRom}</span>
          </p>
          <p className="vocab-example-english">{props.exampleEng}</p>
        </div>
      </div>
    </div>
  );
}
