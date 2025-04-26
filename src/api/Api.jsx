import axios from "axios";

// const BASE_URL = "http://localhost:8080";
const BASE_URL = "https://spring-boot-back-end-project.onrender.com";

const Api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// this will initercep all request and use 'config'.
Api.interceptors.request.use((config) => {
  // get token from local storage
  const token = localStorage.getItem("token");
  // conditionally insert the headers into the request if token exist
  // if token dont exist(not log in), will skip this.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Api;
