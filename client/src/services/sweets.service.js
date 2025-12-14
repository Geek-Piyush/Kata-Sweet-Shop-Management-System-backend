import axios from "../utils/axios";
import cache from "../utils/cache";

const sweetsService = {
  getAllSweets: async (filters = {}) => {
    const cacheKey = `sweets_${JSON.stringify(filters)}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

    const response = await axios.get(`/sweets?${params.toString()}`);
    cache.set(cacheKey, response.data);
    return response.data;
  },

  searchSweets: async (searchParams) => {
    const cacheKey = `search_${JSON.stringify(searchParams)}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const params = new URLSearchParams();
    if (searchParams.name) params.append("name", searchParams.name);
    if (searchParams.category) params.append("category", searchParams.category);

    const response = await axios.get(`/sweets/search?${params.toString()}`);
    cache.set(cacheKey, response.data);
    return response.data;
  },

  getSweetById: async (id) => {
    const response = await axios.get(`/sweets/${id}`);
    return response.data;
  },

  createSweet: async (sweetData) => {
    const response = await axios.post("/sweets", sweetData);
    cache.clearAll(); // Clear all caches when data changes
    return response.data;
  },

  updateSweet: async (id, sweetData) => {
    const response = await axios.put(`/sweets/${id}`, sweetData);
    cache.clearAll();
    return response.data;
  },

  deleteSweet: async (id) => {
    const response = await axios.delete(`/sweets/${id}`);
    cache.clearAll();
    return response.data;
  },

  purchaseSweet: async (id, quantity) => {
    const response = await axios.post(`/sweets/${id}/purchase`, { quantity });
    cache.clearAll();
    return response.data;
  },

  restockSweet: async (id, quantity) => {
    const response = await axios.post(`/sweets/${id}/restock`, { quantity });
    cache.clearAll();
    return response.data;
  },

  uploadSweetPhoto: async (id, file) => {
    const formData = new FormData();
    formData.append("photo", file);
    const response = await axios.post(`/sweets/${id}/photo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    cache.clearAll();
    return response.data;
  },
};

export default sweetsService;
