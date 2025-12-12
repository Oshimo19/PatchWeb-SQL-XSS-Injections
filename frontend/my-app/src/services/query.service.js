// frontend/my-app/src/services/query.service.js

import { api } from "./apiClient";

export const QueryService = {
  findUserById: (id) => api.post("/query", { id }),
};
