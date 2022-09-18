import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import styles from "./AdminStyles.module.scss";
import { database } from "../../../firebase";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import newGrammarNotes from "../../../images/newGrammarNotes.png";
import pickCorrectFormNotes from "../../../images/pickCorrectFormNotes.png";
import translateSentenceNotes from "../../../images/translateSentenceNotes.png";

export default function EditGrammar(props) {
  const { state } = useLocation();

  const [explanation, setExplanation] = useState(state.explanation);
  const [explanationLeftColumn, setExplanationLeftColumn] = useState();
  const [explanationRightColumn, setExplanationRightColumn] = useState();
  const [grammarName, setGrammarName] = useState(state.grammarPoint);
  const [introExample, setIntroExample] = useState(state.introExample);
  const [practice, setPractice] = useState(state.practice);
  const [practiceKeys, setPracticeKeys] = useState([]);
  const [showingOverlay, setShowingOverlay] = useState(false);
  const [overlayPic, setOverlayPic] = useState(
    "https://hips.hearstapps.com/hmg-prod/images/domestic-cat-lies-in-a-basket-with-a-knitted-royalty-free-image-1592337336.jpg"
  );

  // Explanation left column components:
  const [explanationLeftColumnHeading, setExplanationLeftColumnHeading] =
    useState(state.explanationLeftColumn[0]);
  const [explanationLeftColumnExamples, setExplanationLeftColumnExamples] =
    useState(state.explanationLeftColumn.slice(1));

  // Explanation left column components:
  const [explanationRightColumnHeading, setExplanationRightColumnHeading] =
    useState(state.explanationRightColumn[0]);
  const [explanationRightColumnExamples, setExplanationRightColumnExamples] =
    useState(state.explanationRightColumn.slice(1));

  const navigate = useNavigate();

  useEffect(() => {
    if (practice) {
      setPracticeKeys(Object.keys(practice));
    }
  }, [practice]);

  function handleLeftExpChange(e, index, lang) {
    const newArr = explanationLeftColumnExamples.slice();
    const targetArr = newArr[index].split("/");
    targetArr[lang] = e.target.value;
    newArr[index] = targetArr.join().replaceAll(",", "/");
    setExplanationLeftColumnExamples(newArr);
    setExplanationLeftColumn([explanationLeftColumnHeading, ...newArr]);
  }

  function handleRightExpChange(e, index, lang) {
    const newArr = explanationRightColumnExamples.slice();
    const targetArr = newArr[index].split("/");
    targetArr[lang] = e.target.value;
    newArr[index] = targetArr.join().replaceAll(",", "/");
    setExplanationRightColumnExamples(newArr);
  }

  function handlePracticeChange(e, questionType, index, lang = 0) {
    const newArr = practice[questionType].slice();
    const targetArr = newArr[index].split("/");
    targetArr[lang] = e.target.value;
    newArr[index] = targetArr.join().replaceAll(",", "/");
    setPractice((prevState) => ({
      ...prevState,
      [questionType]: [...newArr],
    }));
  }

  function addExample(side) {
    // side: 0 = left, 1 = right
    if (side === 0) {
      setExplanationLeftColumnExamples((prevState) => [...prevState, "//"]);
    } else {
      setExplanationRightColumnExamples((prevState) => [...prevState, "//"]);
    }
  }

  async function handleComponents() {
    setExplanationLeftColumn([
      explanationLeftColumnHeading,
      ...explanationLeftColumnExamples,
    ]);
    setExplanationRightColumn([
      explanationRightColumnHeading,
      ...explanationRightColumnExamples,
    ]);
  }

  useEffect(() => {
    setExplanationLeftColumn([
      explanationLeftColumnHeading,
      ...explanationLeftColumnExamples,
    ]);
    setExplanationRightColumn([
      explanationRightColumnHeading,
      ...explanationRightColumnExamples,
    ]);
  }, [
    explanationLeftColumnHeading,
    explanationLeftColumnExamples,
    explanationRightColumnHeading,
    explanationRightColumnExamples,
  ]);

  function handleSubmit(e) {
    e.preventDefault();

    if (state.lessonID !== 0) {
      database.grammar
        .doc(state.lessonID)
        .update({
          grammarName: grammarName,
          introExample: introExample,
          explanation: explanation,
          explanationLeftColumn: explanationLeftColumn,
          explanationRightColumn: explanationRightColumn,
          practice: practice,
        })

        .then(navigate("/admin-dashboard"))
        .catch((error) => console.error(error));
    } else {
      database.grammar
        .add({
          grammarName: grammarName,
          introExample: introExample,
          explanation: explanation,
          explanationLeftColumn: explanationLeftColumn,
          explanationRightColumn: explanationRightColumn,
          practice: practice,
        })

        .then(navigate("/admin-dashboard"))
        .catch((error) => console.error(error));
    }
  }

  function showOverlay(src = "") {
    if (src.localeCompare("") !== 0) {
      setOverlayPic(src);
    }
    setShowingOverlay(true);
  }

  function deleteExample(exp, side) {
    //side: 0 = left, 1 = right
    console.log(exp);
    if (side === 0 && explanationLeftColumnExamples.indexOf(exp) !== -1) {
      const newArr = [...explanationLeftColumnExamples];
      newArr.splice(newArr.indexOf(exp), 1);
      setExplanationLeftColumnExamples(newArr);
    } else if (
      side === 1 &&
      explanationRightColumnExamples.indexOf(exp) !== -1
    ) {
      const newArr = [...explanationRightColumnExamples];
      newArr.splice(newArr.indexOf(exp), 1);
      setExplanationRightColumnExamples(newArr);
    }
  }

  function addOption(positionFromEnd = 2, exercise, toAdd = "/") {
    const newArr = practice[exercise];
    newArr.splice(newArr.length - positionFromEnd, 0, toAdd);
    setPractice((prevState) => ({
      ...prevState,
      [exercise]: [...newArr],
    }));
  }

  function deleteOption(exercise, index) {
    const newArr = practice[exercise];
    newArr.splice(index, 1);
    setPractice((prevState) => ({
      ...prevState,
      [exercise]: [...newArr],
    }));
  }

  function addExercise(exercise, minState = ["/"]) {
    if (exercise.includes("pickCorrectForm")) {
      minState = ["/", "/", "/", ""];
    } else if (exercise.includes("translateSentence")) {
      minState = ["", "", "/", "/", ""];
    }
    setPractice((prevState) => ({
      ...prevState,
      [exercise]: [...minState],
    }));
    setPracticeKeys((prevState) => [...prevState, exercise]);
  }

  function deleteExercise(exercise) {
    const newObj = practice;
    delete newObj[exercise];
    setPractice(newObj);
    setPracticeKeys(Object.keys(newObj));
  }

  function nextKey(exercise) {
    let count = 0;
    practiceKeys.forEach((key) => {
      if (key.includes(exercise)) {
        count += 1;
      }
    });
    return (count + 1).toString();
  }

  return (
    <React.Fragment>
      {showingOverlay && (
        <div
          className={styles["overlay-wrap"]}
          onClick={() => setShowingOverlay(false)}
        >
          <div className={styles["overlay"]}>
            <img src={overlayPic} />
          </div>
        </div>
      )}
      <div className={`dashboard-wrap ${styles["scrollable"]}`}>
        <Navbar />
        <p className="big-heading">
          Create Grammar Point{" "}
          <FaInfoCircle
            className={`${styles["info-icon"]} ${styles["big-info-icon"]}`}
            onClick={() => showOverlay(newGrammarNotes)}
          />
        </p>

        <div className={styles["lesson-form"]}>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-5">
              <Col xs={4}>
                <InputGroup>
                  <InputGroup.Text>Grammar Name</InputGroup.Text>
                  <Form.Control
                    type="string"
                    placeholder="이다"
                    required
                    value={grammarName}
                    onChange={(e) => setGrammarName(e.target.value)}
                  />
                </InputGroup>
              </Col>

              <Col xs={8}>
                <InputGroup>
                  <InputGroup.Text>Intro Example</InputGroup.Text>
                  <Form.Control
                    type="string"
                    placeholder="저는 학생<이에요>."
                    required
                    value={introExample}
                    onChange={(e) => setIntroExample(e.target.value)}
                  />
                </InputGroup>
              </Col>
            </Row>

            <Row className="mb-5">
              <Col xs={12}>
                <InputGroup>
                  <InputGroup.Text>Explanation</InputGroup.Text>
                  <Form.Control
                    as="textarea"
                    placeholder="이다 is used to give statements or ask simple questions. It is attached to nouns to make them the subject of a sentence.<br/>It is conjugated into -이에요 or -예요 to indicate declarative present tense."
                    rows={3}
                    required
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                  />
                </InputGroup>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <InputGroup>
                  <InputGroup.Text>Explanation Left: Heading</InputGroup.Text>
                  <Form.Control
                    type="string"
                    placeholder="Words that end in consonants: -이에요"
                    required
                    value={explanationLeftColumnHeading}
                    onChange={(e) =>
                      setExplanationLeftColumnHeading(e.target.value)
                    }
                  />
                </InputGroup>
              </Col>
              <Col xs={6}>
                <InputGroup>
                  <InputGroup.Text>Explanation Right: Heading</InputGroup.Text>
                  <Form.Control
                    type="string"
                    placeholder="Words that end in vowels: -예요"
                    required
                    value={explanationRightColumnHeading}
                    onChange={(e) =>
                      setExplanationRightColumnHeading(e.target.value)
                    }
                  />
                </InputGroup>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                {explanationLeftColumnExamples.map(function (exp, i) {
                  return (
                    <div key={"leftexamples" + exp.split("/")[0] + i}>
                      <p className={styles["subheading"]}>
                        {i > 0 && (
                          <MdDelete
                            className={styles["delete-icon"]}
                            onClick={() => deleteExample(exp, 0)}
                          />
                        )}
                        Example {i}:
                      </p>
                      <InputGroup>
                        <InputGroup.Text>Korean</InputGroup.Text>
                        <Form.Control
                          key={"leftexampleskor" + i}
                          type="string"
                          placeholder="저는 학생<이에요>."
                          required
                          value={exp.split("/")[0]}
                          onChange={(e) => handleLeftExpChange(e, i, 0)}
                        />
                      </InputGroup>
                      <InputGroup>
                        <InputGroup.Text>Romanisation</InputGroup.Text>
                        <Form.Control
                          key={"leftexamplesrom" + i}
                          type="string"
                          placeholder="Jeoneun haksaeng<ieyo>."
                          required
                          value={exp.split("/")[1]}
                          onChange={(e) => handleLeftExpChange(e, i, 1)}
                        />
                      </InputGroup>
                      <InputGroup>
                        <InputGroup.Text>English</InputGroup.Text>
                        <Form.Control
                          key={"leftexampleseng" + i}
                          type="string"
                          placeholder="I am a student."
                          required
                          value={exp.split("/")[2]}
                          onChange={(e) => handleLeftExpChange(e, i, 2)}
                        />
                      </InputGroup>
                    </div>
                  );
                })}
                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={() => addExample(0)}
                >
                  Add Example
                </Button>
              </Col>

              <Col xs={6}>
                {explanationRightColumnExamples.map(function (exp, i) {
                  return (
                    <div key={"rightexamples" + i}>
                      <p className={styles["subheading"]}>
                        {i > 0 && (
                          <MdDelete
                            className={styles["delete-icon"]}
                            onClick={() => deleteExample(exp, 1)}
                          />
                        )}
                        Example {i}:
                      </p>
                      <InputGroup>
                        <InputGroup.Text>Korean</InputGroup.Text>
                        <Form.Control
                          key={"rightexampleskor" + i}
                          type="string"
                          placeholder="가수<예요>."
                          required
                          value={exp.split("/")[0]}
                          onChange={(e) => handleRightExpChange(e, i, 0)}
                        />
                      </InputGroup>
                      <InputGroup>
                        <InputGroup.Text>Romanisation</InputGroup.Text>
                        <Form.Control
                          key={"rightexamplesrom" + i}
                          type="string"
                          placeholder="Kasu<yeyo>."
                          required
                          value={exp.split("/")[1]}
                          onChange={(e) => handleRightExpChange(e, i, 1)}
                        />
                      </InputGroup>
                      <InputGroup>
                        <InputGroup.Text>English</InputGroup.Text>
                        <Form.Control
                          key={"rightexampleseng" + i}
                          type="string"
                          placeholder="She is a singer"
                          required
                          value={exp.split("/")[2]}
                          onChange={(e) => handleRightExpChange(e, i, 2)}
                        />
                      </InputGroup>
                    </div>
                  );
                })}
                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={() => addExample(1)}
                >
                  Add Example
                </Button>
              </Col>
            </Row>

            <Row>
              <Col>
                <div className="double-spacer">
                  <p className={styles["subheading"]}>Practice:</p>
                  <InputGroup>
                    <InputGroup.Text>
                      Correction rule and example:
                    </InputGroup.Text>
                    <Form.Control
                      key={"practicecorrection1"}
                      type="string"
                      placeholder="consonant + 이에요 — vowel + 이"
                      value={practice["correction"][0]}
                      onChange={(e) => handlePracticeChange(e, "correction", 0)}
                    />
                    <Form.Control
                      key={"practicecorrection2"}
                      type="string"
                      placeholder="학생이에요 — 가수예"
                      value={practice["correction"][1]}
                      onChange={(e) => handlePracticeChange(e, "correction", 1)}
                    />
                  </InputGroup>
                </div>
              </Col>
            </Row>

            <Row className="mt-3">
              <Button
                variant="light"
                className={styles["add-exercise-btn"]}
                onClick={() =>
                  addExercise("pickCorrectForm" + nextKey("pickCorrectForm"))
                }
              >
                Add Pick Correct Form
              </Button>
              <Button
                variant="light"
                className={styles["add-exercise-btn"]}
                onClick={() =>
                  addExercise(
                    "translateSentence" + nextKey("translateSentence")
                  )
                }
              >
                Add Translate Sentence
              </Button>
            </Row>

            {practiceKeys.map((key, x) => {
              if (key.includes("pickCorrectForm")) {
                return (
                  <Row>
                    <Col className="spacer">
                      <p className={styles["subheading"]}>
                        <MdDelete
                          className={styles["delete-icon"]}
                          onClick={() => deleteExercise(key)}
                        />
                        Pick correct form {key.match(/\d+/)}:
                        <FaInfoCircle
                          className={styles["info-icon"]}
                          onClick={() => showOverlay(pickCorrectFormNotes)}
                        />
                      </p>
                      <InputGroup>
                        <InputGroup.Text>Question:</InputGroup.Text>
                        <Form.Control
                          key={key + "question"}
                          type="string"
                          required
                          placeholder="저는 학생<missing>."
                          value={practice[key][0].split("/")[0]}
                          onChange={(e) => handlePracticeChange(e, key, 0, 0)}
                        />
                        <Form.Control
                          key={key + "questionroman"}
                          type="string"
                          required
                          placeholder=" Jeoneun haksaeng <missing>."
                          value={practice[key][0].split("/")[1]}
                          onChange={(e) => handlePracticeChange(e, key, 0, 1)}
                        />
                      </InputGroup>

                      <Button
                        variant="secondary"
                        className="mt-3 mb-3"
                        onClick={() => addOption(2, key, "/")}
                      >
                        Add Option
                      </Button>

                      {practice[key].map(function (option, i) {
                        if (
                          i !== 0 &&
                          i !== 1 &&
                          i !== practice[key].length - 1 &&
                          i !== practice[key].length - 2
                        ) {
                          return (
                            <div className={styles["input-div"]}>
                              <InputGroup>
                                <InputGroup.Text>Option:</InputGroup.Text>
                                <Form.Control
                                  key={key + "option" + i}
                                  type="string"
                                  placeholder="예요"
                                  required
                                  value={option.split("/")[0]}
                                  onChange={(e) =>
                                    handlePracticeChange(e, key, i, 0)
                                  }
                                />
                                <Form.Control
                                  key={key + "optionroman" + i}
                                  type="string"
                                  placeholder="yeyo"
                                  required
                                  value={option.split("/")[1]}
                                  onChange={(e) =>
                                    handlePracticeChange(e, key, i, 1)
                                  }
                                />
                              </InputGroup>
                              <MdDelete
                                className={styles["inline-delete-icon"]}
                                onClick={() => deleteOption(key, i)}
                              />
                            </div>
                          );
                        } else if (i === 1) {
                          return (
                            <InputGroup>
                              <InputGroup.Text>Correct answer:</InputGroup.Text>
                              <Form.Control
                                key={key + "answer"}
                                type="string"
                                placeholder="이에요"
                                required
                                value={option.split("/")[0]}
                                onChange={(e) =>
                                  handlePracticeChange(e, key, i, 0)
                                }
                              />
                              <Form.Control
                                key={key + "answerroman"}
                                type="string"
                                placeholder="ieyo"
                                required
                                value={option.split("/")[1]}
                                onChange={(e) =>
                                  handlePracticeChange(e, key, i, 1)
                                }
                              />
                            </InputGroup>
                          );
                        } else if (i === practice[key].length - 2) {
                          return (
                            <InputGroup className="mt-5">
                              <InputGroup.Text>
                                Correction (answer):
                              </InputGroup.Text>
                              <Form.Control
                                key={key + "correction1"}
                                type="string"
                                placeholder="저는 학생이에요."
                                required
                                value={option.split("/")[0]}
                                onChange={(e) =>
                                  handlePracticeChange(e, key, i, 0)
                                }
                              />
                              <Form.Control
                                key={key + "correction2"}
                                type="string"
                                placeholder="Jeoneun haksaengieyo."
                                required
                                value={option.split("/")[1]}
                                onChange={(e) =>
                                  handlePracticeChange(e, key, i, 1)
                                }
                              />
                            </InputGroup>
                          );
                        } else if (i === practice[key].length - 1) {
                          return (
                            <InputGroup>
                              <InputGroup.Text>
                                Correction (expl):
                              </InputGroup.Text>
                              <Form.Control
                                key={key + "correctionexpl"}
                                type="string"
                                placeholder="학생 (haksaeng) ends with a consonant → + 이에요"
                                required
                                value={option}
                                onChange={(e) =>
                                  handlePracticeChange(e, key, i, 0)
                                }
                              />
                            </InputGroup>
                          );
                        }
                      })}
                    </Col>
                  </Row>
                );
              } else if (key.includes("translateSentence")) {
                return (
                  <>
                    <Row>
                      <Col className="spacer">
                        <p className={styles["subheading"]}>
                          <MdDelete
                            className={styles["delete-icon"]}
                            onClick={() => deleteExercise(key)}
                          />
                          Translate sentence {key.match(/\d+/)}:
                          <FaInfoCircle
                            className={styles["info-icon"]}
                            onClick={() => showOverlay(translateSentenceNotes)}
                          />
                        </p>
                        <InputGroup>
                          <InputGroup.Text>Question:</InputGroup.Text>
                          <Form.Control
                            key={key + "question"}
                            type="string"
                            placeholder="I am a student."
                            value={practice[key][0]}
                            onChange={(e) => handlePracticeChange(e, key, 0)}
                          />
                        </InputGroup>
                        <InputGroup>
                          <InputGroup.Text>Answer:</InputGroup.Text>
                          <Form.Control
                            key={key + "answer"}
                            type="string"
                            placeholder="저는 학생이에요."
                            value={practice[key][1]}
                            onChange={(e) => handlePracticeChange(e, key, 1)}
                          />
                        </InputGroup>

                        <Button
                          variant="secondary"
                          className="mt-3 mb-3"
                          onClick={() => addOption(2, key, "/")}
                        >
                          Add Option
                        </Button>

                        {practice[key].map(function (option, i) {
                          if (
                            i !== 0 &&
                            i !== 1 &&
                            i !== practice[key].length - 1 &&
                            i !== practice[key].length - 2
                          ) {
                            return (
                              <div className={styles["input-div"]}>
                                <InputGroup>
                                  <InputGroup.Text>Option:</InputGroup.Text>
                                  <Form.Control
                                    key={key + "option" + i}
                                    type="string"
                                    placeholder="예요"
                                    value={option.split("/")[0]}
                                    onChange={(e) =>
                                      handlePracticeChange(e, key, i, 0)
                                    }
                                  />
                                  <Form.Control
                                    key={key + "optionroman" + i}
                                    type="string"
                                    placeholder="yeyo"
                                    value={option.split("/")[1]}
                                    onChange={(e) =>
                                      handlePracticeChange(e, key, i, 1)
                                    }
                                  />
                                </InputGroup>
                                <MdDelete
                                  className={styles["inline-delete-icon"]}
                                  onClick={() => deleteOption(key, i)}
                                />
                              </div>
                            );
                          } else if (i === practice[key].length - 2) {
                            return (
                              <InputGroup className="mt-5">
                                <InputGroup.Text>
                                  Correction (Korean):
                                </InputGroup.Text>
                                <Form.Control
                                  key={key + "correction"}
                                  type="string"
                                  placeholder="저는 학생이에요."
                                  value={option.split("/")[0]}
                                  onChange={(e) =>
                                    handlePracticeChange(e, key, i, 0)
                                  }
                                />
                                <Form.Control
                                  key={key + "correctionroman"}
                                  type="string"
                                  placeholder="Jeoneun haksaengieyo."
                                  value={option.split("/")[1]}
                                  onChange={(e) =>
                                    handlePracticeChange(e, key, i, 1)
                                  }
                                />
                              </InputGroup>
                            );
                          } else if (i === practice[key].length - 1) {
                            return (
                              <InputGroup>
                                <InputGroup.Text>
                                  Correction (English):
                                </InputGroup.Text>
                                <Form.Control
                                  key={key + "correctioneng"}
                                  type="string"
                                  placeholder="I am a student"
                                  value={option}
                                  onChange={(e) =>
                                    handlePracticeChange(e, key, i, 0)
                                  }
                                />
                              </InputGroup>
                            );
                          }
                        })}
                      </Col>
                    </Row>
                  </>
                );
              }
            })}

            <Button variant="success" type="submit" className="mt-5 mb-5">
              {state.lessonID === 0
                ? "Create Grammar Point"
                : "Save Grammar Point"}
            </Button>
          </Form>
        </div>
      </div>
    </React.Fragment>
  );
}
