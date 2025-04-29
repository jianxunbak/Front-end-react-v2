import { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateToken, validateToken } from "../api/AuthEndPoints";
import { addNewUser, getOneUserById } from "../api/UserEndPoints";
import { PacmanLoader } from "react-spinners";
import { toast } from "react-toastify";

export const UserAuthContext = createContext();

export function UserAuthProvider({ children, setIsLoading }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    email: "",
  });

  //Store Logged In UserName:
  const [userProfile, setUserProfile] = useState({
    userId: "",
    username: "",
    email: "",
    aboutMe: "",
    profilePicture: "",
  });

  const checkToken = useCallback(
    async (setIsLoading) => {
      try {
        setIsLoading(true);
        const responseToken = await validateToken();
        if (responseToken.status != 200) {
          setIsLoggedIn(false);
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        setIsLoggedIn(true);
        const responseUser = await getOneUserById(responseToken.data.userId);

        if (responseUser.status === 200) {
          setUserProfile({
            userId: responseUser.data.id,
            username: responseUser.data.username,
            email: responseUser.data.email,
            aboutMe: responseUser.data.aboutMe,
            profilePicture: responseUser.data.profilePicture,
          });
        }
      } catch (error) {
        setIsLoggedIn(false);
        if (error.response) {
          alert("Token is invalid. Please relogin");
          console.error(error.response.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, setIsLoggedIn, setUserProfile]
  );

  // accesses the jwt token when user reloads the page when user log in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        await checkToken(setIsLoading);
      })();
    } else {
      setIsLoggedIn(false);
      setUserProfile({
        userId: "",
        username: "",
        email: "",
        aboutMe: "",
        profilePicture: "",
      });
      return;
    }
  }, [checkToken]);

  //auto login on 1st visit
  //auto login on 1st visit
  useEffect(() => {
    const token = localStorage.getItem("token");
    const hasLoggedOut = sessionStorage.getItem("hasLoggedOut");
    if (!token && !hasLoggedOut) {
      setCredentials({
        username: "Stark",
        password: "password",
      });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const hasLoggedOut = sessionStorage.getItem("hasLoggedOut");
    if (
      !token &&
      !hasLoggedOut &&
      credentials.username === "Stark" &&
      credentials.password === "password"
    ) {
      const autoLogin = async () => {
        await handleLogin(null, setIsLoading);
      };
      autoLogin();
    } else {
      setIsLoggedIn(false);
      setUserProfile({
        userId: "",
        username: "",
        email: "",
        aboutMe: "",
        profilePicture: "",
      });
      return;
    }
  }, [credentials]);

  const handleCredentialsChange = (e, validateRealTimeField = null) => {
    if (!e || !e.target) return; // Avoid accessing undefined properties
    const { name, value } = e.target;

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));

    if (validateRealTimeField) {
      validateRealTimeField(e);
    }
  };

  // get jwt token from username and password when login
  const handleLogin = async (event, setIsLoading) => {
    if (event) event.preventDefault(); // prevents reload to allow the async to run if not wont work as it cant run
    try {
      setIsLoading(true);
      const responseToken = await generateToken(credentials);
      if (responseToken.status == 200) {
        setIsLoggedIn(true);
        localStorage.setItem("token", responseToken.data.token);
        const currentUser = await getOneUserById(responseToken.data.userId);
        if (currentUser.status == 200) {
          setUserProfile({
            userId: currentUser.data.userId,
            username: currentUser.data.username,
            email: currentUser.data.email,
            aboutMe: currentUser.data.aboutMe,
            profilePicture: currentUser.data.profilePicture,
          });
        }
        toast.success("Logged in!");
        navigate("/");
      } else {
        alert("invalid credentials");
      }
    } catch (error) {
      if (error.response) {
        alert(`login failed: ${error.response.data.message}`);
        console.error(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = (setIsLoading) => {
    const confirmLogOut = window.confirm("Logging out. Are you sure?");
    if (!confirmLogOut) {
      return;
    } else if (confirmLogOut) {
      setIsLoading(true);
      sessionStorage.setItem("hasLoggedOut", true);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUserProfile({
        userId: "",
        username: "",
        email: "",
        aboutMe: "",
        profilePicture: "",
      });
      toast.success("Logged out");
      setIsLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 100); // small delay to allow state flush
    }
  };

  const handleSignUp = async (e, validationOnSubmit) => {
    console.log(credentials);
    setIsLoading(true);
    e.preventDefault();
    const results = validationOnSubmit(e, credentials);
    if (!results) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await addNewUser(credentials);
      if (response.status == 201) {
        alert("Sign up successful");
        handleLogin(e, setIsLoading);
      } else alert("invalid credentials");
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Error signing up. Please try again."); // Show error alert
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    credentials,
    handleCredentialsChange,
    handleLogin,
    isLoggedIn,
    setIsLoggedIn,
    handleLogout,
    handleSignUp,
    userProfile,
    setUserProfile,
  };

  return (
    <UserAuthContext.Provider value={contextValue}>
      {children}
    </UserAuthContext.Provider>
  );
}
