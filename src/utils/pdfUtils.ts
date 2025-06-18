/**
 * PDF Utilities
 * 
 * This module provides utilities for working with PDFs in the application,
 * including wrappers around jsPDF and jspdf-autotable.
 */

// Definição de cores para uso nos PDFs
export const pdfColors = {
  primary: [138, 43, 226], // Roxo (blueviolet)
  secondary: [100, 30, 180], // Roxo mais escuro
  accent: [255, 165, 0], // Laranja
  lightGray: [240, 240, 240],
  mediumGray: [200, 200, 200],
  success: [40, 167, 69], // Verde
  danger: [220, 53, 69], // Vermelho
  white: [255, 255, 255],
  black: [0, 0, 0],
  textDark: [50, 50, 50],
  textLight: [100, 100, 100]
};

// Importar diretamente para garantir que a biblioteca seja carregada corretamente
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { configurePdf } from './pdfConfig';

// We'll use direct imports to avoid issues with dynamic loading
export const loadPdfLibraries = async () => {
  try {
    console.log('Iniciando carregamento das bibliotecas PDF');
    
    // Verificar se a biblioteca jspdf-autotable foi carregada corretamente
    try {
      configurePdf();
    } catch (configError) {
      console.error('Erro ao configurar PDF:', configError);
      // Continuar mesmo com erro de configuração
    }
    
    // Verificar se autoTable está disponível
    const testDoc = new jsPDF();
    if (typeof testDoc.autoTable !== 'function') {
      console.error('autoTable não está disponível no objeto jsPDF');
      throw new Error('A função autoTable não está disponível. Verifique a importação da biblioteca jspdf-autotable.');
    }
    
    console.log('jsPDF e jspdf-autotable carregados com sucesso');
    
    // Return the jsPDF constructor
    return { jsPDF };
  } catch (error) {
    console.error('Erro detalhado ao carregar bibliotecas PDF:', error);
    if (error instanceof Error) {
      throw new Error(`Falha ao carregar bibliotecas PDF: ${error.message}`);
    } else {
      throw new Error('Falha ao carregar bibliotecas PDF. Tente novamente.');
    }
  }
};

/**
 * Gera uma prévia do PDF como uma URL de dados
 * @param list - Lista de itens para incluir no PDF
 * @param categories - Categorias para mapear os itens
 * @returns Objeto contendo o documento PDF e a URL de dados
 */
export const generatePdfPreview = async (list: any[], categories: any[]): Promise<{ pdfDoc: any, pdfDataUri: string }> => {
  try {
    console.log('Iniciando geração de PDF para transações');
    
    // Carregar a biblioteca jsPDF
    await loadPdfLibraries();
    console.log('Biblioteca jsPDF carregada com sucesso');
    
    // Criar um novo documento PDF
    const pdfDoc = new jsPDF();
    console.log('Documento PDF criado');
    
    // Verificar se autoTable está disponível
    if (typeof pdfDoc.autoTable !== 'function') {
      console.error('autoTable não está disponível no objeto jsPDF');
      throw new Error('A função autoTable não está disponível. Verifique a importação da biblioteca jspdf-autotable.');
    }
    
    // Adicionar título
    pdfDoc.setFontSize(22);
    pdfDoc.setTextColor(pdfColors.primary[0], pdfColors.primary[1], pdfColors.primary[2]);
    pdfDoc.text('Relatório de Transações', 105, 20, { align: 'center' });
    console.log('Título adicionado');
    
    // Adicionar subtítulo com data
    pdfDoc.setFontSize(12);
    pdfDoc.setTextColor(pdfColors.textDark[0], pdfColors.textDark[1], pdfColors.textDark[2]);
    pdfDoc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
    console.log('Subtítulo adicionado');
    
    // Preparar dados para a tabela
    console.log('Preparando dados para a tabela com', list.length, 'itens');
    const tableData = list.map(item => [
      new Date(item.date).toLocaleDateString(),
      categories.find(cat => cat.id === item.categoryId)?.title || 'Sem categoria',
      item.title,
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value),
      item.expense ? 'Despesa' : 'Receita'
    ]);
    console.log('Dados da tabela preparados');
    
    try {
      // Adicionar tabela
      console.log('Adicionando tabela ao PDF');
      pdfDoc.autoTable({
        head: [['Data', 'Categoria', 'Título', 'Valor', 'Tipo']],
        body: tableData,
        startY: 40,
        theme: 'grid',
        headStyles: {
          fillColor: pdfColors.primary,
          textColor: pdfColors.white,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: pdfColors.lightGray
        },
        margin: { top: 40 }
      });
      console.log('Tabela adicionada com sucesso');
    } catch (tableError) {
      console.error('Erro ao adicionar tabela:', tableError);
      throw new Error(`Falha ao adicionar tabela ao PDF: ${tableError.message}`);
    }
    
    try {
      // Obter o PDF como um blob
      console.log('Gerando blob do PDF');
      const pdfBlob = pdfDoc.output('blob');
      console.log('Blob do PDF gerado com sucesso');
      
      // Criar uma URL para o blob
      console.log('Criando URL para o blob');
      const pdfDataUri = URL.createObjectURL(pdfBlob);
      console.log('URL do PDF criada com sucesso:', pdfDataUri.substring(0, 30) + '...');
      
      return { pdfDoc, pdfDataUri };
    } catch (outputError) {
      console.error('Erro ao gerar saída do PDF:', outputError);
      throw new Error(`Falha ao gerar saída do PDF: ${outputError.message}`);
    }
  } catch (error) {
    console.error('Erro detalhado na geração do PDF:', error);
    if (error instanceof Error) {
      throw new Error(`Falha ao gerar prévia do PDF: ${error.message}`);
    } else {
      throw new Error('Falha ao gerar prévia do PDF. Tente novamente.');
    }
  }
};

/**
 * Revoga uma URL de objeto para liberar memória
 * @param url - URL a ser revogada
 */
export const revokePdfPreview = (url: string): void => {
  try {
    console.log('Revogando URL de prévia do PDF:', url.substring(0, 30) + '...');
    if (url) {
      URL.revokeObjectURL(url);
      console.log('URL revogada com sucesso');
    } else {
      console.log('Nenhuma URL para revogar');
    }
  } catch (error) {
    console.error('Erro ao revogar URL de prévia do PDF:', error);
  }
};