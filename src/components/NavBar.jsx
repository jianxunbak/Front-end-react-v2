import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { UserAuthContext } from "../context/UserAuthContext";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import Icons from "./Icons";

const NavBar = () => {
  const { isLoggedIn, handleLogout, userProfile } = useContext(UserAuthContext);
  // const { isLoggedIn, handleLogout, userProfile } = useContext(UserAuthContext);
  const { setIsLoading } = useContext(IsEditingAndLoadingContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className={styles.bar}>
        <div className={styles.toolTipContainer}>
          <NavLink to="/">{Icons.home}</NavLink>
          <span className={styles.toolTipText}>Home</span>
        </div>
        {!isLoggedIn && (
          <div className={styles.toolTipContainer}>
            <NavLink to="login">{Icons.signIn}</NavLink>
            <span className={styles.toolTipText}>Sign in</span>
          </div>
        )}
        {!isLoggedIn && (
          <div className={styles.toolTipContainer}>
            <NavLink to="signUp">
              {Icons.signUp}
              <span className={styles.toolTipText}>Sign up</span>
            </NavLink>
          </div>
        )}
        {isLoggedIn && (
          <div className={styles.toolTipContainer}>
            <button
              onClick={() => {
                handleLogout(setIsLoading);
              }}
            >
              {Icons.logout}
            </button>
            <span className={styles.toolTipText}>Logout</span>
          </div>
        )}

        {isLoggedIn && (
          <div className={styles.dropdown} ref={dropdownRef}>
            <div className={styles.toolTipContainer}>
              <button
                className={styles.dropdownButton}
                onClick={toggleDropdown}
              >
                {Icons.more}
              </button>
              <span className={styles.toolTipText}>More</span>
            </div>

            <div
              className={`${styles.dropdownContent} ${
                dropdownOpen ? styles.show : styles.hide
              }`}
            >
              {isLoggedIn && (
                <div className={styles.toolTipContainer}>
                  <NavLink to="add">{Icons.add}</NavLink>
                  <span className={styles.toolTipText}>Add recipes</span>
                </div>
              )}

              {isLoggedIn && (
                <div className={styles.toolTipContainer}>
                  <NavLink to="fav">{Icons.fav}</NavLink>
                  <span className={styles.toolTipText}>Favorite List</span>
                </div>
              )}
              {isLoggedIn && (
                <div className={styles.toolTipContainer}>
                  <NavLink to={`profile/${userProfile.userId}`}>
                    {Icons.profile}
                  </NavLink>
                  <span className={styles.toolTipText}>Profile</span>
                </div>
              )}
              {isLoggedIn && (
                <div className={styles.toolTipContainer}>
                  <NavLink to="map">{Icons.map}</NavLink>
                  <span className={styles.toolTipText}>Map of Recipes</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NavBar;
