import React, { useEffect } from "react";
import NavbarLogo from "../authentication/NavbarLogo";
import { useAuth } from "../../contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";
import dino1 from "../../images/dino1.png";
import homedino from "../../images/homedino.png";
import homepage1 from "../../images/homepage1.png";
import homepage2 from "../../images/homepage2.png";

export default function Home() {
  const { currentUser } = useAuth();

  /* useEffect(() => {
    var path = document.querySelector("#homepage-line");
    var pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength + " " + pathLength;
    path.style.strokeDashoffset = pathLength;
    window.addEventListener("scroll", function (e) {
      // What % down is it?
      var scrollPercentage =
        (document.documentElement.scrollTop + document.body.scrollTop) /
        (document.documentElement.scrollHeight -
          document.documentElement.clientHeight) * 2.5;

      if (scrollPercentage > 1) {
        scrollPercentage = 1;
      }

      // Length to offset the dashes
      var drawLength = pathLength * scrollPercentage;


      // Draw in reverse
      path.style.strokeDashoffset = pathLength - drawLength;
    });
  }, []); */

  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="dashboard-wrap hero-dashboard">
      <NavbarLogo />
      <div className="hero-curve-container">
        <div className="hero-curve"></div>
      </div>
      <div className="hero-div">
        <div
          className="hero-content"
          style={{ backgroundImage: `url(${homedino})` }}
        >
          <div className="hero-text">
            <h1>Korean mastery in 10 minutes a day</h1>
            <p>
              Bite-sized lessons and interactive stories for immersive Korean
              language learning
            </p>
            <Link to="/signup" className="text-dec-none">
              <div className="get-started-btn">GET STARTED FOR FREE</div>
            </Link>
            <Link to="/login" className="text-dec-none">
              <div className="already-login-btn">I ALREADY HAVE AN ACCOUNT</div>
            </Link>
          </div>
          {/*  <img className="hero-img" src={homedino} alt="" /> */}
        </div>
      </div>

      <div className="home-body">
        <h1>How it works</h1>

        {/* <div className="svg-wrap">
          <svg
            id="homepage-line-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1039.58 177"
          >
            <path id="homepage-line" className="cls-1" d="M.43,87.33c2.24,1.81,10.94,1.09,23.33-.1,12.39-1.2,28.47-2.88,48.33-5.5,19.86-2.63,43.42-5.79,74.92-10.21,31.49-4.42,69.45-9.92,108.9-15.68,39.45-5.78,80.39-11.84,122.82-18.25,42.42-6.4,86.38-13.21,118.29-18.13,31.91-4.89,49.72-7.34,65.99-9.55,16.27-2.2,30.96-4,44.07-5.42,13.11-1.44,24.67-2.56,31.4-3.12,6.74-.56,9.35-.7,11.43-.78,2.09-.08,3.64-.11,4.67-.07s1.54,.15,2.21,.53c.67,.37,1.66,.99,2.33,1.63,.67,.63,1.04,1.3,5.06,4.84,4.02,3.54,3.75,4.24,2.64,5.78-1.12,1.55-3.69,4.2-7.44,7.27-3.75,3.07-8.69,6.54-14.77,10.41-6.09,3.87-13.35,8.15-17.82,10.81-4.46,2.67-5.13,3.41-5.51,4.06-.37,.65-8.78-4.8-8.57-4.3,.21,.47,.72,.88,1.68,1.13,.96,.24,2.51,.31,4.54,.27,2.03-.04,4.56-.22,7.58-.51,3.01-.28,6.51-.68,28.58-3.97,22.1-3.29,62.4-9.19,68.7-9.87,6.28-.68,11.63-1.19,16.02-1.56,4.4-.37,7.84-.59,8.56-.79,.71-.21-5.27,26.48-3.9,26.78,0,0-2.81,.12-6.57,.39-3.76,.27-8.46,.68-14.12,1.25-5.66,.58-12.27,1.31-52.49,6.76-40.22,5.46-44.02,5.87-47.34,6.19-3.33,.31-6.17,.54-8.52,.62-2.34,.09-4.22,.08-5.59-.06-1.38-.15-2.08-.52-2.48-.98-.41-.44-.52-.98-4.49-4.59-3.98-3.62-3.49-4.3-2.72-5.07,.77-.76,8.96-5.39,15.96-9.61,7.01-4.22,12.87-8.04,17.49-11.43,4.64-3.39,8.06-6.38,10.34-8.95,2.27-2.58,2.74-3.29,6.88-1.11,4.11,2.19,3.97,1.51,3.5,.86-.47-.65-1.23-1.32-2.31-1.95-1.1-.66-1.24-.8-1.92-.91-.67-.12-1.87-.17-3.59-.17s-3.97,.08-6.74,.19c-2.77,.12-13.21,.71-25.21,1.57-11.98,.86-25.53,1.98-40.59,3.22s-31.68,2.82-49.85,4.62c-18.17,1.8-62.73,7.17-105.85,12.37-43.11,5.19-84.74,10.19-124.88,14.81-40.14,4.63-78.78,8.92-115.91,12.82-37.13,3.92-62.89,6.28-84.99,8.22-22.09,1.93-40.52,3.46-55.36,4.97-14.83,1.49-26,2.52-30.03,2.45-5.63-2.77-5.06,.51-6.65-2.17"/>
          </svg>
        </div> */}

        <div className="home-par">
          <img src={homepage1} className="homepage1-img" alt="practice Korean effectively with Ono Dojang" />
          <img src={homepage2} className="homepage2-img" alt="learn Korean effectively with Ono Dojang" />
          <div>
            <h2>Fun learning through stories and interactive exercises</h2>
            <p>
              Learning Korean doesn't have to be boring. Ditch the textbooks and
              learn with stories, where you practice all the vocabulary and
              grammar you have previously acquired in our interactive lessons.
            </p>
          </div>
        </div>

        <div className="home-par">
          <div>
            <h2>Learn with native speaker resources</h2>
            <p>
              All our texts, exercises and voice recordings are produced by
              native speakers. You learn Korean the way it is used in the real
              world and listen to real Koreans talk from day 1!
            </p>
          </div>
          <img
            src={dino1}
            alt="learn Korean with native speaker resources with Ono Dojang"
          />
        </div>

        <div className="home-par">
          <img src={dino1} alt="learn Korean effectively with Ono Dojang" />
          <div>
            <h2>Study effectively with resources tailored to your level</h2>
            <p>
              It can be difficult to find learning resources that match your
              skill. With our progressively challenging lessons that build on
              each other and AI-powered review sessions, you can always be sure
              you're on the right track.
            </p>
          </div>
        </div>

        <div className="home-par">
          <div>
            <h2>Learn anytime, anywhere</h2>
            <p>
              You only need your mobile phone or computer. Connect from your
              morning commute, lunch breaks or before you sleep. You never have
              to miss a day of learning again!
            </p>
          </div>
          <img src={dino1} alt="learn Korean anywhere with Ono Dojang" />
        </div>
      </div>
    </div>
  );
}
