// frontend/my-app/src/services/apiClient.js

import axios from "axios";
import { API_URL } from "../config/env";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // évite les appels bloquants
});

// Interceptor de réponse : normalisation des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Erreur réseau (backend down, timeout, CORS, etc.)
    if (!error.response) {
      return Promise.reject(new Error("NETWORK_ERROR"));
    }

    const status = error.response.status;

    // Normalisation simple par statut HTTP
    if (status === 400) {
      return Promise.reject(new Error("BAD_REQUEST"));
    }

    if (status === 404) {
      return Promise.reject(new Error("NOT_FOUND"));
    }

    if (status === 415) {
      return Promise.reject(new Error("UNSUPPORTED_MEDIA_TYPE"));
    }

    if (status >= 500) {
      return Promise.reject(new Error("SERVER_ERROR"));
    }

    return Promise.reject(new Error("API_ERROR"));
  }
);
