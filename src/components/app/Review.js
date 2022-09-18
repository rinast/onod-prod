import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useAuth } from "../../contexts/AuthContext";
import { database } from "../../firebase";
import dino1 from "../../images/dino1.png";
import ReviewStats from "./ReviewStats";
import ReviewWords from "./ReviewWords";
import ReviewBtn from "./ReviewBtn";

export default function Review() {
  const { currentUser } = useAuth();

  const [urgentCount, setUrgentCount] = useState(0);
  let allowExtraWords = 1;

  const [weakWords, setWeakWords] = useState([]);
  const [mediumWords, setMediumWords] = useState([]);
  const [strongWords, setStrongWords] = useState([]);

  const [weakWordsCount, setWeakWordsCount] = useState(0);
  const [mediumWordsCount, setMediumWordsCount] = useState(0);
  const [strongWordsCount, setStrongWordsCount] = useState(0);

  const [vocabToReview, setVocabToReview] = useState([]);
  const [learningHistory, setLearningHistory] = useState({});
  const [currentStreak, setCurrentStreak] = useState(0);
  const [vocabReviewInDatabase, setVocabReviewInDatabase] = useState({});

  let addedVocab = 0;

  //maximum amount of words in one review session
  const totalReviewLength = 15;

  useEffect(() => {
    database.users
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        setWeakWords([
          ...Object.keys(doc.data().vocabReview[0]),
          ...Object.keys(doc.data().vocabReview[1]),
        ]);
        setWeakWordsCount(
          Object.keys(doc.data().vocabReview[0]).length +
            Object.keys(doc.data().vocabReview[1]).length
        );

        setMediumWords([
          ...Object.keys(doc.data().vocabReview[2]),
          ...Object.keys(doc.data().vocabReview[3]),
        ]);
        setMediumWordsCount(
          Object.keys(doc.data().vocabReview[2]).length +
            Object.keys(doc.data().vocabReview[3]).length
        );

        setStrongWords([
          ...Object.keys(doc.data().vocabReview[4]),
          ...Object.keys(doc.data().vocabReview[5]),
          ...Object.keys(doc.data().vocabReview[6]),
          ...Object.keys(doc.data().vocabReview[7]),
        ]);
        setStrongWordsCount(
          Object.keys(doc.data().vocabReview[4]).length +
            Object.keys(doc.data().vocabReview[5]).length +
            Object.keys(doc.data().vocabReview[6]).length +
            Object.keys(doc.data().vocabReview[7]).length
        );
        setLearningHistory({ ...doc.data().learningHistory });
        setCurrentStreak(doc.data().streak);
        setVocabReviewInDatabase({ ...doc.data().vocabReview });
        if (addedVocab === 0) {
          for (let i = 0; i < 8; i++) {
            for (const [key, value] of Object.entries(
              doc.data().vocabReview[i]
            )) {
              if (value.seconds * 1000 < Date.now()) {
                setUrgentCount((prevState) => prevState + 1);
                allowExtraWords = 0;
                console.log(key, value.seconds * 1000);
              }
            }
          }

          if (allowExtraWords === 0) {
            addedVocab = 1;
            for (let i = 0; i < 8; i++) {
              for (const [key, value] of Object.entries(
                doc.data().vocabReview[i]
              )) {
                console.log(key + ": " + (value.seconds * 1000 < Date.now() &&
                vocabToReview.length < totalReviewLength))
                if (
                  value.seconds * 1000 < Date.now() &&
                  vocabToReview.length < totalReviewLength
                ) {
                  setVocabToReview((prevState) => [...prevState, key]);
                } else if (!(vocabToReview.length < totalReviewLength)) {
                  break;
                }
              }
              if (!(vocabToReview.length < totalReviewLength)) {
                break;
              }
            }
          } else if (allowExtraWords === 1) {
            addedVocab = 1;
            for (let i = 0; i < 8; i++) {
              for (const key of Object.keys(doc.data().vocabReview[i])) {
                if (
                  vocabToReview.length < totalReviewLength
                ) {
                  setVocabToReview((prevState) => [...prevState, key]);
                } else {
                  break;
                }
              }

              if (!(vocabToReview.length < totalReviewLength)) {
                break;
              }
            }
          }
        }
      });
  }, []);

  useEffect(() => {
    console.log("vocab to review: ", vocabToReview)
  }, [vocabToReview])

  return (
    <div className="dashboard-wrap">
      <div className="review">
        <Navbar active="review" />
        <ReviewStats
          weakWordsCount={weakWordsCount}
          mediumWordsCount={mediumWordsCount}
          strongWordsCount={strongWordsCount}
        />
        <ReviewWords
          setVocabToReview={setVocabToReview}
          weakWords={weakWords}
          mediumWords={mediumWords}
          strongWords={strongWords}
          reviewLength={weakWordsCount + mediumWordsCount + strongWordsCount}
        />
        <ReviewBtn
          vocabReviewInDatabase={vocabReviewInDatabase}
          vocabToReview={vocabToReview}
          urgentCount={urgentCount}
          learningHistory={learningHistory}
          currentStreak={currentStreak}
        />
        <img className="lesson-list-img" src={dino1} />
      </div>
    </div>
  );
}
