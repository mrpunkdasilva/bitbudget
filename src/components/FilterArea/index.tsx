import { useState, useEffect } from 'react';
import { categories } from '../../data/categories';

type Props = {
  onFilterChange: (filters: FilterOptions) => void;
}

export type FilterOptions = {
  searchText: string;
  category: string;
  minValue: number | null;
  maxValue: number | null;
  startDate: Date | null;
  endDate: Date | null;
}

export const FilterArea = ({ onFilterChange }: Props) => {
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('');
  const [minValue, setMinValue] = useState<string>('');
  const [maxValue, setMaxValue] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryKeys: string[] = Object.keys(categories);

  useEffect(() => {
    // Convert string values to appropriate types for the filter
    const filters: FilterOptions = {
      searchText,
      category,
      minValue: minValue ? parseFloat(minValue) : null,
      maxValue: maxValue ? parseFloat(maxValue) : null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null
    };

    onFilterChange(filters);
  }, [searchText, category, minValue, maxValue, startDate, endDate, onFilterChange]);

  const clearFilters = () => {
    setSearchText('');
    setCategory('');
    setMinValue('');
    setMaxValue('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="filter-area">
      <div className="filter-area__header">
        <div className="filter-area__title">Filtrar Transações</div>
        <button 
          className="filter-area__toggle-button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
      </div>

      {isExpanded && (
        <div className="filter-area__content">
          <div className="filter-area__row">
            <div className="filter-area__field">
              <label className="filter-area__label">
                <div className="filter-area__label-text">Buscar por texto</div>
                <input 
                  type="text" 
                  className="filter-area__input"
                  value={searchText} 
                  onChange={e => setSearchText(e.target.value)}
                  placeholder="Buscar por título..."
                />
              </label>
            </div>

            <div className="filter-area__field">
              <label className="filter-area__label">
                <div className="filter-area__label-text">Categoria</div>
                <select 
                  className="filter-area__select"
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="">Todas as categorias</option>
                  {categoryKeys.map((key, index) => (
                    <option key={index} value={key}>{categories[key].title}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="filter-area__row">
            <div className="filter-area__field">
              <label className="filter-area__label">
                <div className="filter-area__label-text">Valor Mínimo</div>
                <input 
                  type="number" 
                  className="filter-area__input"
                  value={minValue} 
                  onChange={e => setMinValue(e.target.value)}
                  placeholder="R$ 0,00"
                  min="0"
                  step="0.01"
                />
              </label>
            </div>

            <div className="filter-area__field">
              <label className="filter-area__label">
                <div className="filter-area__label-text">Valor Máximo</div>
                <input 
                  type="number" 
                  className="filter-area__input"
                  value={maxValue} 
                  onChange={e => setMaxValue(e.target.value)}
                  placeholder="Sem limite"
                  min="0"
                  step="0.01"
                />
              </label>
            </div>
          </div>

          <div className="filter-area__row">
            <div className="filter-area__field">
              <label className="filter-area__label">
                <div className="filter-area__label-text">Data Inicial</div>
                <input 
                  type="date" 
                  className="filter-area__input"
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)}
                />
              </label>
            </div>

            <div className="filter-area__field">
              <label className="filter-area__label">
                <div className="filter-area__label-text">Data Final</div>
                <input 
                  type="date" 
                  className="filter-area__input"
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="filter-area__actions">
            <button 
              className="filter-area__clear-button"
              onClick={clearFilters}
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};