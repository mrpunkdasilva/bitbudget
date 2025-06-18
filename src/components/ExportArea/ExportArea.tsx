import React, { useState } from 'react';
import { Item } from '../../types/Item';
import { Category } from '../../types/Category';
import { Web3Asset } from '../../types/Web3Asset';
import { AiRecommendation } from '../../types/AiRecommendation';
import { ExportFormat, ExportType } from '../../services/export/types';
import { useExport } from '../../hooks/useExport';
// Estilos são importados via src/styles/index.scss
// import './styles.scss';

type Props = {
  list: Item[];
  categories?: Record<string, Category>;
  assets?: Web3Asset[];
  recommendations?: AiRecommendation[];
};

export const ExportArea = ({ 
  list, 
  categories = {}, 
  assets = [], 
  recommendations = [] 
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [exportType, setExportType] = useState<ExportType>('transactions');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  
  const { exportData, isExporting } = useExport({
    transactions: list,
    categories,
    assets,
    recommendations
  });

  const handleExport = async () => {
    await exportData(exportFormat, exportType);
  };

  const getDataCount = (type: ExportType): number => {
    switch (type) {
      case 'transactions':
        return list.length;
      case 'crypto':
        return assets.length;
      case 'recommendations':
        return recommendations.length;
      default:
        return 0;
    }
  };

  return (
    <div className="export-area">
      <div 
        className="export-area__header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="export-area__title">
          Exportar Dados
          <span className="export-area__toggle-icon">
            {isExpanded ? '🔽' : '▶️'}
          </span>
        </div>
        <div className="export-area__subtitle">
          Exporte seus dados em diferentes formatos
        </div>
      </div>
      
      {isExpanded && (
        <div className="export-area__content">
          <div className="export-area__options">
            <div className="export-area__option-group">
              <label>Tipo de Dados:</label>
              <select 
                value={exportType} 
                onChange={(e) => setExportType(e.target.value as ExportType)}
                disabled={isExporting}
              >
                <option value="transactions">
                  Transações ({getDataCount('transactions')})
                </option>
                <option value="crypto">
                  Ativos Cripto ({getDataCount('crypto')})
                </option>
                <option value="recommendations">
                  Recomendações ({getDataCount('recommendations')})
                </option>
              </select>
            </div>

            <div className="export-area__option-group">
              <label>Formato:</label>
              <select 
                value={exportFormat} 
                onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                disabled={isExporting}
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
          </div>

          <button 
            className="export-area__export-button"
            onClick={handleExport}
            disabled={isExporting || getDataCount(exportType) === 0}
          >
            {isExporting ? 'Exportando...' : 'Exportar'}
          </button>

          {getDataCount(exportType) === 0 && (
            <p className="export-area__no-data">
              Nenhum dado disponível para exportação.
            </p>
          )}
        </div>
      )}
    </div>
  );
};