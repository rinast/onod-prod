import React, { useState } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { FaRegFlag, FaRegLightbulb } from "react-icons/fa";
import { BiBook } from "react-icons/bi";
import { HiOutlineCog, HiLogout, HiOutlineUser } from "react-icons/hi";
import { useAuth } from "../../contexts/AuthContext";

export default function NavbarComponent(props) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const showDropdown = (e) => {
    setDropdownVisible(true);
  };
  const hideDropdown = (e) => {
    setDropdownVisible(false);
  };

  const toggleDropdown = (e) => {
    setDropdownVisible(!dropdownVisible);
  };

  async function handleLogout() {
    setLogoutError("");
    try {
      await logout();
      navigate("/login");
    } catch {
      setLogoutError("Failed to log out.");
      setTimeout(() => {
        setLogoutError("");
      }, "2000");
    }
  }

  return (
    <React.Fragment>
      {logoutError !== "" && (
        <div className="logout-error">
          <span>{logoutError}</span>
        </div>
      )}
      <Navbar className="navbar-light p-1 px-3 yellow-bcg" expand="sm">
        <Navbar.Brand as={Link} to="/">
          ONODOJANG
        </Navbar.Brand>
        <Nav className="no-show-sm me-auto ms-2">
          <Link
            to="/dashboard"
            className={
              "d-flex p-2 pe-3 mx-2 align-items-center " +
              (props.active && props.active.localeCompare("learn") === 0
                ? "nav-item-active"
                : "nav-item-font")
            }
          >
            <span>
              <IconContext.Provider value={{ className: "react-icons" }}>
                <FaRegLightbulb className="mx-2" />
              </IconContext.Provider>
              LEARN
            </span>
          </Link>
          <Link
            to="/read"
            className={
              "d-flex p-2 pe-3 mx-2 align-items-center " +
              (props.active && props.active.localeCompare("read") === 0
                ? "nav-item-active"
                : "nav-item-font")
            }
          >
            <span>
              <IconContext.Provider value={{ className: "react-icons" }}>
                <BiBook className="mx-2 menu-icon-lg" />
              </IconContext.Provider>
              READ
            </span>
          </Link>
          <Link
            to="/review"
            className={
              "d-flex p-2 pe-3 mx-2 align-items-center " +
              (props.active && props.active.localeCompare("review") === 0
                ? "nav-item-active"
                : "nav-item-font")
            }
          >
            <span>
              <IconContext.Provider value={{ className: "react-icons" }}>
                <FaRegFlag className="mx-2" />
              </IconContext.Provider>
              REVIEW
            </span>
          </Link>
        </Nav>
        <Nav className="ms-auto">
          {/* <Nav.Link as={Link} to="/user">
          <img className="profile-pic" alt="Profile" src={process.env.PUBLIC_URL+"assets/caticon.png"} />
          </Nav.Link> */}
          <NavDropdown
            title={
              <div className="profile-pic-wrap">
                <img
                  className="profile-pic"
                  src={
                    currentUser.photoURL
                      ? currentUser.photoURL
                      : "https://firebasestorage.googleapis.com/v0/b/onodojang-4ce62.appspot.com/o/user%2Fcaticon.png?alt=media&token=b53a2b13-84a2-4321-a0e7-e5a53933a57c"
                  }
                  alt="profile"
                />
              </div>
            }
            id="hover-nav-dropdown"
            align="end"
            show={dropdownVisible}
            onMouseEnter={showDropdown}
            onMouseLeave={hideDropdown}
            onClick={toggleDropdown}
          >
            <Link className="dropdown-link" to="/profile">
              <div className="dropdown-link-wrap">
                <span className="dropdown-link-text"><HiOutlineUser className="dropdown-icon" />PROFILE</span>
              </div>
            </Link>
            <Link className="dropdown-link" to="/settings">
              <div className="dropdown-link-wrap">
                <span className="dropdown-link-text"><HiOutlineCog className="dropdown-icon" />SETTINGS</span>
              </div>
            </Link>
            <div className="dropdown-link" onClick={handleLogout}>
              <div className="dropdown-link-wrap">
                <span className="dropdown-link-text"><HiLogout className="dropdown-icon" />LOGOUT</span>
              </div>
            </div>
          </NavDropdown>
        </Nav>
      </Navbar>

      <Navbar fixed="bottom" className="no-show-lg">
        <Nav className="w-100 justify-content-around">
          <Link
            to="/dashboard"
            className={
              "w-50 py-3 d-flex align-items-center justify-content-center " +
              (props.active && props.active.localeCompare("learn") === 0
                ? "nav-item-active-mobile"
                : "nav-item-mobile")
            }
          >
            <IconContext.Provider value={{ className: "react-icons" }}>
              <FaRegLightbulb className="mx-2" />
            </IconContext.Provider>
            LEARN
          </Link>
          <Link
            to="/read"
            className={
              "w-50 py-3 d-flex align-items-center justify-content-center " +
              (props.active && props.active.localeCompare("read") === 0
                ? "nav-item-active-mobile"
                : "nav-item-mobile")
            }
          >
            <IconContext.Provider value={{ className: "react-icons" }}>
              <BiBook className="mx-2 menu-icon-lg" />
            </IconContext.Provider>
            READ
          </Link>
          <Link
            to="/review"
            className={
              "w-50 py-3 d-flex align-items-center justify-content-center " +
              (props.active && props.active.localeCompare("review") === 0
                ? "nav-item-active-mobile"
                : "nav-item-mobile")
            }
          >
            <IconContext.Provider value={{ className: "react-icons" }}>
              <FaRegFlag className="mx-2" />
            </IconContext.Provider>
            REVIEW
          </Link>
        </Nav>
      </Navbar>
    </React.Fragment>
  );
}
