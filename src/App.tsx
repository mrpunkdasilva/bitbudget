import { useState, useEffect, useCallback } from 'react';
import { Item } from './types/Item';
import { categories } from './data/categories';
import { items } from './data/items'; // Importando items
import { getCurrentMonth, filterListByMonth } from './helpers/dateFilter';
import { TableArea } from './components/TableArea';
import { InfoArea } from './components/InfoArea';
import { InputArea } from './components/InputArea';
import { ChartArea } from './components/ChartArea';
import { Footer } from './components/Footer';
import { useNotification } from './components/NotificationManager';
import { FilterArea, FilterOptions } from './components/FilterArea';
import { ExportArea } from './components/ExportArea';
import { WalletConnect } from './components/Web3/WalletConnect';
import { AssetsList } from './components/Web3/AssetsList';
import { CryptoPriceCards } from './components/Web3/CryptoPriceCards';
import { PortfolioStats } from './components/Web3/PortfolioStats';
import { AiAdvisorButton } from './components/AiAdvisor/AiAdvisorButton';
import { RecommendationsList } from './components/AiAdvisor/RecommendationsList';
import { SmartInsights } from './components/SmartInsights';
import { SmartAlerts } from './components/SmartAlerts';
import { FinancialSummary } from './components/FinancialSummary';
import { QuickTips } from './components/QuickTips';
import { useAi } from './contexts/AiContext';

const App = () => {
  const [list, setList] = useState(items);
  const [filteredList, setFilteredList] = useState<Item[]>([]);
  const [displayList, setDisplayList] = useState<Item[]>([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    searchText: '',
    category: '',
    minValue: null,
    maxValue: null,
    startDate: null,
    endDate: null,
  });
  const [web3Expanded, setWeb3Expanded] = useState(false);
  const [aiExpanded, setAiExpanded] = useState(false);
  const { addNotification, NotificationContainer, success, error, info } = useNotification();
  const { isAiAdvisorOpen } = useAi();

  // Filter by month first
  useEffect(() => {
    setFilteredList(filterListByMonth(list, currentMonth));
  }, [list, currentMonth]);

  // Apply additional filters
  const applyFilters = useCallback((items: Item[], filters: FilterOptions) => {
    return items.filter(item => {
      // Text search filter
      if (
        filters.searchText &&
        !item.title.toLowerCase().includes(filters.searchText.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (filters.category && item.category !== filters.category) {
        return false;
      }

      // Value range filters
      if (filters.minValue !== null && item.value < filters.minValue) {
        return false;
      }

      if (filters.maxValue !== null && item.value > filters.maxValue) {
        return false;
      }

      // Date range filters
      if (filters.startDate !== null) {
        const itemDate = new Date(item.date);
        const startDate = new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0);

        if (itemDate < startDate) {
          return false;
        }
      }

      if (filters.endDate !== null) {
        const itemDate = new Date(item.date);
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);

        if (itemDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }, []);

  // Apply additional filters to the month-filtered list
  useEffect(() => {
    const result = applyFilters(filteredList, activeFilters);
    setDisplayList(result);
  }, [filteredList, activeFilters, applyFilters]);

  // Calculate income and expense based on the filtered list
  useEffect(() => {
    let incomeCount = 0;
    let expenseCount = 0;

    for (let i in displayList) {
      if (categories[displayList[i].category].expense) {
        expenseCount += displayList[i].value;
      } else {
        incomeCount += displayList[i].value;
      }
    }

    setIncome(incomeCount);
    setExpense(expenseCount);
  }, [displayList]);

  // Mostrar mensagem de boas-vindas quando o app carrega
  useEffect(() => {
    info('Bem-vindo ao BitBudget! Gerencie suas finanças com estilo.', 5000);
  }, [info]);

  const handleMonthChange = (newMonth: string) => {
    setCurrentMonth(newMonth);
  };

  const handleAddItem = (item: Item) => {
    let newList = [...list];
    newList.push(item);
    setList(newList);

    // Mostrar notificação de sucesso
    const isExpense = categories[item.category].expense;
    success(`${isExpense ? 'Despesa' : 'Receita'} "${item.title}" adicionada com sucesso!`, 3000);
  };

  const handleDeleteItem = (item: Item) => {
    // Encontrar o índice do item na lista
    const itemIndex = list.findIndex(
      i =>
        i.date.getTime() === item.date.getTime() &&
        i.category === item.category &&
        i.title === item.title &&
        i.value === item.value
    );

    if (itemIndex !== -1) {
      // Criar uma nova lista sem o item
      const newList = [...list];
      newList.splice(itemIndex, 1);
      setList(newList);

      // Mostrar notificação de sucesso
      const isExpense = categories[item.category].expense;
      success(`${isExpense ? 'Despesa' : 'Receita'} "${item.title}" excluída com sucesso!`, 3000);
    } else {
      // Mostrar notificação de erro
      error('Erro ao excluir item. Tente novamente.');
    }
  };

  const handleFilterChange = (filters: FilterOptions) => {
    setActiveFilters(filters);

    // Show notification when filters are applied
    const hasActiveFilters =
      filters.searchText ||
      filters.category ||
      filters.minValue !== null ||
      filters.maxValue !== null ||
      filters.startDate !== null ||
      filters.endDate !== null;

    if (hasActiveFilters) {
      info('Filtros aplicados às transações.', 2000);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header__logo">
          <img src="/favicon.svg" alt="BitBudget Logo" className="header__logo-img" />
        </div>
        <h1 className="header__text">BitBudget</h1>
        <div className="header__subtitle">Sistema Financeiro</div>
      </div>
      <div className="body">
        {/* Alertas Inteligentes */}
        <SmartAlerts />

        {/* Resumo Financeiro Inteligente */}
        <FinancialSummary />

        <InfoArea
          currentMonth={currentMonth}
          onMonthChange={handleMonthChange}
          income={income}
          expense={expense}
        />

        {/* Insights Inteligentes */}
        <SmartInsights />

        {/* Dicas Rápidas */}
        <QuickTips />

        <ChartArea income={income} expense={expense} list={displayList} categories={categories} />

        <InputArea onAdd={handleAddItem} />

        <FilterArea onFilterChange={handleFilterChange} />

        <ExportArea list={displayList} categories={categories} />

        {/* Seção de Criptomoedas */}
        <div className="web3-section">
          <div className="web3-section__header" onClick={() => setWeb3Expanded(!web3Expanded)}>
            <div className="web3-section__title">
              Ativos Cripto
              <span className="web3-section__toggle-icon">
                {web3Expanded ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                )}
              </span>
            </div>
            <div className="web3-section__subtitle">
              Conecte sua carteira para gerenciar seus ativos digitais
            </div>
          </div>

          {web3Expanded && (
            <div className="web3-container">
              <div className="web3-left-column">
                <WalletConnect />
                <PortfolioStats />
              </div>
              <div className="web3-right-column">
                <CryptoPriceCards />
                <AssetsList />
              </div>
            </div>
          )}
        </div>

        {/* Seção de Recomendações IA */}
        <div className="ai-section">
          <div className="ai-section__header" onClick={() => setAiExpanded(!aiExpanded)}>
            <div className="ai-section__title">
              <span>
                💡 Recomendações Inteligentes
              </span>
            </div>
            <div className="ai-section__subtitle">
              Dicas personalizadas para melhorar suas finanças
            </div>
          </div>

          {aiExpanded && <RecommendationsList />}
        </div>

        {/* Botão flutuante de IA */}
        <AiAdvisorButton />

        <TableArea list={displayList} onDeleteItem={handleDeleteItem} />
      </div>

      <Footer />
      <NotificationContainer />
    </div>
  );
};

export default App;
