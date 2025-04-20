import { useContext, useEffect } from "react";
import styles from "./AddEditRecipe.module.css";
import { ProfileContext } from "../context/ProfileContext";
import { ProfileValidationContext } from "../context/ProfileValidationContext";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { UserAuthContext } from "../context/UserAuthContext";
import { PacmanLoader } from "react-spinners";

const EditProfile = () => {
  const {
    handleEditProfile,
    newUserProfile,
    handlerCancel,
    handlerInput,
    setNewUserProfile,
  } = useContext(ProfileContext);
  const { userProfile } = useContext(UserAuthContext);

  const { validationOnSubmit, validateRealTimeField, formErrors } = useContext(
    ProfileValidationContext
  );
  const { isEditing } = useContext(IsEditingAndLoadingContext);

  useEffect(() => {
    setNewUserProfile({
      username: userProfile.username || "",
      email: userProfile.email || "",
      aboutMe: userProfile.aboutMe || "",
      profilePicture: userProfile.profilePicture || "",
    });
  }, [userProfile, setNewUserProfile]);

  return (
    <div className={styles.formMainContainer}>
      <div className={styles.formContainer}>
        <div className={styles.mainTitleContainer}>
          <h1 className={styles.mainTitle}>Edit Profile</h1>
          {isEditing ? (
            <PacmanLoader size={10} color="black" />
          ) : (
            <div className={styles.buttonContainer}>
              <button
                className={styles.button}
                onClick={(e) => handleEditProfile(e, validationOnSubmit)}
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
              <label className={styles.label}>Username:</label>
              <input
                disabled={isEditing}
                className={styles.input}
                name="username"
                type="text"
                onChange={(e) =>
                  handlerInput("profile", e, validateRealTimeField)
                }
                value={newUserProfile.username || ""}
              />
            </div>
            {formErrors.username && (
              <div className={styles.error}>{formErrors.username}</div>
            )}
          </div>
          <div className={styles.InputColSubContainer}>
            <div className={styles.inputRowSubContainer}>
              <label className={styles.label}>Email:</label>
              <input
                disabled={isEditing}
                className={styles.input}
                name="email"
                type="text"
                onChange={(e) =>
                  handlerInput("profile", e, validateRealTimeField)
                }
                value={newUserProfile.email || ""}
              />
            </div>
            {formErrors.email && (
              <div className={styles.error}>{formErrors.email}</div>
            )}
          </div>
          <div className={styles.InputColSubContainer}>
            <div className={styles.inputRowSubContainer}>
              <label className={styles.label}>Profile Pic URL:</label>
              <input
                disabled={isEditing}
                className={styles.input}
                name="profilePicture"
                type="text"
                onChange={(e) =>
                  handlerInput("profile", e, validateRealTimeField)
                }
                value={newUserProfile.profilePicture || ""}
              />
            </div>
            {formErrors.profilePicture && (
              <div className={styles.error}>{formErrors.profilePicture}</div>
            )}
          </div>
          <div className={styles.InputColSubContainer}>
            <div className={styles.inputRowSubContainer}>
              <label className={styles.label}>About me:</label>
              <textarea
                disabled={isEditing}
                className={styles.textArea}
                name="aboutMe"
                type="text"
                onChange={(e) =>
                  handlerInput("profile", e, validateRealTimeField)
                }
                value={newUserProfile.aboutMe || ""}
              />
            </div>
            {formErrors.aboutMe && (
              <div className={styles.error}>{formErrors.aboutMe}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
