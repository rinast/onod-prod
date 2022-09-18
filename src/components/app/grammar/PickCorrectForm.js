import React, { useEffect, useState } from "react";
import MissingCard from "../vocab/MissingCard";

export default function PickCorrectForm(props) {
  const [missingSpace, setMissingSpace] = useState(" ");
  const [propsLoading, setPropsLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [options, setOptions] = useState([]);
  const [missingSpaceRoman, setMissingSpaceRoman] = useState("");
  const [missingSpaceHangeul, setMissingSpaceHangeul] = useState("");

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
    setQuestion(props.content[0]);
    setAnswer(props.content[1]);
    setOptions(shuffle(props.content.slice(1, -2)));
    props.setCorrection(props.content.slice(-2));
    setMissingSpaceRoman("");
    setMissingSpaceHangeul("");
  }, [props]);

  useEffect(() => {
    if (question !== "") {
      setPropsLoading(false);
    }
  }, [question])

  const addDroppedCard = (id) => {
    props.setAllSelected(true);
    if (id.includes("/")) {
      setMissingSpaceHangeul(id.substring(0, id.indexOf("/")).trim().replace("/", ""));
      setMissingSpaceRoman(id.substring(id.indexOf("/")).trim().replace("/", ""));
    } else {
      setMissingSpaceHangeul(id);
    }
    props.setResult(id == answer);
  };

  return (
    <div className="lesson-content-inside-wrap">
      <p className="secondary-heading">Put the correct word in the sentence:</p>
      <div className="double-spacer align-center">
        <p className="vocab-def-korean">
          <span className="missing-syllable-question">
            <span className="missing-card-roman">
              {!propsLoading && question.split("/")[1].split("<missing>")[0]}
            </span>
            {!propsLoading && question.split("/")[0].split("<missing>")[0]}
          </span>
          <span
            className={
              missingSpaceHangeul === "" ? "missing-space missing-space-word" : "active-missing-space"
            }
          >
            <span className="missing-card-roman position-over-missing-space">{missingSpaceRoman}</span>
            {missingSpaceHangeul}
          </span>
          <span className="missing-syllable-question">
            <span className="missing-card-roman">
              {!propsLoading && question.split("/")[1].split("<missing>")[1]}
            </span>
            {!propsLoading && question.split("/")[0].split("<missing>")[1]}
            <span className="vocab-example-roman"></span>
          </span>
        </p>
        {options.map(function (option, i) {
          return (
            <MissingCard
              content={option}
              addDroppedCard={addDroppedCard}
              key={i}
            />
          );
        })}
      </div>
    </div>
  );
}
