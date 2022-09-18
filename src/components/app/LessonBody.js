import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Close from "./Close";
import { database } from "../../firebase";
import VocabDef from "./vocab/VocabDef";
import ProgressBar from "./ProgressBar";
import { BiLoaderAlt } from "react-icons/bi";
import { IoIosCloseCircle } from "react-icons/io";
import { useAuth } from "../../contexts/AuthContext";
import firebase from "firebase/compat/app";

import MissingSyllables from "./vocab/MissingSyllables";
import PuttingSyllablesTogether from "./vocab/PuttingSyllablesTogether";
import MatchToAPicture from "./vocab/MatchToAPicture";
import PuttingWordInSentence from "./vocab/PuttingWordInSentence";
import TrueFalse from "./vocab/TrueFalse";
import TrueFalseSaying from "./vocab/TrueFalseSaying";
import GrammarDef from "./grammar/GrammarDef";
import PickCorrectForm from "./grammar/PickCorrectForm";
import TranslateSentence from "./grammar/TranslateSentence";
import DialogueBody from "./dialogue/DialogueBody";
import TrueFalseDialogue from "./dialogue/TrueFalseDialogue";
import PickCorrectDialogue from "./dialogue/PickCorrectDialogue";
import ReadingBody from "./reading/ReadingBody";
import TrueFalseReading from "./reading/TrueFalseReading";
import PickCorrectReading from "./reading/PickCorrectReading";

export default function LessonBody(props) {
  let params = useParams();
  const [loading, setLoading] = useState(true);
  const [lessonComps, setLessonComps] = useState();
  const [lessonStack, setLessonStack] = useState([]);
  const [exerciseStack, setExerciseStack] = useState([]);
  const [counter, setCounter] = useState(0);
  const [finish, setFinish] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);
  const [lessonVocab, setLessonVocab] = useState({});
  const [zeroVocabReview, setZeroVocabReview] = useState({});

  const [lessonCompsCount, setLessonCompsCount] = useState(0);

  const [allSelected, setAllSelected] = useState(false);
  const [result, setResult] = useState(false);
  const [correction, setCorrection] = useState(["1", "2"]);

  const [tempLesson, setTempLesson] = useState([]);

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [finishedLevel1, setFinishedLevel1] = useState([]);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [learningHistory, setLearningHistory] = useState({});
  const [currentStreak, setCurrentStreak] = useState(0);
  const todayDate = new Date();

  const getRandom = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  function searchKeys(object, searchKey, id = "") {
    const keys = Object.keys(object);
    const hasKey = keys.filter((key) => key.includes(searchKey));

    return hasKey ? hasKey : false;
  }

  useEffect(() => {
    if (lessonComps !== undefined) {
      setLoading(false);
    }
  }, [lessonComps]);

  useEffect(() => {
    database.users
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        setFinishedLevel1([...doc.data().finishedLevel1]);
        setZeroVocabReview({ ...doc.data().vocabReview[0] });
        setLearningHistory({...doc.data().learningHistory});
        setCurrentStreak(doc.data().streak);
      });
  }, []);

  useEffect(() => {
    if (!loading && lessonCompsCount === 0) {
      Object.keys(lessonComps).map((key) => {
        if (
          key.localeCompare("dialogue") === 0 ||
          key.localeCompare("reading") === 0
        ) {
          console.log("adding dialogue or reading");
          setLessonCompsCount((prev) => prev + 1);
        } else if (
          key.localeCompare("grammar") === 0 ||
          key.localeCompare("vocab") === 0
        ) {
          console.log(
            "adding " + lessonComps[key].length + " grammar or vocab points"
          );
          console.log("key: " + key);
          console.log(lessonComps[key]);
          setLessonCompsCount((prev) => prev + lessonComps[key].length);
        }
      });
    }
  }, [loading]);

  useEffect(() => {
    database.lessons
      .where("lessonNr", "==", parseInt(params.lessonNr))
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots

          setLessonComps(doc.data().components);
          if (doc.data().components.vocab) {
            doc.data().components.vocab.forEach((word) => {
              setLessonVocab((prevState) => ({
                ...prevState,
                [word]: firebase.firestore.Timestamp.fromMillis(
                  Date.now() + 14400000
                ),
              }));
            });
          }

          if (!Object.keys(doc.data().components).includes("vocab")) {
            setPageLoading(false);
          } else {
            setTimeout(() => {
              setPageLoading(false);
            }, "5000");
          }
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, []);

  useEffect(() => {
    if (!loading) {
      if (lessonComps.vocab != null) {
        lessonComps.vocab.forEach((word) => {
          database.vocab
            .where("korean", "==", word)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                console.log("setting vocab");
                setLessonStack((prevState) => [
                  ...prevState,
                  <VocabDef
                    key={doc.id}
                    korean={word}
                    roman={doc.data().roman}
                    english={doc.data().english}
                    img={getRandom(doc.data().imgs)}
                    audio={getRandom(doc.data().audios)}
                    setImgLoaded={pull_data}
                    exampleKor={doc.data().exampleKor}
                    exampleEng={doc.data().exampleEng}
                    exampleRom={doc.data().exampleRom}
                    exampleAudio={doc.data().exampleAudio}
                    setAllSelected={setAllSelected}
                    setResult={setResult}
                    setChecked={setChecked}
                  />,
                ]);

                searchKeys(doc.data().practice, "missingSyllables", doc.id).map(
                  function (exercise, i) {
                    setExerciseStack((prevState) => [
                      ...prevState,
                      <MissingSyllables
                        key={doc.id + exercise}
                        korean={word}
                        content={doc.data().practice[exercise]}
                        correction={doc.data().practice["correction"]}
                        img={getRandom(doc.data().imgs)}
                        audio={getRandom(doc.data().audios)}
                        setImgLoaded={pull_data}
                        setAllSelected={setAllSelected}
                        setResult={setResult}
                        setCorrection={setCorrection}
                      />,
                    ]);
                  }
                );

                searchKeys(
                  doc.data().practice,
                  "puttingSyllablesTogether",
                  doc.id
                ).map(function (exercise, i) {
                  setExerciseStack((prevState) => [
                    ...prevState,
                    <PuttingSyllablesTogether
                      key={doc.id + exercise}
                      korean={word}
                      english={doc.data().english}
                      roman={doc.data().roman}
                      content={doc.data().practice[exercise]}
                      correction={doc.data().practice["correction"]}
                      setImgLoaded={pull_data}
                      setAllSelected={setAllSelected}
                      setResult={setResult}
                      setCorrection={setCorrection}
                    />,
                  ]);
                });

                searchKeys(doc.data().practice, "matchToAPicture", doc.id).map(
                  function (exercise, i) {
                    setExerciseStack((prevState) => [
                      ...prevState,
                      <MatchToAPicture
                        key={doc.id + exercise}
                        img={getRandom(doc.data().imgs)}
                        korean={word}
                        content={doc.data().practice[exercise]}
                        correction={doc.data().practice["correction"]}
                        setImgLoaded={false}
                        setAllSelected={setAllSelected}
                        setResult={setResult}
                        setCorrection={setCorrection}
                      />,
                    ]);
                  }
                );

                searchKeys(
                  doc.data().practice,
                  "puttingWordInSentence",
                  doc.id
                ).map(function (exercise, i) {
                  setExerciseStack((prevState) => [
                    ...prevState,
                    <PuttingWordInSentence
                      key={doc.id + exercise}
                      korean={word}
                      content={doc.data().practice[exercise]}
                      correction={doc.data().practice["correction"]}
                      setImgLoaded={true}
                      setAllSelected={setAllSelected}
                      setResult={setResult}
                      setCorrection={setCorrection}
                    />,
                  ]);
                });

                searchKeys(
                  doc.data().practice,
                  "trueFalseQuestion",
                  doc.id
                ).map(function (exercise, i) {
                  setExerciseStack((prevState) => [
                    ...prevState,
                    <TrueFalse
                      key={doc.id + exercise}
                      korean={word}
                      content={doc.data().practice[exercise]}
                      correction={doc.data().practice["correction"]}
                      setImgLoaded={true}
                      setAllSelected={setAllSelected}
                      setResult={setResult}
                      setCorrection={setCorrection}
                    />,
                  ]);
                });

                searchKeys(doc.data().practice, "trueFalseSaying", doc.id).map(
                  function (exercise, i) {
                    setExerciseStack((prevState) => [
                      ...prevState,
                      <TrueFalseSaying
                        key={doc.id + exercise}
                        korean={word}
                        img={getRandom(doc.data().imgs)}
                        audio={getRandom(doc.data().audios)}
                        content={doc.data().practice[exercise]}
                        correction={doc.data().practice["correction"]}
                        setImgLoaded={pull_data}
                        setAllSelected={setAllSelected}
                        setResult={setResult}
                        setCorrection={setCorrection}
                      />,
                    ]);
                  }
                );

                if (doc.data().practice.hasOwnProperty("")) {
                  setExerciseStack((prevState) => [...prevState]);
                }

                //<VocabDef korean={word} english={doc.data().english} />
              });
            });
        });
      }
      if (lessonComps.grammar != null) {
        console.log("getting grammar");
        lessonComps.grammar.forEach((grammarPoint) => {
          console.log("getting " + grammarPoint);
          database.grammar
            .where("grammarName", "==", grammarPoint)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                if (doc.data().explanationLeftColumn === undefined) {
                  setLessonStack((prevState) => [
                    ...prevState,
                    <GrammarDef
                      key={doc.id + "grammar"}
                      grammarName={grammarPoint}
                      introExample={doc.data().introExample}
                      explanation={doc.data().explanation}
                      explanationBody={doc.data().explanationBody}
                      setAllSelected={setAllSelected}
                      setChecked={setChecked}
                      setResult={setResult}
                    />,
                  ]);
                } else {
                  setLessonStack((prevState) => [
                    ...prevState,
                    <GrammarDef
                      key={doc.id + "grammar"}
                      grammarName={grammarPoint}
                      introExample={doc.data().introExample}
                      explanation={doc.data().explanation}
                      explanationLeftColumn={doc.data().explanationLeftColumn}
                      explanationRightColumn={doc.data().explanationRightColumn}
                      setAllSelected={setAllSelected}
                      setChecked={setChecked}
                      setResult={setResult}
                    />,
                  ]);
                }

                searchKeys(doc.data().practice, "pickCorrectForm").map(
                  function (exercise, i) {
                    setExerciseStack((prevState) => [
                      ...prevState,
                      <PickCorrectForm
                        key={doc.id + "pickcorrectform"}
                        grammarName={grammarPoint}
                        content={doc.data().practice[exercise]}
                        setImgLoaded={true}
                        setAllSelected={setAllSelected}
                        setResult={setResult}
                        setCorrection={setCorrection}
                      />,
                    ]);
                  }
                );

                searchKeys(doc.data().practice, "translateSentence").map(
                  function (exercise, i) {
                    setExerciseStack((prevState) => [
                      ...prevState,
                      <TranslateSentence
                        key={doc.id + "translatesentence"}
                        grammarName={grammarPoint}
                        content={doc.data().practice[exercise]}
                        setImgLoaded={true}
                        setAllSelected={setAllSelected}
                        setResult={setResult}
                        setCorrection={setCorrection}
                      />,
                    ]);
                  }
                );
              });
            });
        });
      }

      if (lessonComps.dialogue != null) {
        database.dialogue
          .where("dialogueNr", "==", lessonComps.dialogue)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log("adding " + doc.data().title + " to lessonStack");
              setLessonStack((prevState) => [
                ...prevState,
                <DialogueBody
                  key={doc.id + "dialoguebody"}
                  vocabList={doc.data().vocabList}
                  title={doc.data().title}
                  content={doc.data().content}
                  audios={doc.data().audios}
                  fullAudio={doc.data().fullAudio}
                  setImgLoaded={true}
                  pull_data={pull_data}
                  setAllSelected={setAllSelected}
                  setChecked={setChecked}
                  setResult={setResult}
                />,
              ]);

              searchKeys(doc.data().practice, "trueFalse").map(function (
                exercise,
                i
              ) {
                console.log("adding " + exercise + " to exercsiseStack");
                setExerciseStack((prevState) => [
                  ...prevState,
                  <TrueFalseDialogue
                    key={doc.id + "dialoguetruefalse"}
                    vocabList={doc.data().vocabList}
                    title={doc.data().title}
                    audios={doc.data().audios}
                    body={doc.data().content}
                    content={doc.data().practice[exercise]}
                    setImgLoaded={pull_data}
                    setAllSelected={setAllSelected}
                    setResult={setResult}
                    setCorrection={setCorrection}
                  />,
                ]);
              });

              searchKeys(doc.data().practice, "pickCorrect").map(function (
                exercise,
                i
              ) {
                console.log("adding " + exercise + " to exercsiseStack");
                setExerciseStack((prevState) => [
                  ...prevState,
                  <PickCorrectDialogue
                    key={doc.id + "dialoguepickcorrect"}
                    vocabList={doc.data().vocabList}
                    title={doc.data().title}
                    audios={doc.data().audios}
                    body={doc.data().content}
                    content={doc.data().practice[exercise]}
                    setImgLoaded={pull_data}
                    setAllSelected={setAllSelected}
                    setResult={setResult}
                    setCorrection={setCorrection}
                  />,
                ]);
              });
            });
          });
      }

      if (lessonComps.reading != null) {
        database.reading
          .where("readingNr", "==", lessonComps.reading)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              setLessonStack((prevState) => [
                ...prevState,
                <ReadingBody
                  key={doc.id + "readingbody"}
                  vocabList={doc.data().vocabList}
                  title={doc.data().title}
                  content={doc.data().content}
                  audio={doc.data().audio}
                  audios={doc.data().audios}
                  setImgLoaded={true}
                  pull_data={pull_data}
                  setAllSelected={setAllSelected}
                  setChecked={setChecked}
                  setResult={setResult}
                />,
              ]);

              searchKeys(doc.data().practice, "trueFalse").map(function (
                exercise,
                i
              ) {
                setExerciseStack((prevState) => [
                  ...prevState,
                  <TrueFalseReading
                    key={doc.id + "readingtruefalse"}
                    vocabList={doc.data().vocabList}
                    title={doc.data().title}
                    audios={doc.data().audios}
                    body={doc.data().content}
                    content={doc.data().practice[exercise]}
                    setImgLoaded={pull_data}
                    setAllSelected={setAllSelected}
                    setResult={setResult}
                    setCorrection={setCorrection}
                  />,
                ]);
              });

              searchKeys(doc.data().practice, "pickCorrect").map(function (
                exercise,
                i
              ) {
                setExerciseStack((prevState) => [
                  ...prevState,
                  <PickCorrectReading
                    key={doc.id + "readingpickcorrect"}
                    vocabList={doc.data().vocabList}
                    title={doc.data().title}
                    audios={doc.data().audios}
                    body={doc.data().content}
                    content={doc.data().practice[exercise]}
                    setImgLoaded={pull_data}
                    setAllSelected={setAllSelected}
                    setResult={setResult}
                    setCorrection={setCorrection}
                  />,
                ]);
              });
            });
          });
      }
    }
  }, [loading]);

  useEffect(() => {
    console.log("lessonCompsCount: " + lessonCompsCount);
    console.log("lessonStack length: " + lessonStack.length);
    if (lessonCompsCount === lessonStack.length) {
      console.log("lesson comps count: " + lessonCompsCount);
      console.log(lessonStack);
      console.log(exerciseStack);
      shuffle(exerciseStack);
      setLessonStack((prevState) => [...prevState, ...exerciseStack]);
    }
  }, [exerciseStack, lessonCompsCount]);

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  const evaluate = () => {
    if (result) {
      document
        .getElementsByClassName("lesson-body-next")[0]
        .classList.add("green");
      document.getElementsByClassName("continue-btn")[0].classList.add("green");
    } else {
      document
        .getElementsByClassName("lesson-body-next")[0]
        .classList.add("red");
      document.getElementsByClassName("continue-btn")[0].classList.add("red");
      lessonStack.push(lessonStack[counter]);
      if (finish) {
        setFinish(false);
      }
    }
    setShowCorrection(true);
    setChecked(true);
    document
      .getElementsByClassName("lesson-content-wrap")[0]
      .classList.add("unclickable");
  };

  const cont = () => {
    if (!finish) {
      setCounter(counter + 1);
      setAllSelected(false);
      setResult(false);
      setChecked(false);
      setShowCorrection(false);
      document
        .getElementsByClassName("lesson-content-wrap")[0]
        .classList.remove("unclickable");
      document
        .getElementsByClassName("lesson-body-next")[0]
        .classList.remove("green");
      document
        .getElementsByClassName("lesson-body-next")[0]
        .classList.remove("red");
      document
        .getElementsByClassName("continue-btn")[0]
        .classList.remove("green");
      document
        .getElementsByClassName("continue-btn")[0]
        .classList.remove("red");
    } else {
      if (!finishedLevel1.includes(parseInt(params.lessonNr))) {
        if (!Object.keys(learningHistory).includes(todayDate.toLocaleDateString())) {
          database.users.doc(currentUser.uid).update({
            finishedLevel1: [...finishedLevel1, parseInt(params.lessonNr)],
            "vocabReview.0": { ...zeroVocabReview, ...lessonVocab },
            learningHistory: {...learningHistory, [todayDate.toLocaleDateString()]: 1},
            streak: currentStreak+1
          }).then(setLessonFinished(true))
        } else {
          database.users.doc(currentUser.uid).update({
            finishedLevel1: [...finishedLevel1, parseInt(params.lessonNr)],
            "vocabReview.0": { ...zeroVocabReview, ...lessonVocab },
            learningHistory: {...learningHistory, [todayDate.toLocaleDateString()]: parseInt([learningHistory[todayDate.toLocaleDateString()]])+1}
          }).then(setLessonFinished(true))
        }
      } else {
        if (!Object.keys(learningHistory).includes(todayDate.toLocaleDateString())) {
          database.users.doc(currentUser.uid).update({
            learningHistory: {...learningHistory, [todayDate.toLocaleDateString()]: 1},
            streak: currentStreak+1
          }).then(setLessonFinished(true))
        } else {
          database.users.doc(currentUser.uid).update({
            learningHistory: {...learningHistory, [todayDate.toLocaleDateString()]: parseInt([learningHistory[todayDate.toLocaleDateString()]])+1}
          }).then(setLessonFinished(true))
        }
      }
    }
  };

  useEffect(() => {
    if (lessonFinished) {
      closeLesson();
    }
  }, [lessonFinished]);

  async function resetLesson() {
    setLoading(true);
    setLessonComps({});
    setLessonStack([]);
    setExerciseStack([]);
    setCounter(0);
    setFinish(false);
    setPageLoading(true);
    setLessonCompsCount(0);
  }

  function closeLesson() {
    resetLesson().then(navigate("/"));
  }

  function confirmClose() {
    if (
      window.confirm(
        "Are you sure you want to exit? All progress will be lost."
      )
    ) {
      closeLesson();
    }
  }

  useEffect(() => {
    console.log("counter: " + counter);
    console.log("finish: " + lessonStack.length);
    console.log(counter + 1 === lessonStack.length);
    if (counter + 1 === lessonStack.length) {
      setFinish(true);
    }
  }, [counter]);

  /* useEffect(() => {
    if (document.getElementsByClassName("vocab-def-wrap")[0] != undefined) {
      setPageLoading(false);
    }
  }) */

  const pull_data = (data) => {
    if (data) {
      setPageLoading(false);
    }
  };

  const changeShowCorrection = () => {};

  //TESTING PUTTING SYLLABLES TOGETHER
  /* useEffect(() => {
    if (!loading && lessonStack.length > 5) {
      lessonStack.forEach((el, i) => {
        if (
          i > 3 && el.key.includes("match")
        ) {
          tempLesson.push(el);
          console.log(el);
          setPageLoading(false);
        }
      });
    }
  }, [lessonStack, loading]); */

  return (
    <div className="lesson-body-wrap">
      {pageLoading && (
        <div className="overlay-loading">
          <BiLoaderAlt className="loader" />
        </div>
      )}
      <div className="lesson-body-container">
        {!loading && (
          <ProgressBar total={lessonStack.length} current={counter} />
        )}
        <IoIosCloseCircle
          onClick={() => confirmClose()}
          className="icon-font"
        />
        <div className="lesson-content-wrap">
          {!loading && <>{lessonStack[counter]}</>}
          {/* {!loading && <>{tempLesson[0]}</>} */}
        </div>
      </div>
      {allSelected && (
        <div className="lesson-body-next">
          <div className="correction-wrap">
            {showCorrection && (
              <p>
                <strong>{correction[0]}</strong>
                <br />
                {correction[1]}
              </p>
            )}
          </div>
          <div className="btns-wrap">
            {!checked ? (
              <button className="continue-btn" onClick={evaluate}>
                CONTINUE
              </button>
            ) : (
              <button className="continue-btn" onClick={cont}>
                {finish ? "FINISH" : "CONTINUE"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
