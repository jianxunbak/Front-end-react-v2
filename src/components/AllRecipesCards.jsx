import styles from "./AllRecipesCards.module.css";
import { useContext, useEffect } from "react";
import { FavouriteContext } from "../context/FavouriteContext";
import { RecipeContext } from "../context/RecipeContext";
// import { SearchContext } from "../context/SearchContext";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { PacmanLoader } from "react-spinners";
import { UserAuthContext } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import Icons from "./Icons";
import SearchBar from "./SearchBar";
import { SearchContext } from "../context/SearchContext";
import { MapsContext } from "../context/MapsContext";

const AllRecipesCards = () => {
  const { isRecipeLoading } = useContext(IsEditingAndLoadingContext);
  const { allRecipes, handlerDelete, setNewRecipe } = useContext(RecipeContext);
  const { isLoggedIn, userProfile } = useContext(UserAuthContext);
  const { favouriteList, favButtonClick } = useContext(FavouriteContext);
  const { search, filteredRecipes, setFilteredRecipes } =
    useContext(SearchContext);
  const { setSelectedRecipe } = useContext(MapsContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (allRecipes && location.pathname === "/") {
      const filtered = allRecipes.filter((recipe) => {
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
    } else {
      setFilteredRecipes([]);
    }
  }, [search, allRecipes]);
  return (
    <>
      <div className={styles.mainTitleContainer}>
        {isLoggedIn ? (
          <p className={styles.mainTitle}>Welcome back</p>
        ) : (
          <p className={styles.mainTitle}>Hello</p>
        )}
      </div>
      {!isRecipeLoading && <SearchBar disabled={isRecipeLoading} />}
      <div className={styles.mainCardContainer}>
        {isRecipeLoading ? (
          <div className={styles.loading}>
            <p>Loading recipes...</p>
            <PacmanLoader size={10} />
          </div>
        ) : (
          filteredRecipes.map((recipe) => {
            if (!recipe || !recipe.id) return null;
            return (
              <div key={recipe.id} className={styles.recipeContainer}>
                <img
                  src={recipe.imgSrc}
                  alt={recipe.title}
                  className={styles.recipeImageContainer}
                />
                <div className={styles.recipeDetailsContainer}>
                  <div className={styles.subRowContainer}>
                    <h5 className={styles.title}>{recipe.title}</h5>
                    {isLoggedIn && (
                      <button
                        onClick={() => {
                          favButtonClick(recipe, userProfile.userId);
                        }}
                      >
                        {favouriteList.some(
                          (fav) => fav.recipe.id === recipe.id
                        )
                          ? Icons.heartfill
                          : Icons.heart}
                      </button>
                    )}
                  </div>

                  <p className={styles.cuisine}>- {recipe.cuisine}</p>
                  <p className={styles.description}>{recipe.description}</p>
                </div>
                {isLoggedIn && (
                  <div className={styles.buttonsContainer}>
                    <button
                      className={styles.button}
                      onClick={(event) => {
                        event.preventDefault();
                        navigate(`/recipe/${recipe.id}`);
                      }}
                      type="button"
                    >
                      {Icons.view}
                    </button>
                    {recipe.user && userProfile.userId == recipe.user.id && (
                      <button
                        className={styles.button}
                        onClick={() => {
                          setNewRecipe(recipe);
                          navigate(`/edit`);
                        }}
                      >
                        {Icons.edit}
                      </button>
                    )}

                    {recipe.user && userProfile.userId == recipe.user.id && (
                      <button
                        className={styles.button}
                        onClick={() => {
                          handlerDelete(recipe, recipe.id);
                        }}
                      >
                        {Icons.delete}
                      </button>
                    )}
                    <button
                      className={styles.button}
                      onClick={() => {
                        setSelectedRecipe(recipe);
                        navigate(`/map`);
                      }}
                      type="button"
                    >
                      {Icons.map}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default AllRecipesCards;
