import Api from "./Api";

// Authentication end points
export const generateToken = (userDetails) => {
  return Api.post(`/auth/generateToken`, userDetails);
};

export const validateToken = () => {
  return Api.post(`/auth/validateToken`, {});
};
