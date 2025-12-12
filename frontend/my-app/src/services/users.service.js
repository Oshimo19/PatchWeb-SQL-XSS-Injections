// frontend/my-app/src/services/users.service.js

import { api } from "./apiClient";

export const UsersService = {
  async getAll() {
    try {
      const res = await api.get("/users");

      if (!Array.isArray(res.data)) {
        throw new Error("Invalid users response");
      }

      return res;
    } catch {
      throw new Error("USERS_FETCH_FAILED");
    }
  },

  async createUser(name, password) {
    if (
      !name ||
      !password ||
      typeof name !== "string" ||
      typeof password !== "string"
    ) {
      throw new Error("INVALID_USER_DATA");
    }

    try {
      return await api.post("/user", { name, password });
    } catch {
      throw new Error("USER_CREATE_FAILED");
    }
  },
};
