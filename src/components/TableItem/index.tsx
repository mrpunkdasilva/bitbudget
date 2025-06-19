import { useState } from 'react';
import { Item } from '../../types/Item';
import { formatDate } from '../../helpers/dateFilter';
import { categories } from '../../data/categories';
import { formatCurrency } from '../../helpers/formatters';

type Props = {
  item: Item;
  onDelete: (item: Item) => void;
};

export const TableItem = ({ item, onDelete }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleting(true);

    // Simular um pequeno delay para mostrar o estado de carregamento
    setTimeout(() => {
      onDelete(item);
      setIsDeleting(false);
      setShowConfirm(false);
    }, 300);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <tr className="table-item__row">
      <td className="table-item__column">{formatDate(item.date)}</td>

      <td className="table-item__column">
        <div className={`table-item__category table-item__category--${item.category}`}>
          {categories[item.category].title}
        </div>
      </td>

      <td className="table-item__column">{item.title}</td>

      <td className="table-item__column">
        <div
          className={`table-item__value table-item__value--${categories[item.category].expense ? 'expense' : 'income'}`}
        >
          {formatCurrency(item.value)}
        </div>
      </td>

      <td className="table-item__column table-item__column--actions">
        {!showConfirm ? (
          <button
            className="table-item__delete-btn"
            onClick={handleDeleteClick}
            aria-label={`Excluir ${item.title}`}
          >
            <span className="table-item__delete-icon">×</span>
          </button>
        ) : (
          <div className="table-item__confirm">
            <button
              className="table-item__confirm-btn table-item__confirm-btn--yes"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '...' : 'Sim'}
            </button>
            <button
              className="table-item__confirm-btn table-item__confirm-btn--no"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Não
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};
