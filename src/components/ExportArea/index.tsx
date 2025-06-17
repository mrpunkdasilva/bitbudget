import { useState, useEffect } from 'react';
import { Item } from '../../types/Item';
import { categories } from '../../data/categories';
import { formatDate } from '../../helpers/dateFilter';
import { formatCurrency } from '../../helpers/formatters';
import { useNotification } from '../NotificationManager';
import { loadPdfLibraries, pdfColors, generatePdfPreview, revokePdfPreview } from '../../utils/pdfUtils';

type Props = {
  list: Item[];
}

export const ExportArea = ({ list }: Props) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { success, error } = useNotification();

  // Limpar a prévia do PDF quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        revokePdfPreview(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  // Carregar as bibliotecas do PDF quando o formato for PDF
  useEffect(() => {
    if (exportFormat === 'pdf') {
      loadPdfLibraries();
    }
  }, [exportFormat]);

  // Gerar prévia do PDF quando o formato for PDF
  useEffect(() => {
    const generatePreview = async () => {
      if (exportFormat === 'pdf' && list.length > 0) {
        try {
          const { pdfDoc, pdfDataUri } = await generatePdfPreview(list, categories);
          setPdfDoc(pdfDoc);
          setPdfPreviewUrl(pdfDataUri);
          setShowPdfPreview(true);
        } catch (err) {
          console.error('Error generating PDF preview:', err);
          error('Erro ao gerar prévia do PDF. Tente novamente.');
        }
      } else {
        setShowPdfPreview(false);
      }
    };

    generatePreview();
  }, [exportFormat, list, error]);

  const handleExport = async () => {
    if (list.length === 0) {
      error('Não há dados para exportar');
      return;
    }

    setIsExporting(true);

    try {
      if (exportFormat === 'csv') {
        await exportToCSV();
      } else if (exportFormat === 'json') {
        await exportToJSON();
      } else if (exportFormat === 'pdf') {
        await exportToPDF();
      }

      success(`Dados exportados com sucesso no formato ${exportFormat.toUpperCase()}`);
    } catch (err) {
      console.error('Error exporting data:', err);
      error(`Erro ao exportar dados no formato ${exportFormat.toUpperCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = async () => {
    // Cabeçalho do CSV
    const headers = ['Data', 'Categoria', 'Título', 'Valor', 'Tipo'];
    
    // Converter os dados para o formato CSV
    const rows = list.map(item => [
      formatDate(item.date),
      categories.find(cat => cat.id === item.categoryId)?.title || 'Sem categoria',
      item.title,
      formatCurrency(item.value),
      item.expense ? 'Despesa' : 'Receita'
    ]);
    
    // Juntar cabeçalho e linhas
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Fazer o download do arquivo
    downloadFile(csvContent, 'bitbudget-transacoes.csv', 'text/csv;charset=utf-8;');
  };

  const exportToJSON = async () => {
    // Converter os dados para o formato JSON
    const jsonData = list.map(item => ({
      date: formatDate(item.date),
      category: categories.find(cat => cat.id === item.categoryId)?.title || 'Sem categoria',
      title: item.title,
      value: item.value,
      formattedValue: formatCurrency(item.value),
      type: item.expense ? 'Despesa' : 'Receita'
    }));
    
    // Converter para string JSON formatada
    const jsonContent = JSON.stringify(jsonData, null, 2);
    
    // Fazer o download do arquivo
    downloadFile(jsonContent, 'bitbudget-transacoes.json', 'application/json');
  };

  const exportToPDF = async () => {
    try {
      if (pdfDoc) {
        pdfDoc.save('bitbudget-transacoes.pdf');
      } else {
        throw new Error('Falha ao gerar o documento PDF');
      }
    } catch (err) {
      console.error('Error exporting PDF:', err);
      error('Erro ao exportar PDF. Tente novamente.');
    }
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    // Create a blob with the data
    const blob = new Blob([content], { type: contentType });
    
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // Append to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Release the URL object
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`export-area ${isExpanded ? 'export-area--expanded' : 'export-area--collapsed'}`}>
      <div className="export-area__header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="export-area__title">
          Exportar Dados
          <span className="export-area__toggle-icon">
            {isExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            )}
          </span>
        </div>
        <div className="export-area__subtitle">
          {list.length > 0 
            ? `${list.length} ${list.length === 1 ? 'transação disponível' : 'transações disponíveis'} para exportação`
            : 'Nenhuma transação disponível para exportação'}
        </div>
      </div>
      
      {isExpanded && (
        <div className="export-area__content">
          <div className="export-area__format-selector">
            <label className={`export-area__radio-label ${exportFormat === 'csv' ? 'export-area__radio-label--active' : ''}`}>
              <input
                type="radio"
                name="exportFormat"
                value="csv"
                checked={exportFormat === 'csv'}
                onChange={() => setExportFormat('csv')}
                className="export-area__radio"
              />
            <div className="export-area__format-icon export-area__format-icon--csv">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="M10 12v6M7 15h6"></path>
              </svg>
            </div>
            <div className="export-area__format-info">
              <span className="export-area__radio-text">CSV (Excel)</span>
              <span className="export-area__format-desc">Ideal para planilhas</span>
            </div>
          </label>
          <label className={`export-area__radio-label ${exportFormat === 'json' ? 'export-area__radio-label--active' : ''}`}>
            <input
              type="radio"
              name="exportFormat"
              value="json"
              checked={exportFormat === 'json'}
              onChange={() => setExportFormat('json')}
              className="export-area__radio"
            />
            <div className="export-area__format-icon export-area__format-icon--json">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="M8 16s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="12" x2="9.01" y2="12"></line>
                <line x1="15" y1="12" x2="15.01" y2="12"></line>
              </svg>
            </div>
            <div className="export-area__format-info">
              <span className="export-area__radio-text">JSON</span>
              <span className="export-area__format-desc">Para desenvolvedores</span>
            </div>
          </label>
          <label className={`export-area__radio-label ${exportFormat === 'pdf' ? 'export-area__radio-label--active' : ''}`}>
            <input
              type="radio"
              name="exportFormat"
              value="pdf"
              checked={exportFormat === 'pdf'}
              onChange={() => setExportFormat('pdf')}
              className="export-area__radio"
            />
            <div className="export-area__format-icon export-area__format-icon--pdf">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="M9 15L12 12 15 15"></path>
                <path d="M12 12V18"></path>
              </svg>
            </div>
            <div className="export-area__format-info">
              <span className="export-area__radio-text">PDF</span>
              <span className="export-area__format-desc">Relatório profissional</span>
            </div>
          </label>
        </div>
        
        <button 
          className={`export-area__button ${isExporting ? 'export-area__button--loading' : ''}`}
          onClick={handleExport}
          disabled={list.length === 0 || isExporting}
          title={list.length === 0 ? 'Não há dados para exportar' : `Exportar ${list.length} transações`}
        >
          <span className="export-area__button-icon">
            {isExporting ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            )}
          </span>
          <span className="export-area__button-text">
            {isExporting ? 'Exportando...' : 'Exportar Dados'}
          </span>
        </button>
      
        {/* Prévia do PDF */}
        {showPdfPreview && pdfPreviewUrl && exportFormat === 'pdf' && (
          <div className="export-area__preview">
            <div className="export-area__preview-header">
              <h3 className="export-area__preview-title">Prévia do PDF</h3>
              <button 
                className="export-area__preview-close"
                onClick={() => setShowPdfPreview(false)}
                aria-label="Fechar prévia"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="export-area__preview-content">
              <iframe 
                src={pdfPreviewUrl} 
                className="export-area__preview-iframe"
                title="Prévia do PDF"
              />
            </div>
            <div className="export-area__preview-footer">
              <button 
                className="export-area__preview-button"
                onClick={handleExport}
                disabled={isExporting}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Baixar PDF
              </button>
            </div>
          </div>
        )}
      </div>
    )}
    </div>
  );
};