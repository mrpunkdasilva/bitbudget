import React, { useState } from 'react';
import { Item } from '../../types/Item';
import { Category } from '../../types/Category';
import { formatDate } from '../../helpers/dateFilter';
import { formatCurrency } from '../../helpers/formatters';
import { Web3Asset } from '../../types/Web3Asset';
import { AiRecommendation } from '../../types/AiRecommendation';
import { useNotification } from '../NotificationManager';
import { categories } from '../../data/categories';

type Props = {
  list: Item[];
  categories?: Record<string, Category>;
  assets?: Web3Asset[];
  recommendations?: AiRecommendation[];
};

export const ExportArea = ({ 
  list, 
  categories: propCategories, 
  assets = [], 
  recommendations = [] 
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [exportType, setExportType] = useState<'transactions' | 'crypto' | 'recommendations'>('transactions');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const { success, error } = useNotification();
  
  // Use categories from props if provided, otherwise use the default categories
  const categoriesData = propCategories || categories;

  // Helper function to get category name by key
  const getCategoryName = (categoryKey: string): string => {
    const category = categoriesData[categoryKey];
    return category ? category.title : 'Desconhecida';
  };

  // Export transactions to CSV
  const exportTransactionsToCSV = () => {
    try {
// Create CSV header
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Data,Categoria,Título,Valor\n";
      
      // Add each transaction
      list.forEach(item => {
        const formattedDate = formatDate(item.date);
        const categoryName = getCategoryName(item.category);
        const formattedValue = item.value.toString().replace('.', ',');
        
        csvContent += `${formattedDate},${categoryName},${item.title},${formattedValue}\n`;
      });
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `transacoes_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      document.body.removeChild(link);
      success("Transações exportadas com sucesso!");
      setIsExporting(false);
    } catch (err) {
      console.error("Erro ao exportar transações:", err);
      error("Erro ao exportar transações. Tente novamente.");
      setIsExporting(false);
    }
  };

  // Export crypto assets to CSV
  const exportCryptoToCSV = () => {
    try {
      // Create CSV header
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Nome,Símbolo,Saldo,Tipo de Token,Rede,Última Atualização\n";
      
      // Add each asset
      assets.forEach(asset => {
        const lastUpdated = new Date(asset.lastUpdated).toLocaleString();
        
        csvContent += `${asset.name},${asset.symbol},${asset.balance},${asset.tokenType},${asset.network},${lastUpdated}\n`;
      });
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `ativos_cripto_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      document.body.removeChild(link);
      success("Ativos cripto exportados com sucesso!");
      setIsExporting(false);
    } catch (err) {
      console.error("Erro ao exportar ativos cripto:", err);
      error("Erro ao exportar ativos cripto. Tente novamente.");
      setIsExporting(false);
    }
  };

  // Export recommendations to CSV
  const exportRecommendationsToCSV = () => {
    try {
      // Create CSV header
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Título,Tipo,Conteúdo,Data de Criação,Lida\n";
      
      // Add each recommendation
      recommendations.forEach(rec => {
        const createdAt = new Date(rec.createdAt).toLocaleString();
        const content = rec.content.replace(/"/g, '""'); // Escape quotes
        
        csvContent += `"${rec.title}","${rec.type}","${content}","${createdAt}",${rec.isRead ? 'Sim' : 'Não'}\n`;
      });
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `recomendacoes_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      document.body.removeChild(link);
      success("Recomendações exportadas com sucesso!");
      setIsExporting(false);
    } catch (err) {
      console.error("Erro ao exportar recomendações:", err);
      error("Erro ao exportar recomendações. Tente novamente.");
      setIsExporting(false);
      throw err; // Propagar o erro para ser capturado pelo handleExport
    }
  };

  // Export transactions to JSON
  const exportTransactionsToJSON = () => {
    try {
      // Prepare data
      const data = list.map(item => ({
        date: formatDate(item.date),
        category: getCategoryName(item.category),
        title: item.title,
        value: item.value
      }));
      
      // Create JSON string
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `transacoes_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      // Trigger download
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      success("Transações exportadas com sucesso!");
      setIsExporting(false);
    } catch (err) {
      console.error("Erro ao exportar transações:", err);
      error("Erro ao exportar transações. Tente novamente.");
      setIsExporting(false);
    }
  };

  // Export crypto assets to JSON
  const exportCryptoToJSON = () => {
    try {
      // Create JSON string
      const jsonString = JSON.stringify(assets, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `ativos_cripto_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      success("Ativos cripto exportados com sucesso!");
      setIsExporting(false);
    } catch (err) {
      console.error("Erro ao exportar ativos cripto:", err);
      error("Erro ao exportar ativos cripto. Tente novamente.");
      setIsExporting(false);
      throw err; // Propagar o erro para ser capturado pelo handleExport
    }
  };

  // Export recommendations to JSON
  const exportRecommendationsToJSON = () => {
    try {
      // Create JSON string
      const jsonString = JSON.stringify(recommendations, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `recomendacoes_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      success("Recomendações exportadas com sucesso!");
      setIsExporting(false);
    } catch (err) {
      console.error("Erro ao exportar recomendações:", err);
      error("Erro ao exportar recomendações. Tente novamente.");
      setIsExporting(false);
    }
  };

  // Export transactions to PDF
  const exportTransactionsToPDF = () => {
    try {
      // Criar HTML para o PDF
      const title = 'BitBudget - Relatório de Transações';
      const html = generateTransactionsPdfHtml(list, categoriesData, title);
      
      // Abrir em uma nova janela
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(html);
        newWindow.document.close();
        
        // Adicionar um pequeno atraso antes de chamar a impressão
        setTimeout(() => {
          newWindow.print();
          success("PDF de transações gerado com sucesso!");
          setIsExporting(false);
        }, 500);
      } else {
        error("Erro ao gerar PDF. Verifique se os pop-ups estão permitidos.");
        setIsExporting(false);
        throw new Error("Pop-ups bloqueados");
      }
    } catch (err) {
      console.error("Erro ao exportar transações para PDF:", err);
      error("Erro ao exportar transações para PDF. Tente novamente.");
      setIsExporting(false);
    }
  };

  // Export crypto assets to PDF
  const exportCryptoToPDF = () => {
    try {
      // Criar HTML para o PDF
      const title = 'BitBudget - Relatório de Ativos Cripto';
      const html = generateCryptoAssetsPdfHtml(assets, title);
      
      // Abrir em uma nova janela
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(html);
        newWindow.document.close();
        
        // Adicionar um pequeno atraso antes de chamar a impressão
        setTimeout(() => {
          newWindow.print();
          success("PDF de ativos cripto gerado com sucesso!");
          setIsExporting(false);
        }, 500);
      } else {
        error("Erro ao gerar PDF. Verifique se os pop-ups estão permitidos.");
        setIsExporting(false);
        throw new Error("Pop-ups bloqueados");
      }
    } catch (err) {
      console.error("Erro ao exportar ativos cripto para PDF:", err);
      error("Erro ao exportar ativos cripto para PDF. Tente novamente.");
      setIsExporting(false);
    }
  };

  // Export recommendations to PDF
  const exportRecommendationsToPDF = () => {
    try {
      // Criar HTML para o PDF
      const title = 'BitBudget - Relatório de Recomendações';
      const html = generateRecommendationsPdfHtml(recommendations, title);
      
      // Abrir em uma nova janela
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(html);
        newWindow.document.close();
        // Adicionar um pequeno atraso antes de chamar a impressão
        setTimeout(() => {
          newWindow.print();
          success("PDF de recomendações gerado com sucesso!");
          setIsExporting(false);
        }, 500);
      } else {
        error("Erro ao gerar PDF. Verifique se os pop-ups estão permitidos.");
        setIsExporting(false);
        throw new Error("Pop-ups bloqueados");
      }
    } catch (err) {
      console.error("Erro ao exportar recomendações para PDF:", err);
      error("Erro ao exportar recomendações para PDF. Tente novamente.");
      setIsExporting(false);
    }
  };

  // Função para gerar HTML do PDF de transações
  const generateTransactionsPdfHtml = (list: Item[], categories: Record<string, Category>, title: string): string => {
    // Estilos CSS para o PDF
    const styles = `
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        color: #333;
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .header h1 {
        color: #6200ea;
        margin-bottom: 5px;
      }
      .header p {
        color: #666;
        margin-top: 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
      }
      th {
        background-color: #6200ea;
        color: white;
        text-align: left;
        padding: 10px;
      }
      tr:nth-child(even) {
        background-color: #f2f2f2;
      }
      td {
        padding: 10px;
        border-bottom: 1px solid #ddd;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 12px;
        color: #666;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `;

    // Função para obter o nome da categoria pela chave
    const getCategoryName = (categoryKey: string): string => {
      const category = categories[categoryKey];
      return category ? category.title : 'Desconhecida';
    };

    // Criar cabeçalho
    let html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>${styles}</style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <p>Gerado em: ${new Date().toLocaleString()}</p>
        </div>
    `;

    // Criar tabela
    html += `
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Categoria</th>
            <th>Título</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
    `;

    // Adicionar linhas da tabela
    list.forEach(item => {
      const formattedDate = formatDate(item.date);
      const categoryName = getCategoryName(item.category);
      const formattedValue = formatCurrency(item.value);
      
      html += `
        <tr>
          <td>${formattedDate}</td>
          <td>${categoryName}</td>
          <td>${item.title}</td>
          <td>${formattedValue}</td>
        </tr>
      `;
    });

    // Fechar tabela
    html += `
        </tbody>
      </table>
    `;

    // Adicionar rodapé
    html += `
      <div class="footer">
        <p>BitBudget - Sistema de Gerenciamento Financeiro</p>
        <p>© ${new Date().getFullYear()} BitBudget. Todos os direitos reservados.</p>
      </div>
      </body>
      </html>
    `;

    return html;
  };

  // Função para gerar HTML do PDF de ativos cripto
  const generateCryptoAssetsPdfHtml = (assets: Web3Asset[], title: string): string => {
    // Estilos CSS para o PDF
    const styles = `
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        color: #333;
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .header h1 {
        color: #6200ea;
        margin-bottom: 5px;
      }
      .header p {
        color: #666;
        margin-top: 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
      }
      th {
        background-color: #6200ea;
        color: white;
        text-align: left;
        padding: 10px;
      }
      tr:nth-child(even) {
        background-color: #f2f2f2;
      }
      td {
        padding: 10px;
        border-bottom: 1px solid #ddd;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 12px;
        color: #666;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `;

    // Criar cabeçalho
    let html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>${styles}</style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <p>Gerado em: ${new Date().toLocaleString()}</p>
        </div>
    `;

    // Criar tabela
    html += `
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Símbolo</th>
            <th>Saldo</th>
            <th>Tipo de Token</th>
            <th>Rede</th>
            <th>Última Atualização</th>
          </tr>
        </thead>
        <tbody>
    `;

    // Adicionar linhas da tabela
    assets.forEach(asset => {
      const lastUpdated = new Date(asset.lastUpdated).toLocaleString();
      
      html += `
        <tr>
          <td>${asset.name}</td>
          <td>${asset.symbol}</td>
          <td>${asset.balance}</td>
          <td>${asset.tokenType}</td>
          <td>${asset.network}</td>
          <td>${lastUpdated}</td>
        </tr>
      `;
    });

    // Fechar tabela
    html += `
        </tbody>
      </table>
    `;

    // Adicionar rodapé
    html += `
      <div class="footer">
        <p>BitBudget - Sistema de Gerenciamento Financeiro</p>
        <p>© ${new Date().getFullYear()} BitBudget. Todos os direitos reservados.</p>
      </div>
      </body>
      </html>
    `;

    return html;
  };

  // Função para gerar HTML do PDF de recomendações
  const generateRecommendationsPdfHtml = (recommendations: AiRecommendation[], title: string): string => {
    // Estilos CSS para o PDF
    const styles = `
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        color: #333;
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .header h1 {
        color: #6200ea;
        margin-bottom: 5px;
      }
      .header p {
        color: #666;
        margin-top: 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
      }
      th {
        background-color: #6200ea;
        color: white;
        text-align: left;
        padding: 10px;
      }
      tr:nth-child(even) {
        background-color: #f2f2f2;
      }
      td {
        padding: 10px;
        border-bottom: 1px solid #ddd;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 12px;
        color: #666;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `;

    // Criar cabeçalho
    let html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>${styles}</style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <p>Gerado em: ${new Date().toLocaleString()}</p>
        </div>
    `;

    // Criar tabela
    html += `
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Tipo</th>
            <th>Conteúdo</th>
            <th>Data de Criação</th>
            <th>Lida</th>
          </tr>
        </thead>
        <tbody>
    `;

    // Adicionar linhas da tabela
    recommendations.forEach(rec => {
      const createdAt = new Date(rec.createdAt).toLocaleString();
      const content = rec.content.length > 100 ? rec.content.substring(0, 100) + '...' : rec.content;
      
      html += `
        <tr>
          <td>${rec.title}</td>
          <td>${rec.type}</td>
          <td>${content}</td>
          <td>${createdAt}</td>
          <td>${rec.isRead ? 'Sim' : 'Não'}</td>
        </tr>
      `;
    });

    // Fechar tabela
    html += `
        </tbody>
      </table>
    `;

    // Adicionar rodapé
    html += `
      <div class="footer">
        <p>BitBudget - Sistema de Gerenciamento Financeiro</p>
        <p>© ${new Date().getFullYear()} BitBudget. Todos os direitos reservados.</p>
      </div>
      </body>
      </html>
    `;

    return html;
  };

  // Handle export button click
  const handleExport = () => {
    console.log(`Iniciando exportação de ${exportType} no formato ${exportFormat}`);
    
    // Verificar se há dados para exportar com base no tipo selecionado
    if (
      (exportType === 'transactions' && list.length === 0) ||
      (exportType === 'crypto' && assets.length === 0) ||
      (exportType === 'recommendations' && recommendations.length === 0)
    ) {  
      console.log(`Não há ${getExportTypeLabel().toLowerCase()} para exportar`);
      error(`Não há ${getExportTypeLabel().toLowerCase()} para exportar`);
      return;
    }

    // Definir um timeout de segurança para garantir que o estado de carregamento seja redefinido
    const safetyTimeout = setTimeout(() => {
      if (isExporting) {
        setIsExporting(false);
        error("A exportação demorou muito tempo. Por favor, tente novamente.");
      }
    }, 10000); // 10 segundos de timeout

    // Executar a função de exportação correspondente ao formato e tipo selecionados
    try {
      setIsExporting(true);
      
      switch (exportFormat) {
        case 'csv':
          console.log(`Exportando ${exportType} para CSV`);
          switch (exportType) {
            case 'transactions':
              exportTransactionsToCSV();
              break;
            case 'crypto':
              exportCryptoToCSV();
              break;
            case 'recommendations':
              exportRecommendationsToCSV();
              break;
          }
          break;
          
        case 'json':
          console.log(`Exportando ${exportType} para JSON`);
          switch (exportType) {
            case 'transactions':
              exportTransactionsToJSON();
              break;
            case 'crypto':
              exportCryptoToJSON();
              break;
            case 'recommendations':
              exportRecommendationsToJSON();
              break;
          }
          break;
          
        case 'pdf':
          console.log(`Exportando ${exportType} para PDF`);
          switch (exportType) {
            case 'transactions':
              exportTransactionsToPDF();
              break;
            case 'crypto':
              exportCryptoToPDF();
              break;
            case 'recommendations':
              exportRecommendationsToPDF();
              break;
          }
          break;
      }
    } catch (err) {
      console.error("Erro ao exportar dados:", err);
      error("Ocorreu um erro durante a exportação. Tente novamente.");
      setIsExporting(false);
    } finally {
      // Limpar o timeout de segurança
      clearTimeout(safetyTimeout);
    }
  };

  // Get label for export type
  const getExportTypeLabel = () => {
    switch (exportType) {
      case 'transactions': return 'Transações';
      case 'crypto': return 'Ativos Cripto';
      case 'recommendations': return 'Recomendações';
      default: return 'Dados';
    }
  };

  return (
    <div className={`export-area ${isExpanded ? 'export-area--expanded' : 'export-area--collapsed'}`}>
      <div className="export-area__header" onClick={() => setIsExpanded(!isExpanded)}>
        <h2 className="export-area__title">Exportar Dados</h2>
        <div className="export-area__toggle-icon">
          <span>{isExpanded ? '▲' : '▼'}</span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="export-area__content">
          <div className="export-area__type-selector">
            <div className="export-area__section-title">Tipo de Dados:</div>
            <div className="export-area__type-options">
              <label className={`export-area__type-label ${exportType === 'transactions' ? 'export-area__type-label--active' : ''}`}>
                <input
                  type="radio"
                  name="exportType"
                  value="transactions"
                  checked={exportType === 'transactions'}
                  onChange={() => setExportType('transactions')}
                  className="export-area__radio"
                />
                <div className="export-area__type-icon">📊</div>
                <div className="export-area__type-info">
                  <span className="export-area__type-text">Transações</span>
                  <span className="export-area__type-count">{list.length} itens</span>
                </div>
              </label>
              
              <label className={`export-area__type-label ${exportType === 'crypto' ? 'export-area__type-label--active' : ''}`}>
                <input
                  type="radio"
                  name="exportType"
                  value="crypto"
                  checked={exportType === 'crypto'}
                  onChange={() => setExportType('crypto')}
                  className="export-area__radio"
                />
                <div className="export-area__type-icon">💰</div>
                <div className="export-area__type-info">
                  <span className="export-area__type-text">Ativos Cripto</span>
                  <span className="export-area__type-count">{assets.length} itens</span>
                </div>
              </label>
              
              <label className={`export-area__type-label ${exportType === 'recommendations' ? 'export-area__type-label--active' : ''}`}>
                <input
                  type="radio"
                  name="exportType"
                  value="recommendations"
                  checked={exportType === 'recommendations'}
                  onChange={() => setExportType('recommendations')}
                  className="export-area__radio"
                />
                <div className="export-area__type-icon">💡</div>
                <div className="export-area__type-info">
                  <span className="export-area__type-text">Recomendações</span>
                  <span className="export-area__type-count">{recommendations.length} itens</span>
                </div>
              </label>
            </div>
          </div>
          
          <div className="export-area__format-selector">
            <div className="export-area__section-title">Formato:</div>
            <div className="export-area__format-options">
              <label className={`export-area__radio-label ${exportFormat === 'csv' ? 'export-area__radio-label--active' : ''}`}>
                <input
                  type="radio"
                  name="exportFormat"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={() => setExportFormat('csv')}
                  className="export-area__radio"
                />
                <div className="export-area__format-icon export-area__format-icon--csv">CSV</div>
                <div className="export-area__format-info">
                  <span className="export-area__radio-text">CSV</span>
                  <span className="export-area__format-desc">Planilha compatível com Excel</span>
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
                <div className="export-area__format-icon export-area__format-icon--json">JSON</div>
                <div className="export-area__format-info">
                  <span className="export-area__radio-text">JSON</span>
                  <span className="export-area__format-desc">Formato para desenvolvedores</span>
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
                <div className="export-area__format-icon export-area__format-icon--pdf">PDF</div>
                <div className="export-area__format-info">
                  <span className="export-area__radio-text">PDF</span>
                  <span className="export-area__format-desc">Documento para impressão</span>
                </div>
              </label>
            </div>
          </div>
          
          <button 
            className={`export-area__button ${isExporting ? 'export-area__button--loading' : ''}`}
            onClick={handleExport}
            disabled={isExporting}
          >
            <span className="export-area__button-icon">
              {isExporting ? '⏳' : '📤'}
            </span>
            <span className="export-area__button-text">
              {isExporting ? 'Exportando...' : `Exportar ${getExportTypeLabel()}`}
            </span>
          </button>
          
          {exportFormat === 'pdf' && (
            <p className="export-area__format-desc" style={{ textAlign: 'center', marginTop: '10px' }}>
              Nota: A exportação em PDF abrirá uma nova janela para visualização e impressão.
              Certifique-se de que os pop-ups estão permitidos no seu navegador.
            </p>
          )}
        </div>
      )}
    </div>
  );
};