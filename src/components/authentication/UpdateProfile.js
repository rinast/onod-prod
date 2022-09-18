import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Card, Alert, Row, Col } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { storage } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FaExclamation } from "react-icons/fa";
import CenteredContainer from "../CenteredContainer";
import Navbar from "../app/Navbar";
import dino1 from "../../images/dino1.png";
import { AiOutlineConsoleSql } from "react-icons/ai";

const UpdateProfile = () => {
  const {
    currentUser,
    updateUsername,
    updateEmail,
    updatePassword,
    updatePic,
    deleteUser,
    logout
  } = useAuth();
  const usernameRef = useRef();
  const emailRef = useRef();
  const newPasswordRef = useRef();
  const confirmNewPasswordRef = useRef();
  const profilePicRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [deleteError, setDeleteError] = useState("");

  const [profilePicError, setProfilePicError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

  function deleteClicked(e) {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      handleLogout();
    }
  }

  async function handleLogout() {
    try {
      await deleteUser();
     // await logout();
      console.log("logout and delete successful")
      navigate("/")
    } catch(err) {
      setTimeout(() => {
        setDeleteError(err.message.replace("Firebase:", "").replace(/ *\([^)]*\). */g, "").trim());
        console.log("failed to log out and delete");
        console.log(err);
      }, "2000");
    }
  }

  function setErrors() {
    let errors = false;

    if (newPasswordRef.current.value !== confirmNewPasswordRef.current.value) {
      setConfirmNewPasswordError("Passwords do not match.");
      errors = true;
    } else {
      setConfirmNewPasswordError("");
    }

    if (
      newPasswordRef.current.value &&
      newPasswordRef.current.value.length < 6
    ) {
      setNewPasswordError("Password must be at least 6 characters long.");
      errors = true;
    } else {
      setNewPasswordError("");
    }

    if (profilePicRef.current.files[0] && profilePicRef.current.files[0].size > 1000000) {
      setProfilePicError("The image is too large.");
      errors = true;
    } else {
      setProfilePicError("");
    }

    return errors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    let errorsExist = setErrors();
    if (!errorsExist) {
      const promises = [];
      setLoading(true);

      if (profilePicRef.current.files[0]) {
        var storageRef = storage.ref(
          "user/" + currentUser.uid + "/" + profilePicRef.current.files[0].name
        );
        storageRef.put(profilePicRef.current.files[0]).then((snapshot) => {
          storageRef.getDownloadURL().then((url) => {
            promises.push(updatePic(url))
          });
        });
      }

      if (usernameRef.current.value !== currentUser.displayName) {
        promises.push(updateUsername(usernameRef.current.value));
      }
      if (emailRef.current.value !== currentUser.email) {
        promises.push(updateEmail(emailRef.current.value));
      }
      if (newPasswordRef.current.value) {
        promises.push(updatePassword(newPasswordRef.current.value));
      }

      Promise.all(promises)
      .then(() => {
        setTimeout(() => {
          navigate("/profile");
        }, 1000)
      })
      .catch(() => {
        setError("Something went wrong. Please try again later.");
        console.log("Failed to update account.")
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }

  return (
    <div className="settings-dashboard">
      <Navbar />

      <div className="settings-div">
        {error && (<><p className="delete-error"><FaExclamation className="me-2" />{error}</p></>)}
        <div className="settings-form-div">
          <span className="settings-heading">Profile Settings</span>
          <Form id="settings-form" onSubmit={handleSubmit}>
            <Form.Group as={Row} id="username">
              <Col className="form-label-col" sm={4}>
                <Form.Label>Username</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control
                  defaultValue={currentUser.displayName}
                  type="username"
                  ref={usernameRef}
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} id="email">
              <Col className="form-label-col" sm={4}>
                <Form.Label>Email</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control
                  defaultValue={currentUser.email}
                  type="email"
                  ref={emailRef}
                  required
                />
              </Col>
            </Form.Group>

            <div className="form-spacer"></div>

            <Form.Group as={Row} id="profile-pic">
              <Col className="form-label-col" sm={4}>
                <Form.Label>Profile Picture</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control type="file" ref={profilePicRef} />
              </Col>
              <span className="input-notes">The maximum image size is 1MB.</span>
              {profilePicError && (
                <span className="error">{profilePicError}</span>
              )}
            </Form.Group>

            <div className="form-spacer"></div>

            <Form.Group as={Row} id="new-password">
              <Col className="form-label-col" sm={4}>
                <Form.Label>New Password</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control type="password" ref={newPasswordRef} />
              </Col>
              {newPasswordError && (
                <span className="error">{newPasswordError}</span>
              )}
            </Form.Group>

            <Form.Group as={Row} id="confirm-new-password">
              <Col className="form-label-col" sm={4}>
                <Form.Label>Confirm Password</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control type="password" ref={confirmNewPasswordRef} />
              </Col>
              {confirmNewPasswordError && (
                <span className="error">{confirmNewPasswordError}</span>
              )}
            </Form.Group>

            <div className="form-spacer"></div>

            <div className="settings-btn-wrap">
              <Button disabled={loading} className="settings-btn" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </div>
        <div className="delete-account-div">
          <span onClick={(e) => deleteClicked(e)}>Delete my account</span>
          {deleteError && (<><p className="delete-error"><FaExclamation className="me-2" />{deleteError}</p></>)}
        </div>
      </div>
    </div>
  );

  /* return <CenteredContainer>
    <Card className="customcard">
      <Card.Body>
        <h2 className="text-center mb-4">Update Profile</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
        <Form.Group id="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="username" ref={usernameRef} required defaultValue={currentUser.displayName}/>
          </Form.Group>
          <Form.Group id="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" ref={emailRef} required defaultValue={currentUser.email}/>
          </Form.Group>
          <Form.Group id="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" ref={passwordRef} placeholder="Leave blank to keep the same."/>
          </Form.Group>
          <Form.Group id="password-confirm">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same."/>
          </Form.Group>
          <Button disabled={loading} className="w-100" type="submit">Update</Button>
        </Form>
      </Card.Body>
    </Card>
    <div className="w-100 text-center mt-2">
      <Link to="/user">Cancel</Link>
    </div>
  </CenteredContainer>; */
};

export default UpdateProfile;
