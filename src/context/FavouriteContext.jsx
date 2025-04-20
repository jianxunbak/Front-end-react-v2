import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  addFavourites,
  deleteOneFavourite,
  getAllFavourites,
} from "../api/FavouritesEndPoints";
import { useLocation } from "react-router-dom";
import { UserAuthContext } from "./UserAuthContext";

// Step 1: Create a context object
export const FavouriteContext = createContext();

// Step 2: Set up a Context Provider
export function FavouriteProvider({ children, setIsFavLoading }) {
  const [favouriteList, setFavouriteList] = useState([]);
  const [filteredFavRecipes, setFilteredFavRecipes] = useState([]);
  const { userProfile, isLoggedIn } = useContext(UserAuthContext);
  const userId = userProfile?.userId;
  const location = useLocation();

  // const hasMountRef = useRef();
  // console.log("🧠 FavouriteProvider rendered");
  useEffect(() => {
    const updateFav = async () => {
      if (!userId) return;
      // if (!hasMountRef.current) {
      //   hasMountRef.current = true;
      //   return;
      // }
      if (
        location.pathname === "/fav" ||
        location.pathname === "/" ||
        location.pathname === "/map"
      ) {
        setIsFavLoading(true);
        await updateFavourites();
        setIsFavLoading(false);
      }
    };
    updateFav();
  }, [userId]);

  const updateFavourites = async () => {
    try {
      console.log("🔁 Refreshing favorites...");
      const response = await getAllFavourites(userId);
      if (response.status === 200) {
        const favResponse = response.data;
        setFavouriteList(favResponse);
      }
    } catch (error) {
      alert("Error getting all favourite recipes: " + error);
      console.log("Error getting all favourite recipes: " + error);
    } finally {
      console.log("favorites retrieved");
    }
  };

  const handleAddFavourites = async (userId, recipeId) => {
    if (!userId) return;
    try {
      const addResponse = await addFavourites(userId, recipeId);
      if (addResponse.status === 201) {
        setFavouriteList((prevFav) => [
          ...prevFav.filter(
            (fav) => fav.recipe.id !== addResponse.data.recipe.id
          ),
          addResponse.data,
        ]);
        // toast(`Recipe added to favourite successfully: ${recipeTitle}`); // Show alert with the deleted item's title
      }
    } catch (error) {
      console.error("Error adding recipe to favourites", error);
      alert("Failed to add recipe to favourites. Please try again."); // Show error alert
    }
  };

  const handleUnfavourite = async (userId, recipeId) => {
    if (!userId) return;
    try {
      const favRecipe = favouriteList.find(
        (item) => item.recipe.id === recipeId
      );
      if (!favRecipe) {
        throw new Error("Favourite recipe not found.");
      }
      const favRecipeId = favRecipe.recipe.id;
      // const favTitle = favRecipe.recipe.title;
      const deleteFavResponse = await deleteOneFavourite(userId, favRecipeId);

      if (deleteFavResponse.status === 204) {
        setFavouriteList((prevFav) =>
          prevFav.filter((item) => item.recipe.id !== recipeId)
        );
        // toast("Recipe removed from favourites successfully: " + favTitle);
      }
    } catch (error) {
      console.error("Error removing recipe from favourites: ", error);
      alert("Failed to remove recipe from favourite. Please try again."); // Show error alert
    }
  };

  const favButtonClick = (recipe, userId) => {
    const originalFavList = [...favouriteList];
    const isFavourited = originalFavList.some((fav) => {
      return fav.recipe.id === recipe.id;
    });
    // Optimistic UI update
    setFavouriteList((prevFavList) => {
      const updatedFavList = isFavourited
        ? prevFavList.filter((fav) => fav.recipe.id !== recipe.id)
        : [...prevFavList, { id: Date.now(), recipe }];
      return updatedFavList;
    });

    // roll back to original in case API fails
    const rollBack = () => {
      setFavouriteList(originalFavList);
    };
    if (isFavourited) {
      handleUnfavourite(userId, recipe.id).catch((err) => {
        console.error("error removing favourite: ", err);
        rollBack();
      });
    } else {
      handleAddFavourites(userId, recipe.id).catch((err) => {
        console.error("error removing favourite: ", err);
        rollBack();
      });
    }
  };

  const filterFavList = (search) => {
    const filtered = favouriteList.filter((recipe) => {
      const lowerCaseSearch = search.toLowerCase();
      return (
        recipe.recipe.title?.toLowerCase().includes(lowerCaseSearch) ||
        recipe.recipe.cuisine?.toLowerCase().includes(lowerCaseSearch) ||
        recipe.recipe.city?.toLowerCase().includes(lowerCaseSearch) ||
        recipe.recipe.ingredients?.some((ingredient) =>
          ingredient?.toLowerCase().includes(lowerCaseSearch)
        )
      );
    });
    return filtered;
  };
  const contextValue = {
    favouriteList,
    setFavouriteList,
    handleAddFavourites,
    handleUnfavourite,
    favButtonClick,
    filteredFavRecipes,
    setFilteredFavRecipes,
    filterFavList,
  };

  return (
    <FavouriteContext.Provider value={contextValue}>
      {children}
    </FavouriteContext.Provider>
  );
}
