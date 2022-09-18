import React, { useEffect, useState, useRef } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FaClock,
  FaFire,
  FaBolt,
  FaLightbulb,
  FaBirthdayCake,
  FaExclamation,
  FaCoins,
  FaBrain,
  FaPortrait,
  FaFlagCheckered,
} from "react-icons/fa";
import { BsAlarmFill } from "react-icons/bs";
import CenteredContainer from "../CenteredContainer";
import Navbar from "../app/Navbar";
import { database } from "../../firebase";

export default function Profile() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const [joinedDate, setJoinedDate] = useState(
    new Date(currentUser.metadata.creationTime)
  );
  const [finishedLevel1Count, setFinishedLevel1Count] = useState(0);
  const [learningHistory, setLearningHistory] = useState({});
  const [streak, setStreak] = useState(0);
  const [knownWordsCount, setKnownWordsCount] = useState(0);
  const [changingStreak, setChangingStreak] = useState(0);

  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEPT",
    "OCT",
    "NOV",
    "DEC",
  ];
  const monthsLong = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const level1LessonCount = 30;
  const todayDate = useRef(new Date());
  const updatedUser = useRef(false);

  // FILL LEARNING HISTORY WITH { ...obj }
  /* const may1 = new Date(2022, 4, 1).toLocaleDateString()
  const may2 = new Date(2022, 4, 2).toLocaleDateString()
  const may3 = new Date(2022, 4, 3).toLocaleDateString()
  const may4 = new Date(2022, 4, 4).toLocaleDateString()
  
  const obj = {[may1]: 3, [may2]: 1, [may3]: 5, [may4]: 1} */

  /* database.users.doc(currentUser.uid).update({
    learningHistory: { ...obj },
  }) */

  const navigate = useNavigate();

  const getUserInfo = () => {
    database.users
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        console.log(doc.data().learningHistory);
        setFinishedLevel1Count(doc.data().finishedLevel1.length);
        setLearningHistory(doc.data().learningHistory);
        setStreak(doc.data().streak);
        setKnownWordsCount(
          Object.keys(doc.data().vocabReview[0]).length +
            Object.keys(doc.data().vocabReview[1]).length +
            Object.keys(doc.data().vocabReview[2]).length +
            Object.keys(doc.data().vocabReview[3]).length +
            Object.keys(doc.data().vocabReview[4]).length +
            Object.keys(doc.data().vocabReview[5]).length +
            Object.keys(doc.data().vocabReview[6]).length +
            Object.keys(doc.data().vocabReview[7]).length
        );
      });
  };

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  const getPrevMonth = (month) => {
    if (month >= 0) {
      return monthNames[month];
    } else {
      return monthNames[monthNames.length + month];
    }
  };

  useEffect(() => {
    getUserInfo();

    //for 2 months ago
    for (
      let i = daysInMonth(todayDate.current.getMonth() - 1, todayDate.current.getFullYear());
      i < 31;
      i++
    ) {
      document.getElementById("1-" + (i + 1).toString()).style.opacity = 0;
    }
    //for 1 month ago
    for (
      let i = daysInMonth(todayDate.current.getMonth(), todayDate.current.getFullYear());
      i < 31;
      i++
    ) {
      document.getElementById("2-" + (i + 1).toString()).style.opacity = 0;
    }
    //for this month
    for (
      let i = daysInMonth(todayDate.current.getMonth() + 1, todayDate.current.getFullYear());
      i < 31;
      i++
    ) {
      document.getElementById("3-" + (i + 1).toString()).style.opacity = 0;
    }

    document.getElementById("streak-tooltip").style.bottom =
      -document.getElementById("streak-tooltip").offsetHeight - 10 + "px";
    document.getElementById("words-tooltip").style.bottom =
      -document.getElementById("words-tooltip").offsetHeight - 10 + "px";
    document.getElementById("lessons-tooltip").style.bottom =
      -document.getElementById("lessons-tooltip").offsetHeight - 10 + "px";
  }, []);

  useEffect(() => {
    if (finishedLevel1Count > 0) {
      document.getElementById("progress-percent").textContent =
        Math.round((finishedLevel1Count / level1LessonCount) * 100) + "%";
      document.getElementById("progress-percent").style.color = "#4AA9D3";
      document.getElementById("progress-fill").style.width =
        (finishedLevel1Count / level1LessonCount) * 100 + "%";
    }
  }, [finishedLevel1Count]);

  useEffect(() => {
    // populate study habits
    for (const [key, value] of Object.entries(learningHistory)) {
      let splitKey = key.split("/");

      // for 2 months ago
      if (
        parseInt(splitKey[0]) === todayDate.current.getMonth() - 1 &&
        parseInt(splitKey[2]) === todayDate.current.getFullYear()
      ) {
        if (value === 1) {
          console.log("value of " + key + " in group 1");
          document.getElementById("1-" + splitKey[1]).style.backgroundColor =
            "#A4D3E9";
        } else if (value > 1 && value < 4) {
          console.log("value of " + key + " in group 2");
          document.getElementById("1-" + splitKey[1]).style.backgroundColor =
            "#4AA9D3";
        } else if (value >= 4) {
          console.log("value of " + key + " in group 3");
          document.getElementById("1-" + splitKey[1]).style.backgroundColor =
            "#357997";
        }
      }
      // for 1 month ago
      else if (
        parseInt(splitKey[0]) === todayDate.current.getMonth() &&
        parseInt(splitKey[2]) === todayDate.current.getFullYear()
      ) {
        if (value === 1) {
          console.log("value of " + key + " in group 1");
          document.getElementById("2-" + splitKey[1]).style.backgroundColor =
            "#A4D3E9";
        } else if (value > 1 && value < 4) {
          console.log("value of " + key + " in group 2");
          document.getElementById("2-" + splitKey[1]).style.backgroundColor =
            "#4AA9D3";
        } else if (value >= 4) {
          console.log("value of " + key + " in group 3");
          document.getElementById("2-" + splitKey[1]).style.backgroundColor =
            "#357997";
        }
      }
      // for this month
      else if (
        parseInt(splitKey[0]) === todayDate.current.getMonth() + 1 &&
        parseInt(splitKey[2]) === todayDate.current.getFullYear()
      ) {
        if (value === 1) {
          console.log("value of " + key + " in group 1");
          document.getElementById("3-" + splitKey[1]).style.backgroundColor =
            "#A4D3E9";
        } else if (value > 1 && value < 4) {
          console.log("value of " + key + " in group 2");
          document.getElementById("3-" + splitKey[1]).style.backgroundColor =
            "#4AA9D3";
        } else if (value >= 4) {
          console.log("value of " + key + " in group 3");
          document.getElementById("3-" + splitKey[1]).style.backgroundColor =
            "#357997";
        }
      }
    }

    document.getElementById("3-" + todayDate.current.getDate()).style.border =
    "1px solid #4AA9D3";

    //check for streak
    let yesterdayDate = new Date(todayDate.current.getTime());;
    if (
      Object.keys(learningHistory).length > 0
    ) {
      yesterdayDate = new Date(
        yesterdayDate.setDate(yesterdayDate.getDate() - 1)
      );
      console.log(
        "contain yesterday? ",
        Object.keys(learningHistory).includes(
          yesterdayDate.toLocaleDateString()
        )
      );
      if (
        !Object.keys(learningHistory).includes(
          yesterdayDate.toLocaleDateString()
        ) && streak > 0 && changingStreak === 0
      ) {
        if (Object.keys(learningHistory).includes(todayDate.current.toLocaleDateString())) {
          setChangingStreak(1);
        } else {
          setChangingStreak(2);
        }
      }
    }
  }, [learningHistory, changingStreak, streak, todayDate]);

  useEffect(() => {
    console.log("resetStreak: ", changingStreak)
    if (changingStreak === 1) {
      setStreak(1);
    } else if (changingStreak === 2) {
      setStreak(0);
    }
  }, [changingStreak])

  useEffect(() => {
    console.log("true? ", (streak === 0 || streak === 1))
    if ((streak === 0 || streak === 1) && (changingStreak === 1 || changingStreak === 2) && (!updatedUser.current)) {
      updatedUser.current = true;
      database.users.doc(currentUser.uid).update({
        streak: 0,
      });
    }

    if (streak === 0) {
      document.getElementsByClassName(
        "profile-stats-streak"
      )[0].style.backgroundColor = "#97a8ae";
    } else {
      document.getElementsByClassName(
        "profile-stats-streak"
      )[0].style.backgroundColor = "#fc4848";
    }
  }, [streak]);

  useEffect(() => {
    if (finishedLevel1Count === 0) {
      document.getElementsByClassName(
        "profile-stats-lessons"
      )[0].style.backgroundColor = "#97a8ae";
    } else {
      document.getElementsByClassName(
        "profile-stats-lessons"
      )[0].style.backgroundColor = "#31aa56";
    }
  }, [finishedLevel1Count]);

  useEffect(() => {
    if (knownWordsCount === 0) {
      document.getElementsByClassName(
        "profile-stats-words"
      )[0].style.backgroundColor = "#97a8ae";
    } else {
      document.getElementsByClassName(
        "profile-stats-words"
      )[0].style.backgroundColor = "#f2c01e";
    }
  }, [knownWordsCount]);

  const showTooltip = (tooltipNr, show) => {
    if (tooltipNr === 0 && show === true) {
      document.getElementById("streak-tooltip").style.opacity = 1;
    } else if (tooltipNr === 0 && show === false) {
      document.getElementById("streak-tooltip").style.opacity = 0;
    } else if (tooltipNr === 1 && show === true) {
      document.getElementById("words-tooltip").style.opacity = 1;
    } else if (tooltipNr === 1 && show === false) {
      document.getElementById("words-tooltip").style.opacity = 0;
    } else if (tooltipNr === 2 && show === true) {
      document.getElementById("lessons-tooltip").style.opacity = 1;
    } else if (tooltipNr === 2 && show === false) {
      document.getElementById("lessons-tooltip").style.opacity = 0;
    }
  };

  return (
    <div className="dashboard-wrap">
      <Navbar />

      <div className="profile-container">
        <div className="profile-top-div">
          <div className="profile-img-div">
            <img
              className="profile-pic-profile"
              src={
                currentUser.photoURL
                  ? currentUser.photoURL
                  : "https://firebasestorage.googleapis.com/v0/b/onodojang-4ce62.appspot.com/o/user%2Fcaticon.png?alt=media&token=b53a2b13-84a2-4321-a0e7-e5a53933a57c"
              }
              alt="profile"
            />
          </div>
          <div className="profile-info-div">
            <span className="profile-info-username">
              {currentUser.displayName}
            </span>
            {joinedDate && (
              <span className="profile-info-joined">
                <FaClock className="profile-info-icons" />
                Joined {monthsLong[joinedDate.getMonth()]}{" "}
                {joinedDate.getFullYear()}
              </span>
            )}
          </div>
          <div className="profile-stats-div">
            <div
              className="profile-stats-streak"
              onMouseEnter={() => showTooltip(0, true)}
              onMouseLeave={() => showTooltip(0, false)}
            >
              <FaFire className="fire-icon profile-stats-icon" />
              <span className="profile-stats-number">{streak}</span>
              <div id="streak-tooltip" className="tooltip">
                <span>
                  <p className="tooltip-heading">Streak</p>Learn every day to
                  grow your streak!
                </span>
              </div>
            </div>
            <div
              className="profile-stats-words"
              onMouseEnter={() => showTooltip(1, true)}
              onMouseLeave={() => showTooltip(1, false)}
            >
              <FaBolt className="bolt-icon profile-stats-icon" />
              <span className="profile-stats-number">{knownWordsCount}</span>
              <div id="words-tooltip" className="tooltip">
                <span>
                  <p className="tooltip-heading">Learned words</p>Learn new
                  words by finishing lessons!
                </span>
              </div>
            </div>
            <div
              className="profile-stats-lessons"
              onMouseEnter={() => showTooltip(2, true)}
              onMouseLeave={() => showTooltip(2, false)}
            >
              <FaLightbulb className="bulb-icon profile-stats-icon" />
              <span className="profile-stats-number">
                {finishedLevel1Count}
              </span>
              <div id="lessons-tooltip" className="tooltip">
                <span>
                  <p className="tooltip-heading">Finished lessons</p>Finish
                  lessons to improve your Korean!
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-top-right">
          <div className="profile-heatmap-div">
            <span className="profile-section-heading">Study Habits</span>
            <div className="profile-heatmap-wrap">
              <div className="profile-heatmap-section">
                <span className="profile-heatmap-months 1">
                  {getPrevMonth(todayDate.current.getMonth() - 2)}
                </span>
                <div className="profile-heatmap-squares">
                  <div className="profile-heatmap-weeks">
                    <div id="1-1" className="profile-heatmap-square"></div>
                    <div id="1-2" className="profile-heatmap-square"></div>
                    <div id="1-3" className="profile-heatmap-square"></div>
                    <div id="1-4" className="profile-heatmap-square"></div>
                    <div id="1-5" className="profile-heatmap-square"></div>
                    <div id="1-6" className="profile-heatmap-square"></div>
                    <div id="1-7" className="profile-heatmap-square"></div>
                  </div>
                  <div className="profile-heatmap-weeks">
                    <div id="1-8" className="profile-heatmap-square"></div>
                    <div id="1-9" className="profile-heatmap-square"></div>
                    <div id="1-10" className="profile-heatmap-square"></div>
                    <div id="1-11" className="profile-heatmap-square"></div>
                    <div id="1-12" className="profile-heatmap-square"></div>
                    <div id="1-13" className="profile-heatmap-square"></div>
                    <div id="1-14" className="profile-heatmap-square"></div>
                  </div>
                  <div className="profile-heatmap-weeks">
                    <div id="1-15" className="profile-heatmap-square"></div>
                    <div id="1-16" className="profile-heatmap-square"></div>
                    <div id="1-17" className="profile-heatmap-square"></div>
                    <div id="1-18" className="profile-heatmap-square"></div>
                    <div id="1-19" className="profile-heatmap-square"></div>
                    <div id="1-20" className="profile-heatmap-square"></div>
                    <div id="1-21" className="profile-heatmap-square"></div>
                  </div>
                  <div className="profile-heatmap-weeks">
                    <div id="1-22" className="profile-heatmap-square"></div>
                    <div id="1-23" className="profile-heatmap-square"></div>
                    <div id="1-24" className="profile-heatmap-square"></div>
                    <div id="1-25" className="profile-heatmap-square"></div>
                    <div id="1-26" className="profile-heatmap-square"></div>
                    <div id="1-27" className="profile-heatmap-square"></div>
                    <div id="1-28" className="profile-heatmap-square"></div>
                  </div>
                  <div className="profile-heatmap-weeks">
                    <div id="1-29" className="profile-heatmap-square"></div>
                    <div id="1-30" className="profile-heatmap-square"></div>
                    <div id="1-31" className="profile-heatmap-square"></div>
                  </div>
                </div>
              </div>
              <div className="profile-heatmap-section">
                <span className="profile-heatmap-months 2">
                  {getPrevMonth(todayDate.current.getMonth() - 1)}
                </span>
                <div className="profile-heatmap-squares">
                  <div className="profile-heatmap-weeks">
                    <div id="2-1" className="profile-heatmap-square"></div>
                    <div id="2-2" className="profile-heatmap-square"></div>
                    <div id="2-3" className="profile-heatmap-square"></div>
                    <div id="2-4" className="profile-heatmap-square"></div>
                    <div id="2-5" className="profile-heatmap-square"></div>
                    <div id="2-6" className="profile-heatmap-square"></div>
                    <div id="2-7" className="profile-heatmap-square"></div>
                  </div>
                  <div className="profile-heatmap-weeks">
                    <div id="2-8" className="profile-heatmap-square"></div>
                    <div id="2-9" className="profile-heatmap-square"></div>
                    <div id="2-10" className="profile-heatmap-square"></div>
                    <div id="2-11" className="profile-heatmap-square"></div>
                    <div id="2-12" className="profile-heatmap-square"></div>
                    <div id="2-13" className="profile-heatmap-square"></div>
                    <div id="2-14" className="profile-heatmap-square"></div>
                  </div>
                  <div className="profile-heatmap-weeks">
                    <div id="2-15" className="profile-heatmap-square"></div>
                    <div id="2-16" className="profile-heatmap-square"></div>
                    <div id="2-17" className="profile-heatmap-square"></div>
                    <div id="2-18" className="profile-heatmap-square"></div>
                    <div id="2-19" className="profile-heatmap-square"></div>
                    <div id="2-20" className="profile-heatmap-square"></div>
                    <div id="2-21" className="profile-heatmap-square"></div>
                  </div>
                  <div className="profile-heatmap-weeks">
                    <div id="2-22" className="profile-heatmap-square"></div>
                    <div id="2-23" className="profile-heatmap-square"></div>
                    <div id="2-24" className="profile-heatmap-square"></div>
                    <div id="2-25" className="profile-heatmap-square"></div>
                    <div id="2-26" className="profile-heatmap-square"></div>
                    <div id="2-27" className="profile-heatmap-square"></div>
                    <div id="2-28" className="profile-heatmap-square"></div>
                  </div>
                  <div className="profile-heatmap-weeks">
                    <div id="2-29" className="profile-heatmap-square"></div>
                    <div id="2-30" className="profile-heatmap-square"></div>
                    <div id="2-31" className="profile-heatmap-square"></div>
                  </div>
                </div>
              </div>
              <div className="profile-heatmap-section">
                <span className="profile-heatmap-months 3">
                  {monthNames[todayDate.current.getMonth()]}
                </span>
                <div className="profile-heatmap-squares">
                  <div className="profile-heatmap-weeks">
                    <div id="3-1" className="profile-heatmap-square"></div>
                    <div id="3-2" className="profile-heatmap-square"></div>
                    <div id="3-3" className="profile-heatmap-square"></div>
                    <div id="3-4" className="profile-heatmap-square"></div>
                    <div id="3-5" className="profile-heatmap-square"></div>
                    <div id="3-6" className="profile-heatmap-square"></div>
                    <div id="3-7" className="profile-heatmap-square"></div>
                  </div>
                  <div className="profile-heatmap-weeks">
                    <div id="3-8" className="profile-heatmap-square"></div>
                    <div id="3-9" className="profile-heatmap-square"></div>
                    <div id="3-10" className="profile-heatmap-square"></div>
                    <div id="3-11" className="profile-heatmap-square"></div>
                    <div id="3-12" className="profile-heatmap-square"></div>
                    <div id="3-13" className="profile-heatmap-square"></div>
                    <div id="3-14" className="profile-heatmap-square"></div>
                  </div>
                  <div className="profile-heatmap-weeks">
                    <div id="3-15" className="profile-heatmap-square"></div>
                    <div id="3-16" className="profile-heatmap-square"></div>
                    <div id="3-17" className="profile-heatmap-square"></div>
                    <div id="3-18" className="profile-heatmap-square"></div>
                    <div id="3-19" className="profile-heatmap-square"></div>
                    <div id="3-20" className="profile-heatmap-square"></div>
                    <div id="3-21" className="profile-heatmap-square"></div>
                  </div>
                  <div className="profile-heatmap-weeks">
                    <div id="3-22" className="profile-heatmap-square"></div>
                    <div id="3-23" className="profile-heatmap-square"></div>
                    <div id="3-24" className="profile-heatmap-square"></div>
                    <div id="3-25" className="profile-heatmap-square"></div>
                    <div id="3-26" className="profile-heatmap-square"></div>
                    <div id="3-27" className="profile-heatmap-square"></div>
                    <div id="3-28" className="profile-heatmap-square"></div>
                  </div>
                  <div className="profile-heatmap-weeks">
                    <div id="3-29" className="profile-heatmap-square"></div>
                    <div id="3-30" className="profile-heatmap-square"></div>
                    <div id="3-31" className="profile-heatmap-square"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="profile-progress-div">
            <span className="profile-section-heading">Level Progress</span>
            <div className="profile-progress-bar">
              <span id="progress-percent" className="profile-progress-percent">
                0%
              </span>
              <div className="profile-progress-lvl-1">
                <div
                  id="progress-fill"
                  className="profile-progress-lvl-1-fill"
                ></div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="profile-stats-div">
          <div className="profile-stats-streak">
            <span className="profile-stats-text">streak</span>
            <FaFire className="fire-icon profile-stats-icon" />
            <span className="profile-stats-number">6</span>
          </div>
          <div className="profile-stats-words">
            <span className="profile-stats-text">words learned</span>
            <FaBolt className="bolt-icon profile-stats-icon" />
            <span className="profile-stats-number">48</span>
          </div>
          <div className="profile-stats-lessons">
            <span className="profile-stats-text">lessons done</span>
            <FaLightbulb className="bulb-icon profile-stats-icon" />
            <span className="profile-stats-number">12</span>
          </div>
        </div> */}
        {/*         <div className="profile-achievements-div">
          <span>Achievements</span>
          <div className="profile-badge-container">
            <div>
              <FaFire className="profile-badge" />
              <FaBolt className="profile-badge" />
              <FaBrain className="profile-badge" />
            </div>
            <div>
              <FaExclamation className="profile-badge" />
              <BsAlarmFill className="profile-badge" />
              <FaCoins className="profile-badge" />
            </div>
            <div>
              <span className="profile-badge">1</span>
              <FaPortrait className="profile-badge" />
              <FaBirthdayCake className="profile-badge" />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
