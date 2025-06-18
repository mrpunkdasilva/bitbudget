// Types para o sistema de exportação
export type ExportFormat = 'csv' | 'json' | 'pdf';

export type ExportType = 'transactions' | 'crypto' | 'recommendations';

export interface ExportData {
  data: any[];
  filename: string;
  title: string;
}

export interface ExportStrategy {
  export(data: ExportData): Promise<void>;
}

export interface ExportOptions {
  format: ExportFormat;
  type: ExportType;
  data: any[];
  title?: string;
}