import React from "react";
import egg1 from "../../images/egg1.png";
import egg2 from "../../images/egg2.png";
import egg3 from "../../images/egg3.png";


export default function ReviewStats(props) {
  return (
    <div className="review-wrap">
      <div className="review-section">
        <img className="review-stats-img" src={egg1} alt="unhatched egg" />
        <span>{props.weakWordsCount}</span>
        <span>{props.weakWordsCount !== 1 ? "weak words" : "weak word"}</span>
      </div>

      <div className="review-section">
        <img className="review-stats-img" src={egg2} alt="hatching egg" />
        <span>{props.mediumWordsCount}</span>
        <span>{props.mediumWordsCount !== 1 ? "medium words" : "medium word"}</span>
      </div>

      <div className="review-section">
        <img className="review-stats-img" src={egg3} alt="hatched egg" />
        <span>{props.strongWordsCount}</span>
        <span>{props.strongWordsCount !== 1 ? "strong words" : "strong word"}</span>
      </div>
    </div>
  );
}
