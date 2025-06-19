import { Item } from '../types/Item';

// Get current date
const currentDate = new Date();

// Create dates for this month
const thisMonth = currentDate.getMonth();
const thisYear = currentDate.getFullYear();

// Sample data for the current month
export const items: Item[] = [
  {
    date: new Date(thisYear, thisMonth, 5),
    category: 'salary',
    title: 'Salário',
    value: 4500,
  },
  {
    date: new Date(thisYear, thisMonth, 10),
    category: 'rent',
    title: 'Aluguel Apt',
    value: 1200,
  },
  {
    date: new Date(thisYear, thisMonth, 12),
    category: 'food',
    title: 'Supermercado',
    value: 450.75,
  },
  {
    date: new Date(thisYear, thisMonth, 15),
    category: 'utilities',
    title: 'Conta de Luz',
    value: 195.42,
  },
  {
    date: new Date(thisYear, thisMonth, 16),
    category: 'utilities',
    title: 'Conta de Água',
    value: 87.9,
  },
  {
    date: new Date(thisYear, thisMonth, 18),
    category: 'transport',
    title: 'Combustível',
    value: 250,
  },
  {
    date: new Date(thisYear, thisMonth, 20),
    category: 'health',
    title: 'Farmácia',
    value: 123.75,
  },
  {
    date: new Date(thisYear, thisMonth, 22),
    category: 'entertainment',
    title: 'Cinema',
    value: 65,
  },
  {
    date: new Date(thisYear, thisMonth, 25),
    category: 'freelance',
    title: 'Projeto Website',
    value: 1500,
  },
];
