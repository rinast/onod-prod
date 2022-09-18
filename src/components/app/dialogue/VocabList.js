import React, { useState } from "react";
import { IoLanguage, IoClose } from "react-icons/io5";
import { AiOutlineLine } from "react-icons/ai";
import styles from "./VocabList.module.scss";

export default function VocabList(props) {
  const [visible, setVisible] = useState(false);

  function toggleVocabList() {
    if (visible === false) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }

  return (
    <div className={styles["wrap-div"]}>
      {!visible && (
        <IoLanguage className={styles["eye-icon"]} onClick={toggleVocabList} />
      )}
      {visible && (
        <IoLanguage
          className={styles["eye-icon-down"]}
          onClick={toggleVocabList}
        />
      )}
      <div
        id="list-wrap"
        className={
          visible
            ? `${styles["list-wrap"]}`
            : `${styles["list-wrap"]} ${styles["hidden"]}`
        }
      >
        {Object.keys(props.vocabList).map(function (vocab, i) {
          return (
            <>
              <div className={styles["item-kor"]}>
                <p>{props.vocabList[vocab][0]}</p> 
              </div>
              <div className={styles["item-eng"]}>
                <p>{props.vocabList[vocab][1]}</p>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}
