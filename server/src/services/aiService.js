// Simple rule-based AI recommendation system
// In a real application, you might use a more sophisticated AI model or API

/**
 * Generate financial advice based on user's financial data
 * @param {Object} financialContext - User's financial data
 * @returns {Object} - AI recommendation
 */
export const generateFinancialAdvice = async (financialContext) => {
  const { totalIncome, totalExpenses, balance, savingsRate, categoryBreakdown } = financialContext;
  
  // Initialize recommendation
  let recommendation = {
    title: '',
    content: '',
    type: 'GENERAL'
  };
  
  // Check savings rate
  if (savingsRate < 0) {
    recommendation.title = 'Atenção: Gastos Excedendo Receita';
    recommendation.content = `Nos últimos 3 meses, seus gastos excederam sua receita em R$${Math.abs(balance).toFixed(2)}. Recomendo revisar suas despesas, especialmente nas categorias de maior gasto, e criar um orçamento para evitar dívidas.`;
    recommendation.type = 'BUDGET';
  } else if (savingsRate < 10) {
    recommendation.title = 'Aumente sua Taxa de Poupança';
    recommendation.content = `Sua taxa de poupança atual é de ${savingsRate.toFixed(1)}%, o que está abaixo do recomendado de 20%. Tente aumentar suas economias reduzindo gastos não essenciais ou buscando fontes adicionais de renda.`;
    recommendation.type = 'SAVING';
  } else if (savingsRate > 50) {
    recommendation.title = 'Considere Investir Mais';
    recommendation.content = `Sua taxa de poupança de ${savingsRate.toFixed(1)}% é excelente! Com esse excedente, considere diversificar seus investimentos para fazer seu dinheiro trabalhar para você.`;
    recommendation.type = 'INVESTMENT';
  } else {
    recommendation.title = 'Seu Orçamento Está Equilibrado';
    recommendation.content = `Parabéns por manter um orçamento equilibrado com uma taxa de poupança de ${savingsRate.toFixed(1)}%. Continue monitorando seus gastos e considere estabelecer metas financeiras específicas para o futuro.`;
    recommendation.type = 'GENERAL';
  }
  
  // Analyze category spending
  const expenseCategories = Object.entries(categoryBreakdown)
    .filter(([_, data]) => data.isExpense)
    .sort((a, b) => b[1].total - a[1].total);
  
  if (expenseCategories.length > 0) {
    const [topCategory, topCategoryData] = expenseCategories[0];
    const percentOfExpenses = (topCategoryData.total / totalExpenses) * 100;
    
    if (percentOfExpenses > 40) {
      recommendation.content += `\n\nObservei que ${topCategoryData.title} representa ${percentOfExpenses.toFixed(1)}% de suas despesas totais. Considere analisar se há oportunidades para reduzir gastos nessa categoria.`;
    }
  }
  
  // Add personalized tip based on financial situation
  const tips = [
    'Estabeleça um fundo de emergência com 3-6 meses de despesas.',
    'Considere automatizar suas economias com transferências programadas.',
    'Revise suas assinaturas mensais e cancele as que você não usa com frequência.',
    'Ao fazer compras grandes, pesquise preços e espere por promoções.',
    'Considere renegociar dívidas com taxas de juros altas.',
    'Invista em sua educação financeira lendo livros ou participando de cursos online gratuitos.',
    'Estabeleça metas financeiras específicas, mensuráveis, atingíveis, relevantes e com prazo definido (SMART).',
    'Diversifique seus investimentos para reduzir riscos.'
  ];
  
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  recommendation.content += `\n\nDica: ${randomTip}`;
  
  return recommendation;
};