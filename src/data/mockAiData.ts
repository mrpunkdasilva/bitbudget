import { AiRecommendation } from '../types/AiRecommendation';

// Dados mockados para recomendações de IA
export const mockRecommendations: AiRecommendation[] = [
  {
    id: '1',
    title: 'Reduza gastos com alimentação',
    description:
      'Seus gastos com alimentação fora de casa representam 30% do seu orçamento mensal. Considere preparar mais refeições em casa para economizar até R$ 500 por mês.',
    type: 'SAVING',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
    isRead: false,
    userId: 'user1',
  },
  {
    id: '2',
    title: 'Oportunidade de investimento em renda fixa',
    description:
      'Com base no seu perfil conservador e nas taxas atuais, recomendamos alocar R$ 1.000 em CDBs com liquidez diária. Rendimento estimado: 9.5% ao ano.',
    type: 'INVESTMENT',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
    isRead: true,
    userId: 'user1',
  },
  {
    id: '3',
    title: 'Crie um fundo de emergência',
    description:
      'Você não possui reserva para emergências. Recomendamos guardar pelo menos 6 meses de despesas (aproximadamente R$ 12.000) em uma conta de alta liquidez.',
    type: 'BUDGET',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias atrás
    isRead: false,
    userId: 'user1',
  },
  {
    id: '4',
    title: 'Diversifique seus investimentos',
    description:
      'Sua carteira está concentrada em apenas um tipo de ativo. Considere diversificar alocando 20% em renda variável para melhorar o potencial de retorno a longo prazo.',
    type: 'INVESTMENT',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 dias atrás
    isRead: true,
    userId: 'user1',
  },
  {
    id: '5',
    title: 'Revise seus serviços de assinatura',
    description:
      'Identificamos R$ 250 mensais em serviços de streaming e assinaturas que você usa pouco. Considere cancelar os menos utilizados para economizar até R$ 3.000 por ano.',
    type: 'SAVING',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 dias atrás
    isRead: false,
    userId: 'user1',
  },
];

// Função para gerar uma nova recomendação aleatória
export const generateMockRecommendation = (): AiRecommendation => {
  const types = ['SAVING', 'INVESTMENT', 'BUDGET', 'GENERAL'];
  const randomType = types[Math.floor(Math.random() * types.length)];

  const savingTitles = [
    'Economize em contas de energia',
    'Reduza gastos com transporte',
    'Otimize seus planos de telefonia',
  ];

  const investmentTitles = [
    'Invista em ETFs de baixo custo',
    'Considere títulos do tesouro',
    'Aumente sua exposição internacional',
  ];

  const budgetTitles = [
    'Implemente o método 50/30/20',
    'Revise seu orçamento mensal',
    'Automatize suas economias',
  ];

  const generalTitles = [
    'Melhore sua educação financeira',
    'Planeje sua aposentadoria',
    'Revise seus seguros',
  ];

  let title = '';
  let description = '';

  switch (randomType) {
    case 'SAVING':
      title = savingTitles[Math.floor(Math.random() * savingTitles.length)];
      description =
        'Analisamos seus gastos e identificamos uma oportunidade para economizar até 15% em suas despesas mensais com pequenas mudanças de hábito.';
      break;
    case 'INVESTMENT':
      title = investmentTitles[Math.floor(Math.random() * investmentTitles.length)];
      description =
        'Com base no seu perfil e objetivos financeiros, esta estratégia de investimento pode melhorar seus retornos a longo prazo com risco controlado.';
      break;
    case 'BUDGET':
      title = budgetTitles[Math.floor(Math.random() * budgetTitles.length)];
      description =
        'Uma melhor organização do seu orçamento pode ajudar a atingir suas metas financeiras mais rapidamente e reduzir o estresse financeiro.';
      break;
    default:
      title = generalTitles[Math.floor(Math.random() * generalTitles.length)];
      description =
        'Esta dica geral pode melhorar sua saúde financeira e ajudar a construir um futuro mais seguro para você e sua família.';
  }

  return {
    id: Date.now().toString(),
    title,
    description,
    type: randomType,
    createdAt: new Date().toISOString(),
    isRead: false,
    userId: 'user1',
  };
};
