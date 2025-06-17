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

// We'll use dynamic imports to avoid issues with Vite
export const loadPdfLibraries = async () => {
  try {
    // Import jsPDF
    const jsPDFModule = await import('jspdf');
    const { jsPDF } = jsPDFModule;
    
    // Import jspdf-autotable
    await import('jspdf-autotable');
    
    // Return the jsPDF constructor
    return { jsPDF };
  } catch (error) {
    console.error('Error loading PDF libraries:', error);
    throw new Error('Failed to load PDF libraries. Please try again.');
  }
};

/**
 * Gera uma prévia do PDF como uma URL de dados
 * @param pdfDoc - Documento jsPDF
 * @returns URL de dados do PDF
 */
export const generatePdfPreview = (pdfDoc: any): string => {
  try {
    // Obter o PDF como um blob
    const pdfBlob = pdfDoc.output('blob');
    
    // Criar uma URL para o blob
    return URL.createObjectURL(pdfBlob);
  } catch (error) {
    console.error('Error generating PDF preview:', error);
    throw new Error('Failed to generate PDF preview. Please try again.');
  }
};

/**
 * Revoga uma URL de objeto para liberar memória
 * @param url - URL a ser revogada
 */
export const revokePdfPreview = (url: string): void => {
  if (url) {
    URL.revokeObjectURL(url);
  }
};