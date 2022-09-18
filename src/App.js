import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import AdminRoute from "./components/authentication/AdminRoute";
import PrivateRoute from "./components/authentication/PrivateRoute";
import Signup from "./components/authentication/Signup";
import Profile from "./components/authentication/Profile";
import Login from "./components/authentication/Login";
import ForgotPassword from "./components/authentication/ForgotPassword";
import UpdateProfile from "./components/authentication/UpdateProfile";
import Dashboard from "./components/app/Dashboard";
import Read from "./components/app/Read";
import Review from "./components/app/Review";
import LessonBody from "./components/app/LessonBody";
import ReviewBody from "./components/app/ReviewBody";
import Home from "./components/app/Home";

import AdminDashboard from "./components/app/admin/AdminDashboard";
import CreateLesson from "./components/app/admin/CreateLesson";
import EditLesson from "./components/app/admin/EditLesson";
import EditGrammar from "./components/app/admin/EditGrammar";
import EditVocab from "./components/app/admin/EditVocab";
import EditDialogue from "./components/app/admin/EditDialogue";
import EditReading from "./components/app/admin/EditReading";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Homepage */}
          <Route exact path="/" element={<Home/>} />

          {/* Learn */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
          <Route path="/lessons/:lessonNr" element={<PrivateRoute><LessonBody /></PrivateRoute>} />

          {/* Learn */}
          <Route path="/read" element={<PrivateRoute><Read/></PrivateRoute>} />

          {/* Review */}
          <Route path="/review" element={<PrivateRoute><Review/></PrivateRoute>} />
          <Route path="/review/vocab" element={<PrivateRoute><ReviewBody/></PrivateRoute>} />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <UpdateProfile />
              </PrivateRoute>
            }
          />

          {/* Auth */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Admin Stuff */}
          <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard/></AdminRoute>} />
          <Route path="/create-lesson" element={<AdminRoute><CreateLesson /></AdminRoute>} />
          <Route path="/edit-lesson" element={<AdminRoute><EditLesson /></AdminRoute>} />
          <Route path="/edit-grammar" element={<AdminRoute><EditGrammar /></AdminRoute>} />
          <Route path="/edit-vocab" element={<AdminRoute><EditVocab /></AdminRoute>} />
          <Route path="/edit-dialogue" element={<AdminRoute><EditDialogue /></AdminRoute>} />
          <Route path="/edit-reading" element={<AdminRoute><EditReading /></AdminRoute>} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
