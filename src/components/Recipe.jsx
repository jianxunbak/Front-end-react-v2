import { useNavigate, useParams } from "react-router-dom";
import styles from "/src/components/Recipe.module.css";
import { useContext } from "react";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { UserAuthContext } from "../context/UserAuthContext";
import { PacmanLoader } from "react-spinners";
import { RecipeContext } from "../context/RecipeContext";
import Icons from "./Icons";
import { FavouriteContext } from "../context/FavouriteContext";
import { MapsContext } from "../context/MapsContext";

const Recipe = () => {
  // Get the id from the URL params
  const { id } = useParams();
  const navigate = useNavigate();
  const { isRecipeLoading } = useContext(IsEditingAndLoadingContext);
  const {
    setNewRecipe,
    allRecipes,
    handlerDelete,
    // handleNavigateToUserProfile,
  } = useContext(RecipeContext);
  const { userProfile, isLoggedIn } = useContext(UserAuthContext);
  const { favouriteList, favButtonClick } = useContext(FavouriteContext);
  const { setSelectedRecipe } = useContext(MapsContext);

  // const location = useLocation();

  // Find the selected item based on id passed from params
  const selectedItem = allRecipes.find((item) => item.id === Number(id));
  // return the details of selected item
  if (isRecipeLoading) {
    return (
      <div className={styles.loading}>
        <p>Loading recipes...</p>
        <PacmanLoader size={10} />
      </div>
    );
  }
  if (!selectedItem) {
    return (
      <p className={styles.centerText}>The selected recipe is not found</p>
    );
  }
  return (
    <div className={styles.recipeMainContainer}>
      {isRecipeLoading ? (
        <PacmanLoader size={10} />
      ) : (
        <div className={styles.container}>
          <div className={styles.imageContainer}>
            <img src={selectedItem.imgSrc} alt={selectedItem.imgAlt} />
          </div>
          <div className={styles.detailsContainer}>
            <div className={styles.detailsSubContainer}>
              <div className={styles.listSubContainer}>
                <h1 className={styles.mainTitle}>
                  {selectedItem.title.toUpperCase()}
                </h1>
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      favButtonClick(selectedItem, userProfile.userId);
                    }}
                  >
                    {favouriteList.some(
                      (fav) => fav.recipe.id === selectedItem.id
                    )
                      ? Icons.heartfill
                      : Icons.heart}
                  </button>
                )}
              </div>

              <p className={styles.description}>{selectedItem.description}</p>
              <p className={styles.listSubContainer}>
                Contributor:
                <>
                  <button
                    className={styles.button}
                    onClick={() => navigate(`/profile/${selectedItem.user.id}`)}
                  >
                    {Icons.profile}
                  </button>
                </>
              </p>
              <div className={styles.listContainer}>
                <h2 className={styles.subTitle}>Ingredients</h2>
                <ul>
                  {selectedItem.ingredients.map((item, index) => (
                    <li key={index} className={styles.listSubContainer}>
                      {index + 1}:<p>{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.listContainer}>
                <h2 className={styles.subTitle}>Steps</h2>
                <ul>
                  {selectedItem.steps.map((item, index) => (
                    <li key={index} className={styles.listSubContainer}>
                      {index + 1}:<p>{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={styles.buttonsContainer}>
              <button
                onClick={() => {
                  navigate(`/`);
                }}
              >
                {Icons.home}
              </button>
              {userProfile.userId == selectedItem.user.id && (
                <button
                  onClick={() => {
                    setNewRecipe(selectedItem);
                    navigate(`/edit`);
                  }}
                >
                  {Icons.edit}
                </button>
              )}

              {userProfile.userId == selectedItem.user.id && (
                <button
                  onClick={() => {
                    handlerDelete(selectedItem, selectedItem.id);
                  }}
                >
                  {Icons.delete}
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedRecipe(selectedItem);
                  navigate(`/map`);
                }}
              >
                {Icons.map}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipe;
