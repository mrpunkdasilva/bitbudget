export type AiRecommendation = {
  id: string;
  title: string;
  content: string;
  type: 'SAVING' | 'INVESTMENT' | 'BUDGET' | 'GENERAL';
  isRead: boolean;
  createdAt: string;
  userId: string;
};