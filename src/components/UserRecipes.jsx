import { useNavigate, useParams } from "react-router-dom";
import styles from "./AllRecipesCards.module.css";
import { useContext, useEffect } from "react";
import { UserAuthContext } from "../context/UserAuthContext";
import { FavouriteContext } from "../context/FavouriteContext";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { PacmanLoader } from "react-spinners";
import { RecipeContext } from "../context/RecipeContext";
import { SearchContext } from "../context/SearchContext";
import Icons from "./Icons";
import SearchBar from "./SearchBar";

export const UserRecipes = () => {
  const navigate = useNavigate();
  const { search, filteredRecipes, setFilteredRecipes } =
    useContext(SearchContext);

  const { isLoggedIn, userProfile } = useContext(UserAuthContext);
  const { isLoading, setIsEditing, setIsLoading } = useContext(
    IsEditingAndLoadingContext
  );
  const {
    favouriteList = [],

    favButtonClick,
  } = useContext(FavouriteContext);
  const {
    setNewRecipe,
    userRecipesAndId,
    handlerDelete,
    handleGetOneUserRecipes,
  } = useContext(RecipeContext);

  const { id } = useParams();
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

  useEffect(() => {
    if (userRecipesAndId && userRecipesAndId.recipes) {
      const filtered = userRecipesAndId.recipes.filter((recipe) => {
        const lowerCaseSearch = search.toLowerCase();
        return (
          recipe.title.toLowerCase().includes(lowerCaseSearch) ||
          recipe.cuisine.toLowerCase().includes(lowerCaseSearch) ||
          recipe.city.toLowerCase().includes(lowerCaseSearch) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(lowerCaseSearch)
          )
        );
      });
      setFilteredRecipes(filtered);
    }
  }, [search, userRecipesAndId]);

  return (
    <>
      <div className={styles.mainTitleContainer}>
        <p className={styles.mainTitle}>
          {isLoading ? null : `${userRecipesAndId.username}'s recipes`}
        </p>
      </div>
      {!isLoading && <SearchBar disabled={isLoading} />}
      <div className={styles.mainCardContainer}>
        {isLoading || !userRecipesAndId || !userRecipesAndId.recipes ? (
          <div className={styles.loading}>
            <p>Loading recipes...</p>
            <PacmanLoader size={10} />
          </div>
        ) : (
          filteredRecipes.map((item, index) => (
            <div key={index} className={styles.recipeContainer}>
              <div className="card h-100">
                <img
                  src={item.imgSrc}
                  alt={item.title}
                  className={styles.recipeImageContainer}
                />
                <div className={styles.recipeDetailsContainer}>
                  <div className={styles.subRowContainer}>
                    <h5 className={styles.title}>{item.title}</h5>
                    {isLoggedIn && (
                      <button
                        onClick={() => {
                          favButtonClick(item, userProfile.userId);
                        }}
                      >
                        {favouriteList.some((fav) => fav.recipe.id === item.id)
                          ? Icons.heartfill
                          : Icons.heart}
                      </button>
                    )}
                  </div>

                  <p className={styles.cuisine}>{item.cuisine}</p>
                  <p className={styles.description}>{item.description}</p>
                </div>
                {isLoggedIn && (
                  <div className={styles.buttonsContainer}>
                    <button
                      className={styles.button}
                      onClick={(event) => {
                        event.preventDefault();
                        navigate(`/recipe/${item.id}`);
                      }}
                      type="button"
                    >
                      {Icons.view}
                    </button>
                    {userProfile.userId == userRecipesAndId.id ? (
                      <>
                        <button
                          className={styles.button}
                          onClick={() => {
                            setNewRecipe(item);
                            navigate("/edit");
                            setIsEditing(true);
                          }}
                        >
                          {Icons.edit}
                        </button>
                        <button
                          className={styles.button}
                          onClick={() => handlerDelete(item, item.id)}
                        >
                          {Icons.delete}
                        </button>
                      </>
                    ) : null}
                    <button
                      className={styles.button}
                      onClick={(event) => {
                        event.preventDefault();
                        navigate(`/recipe/${item.id}`);
                      }}
                      type="button"
                    >
                      {Icons.map}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default UserRecipes;
