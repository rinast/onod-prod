import React, { useEffect, useState } from "react";
import MissingCard from "../vocab/MissingCard";
import AddedCard from "../vocab/AddedCard";

export default function TranslateSentence(props) {
  const [missingSpace, setMissingSpace] = useState([]);
  const [propsLoading, setPropsLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [pushedNr, setPushedNr] = useState(0);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    setQuestion(props.content[0]);
    setAnswer(props.content[1]);
    props.setCorrection(props.content.slice(-2));
  }, []);

  useEffect(() => {
    if (!propsLoading) {
      setOptions(shuffle(props.content.slice(2, -2)));
    }
  }, [propsLoading]);

  useEffect(() => {
    if (question !== "") {
      setPropsLoading(false);
    }
  }, [question])

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

  const addDroppedCard = (id, e) => {
    props.setAllSelected(true);
    setMissingSpace([
      ...missingSpace,
      <AddedCard content={id} key={"pushed" + pushedNr} />,
    ]);
    setPushedNr(pushedNr + 1);
    /* props.setResult(
      missingSpace == props.korean.toLowerCase().replace(/\W/g, "")
    ); */
  };

  const handleRemoveCard = (e) => {
    if (e.target.classList[0] === "missing-card-roman") {
      e.target.parentElement.classList.add("hidden-missing-card");
    } else {
      e.target.classList.add("hidden-missing-card");
    }
  };

  const removeFromSelected = (i, inner) => {
    setMissingSpace((selected) => selected.filter((entry) => entry.key != i));
    Array.from(document.getElementsByClassName("hidden-missing-card")).forEach(
      (el) => {
        if (
          inner
            .replace(/[a-zA-Z\.\?\!\s\/]+/g, "")
            .localeCompare(el.innerText.replace(/[a-zA-Z\.\?\!\s\/]+/g, "")) ===
          0
        ) {
          el.classList.remove("hidden-missing-card");
          return;
        }
      }
    );
  };

  useEffect(() => {
    let string = "";
    missingSpace.forEach((el) => {
      string = string.concat(
        el.props.content.replace(/[a-zA-Z\.\?\!\s\/]+/g, "")
      );
    });
    props.setResult(
      string.replace(/[a-zA-Z\.\?\!\s\/]+/g, "").localeCompare(answer.replace(/[\s\?\.\!]/g, "")) === 0
    );
    console.log("string w replace: ", string.replace(/[a-zA-Z\.\?\!\s\/]+/g, ""));
    console.log("answer w replace: ", answer.replace(/[\s\?\.\!]/g, ""));
    console.log(string.replace(/[a-zA-Z\.\?\!\s\/]+/g, "").localeCompare(answer.replace(/[\s\?\.\!]/g, "")) === 0)
  }, [missingSpace]);

  useEffect(() => {
    console.log(options)
  })

  return (
    <div className="lesson-content-inside-wrap">
      <p className="secondary-heading">Translate the sentence:</p>
      {console.log("question: " + question)}
      {console.log("answer: " + answer)}
      <p className="vocab-def-korean double-spacer">{question}</p>
      <br />
      <div className="vocab-def-korean to-add-space">
        <span>
          {missingSpace.length != 0 &&
            missingSpace.map(function (selected, i) {
              /* return (<MissingCard content={selected} key={selected+i.toString()} />) */
              return (
                <AddedCard
                  content={selected.props.content}
                  id={selected.key}
                  key={selected.key}
                  removeFromSelected={removeFromSelected}
                />
              );
            })}
        </span>
      </div>
      <div className="align-center">
        {options.map(function (option, i) {
          return (
            <span
              className="missing-card-wrap"
              onClick={handleRemoveCard}
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
