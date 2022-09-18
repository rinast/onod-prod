import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AiOutlineLogin, AiOutlineUserAdd } from "react-icons/ai";
import { IconContext } from "react-icons";



export default function NavbarLogo(props) {
  return (
    <React.Fragment>
      <Navbar className="navbar-light p-1 px-3 yellow-bcg" expand="sm">
        <Nav.Item>
          <Navbar.Brand as={Link} to="/">
            ONODOJANG
          </Navbar.Brand>
        </Nav.Item>
        <Nav.Item className="ms-auto">
          <Link
            to="/signup"
            className={
              "d-flex p-2 pe-3 mx-2 align-items-center " +
              (props.active && props.active.localeCompare("signup") === 0
                ? "nav-item-active"
                : "nav-item-font")
            }
          >
            <span className="d-flex align-items-center">
              <IconContext.Provider value={{ className: "react-icons" }}>
                <AiOutlineUserAdd className="mx-2" />
              </IconContext.Provider>
              SIGNUP
            </span>
          </Link>
        </Nav.Item>
        <Nav.Item>
        <Link
            to="/login"
            className={
              "d-flex p-2 pe-3 mx-2 align-items-center " +
              (props.active && props.active.localeCompare("login") === 0
                ? "nav-item-active"
                : "nav-item-font")
            }
          >
            <span className="d-flex align-items-center">
              <IconContext.Provider value={{ className: "react-icons" }}>
                <AiOutlineLogin className="mx-2" />
              </IconContext.Provider>
              LOGIN
            </span>
          </Link>
        </Nav.Item>
      </Navbar>
    </React.Fragment>
  );
}
