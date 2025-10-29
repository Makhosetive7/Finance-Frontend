import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Crypto endpoints
export const cryptoAPI = {
  getTopCrypto: (limit = 50) => api.get(`/crypto/topCryptoCurrencies?limit=${limit}`),
  getCoinData: (id) => api.get(`/crypto/coin/${id}`),
  getCoinHistory: (id, days = 7) => api.get(`/crypto/coin/${id}/history?days=${days}`),
  searchCoins: (query) => api.get(`/crypto/search/${query}`),
};

// Stock endpoints
export const stocksAPI = {
  getStockQuote: (symbol) => api.get(`/stocks/quote/${symbol}`),
  getStockProfile: (symbol) => api.get(`/stocks/profile/${symbol}`),
  getStockHistory: (symbol) => api.get(`/stocks/history/${symbol}`),
  getMajorIndices: () => api.get('/stocks/major-indices'),
};

// Forex endpoints
export const forexAPI = {
  getForexRates: () => api.get('/forex/rates'),
  convertCurrency: (from, to, amount) => api.get(`/forex/convert?from=${from}&to=${to}&amount=${amount}`),
  getMajorPairs: () => api.get('/forex/major-pairs'),
};

// News endpoints
export const newsAPI = {
  getMarketNews: () => api.get('/market-news/'),
  getCryptoNews: () => api.get('/market-news/crypto'),
};

export default api;