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
        <NavLink to="/">{Icons.home}</NavLink>
        {!isLoggedIn && <NavLink to="login">{Icons.signIn}</NavLink>}
        {!isLoggedIn && <NavLink to="signUp">{Icons.signUp}</NavLink>}
        {isLoggedIn && (
          <button
            onClick={() => {
              handleLogout(setIsLoading);
            }}
          >
            {Icons.logout}
          </button>
        )}

        {isLoggedIn && (
          <div className={styles.dropdown} ref={dropdownRef}>
            <button className={styles.dropdownButton} onClick={toggleDropdown}>
              {Icons.more}
            </button>

            <div
              className={`${styles.dropdownContent} ${
                dropdownOpen ? styles.show : styles.hide
              }`}
            >
              {isLoggedIn && <NavLink to="add">{Icons.add}</NavLink>}

              {isLoggedIn && <NavLink to="fav">{Icons.fav}</NavLink>}
              {isLoggedIn && (
                <NavLink to={`profile/${userProfile.userId}`}>
                  {Icons.profile}
                </NavLink>
              )}
              {isLoggedIn && <NavLink to="map">{Icons.map}</NavLink>}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NavBar;
