import { ExportStrategy, ExportOptions, ExportFormat } from './types';
import { CsvExportStrategy } from './strategies/CsvExportStrategy';
import { JsonExportStrategy } from './strategies/JsonExportStrategy';
import { PdfExportStrategy } from './strategies/PdfExportStrategy';

export class ExportService {
  private strategies: Map<ExportFormat, ExportStrategy>;

  constructor() {
    this.strategies = new Map();
    this.strategies.set('csv', new CsvExportStrategy());
    this.strategies.set('json', new JsonExportStrategy());
    this.strategies.set('pdf', new PdfExportStrategy());
  }

  async export(options: ExportOptions): Promise<void> {
    const strategy = this.strategies.get(options.format);
    
    if (!strategy) {
      throw new Error(`Formato de exportação não suportado: ${options.format}`);
    }

    const filename = this.generateFilename(options);
    const title = options.title || this.generateTitle(options.type);

    await strategy.export({
      data: options.data,
      filename,
      title
    });
  }

  private generateFilename(options: ExportOptions): string {
    const date = new Date().toISOString().split('T')[0];
    const typeMap = {
      transactions: 'transacoes',
      crypto: 'ativos_cripto',
      recommendations: 'recomendacoes'
    };
    
    const typeName = typeMap[options.type] || options.type;
    return `${typeName}_${date}.${options.format}`;
  }

  private generateTitle(type: string): string {
    const titleMap = {
      transactions: 'BitBudget - Relatório de Transações',
      crypto: 'BitBudget - Relatório de Ativos Cripto',
      recommendations: 'BitBudget - Relatório de Recomendações'
    };
    
    return titleMap[type as keyof typeof titleMap] || 'BitBudget - Relatório';
  }
}