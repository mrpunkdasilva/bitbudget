export interface AiRecommendation {
  id: string;
  title: string;
  description: string;
  type: string; // 'SAVING', 'INVESTMENT', 'BUDGET', 'GENERAL'
  createdAt: string;
  isRead: boolean;
  userId: string;
}
