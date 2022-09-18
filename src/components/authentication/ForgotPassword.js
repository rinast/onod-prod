import React, { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import NavbarLogo from "./NavbarLogo";
import dino1 from "../../images/dino1.png";

const ForgotPassword = () => {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState()

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage()
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions.")
    } catch {
      setError("This email is not associated with an account.");
    }

    setLoading(false);
  }

  return (
    <div className="dashboard-wrap">
      <NavbarLogo />

      <div className="signup-div">
        <div className="signup-form-div">
          <span className="signup-heading">Forgot Your Password?</span>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="signup-form-group" id="email">
              <Form.Label className="signup-form-label">Email</Form.Label>
              <Form.Control
                className="signup-form-control"
                type="email"
                ref={emailRef}
                required
              />
              {message && <span className="success-message">{message}</span>}
              {error && <span className="password-error">{error}</span>}
            </Form.Group>
            <div className="signup-btn-wrap">
              <Button disabled={loading} className="signup-btn" type="submit">
                Reset Password
              </Button>
            </div>
          </Form>

          <div className="signup-login-link w-100 text-center">
            Got your password? <Link to="/login">Log In</Link>
            <div className="mt-3"></div>
            Need an account? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
        <div className="signup-welcome-div">
          <img className="signup-welcome-img" src={dino1} alt="" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
