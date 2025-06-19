/**
 * Formata um valor numérico para o formato de moeda brasileira (R$)
 * @param value Valor a ser formatado
 * @returns String formatada (ex: "R$ 1.234,56")
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

/**
 * Formata um valor numérico para o formato percentual
 * @param value Valor a ser formatado (0.1 = 10%)
 * @returns String formatada (ex: "10%")
 */
export const formatPercentage = (value: number): string => {
  return (value * 100).toFixed(1) + '%';
};

/**
 * Trunca um texto longo adicionando reticências
 * @param text Texto a ser truncado
 * @param maxLength Tamanho máximo (padrão: 25)
 * @returns Texto truncado com reticências se necessário
 */
export const truncateText = (text: string, maxLength: number = 25): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};
