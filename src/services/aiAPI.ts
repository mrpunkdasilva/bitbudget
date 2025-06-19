// Adicionar os novos métodos à API
const ignoreRecommendation = async (token: string, id: string): Promise<void> => {
  const response = await api.put(
    `/api/ai/recommendations/${id}/ignore`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const applyRecommendation = async (token: string, id: string): Promise<void> => {
  const response = await api.put(
    `/api/ai/recommendations/${id}/apply`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Exportar os novos métodos
export const aiAPI = {
  getRecommendations,
  generateRecommendation,
  markRecommendationAsRead,
  ignoreRecommendation,
  applyRecommendation,
};
