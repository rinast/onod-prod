import React, { useEffect, useState } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { database } from "../../firebase";
import stamp from "../../images/stamp.png";
import stampempty from "../../images/stamp-empty.png";

const LessonCard = (props) => {
  const [lessonNr, setLessonNr] = useState(0);
  const [lessonName, setLessonName] = useState("");
  const [lessonDesc, setLessonDesc] = useState("");

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
  const navigate = useNavigate();

  function lessonClicked() {
    navigate("/lessons/" + props.lessonNr);
  }

  useEffect(() => {
    setLessonNr(props.lessonNr);
  }, [props]);

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  useEffect(() => {
    const stamps = document.getElementsByClassName("lesson-card-stamp-done");
    for (var i = 0; i < stamps.length; i++) {
      let randomNr = getRandomInt(90) - 45;
      stamps[i].style.transform = "rotate(" + randomNr + "deg)";
    }
  });

  useEffect(() => {
    if (lessonNr !== 0 && lessonNr !== undefined) {
      database.lessons
        .where("lessonNr", "==", lessonNr)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            setLessonName(doc.data().lessonName);
            setLessonDesc(doc.data().lessonDesc);
          });
        });
    }
  }, [lessonNr]);

  useEffect(() => {
    if (props.setLoaded && lessonName !== "") {
      props.setLoaded(true)
    }
  }, [lessonName])

  return (
    <>
      <div className="lesson-card before-learn-tab mb-3">
        <div
          className={`learn-tab d-flex flex-row justify-items-center ${props.extraClass}`}
        >
          <div>
            <p className="learn-tab-heading pt-3 ps-4 mb-1">{lessonName}</p>
            <p className="mt-n1 ps-4">{lessonDesc}</p>
            <p>{props.classNames}</p>
          </div>
          {props.isFinished ? (
            <img
              className="lesson-card-stamp-done"
              alt="stamp space"
              src={stamp}
            />
          ) : (
            <img
              className="lesson-card-stamp"
              alt="stamp space"
              src={stampempty}
            />
          )}
          <div className="start-lesson-icon-container" onClick={lessonClicked}>
            <div className="circle">
              <FaArrowAltCircleRight />
            </div>
            <FaArrowAltCircleRight className="start-lesson-icon" />
          </div>
        </div>
      </div>
    </>
  );
};

// {
//   return (
//     <>
//       <div className="lesson-card before-learn-tab mb-3">
//         <div
//           className={`learn-tab d-flex flex-row justify-items-center ${props.extraClass}`}
//         >
//           <div>
//             <p className="learn-tab-heading pt-3 ps-4 mb-1">{props.heading}</p>
//             <p className="mt-n1 ps-4">{props.desc}</p>
//             <p>{props.classNames}</p>
//           </div>
//           <div className="start-lesson-icon-container">
//             <FaArrowAltCircleRight className="start-lesson-icon" />
//             <div className="circle">
//               <FaArrowAltCircleRight className="start-lesson-icon" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

export default LessonCard;
