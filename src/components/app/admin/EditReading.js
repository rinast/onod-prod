import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import styles from "./AdminStyles.module.scss";
import { database, storage } from "../../../firebase";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import readingNotes from "../../../images/readingNotes.png";
import readingTrueFalseNotes from "../../../images/readingTrueFalseNotes.png";
import readingPickCorrectNotes from "../../../images/readingPickCorrectNotes.png";

export default function EditReading(props) {
  const { state } = useLocation();

  const [title, setTitle] = useState(state.title);
  const [readingNr, setReadingNr] = useState(state.readingNr);
  const [fullAudio, setFullAudio] = useState(state.audio);
  const [audios, setAudios] = useState(state.audios);
  const [content, setContent] = useState(state.content);
  const [vocabList, setVocabList] = useState(state.vocabList);

  const [errors, setErrors] = useState({});

  const storageRef = storage.ref();
  let initialFolders = [];
  const [uploadError, setUploadError] = useState(false);
  const [folderName, setFolderName] = useState(state.folderName);

  const [practice, setPractice] = useState(state.practice);
  const [practiceKeys, setPracticeKeys] = useState([]);
  const [showingOverlay, setShowingOverlay] = useState(false);
  const [overlayPic, setOverlayPic] = useState(
    "https://hips.hearstapps.com/hmg-prod/images/domestic-cat-lies-in-a-basket-with-a-knitted-royalty-free-image-1592337336.jpg"
  );

  const [playingFull, setPlayingFull] = useState(0);
  const [playingIndiv, setPlayingIndiv] = useState(
    new Array(state.content.length).fill(0)
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (practice) {
      setPracticeKeys(Object.keys(practice));
    }
  }, [practice]);

  useEffect(() => {
    storageRef
      .child("reading")
      .listAll()
      .then((res) => {
        res.prefixes.forEach((folderRef) => {
          initialFolders.push(
            folderRef._delegate._location.path_.split("/")[1]
          );
        });
      });
  }, []);

  function uploadChangeHandler(e, type = 0, index = -1) {
    if (folderName.localeCompare("") === 0 && readingNr === 0) {
      setUploadError(true);
      e.target.value = "";
      return;
    }
    setUploadError(false);

    let ref;
    if (folderName.localeCompare("") === 0) {
      setFolderName("reading" + readingNr);
      ref = storageRef.child(
        "reading/reading" + readingNr + "/" + e.target.files[0].name
      );
    } else {
      ref = storageRef.child(
        "reading/" + folderName + "/" + e.target.files[0].name
      );
    }

    // type 0 = audio, 1 = full audio
    ref.put(e.target.files[0]).then((snapshot) => {
      ref
        .getDownloadURL()
        .then((url) => {
          if (type === 0) {
            if (index === -1) {
              if (audios[0].localeCompare("") === 0) {
                setAudios([url]);
              } else {
                setAudios((prevState) => [...prevState, url]);
              }
            } else {
              let newArr = [...audios];
              newArr[index] = url;
              setAudios([...newArr]);
            }
          } else {
            setFullAudio(url);
          }
        })
        .then(() => {
          e.target.value = "";
        });
    });
  }

  function handlePracticeChange(
    e,
    questionType,
    index,
    lang = 0,
    errorsKey = questionType
  ) {
    const newArr = practice[questionType].slice();
    if (newArr[index].includes("/")) {
      const targetArr = newArr[index].split("/");
      targetArr[lang] = e.target.value;
      newArr[index] = targetArr.join().replaceAll(",", "/");
    } else {
      newArr[index] = e.target.value;
    }
    setPractice((prevState) => ({
      ...prevState,
      [questionType]: [...newArr],
    }));

    if (!!errors[errorsKey]) {
      setErrors({
        ...errors,
        [errorsKey]: null,
      });
    }
  }

  function handleContentChange(e, index) {
    let newArr = [...content];
    newArr[index] = e.target.value;
    setContent([...newArr]);
  }

  function handleTFCheck(e, questionType, index = 2) {
    const newArr = practice[questionType].slice();
    newArr[index] = e.target.value;
    setPractice((prevState) => ({
      ...prevState,
      [questionType]: [...newArr],
    }));
  }

  function playSibling(e, index) {
    if (playingIndiv[index] === 0) {
      e.target.nextElementSibling.play();
      e.target.textContent = "Pause line " + (index + 1);
      let newArr = [...playingIndiv];
      newArr[index] = 1;
      setPlayingIndiv((prevState) => [...newArr]);
    } else if (playingIndiv[index] === 1) {
      e.target.nextElementSibling.pause();
      e.target.textContent = "Play line " + (index + 1);
      let newArr = [...playingIndiv];
      newArr[index] = 0;
      setPlayingIndiv((prevState) => [...newArr]);
    }
  }

  function playFull(e) {
    if (playingFull === 0) {
      e.target.nextElementSibling.play();
      e.target.textContent = "Pause";
      setPlayingFull(1);
    } else {
      e.target.nextElementSibling.pause();
      e.target.textContent = "Play";
      setPlayingFull(0);
    }
  }

  function deleteUpload(index) {
    let newArr = [...audios];
    newArr.splice(index, 1);
    setAudios((prevState) => [...newArr]);
  }

  function deleteContent(index) {
    let newArr = [...content];
    newArr.splice(index, 1);
    setContent([...newArr]);
    let newAudArr = [...audios];
    newAudArr.splice(index, 1);
    setAudios([...newAudArr]);
    let newPlayingIndiv = [...playingIndiv];
    newPlayingIndiv.splice(index, 1);
    setPlayingIndiv([...newPlayingIndiv]);
  }

  function deleteUploadAndReplace(index) {
    let newArr = [...audios];
    newArr[index] = "";
    setAudios((prevState) => [...newArr]);
  }

  function addContent() {
    setContent((prevState) => [...prevState, ""]);
    setAudios((prevState) => [...prevState, ""]);
    setPlayingIndiv((prevState) => [...prevState, 0]);
  }

  const findFormErrors = () => {
    const newErrors = {};

    return newErrors;
  };

  function changeVocab(e, type, key) {
    // type 0 = key, 1 = value
    let newObj = { ...vocabList };
    newObj[key][type] = e.target.value;
    setVocabList({ ...newObj });
  }

  function addVocab() {
    const arrOfNum = Object.keys(vocabList).map((str) => {
      return Number(str);
    });
    let nextKey = (Math.max(...arrOfNum) + 1).toString();
    setVocabList((prevState) => ({
      ...prevState,
      [nextKey]: ["", ""],
    }));
  }

  function deleteVocab(vocab) {
    const newObj = { ...vocabList };
    delete newObj[vocab];
    setVocabList({ ...newObj });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.error("There was an error in the form.");
    } else {
      if (state.lessonID !== 0) {
        database.reading
          .doc(state.lessonID)
          .update({
            readingNr: readingNr,
            title: title,
            content: content,
            audios: audios,
            audio: fullAudio,
            practice: practice,
            folderName: folderName,
            vocabList: vocabList,
          })
          .then(navigate("/admin-dashboard"))
          .catch((error) => console.error(error));
      } else {
        database.reading
          .add({
            readingNr: readingNr,
            title: title,
            content: content,
            audios: audios,
            audio: fullAudio,
            practice: practice,
            folderName: folderName,
            vocabList: vocabList,
          })
          .then(navigate("/admin-dashboard"))
          .catch((error) => console.error(error));
      }
    }
  }

  function showOverlay(src = "") {
    if (src.localeCompare("") !== 0) {
      setOverlayPic(src);
    }
    setShowingOverlay(true);
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
    if (exercise.includes("pickCorrect")) {
      minState = ["", "", "", "", ""];
    } else if (exercise.includes("trueFalse")) {
      minState = ["", ""];
    }

    setPractice((prevState) => ({
      ...prevState,
      [exercise]: [...minState],
    }));
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
          Create Reading{" "}
          <FaInfoCircle
            className={`${styles["info-icon"]} ${styles["big-info-icon"]}`}
            onClick={() => showOverlay(readingNotes)}
          />
        </p>

        <div className={styles["lesson-form"]}>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={8}>
                <InputGroup>
                  <InputGroup.Text>Title</InputGroup.Text>
                  <Form.Control
                    type="string"
                    placeholder="민석 씨, 안녕하세요?"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </InputGroup>
              </Col>

              <Col xs={4}>
                <InputGroup>
                  <InputGroup.Text>Reading Number</InputGroup.Text>
                  <Form.Control
                    type="number"
                    required
                    value={readingNr}
                    onChange={(e) => setReadingNr(e.target.value)}
                  />
                </InputGroup>
              </Col>
            </Row>

            <Row className="mb-5">
              <Col className="d-flex align-items-center">
                <InputGroup>
                  <InputGroup.Text>Full Audio</InputGroup.Text>
                  <Form.Control
                    type="file"
                    isInvalid={uploadError}
                    accept="audio/mpeg"
                    onChange={(e) => uploadChangeHandler(e, 1)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Folder doesn't exist - fill in title first!
                  </Form.Control.Feedback>
                </InputGroup>

                {fullAudio.localeCompare("") !== 0 ? (
                  <div>
                    <Button
                      variant="info"
                      className={styles["play-btn"]}
                      onClick={(e) => playFull(e)}
                    >
                      Play
                    </Button>
                    <audio id="exampleAudio" src={fullAudio}></audio>
                  </div>
                ) : (
                  <p className={styles["example-audio"]}>No example audio!</p>
                )}
              </Col>
            </Row>

            <Row>
              <p className={styles["subheading"]}>Content:</p>
              <Col xs={12}>
                {content.map((line, i) => {
                  return (
                    <>
                      <Form.Control
                        type="string"
                        as="textarea"
                        className={styles["textarea"]}
                        rows="2"
                        placeholder="저는 제니예요. 미국에서 왔어요. 스물두 살이에요. 지금 한국에서 대학교에 다녀요. 한국 생활이 재미있어서 좋아요."
                        required
                        value={line}
                        onChange={(e) => handleContentChange(e, i)}
                      />
                      <MdDelete
                        className={styles["delete-icon"]}
                        onClick={() => deleteContent(i)}
                      />
                    </>
                  );
                })}
              </Col>
              <Button
                variant="secondary"
                className="mt-3 mb-3"
                onClick={() => addContent()}
              >
                Add Line
              </Button>
            </Row>

            <Row>
              <Col>
                <p className={styles["subheading"]}>Vocab List:</p>
                {Object.keys(vocabList).map(function (vocab, i) {
                  return (
                    <div className={styles["vocab-wrap"]}>
                      <div className={styles["vocab-key-wrap"]}>
                        <Form.Control
                          type="string"
                          className={styles["vocab-key"]}
                          placeholder="이름"
                          required
                          value={vocabList[vocab][0]}
                          onChange={(e) => changeVocab(e, 0, vocab)}
                        />
                      </div>
                      <div className={styles["vocab-value-wrap"]}>
                        <Form.Control
                          type="string"
                          className={styles["vocab-value"]}
                          placeholder="name"
                          required
                          value={vocabList[vocab][1]}
                          onChange={(e) => changeVocab(e, 1, vocab)}
                        />
                        <MdDelete
                          className={styles["delete-icon"]}
                          onClick={() => deleteVocab(vocab)}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="align-center">
                  <Button
                    variant="secondary"
                    className="mt-3 mb-3"
                    onClick={() => addVocab()}
                  >
                    Add Vocab
                  </Button>
                </div>
              </Col>
            </Row>

            <Row className="mb-5">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className={styles["subheading"]}>
                    Audios (by line):
                  </Form.Label>
                  <div
                    className={`${styles["uploaded-imgs"]} ${styles["content-audio-wrap"]}`}
                  >
                    {audios.map((aud, i) => {
                      if (aud.localeCompare("") !== 0) {
                        return (
                          <div className={styles["content-audio-reading"]}>
                            <div className={styles["span-audio-reading"]}>
                              <strong>{content[i]}</strong>
                            </div>
                            <Button
                              variant="info"
                              className={styles["play-btn"]}
                              onClick={(e) => playSibling(e, i)}
                            >
                              Play line {i + 1}
                            </Button>
                            <audio src={aud}></audio>
                            <MdDelete
                              className={styles["delete-icon"]}
                              onClick={() => deleteUploadAndReplace(i)}
                            />
                            <Form.Control
                              type="file"
                              accept="audio/mpeg"
                              isInvalid={uploadError}
                              className={styles["file-input"]}
                              onChange={(e) => uploadChangeHandler(e, 0, i)}
                            />
                            <Form.Control.Feedback type="invalid">
                              Folder doesn't exist - fill in Korean first!
                            </Form.Control.Feedback>
                          </div>
                        );
                      } else {
                        return (
                          <div className={styles["no-audio-upload"]}>
                            <div className={styles["span-audio-reading"]}>
                              <strong>{content[i]}</strong>
                            </div>
                            <span className="ms-3">No audio!</span>
                            <Form.Control
                              type="file"
                              accept="audio/mpeg"
                              isInvalid={uploadError}
                              className={styles["file-input"]}
                              onChange={(e) => uploadChangeHandler(e, 0, i)}
                            />
                            <Form.Control.Feedback type="invalid">
                              Folder doesn't exist - fill in Korean first!
                            </Form.Control.Feedback>
                          </div>
                        );
                      }
                    })}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <div className="double-spacer">
                  <p className={styles["subheading"]}>Practice:</p>
                </div>
              </Col>
            </Row>

            <Row className="mt-3">
              <Button
                variant="light"
                className={styles["add-exercise-btn"]}
                onClick={() =>
                  addExercise("pickCorrect" + nextKey("pickCorrect"))
                }
              >
                Add Pick Correct
              </Button>

              <Button
                variant="light"
                className={styles["add-exercise-btn"]}
                onClick={() => addExercise("trueFalse" + nextKey("trueFalse"))}
              >
                Add True False
              </Button>
            </Row>

            {practiceKeys.map((key, x) => {
              if (key.includes("pickCorrect")) {
                return (
                  <Row>
                    <Col className="spacer">
                      <p className={styles["subheading"]}>
                        <MdDelete
                          className={styles["delete-icon"]}
                          onClick={() => deleteExercise(key)}
                        />
                        Pick Correct {key.match(/\d+/)}:
                        <FaInfoCircle
                          className={styles["info-icon"]}
                          onClick={() => showOverlay(readingPickCorrectNotes)}
                        />
                      </p>

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
                                  placeholder="영국"
                                  required
                                  value={option}
                                  onChange={(e) =>
                                    handlePracticeChange(e, key, i, 0)
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
                                placeholder="미국"
                                required
                                value={option}
                                onChange={(e) =>
                                  handlePracticeChange(e, key, i)
                                }
                              />
                            </InputGroup>
                          );
                        } else if (i === 0) {
                          return (
                            <InputGroup>
                              <InputGroup.Text>Question:</InputGroup.Text>
                              <Form.Control
                                key={key + "answer"}
                                type="string"
                                placeholder="제니는 어디에서 왔어요?"
                                required
                                value={option}
                                onChange={(e) =>
                                  handlePracticeChange(e, key, i)
                                }
                              />
                            </InputGroup>
                          );
                        } else if (i === practice[key].length - 2) {
                          return (
                            <InputGroup className="spacer">
                              <InputGroup.Text>
                                Correction (Kor):
                              </InputGroup.Text>
                              <Form.Control
                                key={key + "answer"}
                                type="string"
                                placeholder="제니는 미국에서 왔어요."
                                required
                                value={option}
                                onChange={(e) =>
                                  handlePracticeChange(e, key, i)
                                }
                              />
                            </InputGroup>
                          );
                        } else if (i === practice[key].length - 1) {
                          return (
                            <InputGroup className="spacer">
                              <InputGroup.Text>
                                Correction (Eng):
                              </InputGroup.Text>
                              <Form.Control
                                key={key + "answer"}
                                type="string"
                                placeholder="Jennie is American."
                                required
                                value={option}
                                onChange={(e) =>
                                  handlePracticeChange(e, key, i)
                                }
                              />
                            </InputGroup>
                          );
                        }
                      })}

                      <Button
                        variant="secondary"
                        className="mt-3 mb-3"
                        onClick={() => addOption(2, key, "")}
                      >
                        Add Option
                      </Button>
                    </Col>
                  </Row>
                );
              } else if (key.includes("trueFalse")) {
                return (
                  <Row>
                    <Col className="spacer">
                      <p className={styles["subheading"]}>
                        <MdDelete
                          className={styles["delete-icon"]}
                          onClick={() => deleteExercise(key)}
                        />
                        True False {key.match(/\d+/)}:
                        <FaInfoCircle
                          className={styles["info-icon"]}
                          onClick={() => showOverlay(readingTrueFalseNotes)}
                        />
                      </p>

                      {practice[key].map(function (option, i) {
                        if (i === 1) {
                          return (
                            <div className={styles["input-div"]}>
                              <Form.Group className="d-flex align-items-center">
                                <InputGroup.Text>
                                  Correct answer:
                                </InputGroup.Text>
                                <Form.Check
                                  key={key + "true"}
                                  name={key}
                                  className="ms-3"
                                  type="radio"
                                  id="dialogue"
                                  label="True"
                                  value={true}
                                  onChange={(e) => handleTFCheck(e, key, i)}
                                  defaultChecked={option === "true"}
                                />
                                <Form.Check
                                  key={key + "false"}
                                  name={key}
                                  className="ms-3"
                                  type="radio"
                                  id="dialogue"
                                  label="False"
                                  value={false}
                                  onChange={(e) => handleTFCheck(e, key, i)}
                                  defaultChecked={option === "false"}
                                />
                              </Form.Group>
                            </div>
                          );
                        } else if (i === 0) {
                          return (
                            <InputGroup>
                              <InputGroup.Text>Question:</InputGroup.Text>
                              <Form.Control
                                key={key + "answer"}
                                type="string"
                                placeholder="Jennie likes Korean music."
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
              }
            })}

            <Button variant="success" type="submit" className="mt-5 mb-5">
              {state.lessonID === 0 ? "Create Reading" : "Save Reading"}
            </Button>
          </Form>
        </div>
      </div>
    </React.Fragment>
  );
}
