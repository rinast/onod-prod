import React, { useState, useEffect, useRef } from "react";
import DialogueBubble from "./DialogueBubble";
import styles from "./DialogueSlideUp.module.scss";
import { IoIosArrowDown } from "react-icons/io";
import VocabList from "./VocabList";

export default function DialogueSlideUp(props) {
  const [visible, setVisible] = useState(false);

  const showSlideup = () => {
    if (!visible) {
      setVisible(true);
    } else {
      setVisible(false); 
    }
  }

  return (
    <>
      <div className={`${props.passSelected ? styles["up-btn-seethrough-container"] : styles["up-btn-container"]}`} onClick={showSlideup}>
        <div className={styles["up-btn-inside-container"]}>
          <IoIosArrowDown className={`${!visible ? styles["icon-up"] : styles["icon-down"]}`} />
          <p className={styles["icon-text"]}>{!visible ? "SHOW DIALOGUE" : "HIDE DIALOGUE"}</p>
        </div>
      </div>

      <div id="slideup" className={`${styles["slideup-container"]} ${ !visible ? styles["slideup-not-visible"] : styles["slideup-visible"] }`}>
        <VocabList vocabList={props.vocabList}/>
        <div className={styles["slideup-inside-container"]}>
          {props.content.map(function (sentence, i) {
            return (
              <DialogueBubble
                text={sentence}
                audio={props.audios[i]}
                nr={i}
                key={i}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
