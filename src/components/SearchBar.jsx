import { useContext } from "react";
import { SearchContext } from "../context/SearchContext";
import styles from "./AllRecipesCards.module.css";

const SearchBar = ({ disabled = false }) => {
  const { search, handleInput } = useContext(SearchContext);

  return (
    <div>
      <p className={styles.username}></p>
      <div className={styles.searchGroup}>
        <input
          className={styles.searchBar}
          placeholder="Search..."
          name="search"
          onChange={(e) => handleInput(e)}
          value={search}
          disabled={disabled}
        ></input>
      </div>
    </div>
  );
};

export default SearchBar;
