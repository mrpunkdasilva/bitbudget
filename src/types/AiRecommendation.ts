export interface AiRecommendation {
  id: string;
  userId: string;
  title: string;
  description?: string;
  content?: string;
  type: string;
  createdAt: string;
  isRead: boolean;
  isApplied?: boolean;
}
