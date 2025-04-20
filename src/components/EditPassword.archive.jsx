import { useContext } from "react";
import styles from "./AddEditRecipe.module.css";
("./AddRecipe.module.css");
import { ProfileContext } from "../context/ProfileContext";
import { ProfileValidationContext } from "../context/ProfileValidationContext";

const EditPassword = () => {
  const { validateRealTimeField, validationOnSubmit, formErrors } = useContext(
    ProfileValidationContext
  );
  const { handleEditPassword, handlerCancel, newPassword, handlerInput } =
    useContext(ProfileContext);
  console.log("new password", newPassword);
  return (
    <>
      <div className={styles.form}>
        <div className={styles.main}>
          <h1 className={styles.mainTitle}>Edit Password</h1>
          <button
            className={styles.button}
            onClick={(e) => {
              handleEditPassword(e, validationOnSubmit);
            }}
          >
            Save
          </button>
          <button
            className={styles.button}
            type="button"
            onClick={() => handlerCancel("password")}
          >
            Cancel
          </button>
        </div>
        <div className={styles.group}>
          <label className={`form-label ${styles.label}`}>New Password:</label>
          <input
            className="form-control"
            name="password"
            type="text"
            onChange={(e) => {
              handlerInput("password", e, validateRealTimeField);
            }}
            value={newPassword.password || ""}
          />
        </div>
        {formErrors.password && (
          <div className={styles.error}>{formErrors.password}</div>
        )}
      </div>
    </>
  );
};

export default EditPassword;
