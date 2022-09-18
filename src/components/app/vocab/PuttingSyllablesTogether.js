import React, { useEffect, useState } from "react";
import MissingCard from "./MissingCard";
import AddedCard from "./AddedCard";

export default function PuttingSyllablesTogether(props) {
  const [missingSpace, setMissingSpace] = useState([]);
  const [propsLoading, setPropsLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [pushedNr, setPushedNr] = useState(0);

  useEffect(() => {
    props.setImgLoaded(true);
    props.setCorrection(props.correction);
    const fetchData = async () => {
      setPropsLoading(false);
    };
    fetchData().catch(console.error);
  });

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

  useEffect(() => {
    if (!propsLoading) {
      setOptions(shuffle(props.content));
    }
  }, [propsLoading]);

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
      string.localeCompare(props.korean.replace(/[\s\?\.\!]/g, "")) === 0
    );
  }, [missingSpace]);

  return (
    <div className="lesson-content-inside-wrap">
      <p className="secondary-heading">Put syllables in the correct order:</p>
      <p className="vocab-def-korean double-spacer">{props.english}</p>
      <br />
      {/* <p className="vocab-def-korean">
        <span
          ref={drop}
          className={
            missingSpace === " " ? "missing-space" : "active-missing-space"
          }
        >
          {missingSpace}
        </span>
      </p> */}
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
