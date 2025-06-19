import { Item } from '../types/Item';
import { Category } from '../types/Category';
import { User } from '../types/User';
import { Web3Asset } from '../types/Web3Asset';
import { AiRecommendation } from '../types/AiRecommendation';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
  },

  login: async (
    email: string,
    password: string
  ): Promise<{ id: string; name: string; email: string; token: string }> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/auth/verify/${token}`);
    return handleResponse(response);
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    return handleResponse(response);
  },
};

// User API
export const userAPI = {
  getProfile: async (token: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  updateProfile: async (token: string, userData: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
};

// Category API
export const categoryAPI = {
  getCategories: async (token: string): Promise<Category[]> => {
    const response = await fetch(`${API_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getCategoryById: async (token: string, id: string): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  createCategory: async (token: string, category: Partial<Category>): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    return handleResponse(response);
  },

  updateCategory: async (
    token: string,
    id: string,
    category: Partial<Category>
  ): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    return handleResponse(response);
  },

  deleteCategory: async (token: string, id: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Transaction API
export const transactionAPI = {
  getTransactions: async (
    token: string,
    month?: number,
    year?: number,
    type?: string
  ): Promise<Item[]> => {
    let url = `${API_URL}/expenses`;
    const params = new URLSearchParams();

    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());
    if (type) params.append('type', type);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getTransactionById: async (token: string, id: string): Promise<Item> => {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  createTransaction: async (token: string, transaction: Partial<Item>): Promise<Item> => {
    const response = await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(transaction),
    });
    return handleResponse(response);
  },

  updateTransaction: async (
    token: string,
    id: string,
    transaction: Partial<Item>
  ): Promise<Item> => {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(transaction),
    });
    return handleResponse(response);
  },

  deleteTransaction: async (token: string, id: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getTransactionSummary: async (token: string, year?: number): Promise<any[]> => {
    let url = `${API_URL}/expenses/summary`;

    if (year) {
      url += `?year=${year}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Web3 API
export const web3API = {
  connectWallet: async (
    token: string,
    walletAddress: string
  ): Promise<{ message: string; walletAddress: string }> => {
    const response = await fetch(`${API_URL}/web3/connect-wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ walletAddress }),
    });
    return handleResponse(response);
  },

  getWalletInfo: async (token: string): Promise<{ walletAddress: string }> => {
    const response = await fetch(`${API_URL}/web3/wallet-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  syncAssets: async (token: string): Promise<{ message: string; assets: Web3Asset[] }> => {
    const response = await fetch(`${API_URL}/web3/sync-assets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getAssets: async (token: string): Promise<Web3Asset[]> => {
    const response = await fetch(`${API_URL}/web3/assets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// AI API
export const aiAPI = {
  getRecommendations: async (token: string): Promise<AiRecommendation[]> => {
    const response = await fetch(`${API_URL}/ai/recommendations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  generateRecommendation: async (token: string): Promise<AiRecommendation> => {
    const response = await fetch(`${API_URL}/ai/generate-recommendation`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  markRecommendationAsRead: async (token: string, id: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/ai/recommendations/${id}/read`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};
