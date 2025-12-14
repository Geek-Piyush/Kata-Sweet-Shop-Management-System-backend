const config = {
  API_URL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  TOKEN_KEY: "sweet_shop_token",
  USER_KEY: "sweet_shop_user",
  CART_KEY: "sweet_shop_cart",
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

export default config;
