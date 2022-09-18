import React, { useState, useEffect, useRef } from "react";
import DialogueBubble from "./DialogueBubble";
import AudioPlayerDialogue from "./AudioPlayerDialogue";
import VocabList from "./VocabList"

export default function DialogueBody(props) {
  const [fullAudio, setFullAudio] = useState("");
  const pauseFullAudioRef = useRef(null);
  const [continueLoaded, setContinueLoaded] = useState(false);

  useEffect(() => {
    props.setResult(true);
    props.setChecked(true);
    props.setAllSelected(true);
    props.pull_data(true);
    if (fullAudio === "") {
      setFullAudio(props.fullAudio);
    }
  });

  useEffect(() => {
    if (document.getElementsByClassName("continue-btn")[0]) {
      document.getElementsByClassName("continue-btn")[0].addEventListener("click", function() {
        pauseFullAudioRef.current.pauseAudio();
      })
    }
    if (document.getElementsByClassName("icon-font")[0]) {
      document.getElementsByClassName("icon-font")[0].addEventListener("click", function() {
        pauseFullAudioRef.current.pauseAudio();
      })
    }
  })

  return (
    <>
      <VocabList vocabList={props.vocabList} />
      <div className="lesson-content-inside-wrap">
      <AudioPlayerDialogue ref={pauseFullAudioRef} audio={props.fullAudio}/>
        {props.content.map(function (sentence, i) {
          return (
            <DialogueBubble
              text={sentence}
              audio={props.audios[i]}
              pauseFullAudio={() => pauseFullAudioRef.current.pauseAudio()}
              nr={i}
              key={i}
            />
          );
        })}
      </div>
      
    </>
  );
}
