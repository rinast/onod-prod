import React, { useEffect } from "react";
import { BsList, BsChatFill } from "react-icons/bs";
import { FaArrowAltCircleRight } from "react-icons/fa";

export default function LessonListDesc(props) {
  const descs = [
    "Learn how to say hello in Korean.",
    "Learn how to introduce yourself.",
    "Learn the first few Hangeul characters.",
    "Learn how to thank people in Korean.",
    "Learn how to talk about your job.",
    "Practice talking about your job.",
    "Lesson 7 desc",
    "Lesson 8 desc",
    "Lesson 9 desc",
    "Lesson 10 desc",
  ];

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLesson(document.getElementsByClassName("enlarge")[0].parentNode.id-1)
  //   }, 1000)
  // }, []);

  // useEffect(() => {
  //   window.addEventListener("click", () => {
  //     setTimeout(() => {
  //       setLesson(document.getElementsByClassName("enlarge")[0].parentNode.id-1)
  //     }, 400)
  //   });
  // });

  useEffect(() => {
    console.log("prop has changed");
  }, [props.currentLesson]);

  return (
    <React.Fragment>
      <div
        className="lesson-list-desc-container"
        style={{ top: `var(${props.topDistance})` }}
      >
        {/* <p className="lesson-list-desc-heading">
          {headings[props.currentLesson - 1]}
        </p> */}
        <p className="lesson-list-desc">{descs[props.currentLesson - 1]}</p>
        <div className="lesson-list-desc-icon-wrap">
          <div className="lesson-list-desc-icon-container">
            <BsList className="lesson-list-desc-icon" />
            <span className="lesson-list-desc-icon-label">VOCAB</span>
          </div>
          <div className="lesson-list-desc-icon-container">
            <BsChatFill className="lesson-list-desc-icon" />
            <span className="lesson-list-desc-icon-label">DIALOGUE</span>
          </div>
        </div>
        <div className="start-lesson-icon-container">
          <FaArrowAltCircleRight className="start-lesson-icon" />
          {/* <div className="spinner spinner-1"></div> */}
        </div>
      </div>
    </React.Fragment>
  );
}
