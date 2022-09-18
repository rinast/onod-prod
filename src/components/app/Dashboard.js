import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import LessonList from "./LessonList";
import { useAuth } from "../../contexts/AuthContext";
import { database } from "../../firebase";
import dino1 from "../../images/dino1.png";

export default function Dashboard() {
  const { currentUser } = useAuth();
  //const currentLesson = database.users
  const [scrolledLesson, setScrolledLesson] = useState("");
  const [finishedLessons, setFinishedLessons] = useState([]);
  const todayDate = new Date();

  const adjustLearningHistory = (learningHistory) => {
    if (learningHistory) {
      const asArray = Object.entries(learningHistory);
      const filtered = asArray.filter(([key, value]) => !((todayDate - new Date(key)) > (1000/*ms*/ * 60/*s*/ * 60/*min*/ * 24/*h*/ * 30/*days*/ * 3/*months*/)));
      const newObj = Object.fromEntries(filtered);
  
      database.users.doc(currentUser.uid).update({
        learningHistory: {...newObj},
      })
    }
  }

  useEffect(() => {
    database.users
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.data().finishedLevel1.length > 0) {
          setScrolledLesson(
            (Math.max(...doc.data().finishedLevel1) + 1).toString()
          );
        } else {
          setScrolledLesson("1");
        }
        setFinishedLessons([...doc.data().finishedLevel1]);
        adjustLearningHistory(doc.data().learningHistory, doc.data().streak);
      });
  }, []);

  return (
    <React.Fragment>
      <div className="dashboard-wrap">
        <Navbar active="learn" />
        <LessonList
          setScrolledLesson={setScrolledLesson}
          currentLesson={scrolledLesson}
          finishedLessons={finishedLessons}
        />
        {/* <LessonListDesc currentLesson={scrolledLesson} /> */}
        <img className="lesson-list-img" src={dino1} />
      </div>
    </React.Fragment>
  );
}
