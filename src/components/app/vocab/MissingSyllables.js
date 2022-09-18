import React, { useEffect, useState } from "react";
import AudioPlayer from "./AudioPlayer";
import MissingCard from "./MissingCard";

export default function MissingSyllables(props) {
  const [missingSpace, setMissingSpace] = useState(" ");
  const [propsLoading, setPropsLoading] = useState(true);
  const [question, setQuestion] = useState("?");
  const [answer, setAnswer] = useState("?");
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
    setOptions(shuffle(props.content.slice(1)));
    setPropsLoading(false);
    props.setCorrection(props.correction);
  }, [props]);

  const addDroppedCard = (id) => {
    props.setAllSelected(true);
    console.log(id);
    setMissingSpace(id.replace(/[a-zA-Z\.\?\!\s\/]+/g, ""));
    if (id.includes("/")) {
      setMissingSpaceHangeul(id.substring(0, id.indexOf("/")).trim().replace("/", ""));
      setMissingSpaceRoman(id.substring(id.indexOf("/")).trim().replace("/", ""));
    } else {
      setMissingSpaceHangeul(id);
    }
    props.setResult(id == answer);
  };

  const pull_data = (data) => {
    props.setImgLoaded(true);
  };

  return (
    <div className="lesson-content-inside-wrap">
      <p className="secondary-heading">Complete the word:</p>
      <AudioPlayer
        img={props.img}
        audio={props.audio}
        setImgLoaded={pull_data}
        small={true}
      />
      <div className="align-center">
        <p className="vocab-def-korean">
          <span className="missing-syllable-question">
            <span className="missing-card-roman">
              {!propsLoading && question.split("/")[1].split("<missing>")[0]}
            </span>
            {!propsLoading && question.split("/")[0].split("<missing>")[0]}
          </span>
          <span
            className={
              missingSpace === " " ? "missing-space" : "active-missing-space"
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
