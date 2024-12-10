/** @format */

import axios from "axios";

// * create the re-usable axios instance
const client = axios.create({
  timeout: 30000,
  baseURL: "http://localhost:3001",
  withXSRFToken: true,
  withCredentials: true,
});

export default client;
