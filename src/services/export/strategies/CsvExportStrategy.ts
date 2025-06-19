import { ExportStrategy, ExportData } from '../types';

export class CsvExportStrategy implements ExportStrategy {
  async export(data: ExportData): Promise<void> {
    try {
      let csvContent = 'data:text/csv;charset=utf-8,';

      if (data.data.length > 0) {
        // Create header from first object keys
        const headers = Object.keys(data.data[0]);
        csvContent += headers.join(',') + '\n';

        // Add data rows
        data.data.forEach(item => {
          const values = headers.map(header => {
            const value = item[header];
            // Handle values that might contain commas
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
          });
          csvContent += values.join(',') + '\n';
        });
      }

      // Create and trigger download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', data.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      throw new Error('Erro ao exportar CSV');
    }
  }
}
