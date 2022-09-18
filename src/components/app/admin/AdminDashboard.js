import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import AdminLessonList from "./AdminLessonList";
import styles from "./AdminStyles.module.scss";
import { useAuth } from "../../../contexts/AuthContext";
import { database } from "../../../firebase";

export default function AdminDashboard() {
  return (
    <React.Fragment>
      <div className="dashboard-wrap">
        <Navbar />
        <p className="big-heading">Admin: Edit Lessons</p>

        <AdminLessonList />
        {/* <LessonListDesc currentLesson={scrolledLesson} /> */}
      </div>
    </React.Fragment>
  );
}
