import { Web3Asset } from '../../../types/Web3Asset';

export interface FormattedWeb3Asset {
  Nome: string;
  Símbolo: string;
  Saldo: string;
  'Tipo de Token': string;
  Rede: string;
  'Última Atualização': string;
}

export class Web3AssetFormatter {
  static format(assets: Web3Asset[]): FormattedWeb3Asset[] {
    return assets.map(asset => ({
      Nome: asset.name,
      Símbolo: asset.symbol,
      Saldo: asset.balance,
      'Tipo de Token': asset.tokenType,
      Rede: asset.network,
      'Última Atualização': new Date(asset.lastUpdated).toLocaleString('pt-BR'),
    }));
  }
}
