import React from "react";
import styles from "./AdminStyles.module.scss";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminLessonCard = props => {
  const navigate = useNavigate()

  function lessonClicked() {
    if (props.lessonNr) {
      navigate("/edit-lesson", {
        state: {
          lessonID: props.lessonID,
          lessonType: props.lessonType,
          lessonLvl: props.lessonLvl,
          lessonNr: props.lessonNr,
          lessonName: props.lessonName,
          lessonDesc: props.lessonDesc,
          grammarList: props.components["grammar"],
          vocabList: props.components["vocab"],
          dialogueList: props.components["dialogue"],
          readingList: props.components["reading"],
        },
      });
    } else if (props.grammarPoint) {
      navigate("/edit-grammar", {
        state: {
          lessonID: props.lessonID,
          grammarPoint: props.grammarPoint,
          introExample: props.introExample,
          explanation: props.explanation,
          explanationLeftColumn: props.explanationLeftColumn,
          explanationRightColumn: props.explanationRightColumn,
          practice: props.practice
        }
      })
    } else if (props.vocabPoint) {
      navigate("/edit-vocab", {
        state: {
          lessonID: props.lessonID,
          korean: props.korean,
          roman: props.roman,
          english: props.english,
          imgs: props.imgs,
          audios: props.audios,
          exampleKor: props.exampleKor,
          exampleRom: props.exampleRom,
          exampleEng: props.exampleEng,
          exampleAudio: props.exampleAudio,
          practice: props.practice,
          folderName: props.folderName
        }
      })
    } else if (props.dialoguePoint) {
      navigate("/edit-dialogue", {
        state: {
          lessonID: props.lessonID,
          dialogueNr: props.dialogueNr,
          folderName: props.folderName,
          title: props.title,
          content: props.content,
          audios: props.audios,
          fullAudio: props.fullAudio,
          practice: props.practice,
          vocabList: props.vocabList
        }
      })
    } else if (props.readingPoint) {
      navigate("/edit-reading", {
        state: {
          lessonID: props.lessonID,
          readingNr: props.readingNr,
          title: props.title,
          content: props.content,
          audios: props.audios,
          audio: props.audio,
          practice: props.practice,
          folderName: props.folderName,
          vocabList: props.vocabList
        }
      })
    }
  }

  return (
    <>
      {props.grammarPoint && <p className={styles["clickable-p"]} onClick={lessonClicked}>{props.grammarPoint}</p>}
      {props.vocabPoint && <p className={styles["clickable-p"]} onClick={lessonClicked}>{props.vocabPoint}</p>}
      {props.dialoguePoint && <p className={styles["clickable-p"]} onClick={lessonClicked}>{props.dialoguePoint}</p>}
      {props.readingPoint && <p className={styles["clickable-p"]} onClick={lessonClicked}>{props.readingPoint}</p>}

      {props.lessonName &&<div className={`${styles["lessoncard"]} before-learn-tab mb-3`} onClick={lessonClicked}>
        <div
          className={`learn-tab d-flex flex-row justify-items-center`}
        >
          <div>
            <p className="learn-tab-heading pt-3 ps-4 mb-1">{props.lessonName}</p>
            <p className="mt-n1 ps-4">{props.lessonDesc}</p>
          </div>
        </div>
      </div>}
    </>
  );
};

export default AdminLessonCard;
