import Api from "./Api";

// Favourites end points
export const addFavourites = (userId, recipeId) => {
  return Api.post(`/favourites/${userId}/${recipeId}`, {});
};

export const getAllFavourites = (userId) => {
  return Api.get(`/favourites/${userId}`);
};

export const deleteOneFavourite = (userId, favId) => {
  return Api.delete(`/favourites/${userId}/${favId}`);
};
