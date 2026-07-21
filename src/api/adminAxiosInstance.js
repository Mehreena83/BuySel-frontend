// import axios from "axios";

// const adminAxiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// adminAxiosInstance.interceptors.request.use((config) => {
//   const adminToken = localStorage.getItem("adminToken");

//   if (adminToken) {
//     config.headers.Authorization = `Token ${adminToken}`;
//   }

//   return config;
// });

// export default adminAxiosInstance;


import axios from "axios";

const adminAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

adminAxiosInstance.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");

    if (adminToken) {
      config.headers.Authorization = `Token ${adminToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default adminAxiosInstance;