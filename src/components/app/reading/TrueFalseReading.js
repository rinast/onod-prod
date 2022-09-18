import React, { useEffect, useState, useRef } from "react";
import MissingCard from "../vocab/MissingCard";
import ReadingSlideUp from "./ReadingSlideUp";
import VocabList from "../dialogue/VocabList";

export default function TrueFalseReading(props) {
  const [propsLoading, setPropsLoading] = useState(true);
  const [answer, setAnswer] = useState([]);
  const [question, setQuestion] = useState("");
  const [passSelected, setPassSelected] = useState(false);

  const options = ["True", "False"];

  useEffect(() => {
    const fetchData = async () => {
      setPassSelected(false);
      setQuestion(props.content[0]);
      setAnswer(props.content[1]);
      props.setCorrection("");
    };
    fetchData()
      .then(() => {
        if (props.content.length > 0) {
          setPropsLoading(false);
        }
        Array.from(
          document.getElementsByClassName("missing-card-highlight")
        ).forEach((el) => {
          el.classList.remove("missing-card-highlight");
        });
      })
      .catch(console.error);
  }, [props]);

  const handleHighlight = (e) => {
    let clickedText = "";
    Array.from(
      document.getElementsByClassName("missing-card-highlight")
    ).forEach((el) => {
      el.classList.remove("missing-card-highlight");
    });
    e.target.classList.add("missing-card-highlight");
    clickedText = e.target.innerText.toLowerCase();
    setPassSelected(true);
    props.setAllSelected(true);
    props.setResult(clickedText.localeCompare(answer) === 0);
  };

  const addDroppedCard = (id, e) => {
    props.setAllSelected(true);
  };

  return (
    <div className="lesson-content-inside-wrap">
      <p className="secondary-heading">True or false:</p>
      <div className="align-center double-spacer">
        <p className="vocab-def-korean">{!propsLoading && question}</p>

        <div className="options-div">
          {!propsLoading &&
            options.map(function (option, i) {
              return (
                <span
                  className="missing-card-wrap"
                  onClick={handleHighlight}
                  key={"span" + i}
                >
                  <MissingCard
                    content={option}
                    addDroppedCard={addDroppedCard}
                    key={i}
                  />
                </span>
              );
            })}
        </div>

        <ReadingSlideUp
          content={props.body}
          audios={props.audios}
          passSelected={passSelected}
          vocabList={props.vocabList}
        />
      </div>
    </div>
  );
}
