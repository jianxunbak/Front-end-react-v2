import { useContext, useEffect } from "react";
import styles from "./AllRecipesCards.module.css";
import { FavouriteContext } from "../context/FavouriteContext";
// import { SearchContext } from "../context/SearchContext";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { PacmanLoader } from "react-spinners";
import { UserAuthContext } from "../context/UserAuthContext";
import Icons from "./Icons";
// import { useLocation } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";
import SearchBar from "./SearchBar";

const Fav = () => {
  const {
    favouriteList,
    favButtonClick,
    filteredFavRecipes,
    setFilteredFavRecipes,
    filterFavList,
  } = useContext(FavouriteContext);
  const { isFavLoading } = useContext(IsEditingAndLoadingContext);
  const { isLoggedIn, userProfile } = useContext(UserAuthContext);
  const { search } = useContext(SearchContext);

  useEffect(() => {
    if (favouriteList && location.pathname === "/fav") {
      const filtered = filterFavList(search);
      setFilteredFavRecipes(filtered);
    } else {
      setFilteredFavRecipes([]);
    }
  }, [search, favouriteList]);
  console.log("is fav loading?", isFavLoading);

  return (
    <>
      <div className={styles.mainTitleContainer}>
        <p className={styles.mainTitle}>Favorite recipes</p>
      </div>
      {!isFavLoading && <SearchBar disabled={isFavLoading} />}
      <div className={styles.mainCardContainer}>
        {isFavLoading ? (
          <div className={styles.loading}>
            <p>Loading favorite recipes...</p>
            <PacmanLoader size={10} />
          </div>
        ) : favouriteList.length === 0 ? (
          <p>You have no favorite recipes</p>
        ) : (
          filteredFavRecipes.map((item) => (
            <div key={item.id} className={styles.recipeContainer}>
              <div>
                <img
                  src={item.recipe.imgSrc}
                  alt={item.recipe.title}
                  className={styles.recipeImageContainer}
                />
                <div className={styles.recipeDetailsContainer}>
                  <div className={styles.subRowContainer}>
                    <h5 className={styles.title}>{item.recipe.title}</h5>
                    {isLoggedIn && (
                      <button
                        onClick={() => {
                          favButtonClick(item.recipe, userProfile.userId);
                        }}
                      >
                        {favouriteList.some(
                          (fav) => fav.recipe.id === item.recipe.id
                        )
                          ? Icons.heartfill
                          : Icons.heart}
                      </button>
                    )}
                  </div>
                  <p className={styles.cuisine}>{item.recipe.cuisine}</p>
                  <p className={styles.description}>
                    {item.recipe.description}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Fav;
