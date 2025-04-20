import { useContext } from "react";
import { UserAuthContext } from "../context/UserAuthContext";
import styles from "./LoginSignUp.module.css";
import { ProfileValidationContext } from "../context/ProfileValidationContext";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { PacmanLoader } from "react-spinners";

const SignUp = () => {
  const { credentials, handleCredentialsChange, handleSignUp } =
    useContext(UserAuthContext);

  const { validateRealTimeField, validationOnSubmit, formErrors } = useContext(
    ProfileValidationContext
  );
  const { isLoading } = useContext(IsEditingAndLoadingContext);

  return (
    <div>
      <form className={styles.loginContainer}>
        <div className={styles.inputColContainer}>
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
              onChange={(e) =>
                handleCredentialsChange(e, validateRealTimeField)
              }
            />
          </div>
          {formErrors.username && (
            <div className={styles.error}>{formErrors.username}</div>
          )}
        </div>
        <div className={styles.inputColContainer}>
          <div className={styles.inputContainer}>
            <label htmlFor="email" className={styles.formLabel}>
              Email:
            </label>
            <input
              id="email"
              className={styles.formInput}
              name="email"
              autoComplete="email"
              value={credentials.email}
              onChange={(e) =>
                handleCredentialsChange(e, validateRealTimeField)
              }
            />
          </div>
          {formErrors.email && (
            <div className={styles.error}>{formErrors.email}</div>
          )}
        </div>
        <div className={styles.inputColContainer}>
          <div className={styles.inputContainer}>
            <label className={styles.formLabel}>Password: </label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              className={styles.formInput}
              value={credentials.password}
              onChange={(e) =>
                handleCredentialsChange(e, validateRealTimeField)
              }
            />
          </div>
          {formErrors.password && (
            <div className={styles.error}>{formErrors.password}</div>
          )}
        </div>
        <div className={styles.inputContainer}>
          {isLoading ? (
            <PacmanLoader size={10} color="black" />
          ) : (
            <button
              className={styles.button}
              type="submit"
              onClick={(e) => handleSignUp(e, validationOnSubmit)}
            >
              Sign up
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SignUp;
