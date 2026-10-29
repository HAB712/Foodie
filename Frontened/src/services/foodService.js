import api from "../api/axios";

/* ---------------- Categories ---------------- */

export const getAllCategories = async () => {
  const response = await api.get("/api/categories");
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await api.get(`/api/categories/${id}`);
  return response.data;
};

export const createCategory = async (formData) => {
  const response = await api.post("/api/categories", formData);
  return response.data;
};

export const updateCategory = async (id, formData) => {
  const response = await api.put(`/api/categories/${id}`, formData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/api/categories/${id}`);
  return response.data;
};

/* ---------------- Foods ---------------- */

export const getAllFoods = async () => {
  const response = await api.get("/api/foods");
  return response.data;
};

export const getFoodById = async (id) => {
  const response = await api.get(`/api/foods/${id}`);
  return response.data;
};

export const createFood = async (formData) => {
  const response = await api.post("/api/foods", formData);
  return response.data;
};

export const updateFood = async (id, formData) => {
  const response = await api.put(`/api/foods/${id}`, formData);
  return response.data;
};

export const deleteFood = async (id) => {
  const response = await api.delete(`/api/foods/${id}`);
  return response.data;
};
