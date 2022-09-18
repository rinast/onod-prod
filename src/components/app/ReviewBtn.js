import React from "react";
import { GiMagnifyingGlass } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

export default function ReviewBtn(props) {
  const navigate = useNavigate();

  window.onresize = reposition;

  function reposition() {
    if (document.getElementsByClassName("review-btn")[0]) {
      document.getElementsByClassName("review-btn")[0].style.top =
        document.getElementsByClassName("review-wrap")[0].offsetTop + "px";
      document.getElementsByClassName("review-btn")[0].style.left =
        document.getElementsByClassName("lesson-list-img")[0].offsetLeft + "px";
      document.getElementsByClassName("review-btn")[0].style.opacity = "1";
    }
  }

  function startHovering() {
    document
      .getElementsByClassName("review-btn-icon")[0]
      .classList.add("review-btn-hover");
    document
      .getElementsByClassName("review-btn-text")[0]
      .classList.add("review-btn-hover");
  }
  function stopHovering() {
    document
      .getElementsByClassName("review-btn-icon")[0]
      .classList.remove("review-btn-hover");
    document
      .getElementsByClassName("review-btn-text")[0]
      .classList.remove("review-btn-hover");
  }

  reposition();

  function moveToReview() {
    console.log("passed: ", props.vocabToReview);
    navigate("/review/vocab", {
      state: {
        vocabToReview: props.vocabToReview,
        vocabReviewInDatabase: props.vocabReviewInDatabase,
        learningHistory: props.learningHistory,
        currentStreak: props.currentStreak
      },
    });
  }

  return (
    <div
      className="review-btn"
      onMouseEnter={startHovering}
      onMouseLeave={stopHovering}
    >
      <GiMagnifyingGlass className="review-btn-icon" onClick={moveToReview} />
      <span className="review-btn-text" onClick={moveToReview}>
        REVIEW NOW
        {props.urgentCount > 0 && <div className="urgent-count-wrap">
          <span className="urgent-count">{props.urgentCount}</span>
        </div>}
      </span>
    </div>
  );
}
