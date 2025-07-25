import { API_URL } from './api';
import { AiRecommendation } from '../types/AiRecommendation';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

const getRecommendations = async (token: string): Promise<AiRecommendation[]> => {
  const response = await fetch(`${API_URL}/ai/recommendations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

const generateRecommendation = async (token: string): Promise<AiRecommendation> => {
  const response = await fetch(`${API_URL}/ai/generate-recommendation`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

const markRecommendationAsRead = async (token: string, id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/ai/recommendations/${id}/read`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

const ignoreRecommendation = async (token: string, id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/ai/recommendations/${id}/ignore`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

const applyRecommendation = async (token: string, id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/ai/recommendations/${id}/apply`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const aiAPI = {
  getRecommendations,
  generateRecommendation,
  markRecommendationAsRead,
  ignoreRecommendation,
  applyRecommendation,
};
