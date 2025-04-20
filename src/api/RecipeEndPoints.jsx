import Api from "./Api";

// Recipe end points
export const addOneRecipe = (userId, newRecipe) => {
  return Api.post(`/recipe/${userId}`, newRecipe);
};

export const getAllRecipes = () => {
  return Api.get(`/recipe`);
};

export const getOneRecipe = (recipeId) => {
  return Api.get(`/recipe/${recipeId}`);
};

export const getAllUserRecipes = (userId) => {
  return Api.get(`/recipe/${userId}/userRecipes`);
};

export const updateOneRecipe = (recipeId, updatedRecipe) => {
  return Api.put(`/recipe/${recipeId}`, updatedRecipe);
};

export const deleteOneRecipe = (recipeId) => {
  return Api.delete(`/recipe/${recipeId}`);
};
