import { Item } from '../../types/Item';
import { TableItem } from '../TableItem';

type Props = {
  list: Item[];
  onDeleteItem?: (item: Item) => void;
};

export const TableArea = ({ list, onDeleteItem }: Props) => {
  // Função de fallback caso onDeleteItem não seja fornecido
  const handleDelete = (item: Item) => {
    if (onDeleteItem) {
      onDeleteItem(item);
    } else {
      console.warn('Função onDeleteItem não fornecida ao TableArea');
    }
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="table__head-column" style={{ width: 100 }}>
            Data
          </th>
          <th className="table__head-column" style={{ width: 130 }}>
            Categoria
          </th>
          <th className="table__head-column">Título</th>
          <th className="table__head-column" style={{ width: 150 }}>
            Valor
          </th>
          <th className="table__head-column" style={{ width: 100 }}>
            Ações
          </th>
        </tr>
      </thead>
      <tbody>
        {list.length > 0 ? (
          list.map((item, index) => <TableItem key={index} item={item} onDelete={handleDelete} />)
        ) : (
          <tr>
            <td colSpan={5} className="table__empty-message">
              Nenhuma transação encontrada.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
