import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL + "/api"
    : "https://odoo-hackathon-ccvz.onrender.com/api" // ✅ fallback
});

export default API;
