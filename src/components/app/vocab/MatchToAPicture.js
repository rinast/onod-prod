import React, { useState, useEffect } from "react";
import MissingCard from "./MissingCard";

export default function MatchToAPicture(props) {
  const [propsLoading, setPropsLoading] = useState(true);
  const [answer, setAnswer] = useState("?");
  const [options, setOptions] = useState([]);
  const [result, setResult] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setAnswer(props.content[0]);
      setOptions(shuffle(props.content.map((x) => x)));
      props.setCorrection(props.correction);
    };
    if (props.content != undefined) {
      fetchData()
        .then(() => {
          setPropsLoading(false);
          Array.from(
            document.getElementsByClassName("missing-card-highlight")
          ).forEach((el) => {
            el.classList.remove("missing-card-highlight");
          });
        })
        .catch(console.error);
    }
  }, [props]);

  function shuffle(array) {
    console.log("running shuffle");
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

  const handleHighlight = (e) => {
    let clickedText = "";
    Array.from(
      document.getElementsByClassName("missing-card-highlight")
    ).forEach((el) => {
      el.classList.remove("missing-card-highlight");
    });
    if (e.target.classList[0] === "missing-card-roman") {
      e.target.parentElement.classList.add("missing-card-highlight");
      clickedText = e.target.parentElement.innerText;
    } else {
      e.target.classList.add("missing-card-highlight");
      clickedText = e.target.innerText;
    }
    props.setResult(
      clickedText
        .replace(/[a-zA-Z\.\?\!\s\/]+/g, "")
        .localeCompare(answer.replace(/[a-zA-Z\.\?\!\s\/]+/g, "")) === 0
    );
  };

  const addDroppedCard = (id, e) => {
    props.setAllSelected(true);
    console.log("Content: " + id);
  };

  return (
    <div className="lesson-content-inside-wrap">
      <p className="secondary-heading">Match a word to the picture:</p>
      <div className="match-img">
        <img
          style={!propsLoading ? {} : { display: "none" }}
          src={props.img}
          alt="Match To A Picture"
        />
      </div>
      <div className="options-div">
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
    </div>
  );
}
