import { createContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export const SearchContext = createContext();

export function SearchProvider({ children, setIsLoading }) {
  const location = useLocation();
  const [search, setSearch] = useState([]);
  // const [searchRecipe, setSearchRecipe] = useState([]);
  const [filteredFavRecipe, setFilteredFavRecipe] = useState([]);
  const [searching, setsearching] = useState(false);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const isNavigating = useRef(false);

  useEffect(() => {
    if (!isNavigating.current) {
      setIsLoading(true);
      setSearch("");
      setsearching(false);
      // setSearchRecipe([]);
      setIsLoading(false);
    }
    isNavigating.current = false;
  }, [location.pathname]);

  const handleCancel = () => {
    setIsLoading(true);
    // setSearchRecipe([]);
    setsearching(false);
    setIsLoading(false);
  };

  const handleInput = (e) => {
    setSearch(e.target.value.toLowerCase());
  };
  const contextValue = {
    search,
    handleInput,
    handleCancel,
    searching,
    setsearching,
    filteredFavRecipe,
    setFilteredFavRecipe,
    filteredRecipes,
    setFilteredRecipes,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}
