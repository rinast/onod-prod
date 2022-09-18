import React, { useEffect, useState } from "react";
import MissingCard from "./MissingCard";

export default function TrueFalse(props) {
  const [propsLoading, setPropsLoading] = useState(true);
  const [answer, setAnswer] = useState([]);
  const [question, setQuestion] = useState("");
  const [questionEnglish, setQuestionEnglish] = useState("");

  const options = ["True", "False"];

  useEffect(() => {
    const fetchData = async () => {
      setQuestion(props.content[0]);
      setQuestionEnglish(props.content[1]);
      setAnswer(props.content[2]);
      props.setCorrection(props.correction);
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
    props.setResult(clickedText.localeCompare(answer) === 0);
  };

  const addDroppedCard = (id, e) => {
    props.setAllSelected(true);
  };

  return (
    <div className="lesson-content-inside-wrap">
      <p className="secondary-heading">True or false:</p>
      <div className="align-center double-spacer">
        <p className="vocab-def-korean">
          <span className="missing-card-roman-above">   
            {!propsLoading && question.split("/")[0]}
            <span className="missing-card-roman">
              {!propsLoading && question.split("/")[1]}
            </span>
          </span>
          {" "} means {" "} {!propsLoading && questionEnglish}.
        </p>

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
      </div>
    </div>
  );
}
