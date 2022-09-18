import React, { useEffect, useState } from "react";
import MissingCard from "../vocab/MissingCard";
import DialogueSlideUp from "./DialogueSlideUp";

export default function PickCorrectDialogue(props) {
  const [propsLoading, setPropsLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [options, setOptions] = useState([]);
  const [passSelected, setPassSelected] = useState(false);

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  useEffect(() => {
    Array.from(
      document.getElementsByClassName("missing-card-highlight")
    ).forEach((el) => {
      el.classList.remove("missing-card-highlight");
    });
    setQuestion(props.content[0]);
    setAnswer(props.content[1]);
    setOptions(shuffle(props.content.slice(1, -2)));
    props.setCorrection(props.content.slice(-2));
  }, [props]);

  useEffect(() => {
    if (question !== "") {
      setPropsLoading(false);
    }
  }, [question]);

  const addDroppedCard = (id) => {
    props.setAllSelected(true);
  };

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

  return (
    <div className="lesson-content-inside-wrap">
      <p className="secondary-heading">Pick the correct answer:</p>
      <div className="double-spacer align-center">
        <p className="vocab-def-korean">
          <span className="missing-syllable-question">
            {!propsLoading && question}
          </span>
        </p>
        {options.map(function (option, i) {
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

      <DialogueSlideUp
          content={props.body}
          audios={props.audios}
          passSelected={passSelected}
          vocabList={props.vocabList}
        />
    </div>
  );
}
