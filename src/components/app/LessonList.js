import React, { useEffect, useState } from "react";
import LessonCard from "./LessonCard";
import { Element, scroller, Events } from "react-scroll";

function Observers({ selector, callback }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("show", entry.isIntersecting);
        });
      },
      {
        threshold: 1,
      }
    );

    const midObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("enlarge", entry.isIntersecting);
        });
      },
      { rootMargin: "-30% 0% -70% 0%" }
    );

    const cards = document.querySelectorAll(selector);

    cards.forEach((card) => {
      observer.observe(card);
      midObserver.observe(card);
    });

    return () => {
      observer.disconnect();
      midObserver.disconnect();
    };
  }, []);

  return null;
}

export default function LessonList(props) {
  const [visible, setVisible] = useState(false);
  const [topDistance, setTopDistance] = useState(200);
  const [loaded, setLoaded] = useState(false);

  const ScrollToClicked = (el) => {
    console.log(el);
    let wrapHeight =
      document.getElementsByClassName("dashboard-wrap")[0].offsetHeight;
    let element = document.getElementById(el);
    setTopDistance(window.pageYOffset + element.getBoundingClientRect().top);
    scroller.scrollTo(el, {
      duration: 300,
      smooth: "easeOutQuad",
      containerId: "lesson-cards",
      offset: -((wrapHeight / 100) * 20 - getAbsoluteHeight(element) / 2),
    });
  };

  function getAbsoluteHeight(el) {
    el = typeof el === "string" ? document.querySelector(el) : el;

    var styles = window.getComputedStyle(el);
    var margin =
      parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

    return Math.ceil(el.offsetHeight + margin);
  }

  useEffect(() => {
    console.log(props.currentLesson)
    if (document.getElementById(props.currentLesson)) {
      initialScroll(props.currentLesson).then(() => {
        let counter = 0;
        while (!document.getElementById(props.currentLesson).children[1].classList.contains("enlarge") && counter < 5) {
          setTimeout(() => {ScrollToClicked(props.currentLesson)}, "500");
          console.log("scrolling")
          counter++;
        }
      });
    } else {
      initialScroll(props.currentLesson).then(() => {
        let counter = 0;
        while (!document.getElementById(props.currentLesson).children[1].classList.contains("enlarge") && counter < 5) {
          setTimeout(() => {ScrollToClicked(props.currentLesson)}, "500");
          console.log("scrolling")
          counter++;
        }
      });
    }
  }, [props.currentLesson]);

  let initialScroll = (el) =>
    new Promise(function (resolve, reject) {
      let wrapHeight =
        document.getElementsByClassName("dashboard-wrap")[0].offsetHeight;
      let element = document.getElementById(el);
      setTopDistance(window.pageYOffset + element.getBoundingClientRect().top);
      resolve(
        scroller.scrollTo(el, {
          duration: 300,
          smooth: "easeOutQuad",
          containerId: "lesson-cards",
          offset: -((wrapHeight / 100) * 20 - getAbsoluteHeight(element) / 2),
        })
      );
    });

  function isFinished(lessonNr) {
    return props.finishedLessons.includes(lessonNr);
  }

  return (
    <React.Fragment>
      <div id="lesson-cards" className="lesson-cards">
        <div className="lessonlist">
          <LessonCard
            id="hidden-card"
            className="lesson-card"
            extraClass="hidden-card"
          />
          <LessonCard className="lesson-card" extraClass="hidden-card" />
          <div
            id="1"
            onClick={() => {
              ScrollToClicked("1");
              props.setScrolledLesson("1");
              // props.topDistance(topDistance)
            }}
          >
            <Element name="1"></Element>
            <LessonCard
              className="lesson-card"
              lessonNr={1}
              isFinished={isFinished(1)}
              setLoaded={setLoaded}
            />
          </div>
          <div
            id="2"
            onClick={() => {
              ScrollToClicked("2");
              props.setScrolledLesson("2");
              // props.topDistance(topDistance)
            }}
          >
            <Element name="2"></Element>
            <LessonCard
              className="lesson-card"
              lessonNr={2}
              isFinished={isFinished(2)}
            />
          </div>
          <div
            id="3"
            onClick={() => {
              ScrollToClicked("3");
              props.setScrolledLesson("3");
              // props.topDistance(topDistance)
            }}
          >
            <Element name="3"></Element>
            <LessonCard
              className="lesson-card"
              lessonNr={3}
              isFinished={isFinished(3)}
            />
          </div>
          <div
            id="4"
            onClick={() => {
              ScrollToClicked("4");
              props.setScrolledLesson("4");
              // props.topDistance(topDistance)
            }}
          >
            <Element name="4"></Element>
            <LessonCard
              className="lesson-card"
              lessonNr={4}
              isFinished={isFinished(4)}
            />
          </div>
          <div
            id="5"
            onClick={() => {
              ScrollToClicked("5");
              props.setScrolledLesson("5");
              // props.topDistance(topDistance)
            }}
          >
            <Element name="5"></Element>
            <LessonCard
              className="lesson-card"
              lessonNr={5}
              isFinished={isFinished(5)}
            />
          </div>
          <div
            id="6"
            onClick={() => {
              ScrollToClicked("6");
              props.setScrolledLesson("6");
              // props.topDistance(topDistance)
            }}
          >
            <Element name="6"></Element>
            <LessonCard
              className="lesson-card"
              lessonNr={6}
              isFinished={isFinished(6)}
            />
          </div>
          <div
            id="7"
            onClick={() => {
              ScrollToClicked("7");
              props.setScrolledLesson("7");
              // props.topDistance(topDistance)
            }}
          >
            <Element name="7"></Element>
            <LessonCard
              className="lesson-card"
              lessonNr={7}
              isFinished={isFinished(7)}
            />
          </div>
          <div
            id="8"
            onClick={() => {
              ScrollToClicked("8");
              props.setScrolledLesson("8");
              // props.topDistance(topDistance)
            }}
          >
            <Element name="8"></Element>
            <LessonCard
              className="lesson-card"
              lessonNr={8}
              isFinished={isFinished(8)}
            />
          </div>
          <div
            id="9"
            onClick={() => {
              ScrollToClicked("9");
              props.setScrolledLesson("9");
              // props.topDistance(topDistance)
            }}
          >
            <Element name="9"></Element>
            <LessonCard
              className="lesson-card"
              lessonNr={9}
              isFinished={isFinished(9)}
            />
          </div>
          <div
            id="10"
            onClick={() => {
              ScrollToClicked("10");
              props.setScrolledLesson("10");
              // props.topDistance(topDistance)
            }}
          >
            <Element name="10"></Element>
            <LessonCard
              className="lesson-card"
              lessonNr={10}
              isFinished={isFinished(10)}
            />
          </div>
          <div
            id="11"
            onClick={() => {
              ScrollToClicked("11");
              props.setScrolledLesson("11");
              // props.topDistance(topDistance)
            }}
          >
            <Element name="11"></Element>
            <LessonCard
              className="lesson-card"
              lessonNr={11}
              isFinished={isFinished(11)}
            />
          </div>
          <div
            id="12"
            onClick={() => {
              ScrollToClicked("12");
              props.setScrolledLesson("12");
              // props.topDistance(topDistance)
            }}
          >
            <Element name="12"></Element>
            <LessonCard
              className="lesson-card"
              lessonNr={12}
              isFinished={isFinished(12)}
            />
          </div>
          <div
            id="13"
            onClick={() => {
              ScrollToClicked("13");
              props.setScrolledLesson("13");
              // props.topDistance(topDistance)
            }}
          >
            <Element name="13"></Element>
            <LessonCard
              className="lesson-card"
              lessonNr={13}
              isFinished={isFinished(13)}
            />
          </div>
          <LessonCard
            className="lesson-card"
            heading="Lesson 1"
            desc="This is lesson 1"
          />
          <LessonCard
            className="lesson-card"
            heading="Lesson 1"
            desc="This is lesson 1"
          />
          <LessonCard
            className="lesson-card"
            heading="Lesson Last"
            desc="This is lesson 1"
          />
          <LessonCard
            className="lesson-card"
            extraClass="hidden-card"
            heading="hidden card"
            desc="hidden card"
          />
          <LessonCard
            className="lesson-card"
            extraClass="hidden-card"
            heading="hidden card"
            desc="hidden card"
          />
          <LessonCard
            className="lesson-card"
            extraClass="hidden-card"
            heading="hidden card"
            desc="hidden card"
          />
          <LessonCard
            className="lesson-card"
            extraClass="hidden-card"
            heading="hidden card"
            desc="hidden card"
          />
          <LessonCard
            className="lesson-card"
            extraClass="hidden-card"
            heading="hidden card"
            desc="hidden card"
          />
          <LessonCard className="lesson-card" extraClass="hidden-card" />
        </div>
      </div>
      <Observers
        selector=".lesson-card"
        callback={(e) => {
          setVisible(e[0].isIntersecting ? true : false);
        }}
      />
    </React.Fragment>
  );
}
