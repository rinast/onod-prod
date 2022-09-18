import React, { useState } from "react";
import styles from "./ReadingSlideUp.module.scss";
import { IoIosArrowDown } from "react-icons/io";
import ReadingBodyAudio from "./ReadingBodyAudio";
import VocabList from "../dialogue/VocabList";

export default function ReadingSlideUp(props) {
  const [visible, setVisible] = useState(false);

  const showSlideup = () => {
    if (!visible) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  return (
    <>
      <div
        className={`${
          props.passSelected
            ? styles["up-btn-seethrough-container"]
            : styles["up-btn-container"]
        }`}
        onClick={showSlideup}
      >
        <div className={styles["up-btn-inside-container"]}>
          <IoIosArrowDown
            className={`${!visible ? styles["icon-up"] : styles["icon-down"]}`}
          />
          <p className={styles["icon-text"]}>
            {!visible ? "SHOW TEXT" : "HIDE TEXT"}
          </p>
        </div>
      </div>

      <div
        id="slideup"
        className={`${styles["slideup-container"]} ${
          !visible ? styles["slideup-not-visible"] : styles["slideup-visible"]
        }`}
      >
        <VocabList vocabList={props.vocabList} />
        <div className={styles["slideup-inside-container"]}>
          {props.content.map(function (paragraph, i) {
            return (
              <div className="reading-paragraph-wrap spacer">
                <ReadingBodyAudio
                  audio={props.audios[i]}
                />
                <p className="reading-paragraph">{paragraph}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
