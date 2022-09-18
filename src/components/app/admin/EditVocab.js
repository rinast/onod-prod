import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import styles from "./AdminStyles.module.scss";
import { database, storage } from "../../../firebase";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import newVocabNotes from "../../../images/newVocabNotes.png";
import matchToAPictureNotes from "../../../images/matchToAPictureNotes.png";
import puttingSyllablesTogetherNotes from "../../../images/puttingSyllablesTogetherNotes.png";
import missingSyllablesNotes from "../../../images/missingSyllablesNotes.png";
import puttingWordInSentenceNotes from "../../../images/puttingWordInSentenceNotes.png";
import trueFalseQuestionNotes from "../../../images/trueFalseQuestionNotes.png";
import trueFalseSayingNotes from "../../../images/trueFalseSayingNotes.png";

export default function EditVocab(props) {
  const { state } = useLocation();

  const [korean, setKorean] = useState(state.korean);
  const [english, setEnglish] = useState(state.english);
  const [roman, setRoman] = useState(state.roman);
  const [audios, setAudios] = useState(state.audios);
  const [imgs, setImgs] = useState(state.imgs);

  const [exampleKor, setExampleKor] = useState(state.exampleKor);
  const [exampleEng, setExampleEng] = useState(state.exampleEng);
  const [exampleRom, setExampleRom] = useState(state.exampleRom);
  const [exampleAudio, setExampleAudio] = useState(state.exampleAudio);

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

  const navigate = useNavigate();

  useEffect(() => {
    if (practice) {
      setPracticeKeys(Object.keys(practice));
    }
  }, [practice]);

  useEffect(() => {
    storageRef
      .child("vocab")
      .listAll()
      .then((res) => {
        res.prefixes.forEach((folderRef) => {
          initialFolders.push(
            folderRef._delegate._location.path_.split("/")[1]
          );
        });
      });
  }, []);

  function uploadChangeHandler(e, type = 0) {
    if (
      folderName.localeCompare("") === 0 &&
      korean.trim().localeCompare("") === 0
    ) {
      setUploadError(true);
      e.target.value = "";
      return;
    }
    setUploadError(false);

    let ref;
    if (folderName.localeCompare("") === 0) {
      setFolderName(korean.replace(/[!?@#.$%^&*]/g, ""));
      ref = storageRef.child(
        "vocab/" + korean.replace(/[!?@#.$%^&*]/g, "") + "/" + e.target.files[0].name
      );
    } else {
      ref = storageRef.child(
        "vocab/" + folderName + "/" + e.target.files[0].name
      );
    }

    // type 0 = image, 1 = audio, 2 = example audio
    ref.put(e.target.files[0]).then((snapshot) => {
      ref
        .getDownloadURL()
        .then((url) => {
          if (type === 0) {
            console.log(imgs)
            if (imgs.length === 0) {
              setImgs([url]);
              console.log("set")
            } else {
              if (imgs[0].localeCompare("") === 0) {
                setImgs([url])
              } else {
                setImgs((prevState) => [...prevState, url]);
              }
            }
          } else if (type === 1) {
            if (audios[0].localeCompare("") === 0) {
              setAudios([url]);
            } else {
              setAudios((prevState) => [...prevState, url]);
            }
          } else {
            setExampleAudio(url);
          }
        })
        .then(() => {
          e.target.value = "";
        });
    });
  }

  const findFormErrors = () => {
    const newErrors = {};

    practiceKeys.map((key) => {
      if (key.includes("missingSyllables")) {
        practice[key][0].split("/").map((question) => {
          if (question.includes("<missing>") === false) {
            newErrors[key + "Question"] =
              "Missing Syllables doesn't have <missing>";
          }
        });
      } else if (key.includes("puttingWordInSentence")) {
        practice[key][0].split("/").map((question) => {
          if (question.includes("<missing>") === false) {
            newErrors[key + "Question"] =
              "Putting Word In Sentence doesn't have <missing>";
          }
        });
      }
    });

    return newErrors;
  };

  useEffect(() => {
    console.log(practice)
  }, [practice])

  function handlePracticeChange(
    e,
    questionType,
    index,
    lang = 0,
    errorsKey = questionType
  ) {
    const newArr = practice[questionType].slice();
    console.log("sliced newArr ", newArr)
    console.log("include slash ", newArr[index].includes("/") )
    if (newArr[index].includes("/")) {
      const targetArr = newArr[index].split("/");
      targetArr[lang] = e.target.value;
      newArr[index] = targetArr.join().replaceAll(",", "/");
      console.log(newArr)
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

  function handleTFCheck(e, questionType, index = 2) {
    const newArr = practice[questionType].slice();
    newArr[index] = e.target.value;
    setPractice((prevState) => ({
      ...prevState,
      [questionType]: [...newArr],
    }));
  }

  function playSibling(e) {
    e.target.nextElementSibling.play();
  }

  function deleteUpload(index, type = 0) {
    // type: 0 = imgs, 1 = audios
    if (type === 1) {
      let newArr = [...audios];
      newArr.splice(index, 1);
      setAudios((prevState) => [...newArr]);
    } else if (type === 0) {
      let newArr = [...imgs];
      newArr.splice(index, 1);
      setImgs((prevState) => [...newArr]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.error("There was an error in the form.");
    } else {
      if (state.lessonID !== 0) {
        database.vocab
          .doc(state.lessonID)
          .update({
            korean: korean,
            english: english,
            roman: roman,
            imgs: imgs,
            audios: audios,
            exampleKor: exampleKor,
            exampleEng: exampleEng,
            exampleRom: exampleRom,
            exampleAudio: exampleAudio,
            practice: practice,
            folderName: folderName,
          })
          .then(navigate("/admin-dashboard"))
          .catch((error) => console.error(error));
      } else {
        database.vocab
          .add({
            korean: korean,
            english: english,
            roman: roman,
            imgs: imgs,
            audios: audios,
            exampleKor: exampleKor,
            exampleEng: exampleEng,
            exampleRom: exampleRom,
            exampleAudio: exampleAudio,
            practice: practice,
            folderName: folderName,
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
    if (exercise.includes("matchToAPicture")) {
      minState = ["/", "/"];
    } else if (exercise.includes("missingSyllables")) {
      minState = ["/", "/", "/"];
    } else if (exercise.includes("puttingSyllablesTogether")) {
      minState = ["/", "/"];
    } else if (exercise.includes("puttingWordInSentence")) {
      minState = ["/", "/", "/"];
    } else if (exercise.includes("trueFalseQuestion")) {
      minState = ["/", "", ""];
    } else if (exercise.includes("trueFalseSaying")) {
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
          Create Vocab{" "}
          <FaInfoCircle
            className={`${styles["info-icon"]} ${styles["big-info-icon"]}`}
            onClick={() => showOverlay(newVocabNotes)}
          />
        </p>

        <div className={styles["lesson-form"]}>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={4}>
                <InputGroup>
                  <InputGroup.Text>Korean</InputGroup.Text>
                  <Form.Control
                    type="string"
                    placeholder="안녕하세요?"
                    required
                    value={korean}
                    onChange={(e) => setKorean(e.target.value)}
                  />
                </InputGroup>

                <InputGroup className="spacer">
                  <InputGroup.Text>Example (Kor)</InputGroup.Text>
                  <Form.Control
                    type="string"
                    placeholder="제니 씨, 안녕하세요?"
                    required
                    value={exampleKor}
                    onChange={(e) => setExampleKor(e.target.value)}
                  />
                </InputGroup>
              </Col>

              <Col xs={4}>
                <InputGroup>
                  <InputGroup.Text>Romanisation</InputGroup.Text>
                  <Form.Control
                    type="string"
                    placeholder="Annyeonghaseyeo?"
                    required
                    value={roman}
                    onChange={(e) => setRoman(e.target.value)}
                  />
                </InputGroup>

                <InputGroup className="spacer">
                  <InputGroup.Text>Example (Rom)</InputGroup.Text>
                  <Form.Control
                    type="string"
                    placeholder="Jennie ssi, annyeonghaseyo?"
                    required
                    value={exampleRom}
                    onChange={(e) => setExampleRom(e.target.value)}
                  />
                </InputGroup>
              </Col>

              <Col xs={4}>
                <InputGroup>
                  <InputGroup.Text>English</InputGroup.Text>
                  <Form.Control
                    type="string"
                    placeholder="Hello"
                    required
                    value={english}
                    onChange={(e) => setEnglish(e.target.value)}
                  />
                </InputGroup>

                <InputGroup className="spacer">
                  <InputGroup.Text>Example (Eng)</InputGroup.Text>
                  <Form.Control
                    type="string"
                    placeholder="Hello, Jennie!"
                    required
                    value={exampleEng}
                    onChange={(e) => setExampleEng(e.target.value)}
                  />
                </InputGroup>
              </Col>
            </Row>

            <Row className="mb-5">
              <Col className="d-flex align-items-center">
                <InputGroup>
                  <InputGroup.Text>Example Audio</InputGroup.Text>
                  <Form.Control
                    type="file"
                    isInvalid={uploadError}
                    accept="audio/mpeg"
                    onChange={(e) => uploadChangeHandler(e, 2)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Folder doesn't exist - fill in Korean first!
                  </Form.Control.Feedback>
                </InputGroup>

                {exampleAudio.localeCompare("") !== 0 ? (
                  <div>
                    <Button
                      variant="info"
                      className={styles["play-btn"]}
                      onClick={(e) => playSibling(e)}
                    >
                      Play
                    </Button>
                    <audio id="exampleAudio" src={exampleAudio}></audio>
                  </div>
                ) : (
                  <p className={styles["example-audio"]}>No example audio!</p>
                )}
              </Col>
            </Row>

            <Row className="mb-5">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className={styles["subheading"]}>
                    Images:
                  </Form.Label>
                  <div className={styles["uploaded-imgs"]}>
                    {imgs.map((img, i) => {
                      if (img.localeCompare("") !== 0) {
                        return (
                          <div className={styles["upload"]}>
                            <img
                              src={img}
                              alt={korean}
                              className={styles["uploaded-img"]}
                            />
                            <MdDelete
                              className={styles["img-delete-icon"]}
                              onClick={() => deleteUpload(i, 0)}
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div className={styles["upload"]}>
                            <p>No image!</p>
                          </div>
                        );
                      }
                    })}
                    <div className="align-items-center d-flex justify-content-center">
                      <Form.Control
                        type="file"
                        isInvalid={uploadError}
                        accept="image/png, image/jpeg"
                        className={styles["file-input"]}
                        onChange={(e) => uploadChangeHandler(e, 0)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Folder doesn't exist - fill in Korean first!
                      </Form.Control.Feedback>
                    </div>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-5">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className={styles["subheading"]}>
                    Audios:
                  </Form.Label>
                  <div className={styles["uploaded-imgs"]}>
                    {audios.map((aud, i) => {
                      if (aud.localeCompare("") !== 0) {
                        return (
                          <div>
                            <Button
                              variant="info"
                              className={styles["play-btn"]}
                              onClick={(e) => playSibling(e)}
                            >
                              Play {i + 1}
                            </Button>
                            <audio src={aud}></audio>
                            <MdDelete
                              className={styles["delete-icon"]}
                              onClick={() => deleteUpload(i, 1)}
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div className={styles["upload"]}>
                            <p>No audio!</p>
                          </div>
                        );
                      }
                    })}
                    <div className="align-items-center d-flex justify-content-center">
                      <Form.Control
                        type="file"
                        accept="audio/mpeg"
                        isInvalid={uploadError}
                        className={styles["file-input"]}
                        onChange={(e) => uploadChangeHandler(e, 1)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Folder doesn't exist - fill in Korean first!
                      </Form.Control.Feedback>
                    </div>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <div className="double-spacer">
                  <p className={styles["subheading"]}>Practice:</p>
                  <InputGroup>
                    <InputGroup.Text>
                      Correction (Korean/Romanisation):
                    </InputGroup.Text>
                    <Form.Control
                      key={"practicecorrection1"}
                      type="string"
                      placeholder="안녕하세요?"
                      value={practice["correction"][0].split("/")[0]}
                      onChange={(e) =>
                        handlePracticeChange(e, "correction", 0, 0)
                      }
                    />
                    <Form.Control
                      key={"practicecorrection2"}
                      type="string"
                      placeholder="Annyeonghaseyo?"
                      value={practice["correction"][0].split("/")[1]}
                      onChange={(e) =>
                        handlePracticeChange(e, "correction", 0, 1)
                      }
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Text>Correction (English):</InputGroup.Text>
                    <Form.Control
                      key={"practicecorrection1"}
                      type="string"
                      placeholder="Hello."
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
                  addExercise("matchToAPicture" + nextKey("matchToAPicture"))
                }
              >
                Add Match To A Picture
              </Button>

              <Button
                variant="light"
                className={styles["add-exercise-btn"]}
                onClick={() =>
                  addExercise("missingSyllables" + nextKey("missingSyllables"))
                }
              >
                Add Missing Syllables
              </Button>

              <Button
                variant="light"
                className={styles["add-exercise-btn"]}
                onClick={() =>
                  addExercise(
                    "puttingSyllablesTogether" +
                      nextKey("puttingSyllablesTogether")
                  )
                }
              >
                Add Putting Syllables Together
              </Button>

              <Button
                variant="light"
                className={styles["add-exercise-btn"]}
                onClick={() =>
                  addExercise(
                    "puttingWordInSentence" + nextKey("puttingWordInSentence")
                  )
                }
              >
                Add Putting Word In Sentence
              </Button>

              <Button
                variant="light"
                className={styles["add-exercise-btn"]}
                onClick={() =>
                  addExercise(
                    "trueFalseQuestion" + nextKey("trueFalseQuestion")
                  )
                }
              >
                Add True False Question
              </Button>

              <Button
                variant="light"
                className={styles["add-exercise-btn"]}
                onClick={() =>
                  addExercise("trueFalseSaying" + nextKey("trueFalseSaying"))
                }
              >
                Add True False Saying
              </Button>
            </Row>

            {practiceKeys.map((key, x) => {
              if (key.includes("matchToAPicture")) {
                return (
                  <Row>
                    <Col className="spacer">
                      <p className={styles["subheading"]}>
                        <MdDelete
                          className={styles["delete-icon"]}
                          onClick={() => deleteExercise(key)}
                        />
                        Match To A Picture {key.match(/\d+/)}:
                        <FaInfoCircle
                          className={styles["info-icon"]}
                          onClick={() => showOverlay(matchToAPictureNotes)}
                        />
                      </p>

                      {practice[key].map(function (option, i) {
                        if (i !== 0) {
                          return (
                            <div className={styles["input-div"]}>
                              <InputGroup>
                                <InputGroup.Text>Option:</InputGroup.Text>
                                <Form.Control
                                  key={key + "option" + i}
                                  type="string"
                                  placeholder="뭐예요?"
                                  required
                                  value={option.split("/")[0]}
                                  onChange={(e) =>
                                    handlePracticeChange(e, key, i, 0)
                                  }
                                />
                                <Form.Control
                                  key={key + "optionroman" + i}
                                  type="string"
                                  placeholder="Mwoyeyo?"
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
                        } else if (i === 0) {
                          return (
                            <InputGroup>
                              <InputGroup.Text>Correct answer:</InputGroup.Text>
                              <Form.Control
                                key={key + "answer"}
                                type="string"
                                placeholder="안녕하세요?"
                                required
                                value={option.split("/")[0]}
                                onChange={(e) =>
                                  handlePracticeChange(e, key, i, 0)
                                }
                              />
                              <Form.Control
                                key={key + "answerroman"}
                                type="string"
                                placeholder="Anyyeonghaseyo?"
                                required
                                value={option.split("/")[1]}
                                onChange={(e) =>
                                  handlePracticeChange(e, key, i, 1)
                                }
                              />
                            </InputGroup>
                          );
                        }
                      })}

                      <Button
                        variant="secondary"
                        className="mt-3 mb-3"
                        onClick={() => addOption(0, key, "/")}
                      >
                        Add Option
                      </Button>
                    </Col>
                  </Row>
                );
              } else if (key.includes("missingSyllables")) {
                return (
                  <Row>
                    <Col className="spacer">
                      <p className={styles["subheading"]}>
                        <MdDelete
                          className={styles["delete-icon"]}
                          onClick={() => deleteExercise(key)}
                        />
                        Missing Syllables {key.match(/\d+/)}:
                        <FaInfoCircle
                          className={styles["info-icon"]}
                          onClick={() => showOverlay(missingSyllablesNotes)}
                        />
                      </p>

                      {practice[key].map(function (option, i) {
                        if (i !== 0 && i !== 1) {
                          return (
                            <div className={styles["input-div"]}>
                              <InputGroup>
                                <InputGroup.Text>Option:</InputGroup.Text>
                                <Form.Control
                                  key={key + "option" + i}
                                  type="string"
                                  placeholder="하"
                                  required
                                  value={option.split("/")[0]}
                                  onChange={(e) =>
                                    handlePracticeChange(e, key, i, 0)
                                  }
                                />
                                <Form.Control
                                  key={key + "optionroman" + i}
                                  type="string"
                                  placeholder="ha"
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
                        } else if (i === 0) {
                          return (
                            <InputGroup>
                              <InputGroup.Text>Question:</InputGroup.Text>
                              <Form.Control
                                key={key + "answer"}
                                type="string"
                                placeholder="안<missing>하세요?"
                                required
                                isInvalid={!!errors[key + "Question"]}
                                value={option.split("/")[0]}
                                onChange={(e) =>
                                  handlePracticeChange(
                                    e,
                                    key,
                                    i,
                                    0,
                                    key + "Question"
                                  )
                                }
                              />
                              <Form.Control
                                key={key + "answerroman"}
                                type="string"
                                placeholder="An<missing>haseyo?"
                                required
                                isInvalid={!!errors[key + "Question"]}
                                value={option.split("/")[1]}
                                onChange={(e) =>
                                  handlePracticeChange(
                                    e,
                                    key,
                                    i,
                                    1,
                                    key + "Question"
                                  )
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors[key + "Question"]}
                              </Form.Control.Feedback>
                            </InputGroup>
                          );
                        } else if (i === 1) {
                          return (
                            <InputGroup>
                              <InputGroup.Text>Correct answer:</InputGroup.Text>
                              <Form.Control
                                key={key + "answer"}
                                type="string"
                                placeholder="녕"
                                required
                                value={option.split("/")[0]}
                                onChange={(e) =>
                                  handlePracticeChange(e, key, i, 0)
                                }
                              />
                              <Form.Control
                                key={key + "answerroman"}
                                type="string"
                                placeholder="nyeong"
                                required
                                value={option.split("/")[1]}
                                onChange={(e) =>
                                  handlePracticeChange(e, key, i, 1)
                                }
                              />
                            </InputGroup>
                          );
                        }
                      })}

                      <Button
                        variant="secondary"
                        className="mt-3 mb-3"
                        onClick={() => addOption(0, key, "/")}
                      >
                        Add Option
                      </Button>
                    </Col>
                  </Row>
                );
              } else if (key.includes("puttingSyllablesTogether")) {
                return (
                  <Row>
                    <Col className="spacer">
                      <p className={styles["subheading"]}>
                        <MdDelete
                          className={styles["delete-icon"]}
                          onClick={() => deleteExercise(key)}
                        />
                        Putting Syllables Together {key.match(/\d+/)}:
                        <FaInfoCircle
                          className={styles["info-icon"]}
                          onClick={() =>
                            showOverlay(puttingSyllablesTogetherNotes)
                          }
                        />
                      </p>

                      {practice[key].map(function (option, i) {
                        return (
                          <div className={styles["input-div"]}>
                            <InputGroup>
                              <InputGroup.Text>Option:</InputGroup.Text>
                              <Form.Control
                                key={key + "option" + i}
                                type="string"
                                placeholder="안"
                                required
                                value={option.split("/")[0]}
                                onChange={(e) =>
                                  handlePracticeChange(e, key, i, 0)
                                }
                              />
                              <Form.Control
                                key={key + "optionroman" + i}
                                type="string"
                                placeholder="an"
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
                      })}

                      <Button
                        variant="secondary"
                        className="mt-3 mb-3"
                        onClick={() => addOption(0, key, "/")}
                      >
                        Add Option
                      </Button>
                    </Col>
                  </Row>
                );
              } else if (key.includes("puttingWordInSentence")) {
                return (
                  <Row>
                    <Col className="spacer">
                      <p className={styles["subheading"]}>
                        <MdDelete
                          className={styles["delete-icon"]}
                          onClick={() => deleteExercise(key)}
                        />
                        Putting Word In Sentence {key.match(/\d+/)}:
                        <FaInfoCircle
                          className={styles["info-icon"]}
                          onClick={() =>
                            showOverlay(puttingWordInSentenceNotes)
                          }
                        />
                      </p>

                      {practice[key].map(function (option, i) {
                        if (i !== 0 && i !== 1) {
                          return (
                            <div className={styles["input-div"]}>
                              <InputGroup>
                                <InputGroup.Text>Option:</InputGroup.Text>
                                <Form.Control
                                  key={key + "option" + i}
                                  type="string"
                                  placeholder="하"
                                  required
                                  value={option.split("/")[0]}
                                  onChange={(e) =>
                                    handlePracticeChange(e, key, i, 0)
                                  }
                                />
                                <Form.Control
                                  key={key + "optionroman" + i}
                                  type="string"
                                  placeholder="ha"
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
                            <div className={styles["input-div"]}>
                              <InputGroup>
                                <InputGroup.Text>Correct answer:</InputGroup.Text>
                                <Form.Control
                                  key={key + "option" + i}
                                  type="string"
                                  placeholder="하"
                                  required
                                  value={option.split("/")[0]}
                                  onChange={(e) =>
                                    handlePracticeChange(e, key, i, 0)
                                  }
                                />
                                <Form.Control
                                  key={key + "optionroman" + i}
                                  type="string"
                                  placeholder="ha"
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
                        } else if (i === 0) {
                          return (
                            <InputGroup>
                              <InputGroup.Text>Question:</InputGroup.Text>
                              <Form.Control
                                key={key + "answer"}
                                type="string"
                                placeholder="<missing>? 제 이름은 제니예요."
                                required
                                isInvalid={!!errors[key + "Question"]}
                                value={option.split("/")[0]}
                                onChange={(e) =>
                                  handlePracticeChange(
                                    e,
                                    key,
                                    i,
                                    0,
                                    key + "Question"
                                  )
                                }
                              />
                              <Form.Control
                                key={key + "answerroman"}
                                type="string"
                                placeholder="<missing> Je ireumeun Jennie yeyo."
                                required
                                isInvalid={!!errors[key + "Question"]}
                                value={option.split("/")[1]}
                                onChange={(e) =>
                                  handlePracticeChange(
                                    e,
                                    key,
                                    i,
                                    1,
                                    key + "Question"
                                  )
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors[key + "Question"]}
                              </Form.Control.Feedback>
                            </InputGroup>
                          );
                        }
                      })}

                      <Button
                        variant="secondary"
                        className="mt-3 mb-3"
                        onClick={() => addOption(0, key, "/")}
                      >
                        Add Option
                      </Button>
                    </Col>
                  </Row>
                );
              } else if (key.includes("trueFalseQuestion")) {
                return (
                  <Row>
                    <Col className="spacer">
                      <p className={styles["subheading"]}>
                        <MdDelete
                          className={styles["delete-icon"]}
                          onClick={() => deleteExercise(key)}
                        />
                        True False Question {key.match(/\d+/)}:
                        <FaInfoCircle
                          className={styles["info-icon"]}
                          onClick={() => showOverlay(trueFalseQuestionNotes)}
                        />
                      </p>

                      {practice[key].map(function (option, i) {
                        if (i === 2) {
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
                              <InputGroup.Text>
                                Question (Korean):
                              </InputGroup.Text>
                              <Form.Control
                                key={key + "answer"}
                                type="string"
                                placeholder="안녕하세요"
                                required
                                value={option.split("/")[0]}
                                onChange={(e) =>
                                  handlePracticeChange(e, key, i, 0)
                                }
                              />
                              <Form.Control
                                key={key + "answerroman"}
                                type="string"
                                placeholder="annyeonghaseyo"
                                required
                                value={option.split("/")[1]}
                                onChange={(e) =>
                                  handlePracticeChange(e, key, i, 1)
                                }
                              />
                            </InputGroup>
                          );
                        } else if (i === 1) {
                          return (
                            <InputGroup>
                              <InputGroup.Text>
                                Question (English):
                              </InputGroup.Text>
                              <Form.Control
                                key={key + "answer"}
                                type="string"
                                placeholder="hello"
                                required
                                isInvalid={!!errors[key + "Question"]}
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
              } else if (key.includes("trueFalseSaying")) {
                return (
                  <Row>
                    <Col className="spacer">
                      <p className={styles["subheading"]}>
                        <MdDelete
                          className={styles["delete-icon"]}
                          onClick={() => deleteExercise(key)}
                        />
                        True False Saying {key.match(/\d+/)}:
                        <FaInfoCircle
                          className={styles["info-icon"]}
                          onClick={() => showOverlay(trueFalseSayingNotes)}
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
                                placeholder="Jennie is saying it is nice to meet you."
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
              {state.lessonID === 0 ? "Create Vocab" : "Save Vocab"}
            </Button>
          </Form>
        </div>
      </div>
    </React.Fragment>
  );
}
