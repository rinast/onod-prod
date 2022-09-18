import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import styles from "./AdminStyles.module.scss";
import { database } from "../../../firebase";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditLesson(props) {
  const { state } = useLocation();
  const [grammarList, setGrammarList] = useState(["empty"]);
  const [vocabList, setVocabList] = useState(["empty"]);
  const [dialogueList, setDialogueList] = useState(0);
  const [readingList, setReadingList] = useState(0);

  const [lessonLvl, setLessonLvl] = useState(state.lessonLvl);
  const [lessonNr, setLessonNr] = useState(state.lessonNr);
  const [lessonName, setLessonName] = useState(state.lessonName);
  const [lessonDesc, setLessonDesc] = useState(state.lessonDesc);
  const components = {};

  const lessonType = state.lessonType;

  const [checkedGrammar, setCheckedGrammar] = useState([]);
  const [checkedVocab, setCheckedVocab] = useState([]);
  const [checkedDialogue, setCheckedDialogue] = useState(0);
  const [checkedReading, setCheckedReading] = useState(0);
  const [fullGrammarList, setFullGrammarList] = useState([]);
  const [fullVocabList, setFullVocabList] = useState([]);
  const [fullDialogueList, setFullDialogueList] = useState([]);
  const [fullReadingList, setFullReadingList] = useState([]);

  useEffect(() => {
    setGrammarList(state.grammarList);
    setVocabList(state.vocabList);
    setDialogueList(state.dialogueList);
    setReadingList(state.readingList);

    setCheckedGrammar(state.grammarList);
    setCheckedVocab(state.vocabList);
    setCheckedDialogue(state.dialogueList);
    setCheckedReading(state.readingList);
    console.log(state.grammarList)
    console.log(state.vocabList);
    console.log(state.dialogueList);
    console.log(state.readingList)
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    database.grammar.get().then((querySnapshot) => {
      setFullGrammarList(
        querySnapshot.docs.map((doc) => doc.data().grammarName)
      );
    });

    database.vocab.get().then((querySnapshot) => {
      setFullVocabList(querySnapshot.docs.map((doc) => doc.data().korean));
    });

    database.dialogue.get().then((querySnapshot) => {
      setFullDialogueList(
        querySnapshot.docs.map((doc) => ({
          ["title"]: doc.data().title,
          ["dialogueNr"]: doc.data().dialogueNr,
        }))
      );
    });

    database.reading.get().then((querySnapshot) => {
      setFullReadingList(
        querySnapshot.docs.map((doc) => ({
          ["title"]: doc.data().title,
          ["readingNr"]: doc.data().readingNr,
        }))
      );
    });
  }, []);

  function handleCheck(e) {
    if (e.target.id.localeCompare("grammar") === 0) {
      if (checkedGrammar !== undefined && !checkedGrammar.includes(e.target.value)) {
        setCheckedGrammar((prevState) => [...prevState, e.target.value]);
      } else if (checkedGrammar !== undefined && checkedGrammar.includes(e.target.value)) {
        setCheckedGrammar(
          checkedGrammar.filter((item) => item !== e.target.value)
        );
      } else if (checkedGrammar === undefined) {
        setCheckedGrammar([e.target.value]);
      }

    } else if (e.target.id.localeCompare("vocab") === 0) {
      if (checkedVocab !== undefined && !checkedVocab.includes(e.target.value)) {
        setCheckedVocab((prevState) => [...prevState, e.target.value]);
      } else if (checkedVocab !== undefined && checkedVocab.includes(e.target.value)) {
        setCheckedVocab(checkedVocab.filter((item) => item !== e.target.value));
      } else if (checkedVocab === undefined) {
        setCheckedVocab([e.target.value]);
      }

    } else if (e.target.id.localeCompare("dialogue") === 0) {
      console.log("setting dialogue to " + e.target.value)
      setCheckedDialogue(parseInt(e.target.value));
    } else if (e.target.id.localeCompare("reading") === 0) {
      setCheckedReading(parseInt(e.target.value));
    }
  }

  async function handleComponents() {
    if (checkedGrammar && checkedGrammar.length !== 0) {
      components["grammar"] = checkedGrammar;
    }
    if (checkedVocab && checkedVocab.length !== 0) {
      components["vocab"] = checkedVocab;
    }
    if (checkedDialogue && checkedDialogue !== 0) {
      components["dialogue"] = checkedDialogue;
    }
    if (checkedReading && checkedReading !== 0) {
      components["reading"] = checkedReading;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    handleComponents()
      .then(
        database.lessons.doc(state.lessonID).update({
          lessonLvl: parseInt(lessonLvl),
          lessonNr: parseInt(lessonNr),
          lessonName: lessonName,
          lessonDesc: lessonDesc,
          components: components,
        })
      )
      .then(navigate("/admin-dashboard"))
      .catch((error) => console.error(error));
  }

  return (
    <React.Fragment>
      <div className="dashboard-wrap">
        <Navbar />
        <p className="big-heading">Create Lesson: {lessonType}</p>

        <div className={styles["lesson-form"]}>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-5">
              <Col xs={2}>
                <InputGroup>
                  <InputGroup.Text>Lesson Level</InputGroup.Text>
                  <Form.Control
                    type="number"
                    required
                    value={lessonLvl}
                    onChange={(e) => setLessonLvl(e.target.value)}
                  />
                </InputGroup>
              </Col>

              <Col xs={2}>
                <InputGroup>
                  <InputGroup.Text>Lesson Number</InputGroup.Text>
                  <Form.Control
                    type="number"
                    required
                    value={lessonNr}
                    onChange={(e) => setLessonNr(e.target.value)}
                  />
                </InputGroup>
              </Col>
            </Row>

            <Row className="mb-5">
              <Col xs={4}>
                <InputGroup>
                  <InputGroup.Text>Lesson Name</InputGroup.Text>
                  <Form.Control
                    type="string"
                    required
                    value={lessonName}
                    onChange={(e) => setLessonName(e.target.value)}
                  />
                </InputGroup>
              </Col>

              <Col>
                <InputGroup>
                  <InputGroup.Text>Description</InputGroup.Text>
                  <Form.Control
                    type="string"
                    required
                    value={lessonDesc}
                    onChange={(e) => setLessonDesc(e.target.value)}
                  />
                </InputGroup>
              </Col>
            </Row>

            {(lessonType.localeCompare("grammar") === 0) && (
              <Row>
                <Col xs={4}>
                  <Form.Group>
                    <Form.Label className={styles["subheading"]}>
                      Select grammar points:
                    </Form.Label>
                    {fullGrammarList.map(function (grammar, i) {
                      return (
                        <Form.Check
                          key={"grammar" + grammar}
                          className="mb-1"
                          type="checkbox"
                          defaultChecked={grammarList !== undefined && grammarList.includes(grammar)}
                          id="grammar"
                          label={grammar}
                          value={grammar}
                          onChange={(e) => handleCheck(e)}
                        />
                      );
                    })}
                  </Form.Group>
                </Col>

                <Col xs={4}>
                  <Form.Group>
                    <Form.Label className={styles["subheading"]}>
                      Select vocab:
                    </Form.Label>
                    {fullVocabList.map(function (vocab, i) {
                      return (
                        <Form.Check
                          key={"vocab" + vocab}
                          className="mb-1"
                          type="checkbox"
                          defaultChecked={vocabList !== undefined && vocabList.includes(vocab)}
                          id="vocab"
                          label={vocab}
                          value={vocab}
                          onChange={(e) => handleCheck(e)}
                        />
                      );
                    })}
                  </Form.Group>
                </Col>
              </Row>
            )}

            {(lessonType.localeCompare("dialogue") === 0) && (
              <Row>
                <Col xs={4}>
                  <Form.Group>
                    <Form.Label className={styles["subheading"]}>
                      Select dialogues:
                    </Form.Label>
                    {fullDialogueList.map(function (dialogue, i) {
                      return (
                        <Form.Check
                          key={"dialogue" + dialogue["title"]}
                          name="dialogue"
                          className="mb-1"
                          type="radio"
                          defaultChecked={
                            dialogueList === dialogue["dialogueNr"]
                          }
                          id="dialogue"
                          label={dialogue["title"]}
                          value={dialogue["dialogueNr"]}
                          onChange={(e) => handleCheck(e)}
                        />
                      );
                    })}
                  </Form.Group>
                </Col>
              </Row>
            )}

            {(lessonType.localeCompare("reading") === 0) && (
              <Row>
                <Col xs={4}>
                  <Form.Group>
                    <Form.Label className={styles["subheading"]}>
                      Select readings:
                    </Form.Label>
                    {fullReadingList.map(function (reading, i) {
                      return (
                        <Form.Check
                          key={"reading" + reading["title"]}
                          name="reading"
                          className="mb-1"
                          type="radio"
                          defaultChecked={readingList === reading["readingNr"]}
                          id="reading"
                          label={reading["title"]}
                          value={reading["readingNr"]}
                          onChange={(e) => handleCheck(e)}
                        />
                      );
                    })}
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Button variant="success" type="submit" className="mt-5">
              Save Lesson
            </Button>
          </Form>
        </div>
      </div>
    </React.Fragment>
  );
}
