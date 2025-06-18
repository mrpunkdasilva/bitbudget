import { ExportStrategy, ExportData } from '../types';

export class PdfExportStrategy implements ExportStrategy {
  async export(data: ExportData): Promise<void> {
    try {
      const html = this.generateHtml(data);
      
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(html);
        newWindow.document.close();
        
        setTimeout(() => {
          newWindow.print();
        }, 500);
      } else {
        throw new Error('Pop-ups bloqueados');
      }
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw new Error('Erro ao exportar PDF');
    }
  }

  private generateHtml(data: ExportData): string {
    const styles = `
      <style>
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
      </style>
    `;

    const tableHeaders = data.data.length > 0 ? Object.keys(data.data[0]) : [];
    
    let html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title}</title>
        ${styles}
      </head>
      <body>
        <div class="header">
          <h1>${data.title}</h1>
          <p>Gerado em ${new Date().toLocaleString('pt-BR')}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              ${tableHeaders.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
    `;

    data.data.forEach(item => {
      html += '<tr>';
      tableHeaders.forEach(header => {
        html += `<td>${item[header] || ''}</td>`;
      });
      html += '</tr>';
    });

    html += `
          </tbody>
        </table>
        
        <div class="footer">
          <p>BitBudget - Sistema de Controle Financeiro</p>
        </div>
      </body>
      </html>
    `;

    return html;
  }
}