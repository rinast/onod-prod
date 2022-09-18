import React, { useEffect, useState, useRef } from "react";
import AdminLessonCard from "./AdminLessonCard";
import styles from "./AdminStyles.module.scss";
import { database } from "../../../firebase";
import { useNavigate } from "react-router-dom";

export default function AdminLessonList() {
  const [grammarLessons, setGrammarLessons] = useState([]);
  const [dialogueLessons, setDialogueLessons] = useState([]);
  const [readingLessons, setReadingLessons] = useState([]);

  const [lessonNrs, setLessonNrs] = useState([]);
  const [lastLessonLvl, setLastLessonLvl] = useState(1);
  const [dialogueNrs, setDialogueNrs] = useState([]);
  const [readingNrs, setReadingNrs] = useState([]);

  const [grammarPoints, setGrammarPoints] = useState([]);
  const [vocabPoints, setVocabPoints] = useState([]);
  const [dialoguePoints, setDialoguePoints] = useState([]);
  const [readingPoints, setReadingPoints] = useState([]);

  const [grammarList, setGrammarList] = useState([]);
  const [vocabList, setVocabList] = useState([]);
  const [dialogueList, setDialogueList] = useState([]);
  const [readingList, setReadingList] = useState([]);

  const navigate = useNavigate();

  const fire = useRef(0);

  useEffect(() => {
    database.grammar.get().then((querySnapshot) => {
      setGrammarList(querySnapshot.docs.map((doc) => doc.data().grammarName));
    });

    database.vocab.get().then((querySnapshot) => {
      setVocabList(querySnapshot.docs.map((doc) => doc.data().korean));
    });

    database.dialogue.get().then((querySnapshot) => {
      setDialogueList(
        querySnapshot.docs.map((doc) => ({
          ["title"]: doc.data().title,
          ["dialogueNr"]: doc.data().dialogueNr,
        }))
      );
    });

    database.reading.get().then((querySnapshot) => {
      setReadingList(
        querySnapshot.docs.map((doc) => ({
          ["title"]: doc.data().title,
          ["readingNr"]: doc.data().readingNr,
        }))
      );
    });

    if (fire.current === 0 && grammarLessons.length === 0) {
      fire.current = 1;
      database.lessons
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (
              doc.data().components.grammar ||
              doc.data().components.vocab ||
              Object.keys(doc.data().components).length === 0
            ) {
              setGrammarLessons((prevState) => [
                ...prevState,
                <AdminLessonCard
                  key={"adminlessonlist" + doc.data().lessonNr.toString()}
                  lessonID={doc.id}
                  lessonType="grammar"
                  lessonName={doc.data().lessonName}
                  lessonLvl={doc.data().lessonLvl}
                  lessonNr={doc.data().lessonNr}
                  lessonDesc={doc.data().lessonDesc}
                  components={doc.data().components}
                />,
              ]);
            }

            if (doc.data().components.dialogue) {
              setDialogueLessons((prevState) => [
                ...prevState,
                <AdminLessonCard
                  key={"adminlessonlist" + doc.data().lessonNr.toString()}
                  lessonID={doc.id}
                  lessonType="dialogue"
                  lessonName={doc.data().lessonName}
                  lessonLvl={doc.data().lessonLvl}
                  lessonNr={doc.data().lessonNr}
                  lessonDesc={doc.data().lessonDesc}
                  components={doc.data().components}
                />,
              ]);
            }

            if (doc.data().components.reading) {
              setReadingLessons((prevState) => [
                ...prevState,
                <AdminLessonCard
                  key={"adminlessonlist" + doc.data().lessonNr.toString()}
                  lessonID={doc.id}
                  lessonType="reading"
                  lessonName={doc.data().lessonName}
                  lessonLvl={doc.data().lessonLvl}
                  lessonNr={doc.data().lessonNr}
                  lessonDesc={doc.data().lessonDesc}
                  components={doc.data().components}
                />,
              ]);
            }

            setLessonNrs((prevState) => [...prevState, doc.data().lessonNr]);
            if (doc.data().lessonLvl > lastLessonLvl) {
              setLastLessonLvl(doc.data().lessonLvl);
            }
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });

      database.grammar.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setGrammarPoints((prevState) => [
            ...prevState,
            <AdminLessonCard
              key={"grammarpoint" + doc.data().grammarName}
              lessonID={doc.id}
              grammarPoint={doc.data().grammarName}
              introExample={doc.data().introExample}
              explanation={doc.data().explanation}
              explanationLeftColumn={doc.data().explanationLeftColumn}
              explanationRightColumn={doc.data().explanationRightColumn}
              practice={doc.data().practice}
            />,
          ]);
        });
      });

      database.vocab.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setVocabPoints((prevState) => [
            ...prevState,
            <AdminLessonCard
              key={"vocabpoint" + doc.data().korean}
              lessonID={doc.id}
              vocabPoint={doc.data().korean}
              korean={doc.data().korean}
              roman={doc.data().roman}
              english={doc.data().english}
              imgs={doc.data().imgs}
              audios={doc.data().audios}
              exampleKor={doc.data().exampleKor}
              exampleRom={doc.data().exampleRom}
              exampleEng={doc.data().exampleEng}
              exampleAudio={doc.data().exampleAudio}
              practice={doc.data().practice}
              folderName={doc.data().folderName}
            />,
          ]);
        });
      });

      database.dialogue.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setDialoguePoints((prevState) => [
            ...prevState,
            <AdminLessonCard
              key={"dialoguepoint" + doc.data().title}
              dialoguePoint={doc.data().title}
              lessonID={doc.id}
              dialogueNr={doc.data().dialogueNr}
              folderName={doc.data().folderName}
              title={doc.data().title}
              content={doc.data().content}
              audios={doc.data().audios}
              fullAudio={doc.data().fullAudio}
              practice={doc.data().practice}
              vocabList={doc.data().vocabList}
            />,
          ]);
          setDialogueNrs((prevState) => [...prevState, doc.data().dialogueNr]);
        });
      });

      database.reading.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setReadingPoints((prevState) => [
            ...prevState,
            <AdminLessonCard
              key={"readingpoint" + doc.data().title}
              readingPoint={doc.data().title}
              lessonID={doc.id}
              readingNr={doc.data().readingNr}
              folderName={doc.data().folderName}
              title={doc.data().title}
              content={doc.data().content}
              audios={doc.data().audios}
              audio={doc.data().audio}
              practice={doc.data().practice}
              vocabList={doc.data().vocabList}
            />,
          ]);
          setReadingNrs((prevState) => [...prevState, doc.data().readingNr]);
        });
      });
    }
  }, [fire.current]);

  function openNewLesson(e) {
    navigate("/create-lesson", {
      state: {
        lessonType: e.target.id,
        grammarList: grammarList,
        vocabList: vocabList,
        dialogueList: dialogueList,
        readingList: readingList,
        lastLessonLvl: lastLessonLvl,
        lastLessonNr: Math.max(...lessonNrs),
      },
    });
  }

  function addNewGrammar() {
    navigate("/edit-grammar", {
      state: {
        lessonID: 0,
        grammarPoint: "",
        introExample: "",
        explanation: "",
        explanationLeftColumn: ["", "", ""],
        explanationRightColumn: ["", "", ""],
        practice: {
          correction: ["", ""],
          pickCorrectForm: ["", "", "", ""],
          translateSentence: ["", "", "", "", ""],
        },
      },
    });
  }

  function addNewVocab() {
    navigate("/edit-vocab", {
      state: {
        lessonID: 0,
        korean: "",
        english: "",
        roman: "",
        imgs: [""],
        audios: [""],
        exampleKor: "",
        exampleEng: "",
        exampleRom: "",
        exampleAudio: "",
        practice: { correction: ["/", ""] },
        folderName: "",
      },
    });
  }

  function addNewDialogue() {
    navigate("/edit-dialogue", {
      state: {
        lessonID: 0,
        dialogueNr: Math.max(...dialogueNrs) + 1,
        folderName: "",
        title: "",
        content: ["", ""],
        audios: ["", ""],
        fullAudio: "",
        practice: { pickCorrect: ["", "", "", "", ""], trueFalse: ["", ""] },
        vocabList: {"": ""}
      },
    });
  }

  function addNewReading() {
    navigate("/edit-reading", {
      state: {
        lessonID: 0,
        readingNr: Math.max(...readingNrs) + 1,
        folderName: "",
        title: "",
        content: [""],
        audios: [""],
        audio: "",
        practice: { pickCorrect: ["", "", "", "", ""], trueFalse: ["", ""] },
        vocabList: {"": ""}
      },
    });
  }

  return (
    <React.Fragment>
      <div id="lesson-cards" className={styles["lessoncards"]}>
        <div className={styles["lessonlists"]}>
          <div className={styles["lessonlist-grammar"]}>
            <p className={styles["subheading"]}>Grammar Points:</p>
            {grammarPoints.map(function (point, i) {
              return point;
            })}

            <p className={styles["subheading"]}>Vocabs:</p>
            {vocabPoints.map(function (point, i) {
              return point;
            })}
            <div className={styles["btn-div"]}>
              <button className={styles["new-btn"]} onClick={addNewGrammar}>
                Add new grammar
              </button>
              <button className={styles["new-btn"]} onClick={addNewVocab}>
                Add new vocab
              </button>
            </div>

            <p className={styles["heading-subsection"]}>
              Grammar & vocab lessons:
            </p>
            {grammarLessons.map(function (lesson, i) {
              return lesson;
            })}
            <div className={styles["btn-div"]}>
              <button
                className={styles["new-btn"]}
                id="grammar"
                onClick={(e) => openNewLesson(e)}
              >
                Add grammar lesson
              </button>
            </div>
          </div>

          <div className={styles["lessonlist-dialogue"]}>
            <p className={styles["subheading"]}>Dialogues:</p>
            {dialoguePoints.map(function (point, i) {
              return point;
            })}
            <div className={styles["btn-div"]}>
              <button className={styles["new-btn"]} onClick={addNewDialogue}>
                Add new dialogue
              </button>
            </div>

            <p className={styles["heading-subsection"]}>Dialogue lessons:</p>
            {dialogueLessons.map(function (lesson, i) {
              return lesson;
            })}
            <div className={styles["btn-div"]}>
              <button
                className={styles["new-btn"]}
                id="dialogue"
                onClick={(e) => openNewLesson(e)}
              >
                Add dialogue lesson
              </button>
            </div>
          </div>

          <div className={styles["lessonlist-reading"]}>
            <p className={styles["subheading"]}>Readings:</p>
            {readingPoints.map(function (point, i) {
              return point;
            })}
            <div className={styles["btn-div"]}>
              <button className={styles["new-btn"]} onClick={addNewReading}>
                Add new reading
              </button>
            </div>

            <p className={styles["heading-subsection"]}>Reading lessons:</p>
            {readingLessons.map(function (lesson, i) {
              return lesson;
            })}
            <div className={styles["btn-div"]}>
              <button
                className={styles["new-btn"]}
                id="reading"
                onClick={(e) => openNewLesson(e)}
              >
                Add reading lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
