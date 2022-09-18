import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
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

export default function ReviewBody(props) {
  let params = useParams();
  const { state } = useLocation();

  let databaseRead = 0;

  const [loading, setLoading] = useState(true);
  const [lessonStack, setLessonStack] = useState([]);
  const [exerciseStack, setExerciseStack] = useState([]);
  const [counter, setCounter] = useState(0);
  const [finish, setFinish] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);

  const [lessonCompsCount, setLessonCompsCount] = useState(0);

  const [allSelected, setAllSelected] = useState(false);
  const [result, setResult] = useState(false);
  const [correction, setCorrection] = useState(["1", "2"]);
  const [lessonFinished, setLessonFinished] = useState(false);

  const [vocabReviewToDatabase, setVocabReviewToDatabase] = useState({
    ...state.vocabReviewInDatabase
  });

  let todayDate = new Date();

  const [vocabReviewChanged, setVocabReviewChanged] = useState({});

  const [tempLesson, setTempLesson] = useState([]);

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const getRandom = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  useEffect(() => {
    let exercise = {};
    if (databaseRead === 0 && !exerciseStack.length > 0) {
      databaseRead = 1;
      shuffle(state.vocabToReview);
      state.vocabToReview.forEach((word) => {
        database.vocab
          .where("korean", "==", word)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              exercise[word] = getRandom(
                Object.keys(doc.data().practice).filter(
                  (e) => e !== "correction"
                )
              );

              if (exercise[word].includes("missingSyllables")) {
                setExerciseStack((prevState) => [
                  ...prevState,
                  <MissingSyllables
                    key={doc.id + exercise[word]}
                    korean={word}
                    content={doc.data().practice[exercise[word]]}
                    correction={doc.data().practice["correction"]}
                    img={getRandom(doc.data().imgs)}
                    audio={getRandom(doc.data().audios)}
                    setImgLoaded={pull_data}
                    setAllSelected={setAllSelected}
                    setResult={setResult}
                    setCorrection={setCorrection}
                  />,
                ]);
              } else if (exercise[word].includes("matchToAPicture")) {
                setExerciseStack((prevState) => [
                  ...prevState,
                  <MatchToAPicture
                    key={doc.id + exercise[word]}
                    img={getRandom(doc.data().imgs)}
                    korean={word}
                    content={doc.data().practice[exercise[word]]}
                    correction={doc.data().practice["correction"]}
                    setImgLoaded={false}
                    setAllSelected={setAllSelected}
                    setResult={setResult}
                    setCorrection={setCorrection}
                  />,
                ]);
              } else if (exercise[word].includes("puttingSyllablesTogether")) {
                setExerciseStack((prevState) => [
                  ...prevState,
                  <PuttingSyllablesTogether
                    key={doc.id + exercise[word]}
                    korean={word}
                    english={doc.data().english}
                    roman={doc.data().roman}
                    content={doc.data().practice[exercise[word]]}
                    correction={doc.data().practice["correction"]}
                    setImgLoaded={pull_data}
                    setAllSelected={setAllSelected}
                    setResult={setResult}
                    setCorrection={setCorrection}
                  />,
                ]);
              } else if (exercise[word].includes("puttingWordInSentence")) {
                setExerciseStack((prevState) => [
                  ...prevState,
                  <PuttingWordInSentence
                    key={doc.id + exercise[word]}
                    korean={word}
                    content={doc.data().practice[exercise[word]]}
                    correction={doc.data().practice["correction"]}
                    setImgLoaded={true}
                    setAllSelected={setAllSelected}
                    setResult={setResult}
                    setCorrection={setCorrection}
                  />,
                ]);
              } else if (
                exercise[word].includes("trueFalseQuestion") ||
                (exercise[word].includes("trueFalse") &&
                  !exercise[word].includes("Saying"))
              ) {
                setExerciseStack((prevState) => [
                  ...prevState,
                  <TrueFalse
                    key={doc.id + exercise[word]}
                    korean={word}
                    content={doc.data().practice[exercise[word]]}
                    correction={doc.data().practice["correction"]}
                    setImgLoaded={true}
                    setAllSelected={setAllSelected}
                    setResult={setResult}
                    setCorrection={setCorrection}
                  />,
                ]);
              } else if (exercise[word].includes("trueFalseSaying")) {
                setExerciseStack((prevState) => [
                  ...prevState,
                  <TrueFalseSaying
                    key={doc.id + exercise[word]}
                    korean={word}
                    img={getRandom(doc.data().imgs)}
                    audio={getRandom(doc.data().audios)}
                    content={doc.data().practice[exercise[word]]}
                    correction={doc.data().practice["correction"]}
                    setImgLoaded={pull_data}
                    setAllSelected={setAllSelected}
                    setResult={setResult}
                    setCorrection={setCorrection}
                  />,
                ]);
              } else {
                console.log("Exercise doesn't exist");
              }

              /* searchKeys(doc.data().practice, "missingSyllables", doc.id).map(
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

              searchKeys(doc.data().practice, "trueFalseQuestion", doc.id).map(
                function (exercise, i) {
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
                }
              );

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
              } */

              //<VocabDef korean={word} english={doc.data().english} />
            });
          });
      });
    }
  }, [loading]);

  useEffect(() => {
    if (exerciseStack.length === state.vocabToReview.length) {
      setLoading(false);
      setLessonStack([...exerciseStack]);
    }
  }, [exerciseStack]);

  useEffect(() => {
    if (counter + 1 === lessonStack.length) {
      setFinish(true);
    }
  }, [lessonStack])

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
    let vocabReviewCopy = { ...vocabReviewToDatabase };
    if (result) {
      document
        .getElementsByClassName("lesson-body-next")[0]
        .classList.add("green");
      document.getElementsByClassName("continue-btn")[0].classList.add("green");
      if (counter < state.vocabToReview.length) {
        for (let i = 0; i < 8; i++) {
          if (
            vocabReviewToDatabase[i].hasOwnProperty(
              lessonStack[counter].props.korean
            )
          ) {
            delete vocabReviewCopy[i][lessonStack[counter].props.korean];

            //add x milliseconds
            if (i === 0) {
              // move to 1 and add 12 hourse
              vocabReviewCopy[i + 1][lessonStack[counter].props.korean] =
                firebase.firestore.Timestamp.fromMillis(Date.now() + 43200000);
            } else if (i === 1) {
              // move to 2 and add 24 hours
              vocabReviewCopy[i + 1][lessonStack[counter].props.korean] =
                firebase.firestore.Timestamp.fromMillis(Date.now() + 86400000);
            } else if (i === 2) {
              // move to 3 and add 6 days
              vocabReviewCopy[i + 1][lessonStack[counter].props.korean] =
                firebase.firestore.Timestamp.fromMillis(Date.now() + 518400000);
            } else if (i === 3) {
              // move to 4 and add 12 days
              vocabReviewCopy[i + 1][lessonStack[counter].props.korean] =
                firebase.firestore.Timestamp.fromMillis(
                  Date.now() + 1036800000
                );
            } else if (i === 4) {
              // move to 5 and add 48 days
              vocabReviewCopy[i + 1][lessonStack[counter].props.korean] =
                firebase.firestore.Timestamp.fromMillis(
                  Date.now() + 4147200000
                );
            } else if (i === 5) {
              // move to 6 and add 96 days
              vocabReviewCopy[i + 1][lessonStack[counter].props.korean] =
                firebase.firestore.Timestamp.fromMillis(
                  Date.now() + 8294400000
                );
            } else if (i === 6) {
              // move to 7 and add 6 months
              vocabReviewCopy[i + 1][lessonStack[counter].props.korean] =
                firebase.firestore.Timestamp.fromMillis(
                  Date.now() + 15778476000
                );
            } else if (i === 7) {
              // do not move and add 6 months
              vocabReviewCopy[i][lessonStack[counter].props.korean] =
                firebase.firestore.Timestamp.fromMillis(
                  Date.now() + 15778476000
                );
            }

            setVocabReviewToDatabase({ ...vocabReviewCopy });
            break;
          }
        }

        /* database.users
          .doc(currentUser.uid)
          .get()
          .then((doc) => {
            for (let i = 0; i < 8; i++) {
              if (
                doc
                  .data()
                  .vocabReview[i].hasOwnProperty(
                    lessonStack[counter].props.korean
                  )
              ) {
                let vocabReviewCopy = { ...doc.data().vocabReview };
                delete vocabReviewCopy[i][lessonStack[counter].props.korean];

                //add x milliseconds
                if (i === 0) {
                  // move to 1 and add 12 hourse
                  vocabReviewCopy[i + 1][lessonStack[counter].props.korean] =
                    firebase.firestore.Timestamp.fromMillis(
                      Date.now() + 43200000
                    );
                } else if (i === 1) {
                  // move to 2 and add 24 hours
                  vocabReviewCopy[i + 1][lessonStack[counter].props.korean] =
                    firebase.firestore.Timestamp.fromMillis(
                      Date.now() + 86400000
                    );
                } else if (i === 2) {
                  // move to 3 and add 6 days
                  vocabReviewCopy[i + 1][lessonStack[counter].props.korean] =
                    firebase.firestore.Timestamp.fromMillis(
                      Date.now() + 518400000
                    );
                } else if (i === 3) {
                  // move to 4 and add 12 days
                  vocabReviewCopy[i + 1][lessonStack[counter].props.korean] =
                    firebase.firestore.Timestamp.fromMillis(
                      Date.now() + 1036800000
                    );
                } else if (i === 4) {
                  // move to 5 and add 48 days
                  vocabReviewCopy[i + 1][lessonStack[counter].props.korean] =
                    firebase.firestore.Timestamp.fromMillis(
                      Date.now() + 4147200000
                    );
                } else if (i === 5) {
                  // move to 6 and add 96 days
                  vocabReviewCopy[i + 1][lessonStack[counter].props.korean] =
                    firebase.firestore.Timestamp.fromMillis(
                      Date.now() + 8294400000
                    );
                } else if (i === 6) {
                  // move to 7 and add 6 months
                  vocabReviewCopy[i + 1][lessonStack[counter].props.korean] =
                    firebase.firestore.Timestamp.fromMillis(
                      Date.now() + 15778476000
                    );
                } else if (i === 7) {
                  // do not move and add 6 months
                  vocabReviewCopy[i][lessonStack[counter].props.korean] =
                    firebase.firestore.Timestamp.fromMillis(
                      Date.now() + 15778476000
                    );
                }

                console.log("changed vocab review: ", vocabReviewCopy);

                database.users.doc(currentUser.uid).update({
                  vocabReview: { ...vocabReviewCopy },
                });

                break;
              }
            }
          });*/
      }
    } else {
      document
        .getElementsByClassName("lesson-body-next")[0]
        .classList.add("red");
      document.getElementsByClassName("continue-btn")[0].classList.add("red");
      lessonStack.push(lessonStack[counter]);
      if (finish) {
        setFinish(false);
      }
      if (counter < state.vocabToReview.length) {
        for (let i = 0; i < 8; i++) {
          if (
            vocabReviewToDatabase[i].hasOwnProperty(
              lessonStack[counter].props.korean
            )
          ) {
            delete vocabReviewCopy[i][lessonStack[counter].props.korean];

            // move to 0 and add 4 hours
            vocabReviewCopy[0][lessonStack[counter].props.korean] =
              firebase.firestore.Timestamp.fromMillis(Date.now() + 14400000);

            setVocabReviewToDatabase({ ...vocabReviewCopy });
            break;
          }

          /* database.users
          .doc(currentUser.uid)
          .get()
          .then((doc) => {
            for (let i = 0; i < 8; i++) {
              if (
                doc
                  .data()
                  .vocabReview[i].hasOwnProperty(
                    lessonStack[counter].props.korean
                  )
              ) {
                let vocabReviewCopy = { ...doc.data().vocabReview };
                delete vocabReviewCopy[i][lessonStack[counter].props.korean];

                // move to 0 and add 4 hours
                vocabReviewCopy[0][lessonStack[counter].props.korean] =
                  firebase.firestore.Timestamp.fromMillis(
                    Date.now() + 14400000
                  );

                console.log("changed vocab review: ", vocabReviewCopy);
                database.users.doc(currentUser.uid).update({
                  vocabReview: { ...vocabReviewCopy },
                });

                break;
              }
            }
          }); */
        }
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
      setCounter(prevState => prevState + 1);
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
      if (
        !Object.keys(state.learningHistory).includes(
          todayDate.toLocaleDateString()
        )
      ) {
        database.users
          .doc(currentUser.uid)
          .update({
            vocabReview: { ...vocabReviewToDatabase },
            learningHistory: {
              ...state.learningHistory,
              [todayDate.toLocaleDateString()]: 1,
            },
            streak: state.currentStreak + 1,
          })
          .then(setLessonFinished(true));
      } else {
        database.users
          .doc(currentUser.uid)
          .update({
            vocabReview: { ...vocabReviewToDatabase },
            learningHistory: {
              ...state.learningHistory,
              [todayDate.toLocaleDateString()]:
                parseInt([
                  state.learningHistory[todayDate.toLocaleDateString()],
                ]) + 1,
            },
          })
          .then(setLessonFinished(true));
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
    databaseRead = 0;
    setLessonStack([]);
    setExerciseStack([]);
    setCounter(0);
    setFinish(false);
    setPageLoading(true);
    setLessonCompsCount(0);
  }

  function closeLesson() {
    resetLesson().then(navigate("/review"));
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
    if (counter + 1 === lessonStack.length) {
      setFinish(true);
    }
  }, [counter]);

  useEffect(() => {
    if (
      document.getElementsByClassName("lesson-content-inside-wrap")[0] !=
      undefined
    ) {
      setPageLoading(false);
    }
  });

  const pull_data = (data) => {
    if (data) {
      setPageLoading(false);
    }
  };

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
        <IoIosCloseCircle onClick={() => confirmClose()} className="icon-font" />
        <div className="lesson-content-wrap">
          {!loading && <>{lessonStack[counter]}</>}
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
