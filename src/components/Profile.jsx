// components/Profile.js
import { useContext, useEffect } from "react";
import { UserAuthContext } from "../context/UserAuthContext";
import styles from "./Profile.module.css"; // You can create this CSS file to style your profile
import { useNavigate, useParams } from "react-router-dom";
import { ProfileContext } from "../context/ProfileContext";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { PacmanLoader } from "react-spinners";
import { RecipeContext } from "../context/RecipeContext";
import Icons from "./Icons";
import profilePicSample from "../assets/profilePicSample.png";

const Profile = () => {
  const { id } = useParams();
  const { userProfile } = useContext(UserAuthContext);
  const { isLoading, setIsLoading } = useContext(IsEditingAndLoadingContext);
  const { handleGetOneUserRecipes, userRecipesAndId } =
    useContext(RecipeContext);
  const { handleDeleteProfile } = useContext(ProfileContext);
  const navigate = useNavigate();
  const samplePic = profilePicSample;

  useEffect(() => {
    if (!id) {
      return;
    }
    const getUserDetails = async () => {
      setIsLoading(true);
      await handleGetOneUserRecipes(id);
      setIsLoading(false);
    };
    getUserDetails();
  }, [id]);

  return (
    <>
      <div className={styles.profileMainContainer}>
        {isLoading || userRecipesAndId.length === 0 ? (
          <div className={styles.loading}>
            <p>Loading profile...</p>
            <PacmanLoader size={10} />
          </div>
        ) : (
          <div className={styles.container}>
            <div className={styles.imageContainer}>
              <img
                src={
                  !userRecipesAndId.profilePicture
                    ? samplePic
                    : userRecipesAndId.profilePicture
                }
                alt="User profile picture"
                className={styles.profileAvatar}
              />
            </div>
            <div className={styles.detailsContainer}>
              <div className={styles.detailsSubContainer}>
                <h1 className={styles.mainTitle}>
                  {userRecipesAndId.username}
                </h1>
                <div className={styles.detailsRowContainer}>
                  <p className={styles.label}>Email:</p>
                  <p className={styles.description}>{userRecipesAndId.email}</p>
                </div>
                <div className={styles.detailsRowContainer}>
                  <p className={styles.label}>About Me:</p>
                  <p className={styles.description}>
                    {userRecipesAndId.aboutMe === null
                      ? " Please tell us more about yourself!"
                      : userRecipesAndId.aboutMe}
                  </p>
                </div>
              </div>
              <div className={styles.buttonsContainer}>
                <button
                  className={styles.button}
                  onClick={() => {
                    navigate(`/userRecipes/${id}`);
                  }}
                >
                  {Icons.food}
                </button>
                {userRecipesAndId.id === userProfile.userId && (
                  <>
                    <button
                      className={styles.button}
                      onClick={() => {
                        navigate("/editProfile");
                      }}
                    >
                      {Icons.edit}
                    </button>
                    <button
                      className={styles.button}
                      onClick={() => {
                        navigate("/editPassword");
                      }}
                    >
                      {Icons.lock}
                    </button>
                    <button
                      className={styles.button}
                      onClick={(e) => handleDeleteProfile(e)}
                    >
                      {Icons.delete}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
