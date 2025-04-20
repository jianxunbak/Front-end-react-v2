import { useContext, useEffect } from "react";
import styles from "./AddEditRecipe.module.css";
import { ProfileContext } from "../context/ProfileContext";
import { ProfileValidationContext } from "../context/ProfileValidationContext";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { UserAuthContext } from "../context/UserAuthContext";
import { PacmanLoader } from "react-spinners";

const EditPassword = () => {
  const {
    handleEditPassword,
    newPassword,
    setNewPassword,
    handlerCancel,
    handlerInput,
  } = useContext(ProfileContext);
  const { userProfile } = useContext(UserAuthContext);

  const { validationOnSubmit, validateRealTimeField, formErrors } = useContext(
    ProfileValidationContext
  );
  const { isEditing } = useContext(IsEditingAndLoadingContext);

  useEffect(() => {
    setNewPassword({
      password: "",
    });
  }, [userProfile, setNewPassword]);

  return (
    <form className={styles.formMainContainer}>
      <div className={styles.formContainer}>
        <div className={styles.mainTitleContainer}>
          <h1 className={styles.mainTitle}>Edit Password</h1>
          {isEditing ? (
            <PacmanLoader size={10} color="black" />
          ) : (
            <div className={styles.buttonContainer}>
              <button
                className={styles.button}
                onClick={(e) => {
                  handleEditPassword(e, validationOnSubmit);
                  console.log(userProfile);
                }}
              >
                Save
              </button>
              <button
                className={styles.button}
                type="button"
                onClick={() => handlerCancel("profile")}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className={styles.inputMainContainer}>
          <div className={styles.InputColSubContainer}>
            <div className={styles.inputRowSubContainer}>
              <label className={styles.label}>Password:</label>
              <input
                type="text"
                name="username"
                autoComplete="username"
                value={userProfile?.username || ""}
                style={{ display: "none" }}
                readOnly
              />
              <input
                disabled={isEditing}
                className={styles.input}
                name="password"
                type="password"
                autoComplete="new-password"
                onChange={(e) =>
                  handlerInput("password", e, validateRealTimeField)
                }
                value={newPassword.password}
              />
            </div>
            {formErrors.password && (
              <div className={styles.error}>{formErrors.password}</div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditPassword;
