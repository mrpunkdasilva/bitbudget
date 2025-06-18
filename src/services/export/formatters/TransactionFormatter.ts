import { Item } from '../../../types/Item';
import { Category } from '../../../types/Category';
import { formatDate } from '../../../helpers/dateFilter';
import { formatCurrency } from '../../../helpers/formatters';

export interface FormattedTransaction {
  Data: string;
  Categoria: string;
  Título: string;
  Valor: string;
}

export class TransactionFormatter {
  static format(
    transactions: Item[], 
    categories: Record<string, Category>
  ): FormattedTransaction[] {
    return transactions.map(transaction => ({
      Data: formatDate(transaction.date),
      Categoria: this.getCategoryName(transaction.category, categories),
      Título: transaction.title,
      Valor: formatCurrency(transaction.value)
    }));
  }

  private static getCategoryName(
    categoryKey: string, 
    categories: Record<string, Category>
  ): string {
    const category = categories[categoryKey];
    return category ? category.title : 'Desconhecida';
  }
}