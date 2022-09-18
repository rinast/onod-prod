import React, { useState, useEffect } from "react";

export default function GrammarDef(props) {
  const [playIsVisible, setPlayIsVisible] = useState(true);
  const [explanation, setExplanation] = useState([]);
  const [explanationBody, setExplanationBody] = useState([]);

  useEffect(() => {
    props.setAllSelected(true);
    props.setChecked(true);
    props.setResult(true);
  })

  useEffect(() => {
    if (props.explanation.includes("<br/>")) {
      setExplanation(props.explanation.split("<br/>"));
    } else {
      setExplanation(props.explanation);
    }

    if (!(explanationBody.length > 0) && props.explanationBody === undefined) {
      setExplanationBody([
        props.explanationLeftColumn,
        props.explanationRightColumn,
      ]);
    } else if (!(explanationBody.length > 0)) {
      console.log("explanation non-columns");
      setExplanationBody([props.explanationBody]);
    }
  }, [props]);

  const playExample = () => {
    if (playIsVisible) {
      document.getElementById("example-audio").play();
    } else {
      document.getElementById("example-audio").pause();
    }
    setPlayIsVisible(!playIsVisible);
  };

  /* useEffect(() => {
    if (props.exampleAudio) {
      document.getElementById("example-audio").addEventListener("ended", () => {
        setPlayIsVisible(true);
      });
      return () => {
        if (document.getElementById("example-audio") != null) {
          document
            .getElementById("example-audio")
            .removeEventListener("ended", () => setPlayIsVisible(true));
        }
      };
    }
  }); */

  return (
    <>
      <div className="lesson-content-inside-wrap">
        <p className="secondary-heading">
          Grammar: <strong>{props.grammarName}</strong>
        </p>

        <p className="align-center spacer intro-example">
          {props.introExample.substr(0, props.introExample.indexOf("<"))}
          <span className="intro-example-bold">
            {props.introExample.match(/\<(.*?)\>/)[1]}
          </span>
          {props.introExample.substr(props.introExample.indexOf(">") + 1)}
        </p>

        <div className="grammar-explanation">
          <ul>
            {explanation.map((ex, i) => {
              return (
                <li key={i.toString() + "exp"}>
                  {ex}
                  <br />
                  <br />
                </li>
              );
            })}
          </ul>
        </div>

        {/* Next need explanation body for both columns and no columns!!! */}

        {/* <p className="secondary-heading">Put the correct word in the sentence:</p>
      <div className="spacer"></div>
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
      </div> */}
      </div>
      <div className="spacer grammar-columns">
        {explanationBody.map((exCol, i) => {
          return (
            <div
              key={i.toString() + "expCol"}
              className={"grammar-columns-inner"}
            >
              <p className="explanation-col-heading">{exCol[0]}</p>

              {exCol.map((exColExample, x) => {
                if (x > 0) {
                  return (
                    <div
                      className="example-div-text"
                      key={x.toString() + "exColExample"}
                    >
                      <div className="vocab-example-korean">
                        <div className="excolexample-roman-above">
                          <div className="excolexample-korean">
                            <div className="excolexample-roman">
                              {exColExample
                                .split("/")[1]
                                .substr(
                                  0,
                                  exColExample.split("/")[1].indexOf("<")
                                )}
                              <span style={{ fontWeight: "600" }}>
                                {
                                  exColExample
                                    .split("/")[1]
                                    .match(/\<(.*?)\>/)[1]
                                }
                              </span>
                              {exColExample
                                .split("/")[1]
                                .substr(
                                  exColExample.split("/")[1].indexOf(">") + 1
                                )}
                            </div>
                            {exColExample
                              .split("/")[0]
                              .substr(
                                0,
                                exColExample.split("/")[0].indexOf("<")
                              )}
                            <span style={{ fontWeight: "600" }}>
                              {exColExample.split("/")[0].match(/\<(.*?)\>/)[1]}
                            </span>
                            {exColExample
                              .split("/")[0]
                              .substr(
                                exColExample.split("/")[0].indexOf(">") + 1
                              )}
                          </div>
                        </div>
                      </div>

                      <div className="excolexample-english">
                        {exColExample.split("/")[2]}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
