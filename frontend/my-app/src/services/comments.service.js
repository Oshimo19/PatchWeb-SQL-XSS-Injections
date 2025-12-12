// frontend/my-app/src/services/comments.service.js

import { api } from "./apiClient";

export const CommentsService = {
  async getAll() {
    try {
      const res = await api.get("/comments");

      // Sécurité : l’API doit toujours renvoyer un tableau
      if (!Array.isArray(res.data)) {
        throw new Error("Invalid comments response");
      }

      return res;
    } catch (err) {
      // Centralisation des erreurs
      throw new Error("COMMENTS_FETCH_FAILED");
    }
  },

  async addComment(content) {
    if (!content || typeof content !== "string") {
      throw new Error("INVALID_COMMENT");
    }

    try {
      return await api.post("/comment", { content });
    } catch (err) {
      throw new Error("COMMENT_CREATE_FAILED");
    }
  },
};
