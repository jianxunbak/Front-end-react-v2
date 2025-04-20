import Api from "./Api";

// User end points
export const addNewUser = (user) => {
  return Api.post(`/users`, user);
};

export const getAllUsers = () => {
  return Api.get(`/users`);
};

export const getOneUserById = (userId) => {
  return Api.get(`/users/${userId}`);
};

export const updateUserDetails = (userId, userDetails) => {
  return Api.put(`/users/${userId}`, userDetails);
};

export const updateUserPassword = (userId, userPassword) => {
  return Api.put(`/users/${userId}/password`, userPassword);
};

export const deleteUser = (userId) => {
  return Api.delete(`/users/${userId}`);
};
