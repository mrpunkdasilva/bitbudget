import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InputArea } from './index';

// Mock the NotificationManager context
vi.mock('../NotificationManager', () => ({
  useNotification: () => ({
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
    addNotification: vi.fn(),
    NotificationContainer: () => null,
  }),
}));

describe('InputArea Component', () => {
  const onAddMock = vi.fn();

  beforeEach(() => {
    onAddMock.mockClear();
  });

  it('renders all form fields correctly', () => {
    render(<InputArea onAdd={onAddMock} />);

    // Check if all form elements are rendered
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByText('Categoria')).toBeInTheDocument();
    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Valor')).toBeInTheDocument();
    expect(screen.getByText('Adicionar')).toBeInTheDocument();
  });

  it('validates empty fields and shows errors', async () => {
    render(<InputArea onAdd={onAddMock} />);

    // Click the add button without filling any fields
    fireEvent.click(screen.getByText('Adicionar'));

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('Data é obrigatória!')).toBeInTheDocument();
      expect(screen.getByText('Categoria é obrigatória!')).toBeInTheDocument();
      expect(screen.getByText('Título é obrigatório!')).toBeInTheDocument();
      expect(screen.getByText('Valor deve ser maior que zero!')).toBeInTheDocument();
    });

    // onAdd should not be called
    expect(onAddMock).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    render(<InputArea onAdd={onAddMock} />);

    // Fill in the form
    const dateInput = screen.getByLabelText('Data');
    const categorySelect = screen.getByLabelText('Categoria');
    const titleInput = screen.getByLabelText('Título');
    const valueInput = screen.getByLabelText('Valor');

    // Set today's date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    fireEvent.change(dateInput, { target: { value: formattedDate } });
    fireEvent.change(categorySelect, { target: { value: 'food' } });
    fireEvent.change(titleInput, { target: { value: 'Teste de Refeição' } });
    fireEvent.change(valueInput, { target: { value: '50.75' } });

    // Submit the form
    fireEvent.click(screen.getByText('Adicionar'));

    // Wait for the submission to complete (there's a setTimeout in the component)
    await waitFor(
      () => {
        expect(onAddMock).toHaveBeenCalledTimes(1);
      },
      { timeout: 500 }
    );

    // Check if onAdd was called with the correct data
    expect(onAddMock).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'food',
        title: 'Teste de Refeição',
        value: 50.75,
      })
    );
  });

  it('validates title length', async () => {
    render(<InputArea onAdd={onAddMock} />);

    const titleInput = screen.getByLabelText('Título');

    // Test with a title that's too short
    fireEvent.change(titleInput, { target: { value: 'ab' } });
    fireEvent.blur(titleInput);

    await waitFor(() => {
      expect(screen.getByText('Título deve ter pelo menos 3 caracteres!')).toBeInTheDocument();
    });

    // Test with a title that's too long (more than 50 chars)
    fireEvent.change(titleInput, { target: { value: 'a'.repeat(51) } });
    fireEvent.blur(titleInput);

    await waitFor(() => {
      expect(screen.getByText('Título deve ter no máximo 50 caracteres!')).toBeInTheDocument();
    });
  });
});
