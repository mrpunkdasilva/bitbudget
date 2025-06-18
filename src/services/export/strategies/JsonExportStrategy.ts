import { ExportStrategy, ExportData } from '../types';

export class JsonExportStrategy implements ExportStrategy {
  async export(data: ExportData): Promise<void> {
    try {
      const jsonString = JSON.stringify(data.data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", data.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting JSON:', error);
      throw new Error('Erro ao exportar JSON');
    }
  }
}