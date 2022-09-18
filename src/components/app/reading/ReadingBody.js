import React, { useState, useEffect, useRef } from "react";
import AudioPlayerDialogue from "../dialogue/AudioPlayerDialogue";
import ReadingBodyAudio from "./ReadingBodyAudio";
import VocabList from "../dialogue/VocabList";

export default function ReadingBody(props) {
  const [fullAudio, setFullAudio] = useState("");
  const pauseFullAudioRef = useRef(null);
  const [playIsVisible, setPlayIsVisible] = useState(true);

  useEffect(() => {
    props.setResult(true);
    props.setChecked(true);
    props.setAllSelected(true);
    props.pull_data(true);
    if (fullAudio === "") {
      setFullAudio(props.audio);
    }
  });

  useEffect(() => {
    if (document.getElementsByClassName("continue-btn")[0]) {
      document
        .getElementsByClassName("continue-btn")[0]
        .addEventListener("click", function () {
          pauseFullAudioRef.current.pauseAudio();
        });
    }
    if (document.getElementsByClassName("icon-font")[0]) {
      document
        .getElementsByClassName("icon-font")[0]
        .addEventListener("click", function () {
          pauseFullAudioRef.current.pauseAudio();
        });
    }
  });

  return (
    <>
      <VocabList vocabList={props.vocabList} />
      <div className="lesson-content-inside-wrap">
        <AudioPlayerDialogue ref={pauseFullAudioRef} audio={props.audio} />

        <p className="reading-heading double-spacer">
          <strong>{props.title}</strong>
        </p>
        <div className="reading-paragraphs">
        {props.content.map(function (paragraph, i) {
          return (
            <div className="reading-paragraph-wrap spacer">
              <ReadingBodyAudio audio={props.audios[i]} pauseFullAudio={() => pauseFullAudioRef.current.pauseAudio()} />
              <p className="reading-paragraph">{paragraph}</p>
            </div>
          );
        })}
        </div>
      </div>
    </>
  );
}
