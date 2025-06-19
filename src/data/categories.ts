import { Category } from '../types/Category';

export const categories: Record<string, Category> = {
  food: { title: 'Alimentação', color: '#FF6961', expense: true },
  rent: { title: 'Aluguel', color: '#8884FF', expense: true },
  salary: { title: 'Salário', color: '#4CAF50', expense: false },
  transport: { title: 'Transporte', color: '#FFC107', expense: true },
  utilities: { title: 'Utilidades', color: '#03A9F4', expense: true },
  entertainment: { title: 'Entretenimento', color: '#9C27B0', expense: true },
  health: { title: 'Saúde', color: '#E91E63', expense: true },
  education: { title: 'Educação', color: '#3F51B5', expense: true },
  investment: { title: 'Investimento', color: '#009688', expense: false },
  other: { title: 'Outros', color: '#607D8B', expense: true },
  freelance: { title: 'Freelance', color: '#8BC34A', expense: false },
  gift: { title: 'Presente', color: '#FF9800', expense: false },
};
