# Sistema de Exportação - Arquitetura Desacoplada

## Visão Geral

Este sistema de exportação foi refatorado para seguir princípios de **Clean Architecture** e **Strategy Pattern**, eliminando o acoplamento excessivo que existia anteriormente.

## Estrutura da Arquitetura

### 1. **Strategy Pattern**
- `ExportStrategy` - Interface que define o contrato para estratégias de exportação
- `CsvExportStrategy` - Implementação para exportação CSV
- `JsonExportStrategy` - Implementação para exportação JSON
- `PdfExportStrategy` - Implementação para exportação PDF

### 2. **Service Layer**
- `ExportService` - Orquestra as estratégias de exportação
- Gerencia a seleção da estratégia baseada no formato escolhido
- Responsável pela geração de nomes de arquivo e títulos

### 3. **Formatters**
- `TransactionFormatter` - Formata dados de transações para exportação
- `Web3AssetFormatter` - Formata dados de ativos cripto
- `RecommendationFormatter` - Formata dados de recomendações IA

### 4. **Custom Hook**
- `useExport` - Hook que encapsula a lógica de exportação
- Gerencia estado de loading e notificações
- Interface simples para componentes React

## Benefícios da Nova Arquitetura

### ✅ **Separação de Responsabilidades**
- Cada classe tem uma única responsabilidade
- Componente UI focado apenas na interface
- Lógica de negócio separada em serviços

### ✅ **Extensibilidade**
- Fácil adicionar novos formatos de exportação
- Novos tipos de dados podem ser adicionados facilmente
- Estratégias podem ser modificadas independentemente

### ✅ **Testabilidade**
- Cada classe pode ser testada isoladamente
- Mocks podem ser facilmente criados
- Lógica de negócio separada da UI

### ✅ **Manutenibilidade**
- Código mais organizado e legível
- Modificações localizadas
- Menos chance de bugs por acoplamento

### ✅ **Reusabilidade**
- Serviços podem ser reutilizados em outros contextos
- Formatters podem ser usados independentemente
- Hook pode ser usado em múltiplos componentes

## Como Usar

### Básico com Hook
```typescript
import { useExport } from '../../hooks/useExport';

const { exportData, isExporting } = useExport({
  transactions: myTransactions,
  categories: myCategories
});

// Exportar transações em CSV
await exportData('csv', 'transactions');
```

### Direto com Service
```typescript
import { ExportService } from '../../services/export';

const exportService = new ExportService();

await exportService.export({
  format: 'pdf',
  type: 'transactions',
  data: formattedData,
  title: 'Meu Relatório'
});
```

### Adicionar Nova Estratégia
```typescript
// 1. Implementar a interface
export class XmlExportStrategy implements ExportStrategy {
  async export(data: ExportData): Promise<void> {
    // Implementação da exportação XML
  }
}

// 2. Registrar no ExportService
constructor() {
  this.strategies = new Map();
  this.strategies.set('xml', new XmlExportStrategy());
}
```

## Comparação: Antes vs Depois

### 🔴 **Antes (Acoplado)**
- 1 arquivo gigante (800+ linhas)
- Lógica misturada no componente
- Código duplicado entre formatos
- Difícil de testar e manter
- Dependências espalhadas

### 🟢 **Depois (Desacoplado)**
- Múltiplos arquivos pequenos e focados
- Separação clara de responsabilidades
- Reutilização de código
- Fácil de testar cada parte
- Dependências bem definidas

## Próximos Passos

1. **Testes Unitários** - Implementar testes para cada strategy
2. **Validação** - Adicionar validação de dados antes da exportação
3. **Cache** - Implementar cache para formatação de dados grandes
4. **Configuração** - Tornar formatação configurável por usuário
5. **Batch Export** - Permitir exportação de múltiplos tipos simultaneamente