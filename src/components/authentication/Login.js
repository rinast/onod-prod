import React, { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import NavbarLogo from "./NavbarLogo";
import dino1 from "../../images/dino1.png";
import namsandino from "../../images/namsandino.png";


const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/dashboard");
    } catch {
      setError("Wrong username or password.");
    }

    setLoading(false);
  }

  return (
    <div className="dashboard-wrap">
      <NavbarLogo active="login"/>

      <div className="signup-div">
        <div className="signup-form-div">
          <span className="signup-heading">Login</span>
          <Form onSubmit={handleSubmit}>
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
              <div className="login-details-wrap">
                <div className="forgot-password-link">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
                {error && <span className="password-error">{error}</span>}
              </div>
            </Form.Group>
            <div className="signup-btn-wrap">
              <Button disabled={loading} className="signup-btn" type="submit">
                Log In
              </Button>
            </div>
          </Form>
          <div className="signup-login-link w-100 text-center">
            Need an account? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
        <div className="login-welcome-div" style={{backgroundImage: `url(${namsandino})` }}>
          {/* <img className="signup-welcome-img" src={namsandino} alt="" /> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
