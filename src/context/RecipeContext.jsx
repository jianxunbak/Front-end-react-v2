import { createContext, useCallback, useEffect, useState } from "react";
import {
  addOneRecipe,
  deleteOneRecipe,
  getAllRecipes,
  updateOneRecipe,
} from "../api/RecipeEndPoints";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getOneUserById } from "../api/UserEndPoints";

// Step 1: Create a context object
export const RecipeContext = createContext();

// Step 2: Set up a Context Provider
export function RecipeProvider({
  children,
  setIsEditing,
  setIsFormLoading,
  setIsRecipeLoading,
}) {
  const [allRecipes, setAllRecipes] = useState([]);
  const [userRecipesAndId, setUserRecipesAndId] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    imgSrc: "",
    title: "",
    description: "",
    ingredients: [""],
    steps: [""],
    location: "",
    latitude: 0.0,
    longitude: 0.0,
  });
  const navigate = useNavigate();
  // const skipRefresh = useRef(false);

  //get all recipes upon first mount/ page refresh
  useEffect(() => {
    const updateRecipes = async () => {
      console.log("🔁 Refreshing recipes...");
      setIsRecipeLoading(true);
      await getRecipes();
      setIsRecipeLoading(false);
    };

    updateRecipes();
  }, [location]);

  const getRecipes = useCallback(async () => {
    try {
      const response = await getAllRecipes();
      if (response.status === 200) setAllRecipes(response.data);
      return response;
    } catch (error) {
      console.error("Error getting recipes:", error);
    }
  }, []);
  const handlerDelete = async (selectedItem, recipeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (confirmDelete) {
      setIsRecipeLoading(true);
      try {
        const deletedTitle = selectedItem.title;
        const response = await deleteOneRecipe(recipeId);
        if (response.status === 204) {
          toast(`Recipe deleted: ${deletedTitle}`); // Show alert with the deleted item's title
          navigate(`/`);
          await getRecipes();
        }
      } catch (error) {
        console.error("Error deleting recipe:", error);
        alert("Failed to delete the recipe. Please try again."); // Show error alert
      } finally {
        setIsRecipeLoading(false);
      }
    }
  };

  //methods for addd and edit recipes
  const handleInput = (e, validateRealTimeField, index = null) => {
    if (!e || !e.target) return; // Avoid accessing undefined properties
    const { name, value } = e.target;
    validateRealTimeField(name, value, index);

    // update the newRecipe state
    setNewRecipe((prevRecipe) => {
      const updated = { ...prevRecipe };
      // Handle array fields like 'ingredients' and 'steps'
      if (name === "ingredients" || name === "steps") {
        const updatedArray = [...updated[name]]; // Create a copy of the array
        if (index !== null) {
          updatedArray[index] = value; // Update the specific index
        }
        updated[name] = updatedArray; // Update the array in state
      } else {
        // for nonarray fields
        updated[name] = value;
      }
      return updated;
    });
  };

  const handleCancel = () => {
    setIsEditing(true);
    setNewRecipe({
      imgSrc: "",
      title: "",
      description: "",
      ingredients: [""],
      steps: [""],
      location: "",
      latitude: 0.0,
      longitude: 0.0,
    });
    navigate("/");
    setIsEditing(false);
  };
  const handleAddField = (field) => {
    setNewRecipe((prevRecipe) => ({
      ...prevRecipe,
      [field]: [...prevRecipe[field], ""],
    }));
  };

  const handleMinusField = (field, itemToRemove) => {
    setNewRecipe((prevRecipe) => ({
      ...prevRecipe,
      [field]: prevRecipe[field].filter((_, index) => index != itemToRemove),
    }));
  };

  const handleAddRecipe = async (e, validationOnSubmit, userId) => {
    e.preventDefault();
    const results = validationOnSubmit(e, newRecipe);
    if (!results) {
      setIsFormLoading(false);
      return;
    }
    try {
      setIsFormLoading(true);
      const response = await addOneRecipe(userId, newRecipe);
      if (response.status === 201) {
        const updatedRecipes = await getRecipes();
        toast(`Recipe added: ${newRecipe.title}`);
        const createdRecipeId = updatedRecipes.data.find(
          (item) => item.title === newRecipe.title
        ).id;
        if (!createdRecipeId) throw new Error("Newly added recipe not found");
        navigate(`/recipe/${createdRecipeId}`);
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("Error adding recipe:", error);
    } finally {
      setIsFormLoading(false);

      setNewRecipe({
        imgSrc: "",
        title: "",
        description: "",
        ingredients: [""],
        steps: [""],
        location: "",
        latitude: 0.0,
        longitude: 0.0,
      });
    }
  };
  const handleEditRecipe = async () => {
    try {
      setIsEditing(true);
      const response = await updateOneRecipe(newRecipe.id, newRecipe);
      if (response.status === 200) {
        await getRecipes();
        toast(`Recipe edited: ${newRecipe.title}`);
        navigate(`/recipe/${newRecipe.id}`);
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
    } finally {
      setNewRecipe({
        imgSrc: "",
        title: "",
        description: "",
        ingredients: [""],
        steps: [""],
        location: "",
        latitude: 0.0,
        longitude: 0.0,
      });
      setIsEditing(false);
    }
  };

  const handleGetOneUserRecipes = async (userId) => {
    try {
      setUserRecipesAndId([]); // 👈 Clear the old data
      const response = await getOneUserById(userId);
      if (response.status === 200) {
        setUserRecipesAndId(response.data);
      }
    } catch (error) {
      console.error("Error getting recipe:", error);
    }
  };

  const contextValue = {
    getRecipes,
    allRecipes,
    newRecipe,
    setNewRecipe,
    setAllRecipes,
    handlerDelete,
    handleCancel,
    handleAddField,
    handleMinusField,
    handleAddRecipe,
    handleEditRecipe,
    handleInput,
    // handleNavigateToUserRecipe,
    userRecipesAndId,
    handleGetOneUserRecipes,
  };

  return (
    <RecipeContext.Provider value={contextValue}>
      {children}
    </RecipeContext.Provider>
  );
}
