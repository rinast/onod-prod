import React, { useEffect, useState } from "react";
import { database } from "../../firebase";
import { useNavigate } from "react-router-dom";


export default function ReviewWords(props) {
  const [fullWords, setFullWords] = useState([]);
  const navigate = useNavigate();
  let queried = 0;

  if (fullWords.length > 0) {
    queried = 1;
  }

  useEffect(() => {
    if (
      props.weakWords.length +
        props.mediumWords.length +
        props.strongWords.length ===
        props.reviewLength &&
      queried === 0
    ) {
      queried = 1;
      props.weakWords.forEach((word) => {
        database.vocab
          .where("korean", "==", word)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              let obj = {
                korean: word,
                english: doc.data().english,
                img: doc.data().imgs[0],
                strength: "weak",
              };
              setFullWords((prevState) => [...prevState, obj]);
            });
          });
      });

      props.mediumWords.forEach((word) => {
        database.vocab
          .where("korean", "==", word)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              let obj = {
                korean: word,
                english: doc.data().english,
                img: doc.data().imgs[0],
                strength: "medium",
              };
              setFullWords((prevState) => [...prevState, obj]);
            });
          });
      });

      props.strongWords.forEach((word) => {
        database.vocab
          .where("korean", "==", word)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              let obj = {
                korean: word,
                english: doc.data().english,
                img: doc.data().imgs[0],
                strength: "strong",
              };
              setFullWords((prevState) => [...prevState, obj]);
            });
          });
      });
    }
  }, [props]);

  return (
    <>
      <div className="review-words-labels">
        <span></span>
        <span>KOREAN</span>
        <span>ENGLISH</span>
        <span>STRENGTH</span>
      </div>
      <div className="review-wrap-words">
        {fullWords &&
          fullWords.map((word, i) => {
            return (
              <>
                <div className="review-words">
                  <div className="review-word-section">
                    <img
                      className="review-word-list-img"
                      src={word["img"]}
                      alt={word["english"]}
                    />
                  </div>
                  <span className="review-word-section">
                    <strong>{word["korean"]}</strong>
                  </span>
                  <span className="review-word-section">{word["english"]}</span>
                  <div className="review-word-section">
                    <div className="review-word-bar">
                      <div
                        className={"review-word-bar-" + word["strength"]}
                      ></div>
                    </div>
                    <span className="review-word-bar-label">
                      {word["strength"].toUpperCase()}
                    </span>
                  </div>
                </div>
              </>
            );
          })}
        {!fullWords.length > 0 && (
          <div className="no-review-wrap">
            <p className="no-review-notes">
              You have not learned any words yet.
            </p>
            <p className="no-review-btn" onClick={() => navigate("/")}>START LEARNING</p>
          </div>
        )}
      </div>
    </>
  );
}
