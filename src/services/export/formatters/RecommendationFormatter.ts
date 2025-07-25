import { AiRecommendation } from '../../../types/AiRecommendation';

export interface FormattedRecommendation {
  Título: string;
  Tipo: string;
  Conteúdo: string | undefined;
  'Data de Criação': string;
  Lida: string;
}

export class RecommendationFormatter {
  static format(recommendations: AiRecommendation[]): FormattedRecommendation[] {
    return recommendations.map(rec => ({
      Título: rec.title,
      Tipo: this.getTypeLabel(rec.type),
      Conteúdo: rec.content,
      'Data de Criação': new Date(rec.createdAt).toLocaleString('pt-BR'),
      Lida: rec.isRead ? 'Sim' : 'Não',
    }));
  }

  private static getTypeLabel(type: string): string {
    const typeMap = {
      SAVING: 'Economia',
      INVESTMENT: 'Investimento',
      BUDGET: 'Orçamento',
      GENERAL: 'Geral',
    };

    return typeMap[type as keyof typeof typeMap] || type;
  }
}
