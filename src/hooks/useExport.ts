import { useState } from 'react';
import { ExportService } from '../services/export/ExportService';
import { ExportFormat, ExportType } from '../services/export/types';
import { Item } from '../types/Item';
import { Category } from '../types/Category';
import { Web3Asset } from '../types/Web3Asset';
import { AiRecommendation } from '../types/AiRecommendation';
import { TransactionFormatter } from '../services/export/formatters/TransactionFormatter';
import { Web3AssetFormatter } from '../services/export/formatters/Web3AssetFormatter';
import { RecommendationFormatter } from '../services/export/formatters/RecommendationFormatter';
import { useNotification } from '../components/NotificationManager';

interface UseExportProps {
  transactions?: Item[];
  categories?: Record<string, Category>;
  assets?: Web3Asset[];
  recommendations?: AiRecommendation[];
}

export const useExport = ({
  transactions = [],
  categories = {},
  assets = [],
  recommendations = []
}: UseExportProps = {}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { success, error } = useNotification();
  const exportService = new ExportService();

  const exportData = async (format: ExportFormat, type: ExportType) => {
    try {
      setIsExporting(true);
      
      let formattedData: any[] = [];
      
      switch (type) {
        case 'transactions':
          formattedData = TransactionFormatter.format(transactions, categories);
          break;
        case 'crypto':
          formattedData = Web3AssetFormatter.format(assets);
          break;
        case 'recommendations':
          formattedData = RecommendationFormatter.format(recommendations);
          break;
        default:
          throw new Error(`Tipo de exportação não suportado: ${type}`);
      }

      await exportService.export({
        format,
        type,
        data: formattedData
      });

      success(`${type} exportado com sucesso!`);
    } catch (err) {
      console.error('Export error:', err);
      error(`Erro ao exportar ${type}. Tente novamente.`);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportData,
    isExporting
  };
};