import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import styles from "./AdminStyles.module.scss";
import { database } from "../../../firebase";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

export default function CreateLesson(props) {
  const [lessonLvl, setLessonLvl] = useState(1);
  const [lessonNr, setLessonNr] = useState(0);
  const [lessonName, setLessonName] = useState("");
  const [lessonDesc, setLessonDesc] = useState("");
  const components = {};

  const { state } = useLocation();
  const lessonType = state.lessonType;
  const grammarList = state.grammarList;
  const vocabList = state.vocabList;
  const dialogueList = state.dialogueList;
  const readingList = state.readingList;
  const [checkedGrammar, setCheckedGrammar] = useState([]);
  const [checkedVocab, setCheckedVocab] = useState([]);
  const [checkedDialogue, setCheckedDialogue] = useState(0);
  const [checkedReading, setCheckedReading] = useState(0);

  useEffect(() => {
    setLessonLvl(state.lastLessonLvl);
    setLessonNr(state.lastLessonNr+1);
  }, [])

  const navigate = useNavigate();

  function handleCheck(e) {
    if (e.target.id.localeCompare("grammar") === 0) {
      if (!checkedGrammar.includes(e.target.value)) {
        setCheckedGrammar((prevState) => [...prevState, e.target.value]);
      }
    } else if (e.target.id.localeCompare("vocab") === 0) {
      if (!checkedVocab.includes(e.target.value)) {
        setCheckedVocab((prevState) => [...prevState, e.target.value]);
      }
    } else if (e.target.id.localeCompare("dialogue") === 0) {
      setCheckedDialogue(parseInt(e.target.value));
    } else if (e.target.id.localeCompare("reading") === 0) {
      setCheckedReading(parseInt(e.target.value));
    }
  }

  async function handleComponents() {
    if (checkedGrammar.length !== 0) {
      components["grammar"] = checkedGrammar;
    }
    if (checkedVocab.length !== 0) {
      components["vocab"] = checkedVocab;
    }
    if (checkedDialogue !== 0) {
      components["dialogue"] = checkedDialogue;
    }
    if (checkedReading !== 0) {
      components["reading"] = checkedReading;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    handleComponents()
      .then(
        database.lessons.add({
          lessonLvl: lessonLvl,
          lessonNr: lessonNr,
          lessonName: lessonName,
          lessonDesc: lessonDesc,
          components: components,
        })
      )
      .then(navigate("/admin-dashboard"));
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

            {lessonType.localeCompare("grammar") === 0 && (
              <Row>
                <Col xs={4}>
                  <Form.Group>
                    <Form.Label className={styles["subheading"]}>Select grammar points:</Form.Label>
                    {grammarList.map(function (grammar, i) {
                      return (
                        <Form.Check
                          key={"grammar"+grammar}
                          className="mb-1"
                          type="checkbox"
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
                    <Form.Label className={styles["subheading"]}>Select vocab:</Form.Label>
                    {vocabList.map(function (vocab, i) {
                      return (
                        <Form.Check
                          key={"vocab"+vocab}
                          className="mb-1"
                          type="checkbox"
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

            {lessonType.localeCompare("dialogue") === 0 && (
              <Row>
                <Col xs={4}>
                  <Form.Group>
                    <Form.Label className={styles["subheading"]}>Select dialogues:</Form.Label>
                    {dialogueList.map(function (dialogue, i) {
                      return (
                        <Form.Check
                          key={"dialogue"+dialogue["title"]}
                          name="dialogue"
                          className="mb-1"
                          type="radio"
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

            {lessonType.localeCompare("reading") === 0 && (
              <Row>
                <Col xs={4}>
                  <Form.Group>
                    <Form.Label className={styles["subheading"]}>Select reading:</Form.Label>
                    {readingList.map(function (reading, i) {
                      return (
                        <Form.Check
                          key={"reading"+reading["title"]}
                          name="reading"
                          className="mb-1"
                          type="radio"
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
              Add Lesson
            </Button>
          </Form>
        </div>
      </div>
    </React.Fragment>
  );
}
