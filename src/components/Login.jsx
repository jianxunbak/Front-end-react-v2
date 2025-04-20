import { useContext } from "react";
import { UserAuthContext } from "../context/UserAuthContext";
import styles from "./LoginSignUp.module.css";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { PacmanLoader } from "react-spinners";

const Login = () => {
  const { credentials, handleCredentialsChange, handleLogin } =
    useContext(UserAuthContext);

  const { setIsLoading, isLoading } = useContext(IsEditingAndLoadingContext);

  return (
    <div>
      <form
        onSubmit={(e) => {
          handleLogin(e, setIsLoading);
        }}
        className={styles.loginContainer}
      >
        <div className={styles.inputContainer}>
          <label htmlFor="username" className={styles.formLabel}>
            Username:
          </label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            className={styles.formInput}
            value={credentials.username}
            onChange={(e) => handleCredentialsChange(e)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="password" className={styles.formLabel}>
            Password:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className={styles.formInput}
            value={credentials.password}
            onChange={(e) => handleCredentialsChange(e)}
          />
        </div>
        <div className={styles.inputContainer}>
          {isLoading ? (
            <PacmanLoader size={10} color="black" />
          ) : (
            <button className={styles.button} type="submit">
              Login
            </button>
          )}
        </div>
        {!isLoading && (
          <div className={styles.hintContainer}>
            <p className={styles.hint}>*HINT*</p>
            <p className={styles.hint}>Username: Stark</p>
            <p className={styles.hint}>Password: password</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
