import React, { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import NavbarLogo from "./NavbarLogo";
import dino1 from "../../images/dino1.png";

const Signup = () => {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState();
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      if (passwordError && passwordRef.current.value.length >= 6) {
        setPasswordError("");
      } else {
        setPasswordError("Password must be at least 6 characters long.");
      }
      return setError("Passwords do not match.");
    }

    if (passwordRef.current.value.length < 6) {
      if (
        error &&
        passwordRef.current.value === passwordConfirmRef.current.value
      ) {
        setError("");
      } else {
        setError("Passwords do not match.");
      }
      return setPasswordError("Password must be at least 6 characters long.");
    }

    try {
      setError("");
      setLoading(true);
      await signup(
        emailRef.current.value,
        passwordRef.current.value,
        usernameRef.current.value
      );
      navigate("/");
    } catch {
      setError("Failed to create an account.");
    }

    setLoading(false);
  }

  return (
    <div className="dashboard-wrap">
      <NavbarLogo active="signup"/>

      <div className={`signup-div ${(!error && !passwordError) && "pt-3 pb-3"}`}>
        <div className="signup-form-div">
          <span className="signup-heading">Welcome to Ono Dojang</span>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="signup-form-group" id="username">
              <Form.Label className="signup-form-label">Username</Form.Label>
              <Form.Control
                className="signup-form-control"
                type="username"
                ref={usernameRef}
                required
              />
            </Form.Group>
            <Form.Group className="signup-form-group" id="email">
              <Form.Label className="signup-form-label">Email</Form.Label>
              <Form.Control
                className="signup-form-control"
                type="email"
                ref={emailRef}
                required
              />
            </Form.Group>
            <Form.Group className="signup-form-group" id="password">
              <Form.Label className="signup-form-label">Password</Form.Label>
              <Form.Control
                className="signup-form-control"
                type="password"
                ref={passwordRef}
                required
              />
              {passwordError && (
                <span className="password-error">{passwordError}</span>
              )}
            </Form.Group>
            <Form.Group className="signup-form-group" id="password-confirm">
              <Form.Label className="signup-form-label">
                Confirm Password
              </Form.Label>
              <Form.Control
                className="signup-form-control"
                type="password"
                ref={passwordConfirmRef}
                required
              />
              {error && <span className="password-error">{error}</span>}
            </Form.Group>
            <div className="signup-btn-wrap">
              <Button disabled={loading} className="signup-btn" type="submit">
                Sign Up
              </Button>
            </div>
          </Form>
          <div className="signup-login-link w-100 text-center">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </div>
        <div className="signup-welcome-div">
          <img className="signup-welcome-img" src={dino1} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
