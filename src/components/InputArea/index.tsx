import { useState, useEffect } from 'react';
import { Item } from '../../types/Item';
import { categories } from '../../data/categories';
import { useNotification } from '../NotificationManager';

type Props = {
    onAdd: (item: Item) => void;
}

export const InputArea = ({ onAdd }: Props) => {
    const [dateField, setDateField] = useState('');
    const [categoryField, setCategoryField] = useState('');
    const [titleField, setTitleField] = useState('');
    const [valueField, setValueField] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Estados para validação
    const [dateError, setDateError] = useState('');
    const [categoryError, setCategoryError] = useState('');
    const [titleError, setTitleError] = useState('');
    const [valueError, setValueError] = useState('');
    
    const { error } = useNotification();

    let categoryKeys: string[] = Object.keys(categories);

    // Validar campos individuais
    const validateDate = (date: string): boolean => {
        if (!date) {
            setDateError('Data é obrigatória!');
            return false;
        }
        
        const selectedDate = new Date(date);
        const today = new Date();
        
        // Verificar se a data é válida
        if (isNaN(selectedDate.getTime())) {
            setDateError('Data inválida!');
            return false;
        }
        
        // Verificar se a data não é futura (mais de 1 dia à frente)
        const futureLimit = new Date();
        futureLimit.setDate(today.getDate() + 1);
        if (selectedDate > futureLimit) {
            setDateError('A data não pode ser mais de 1 dia no futuro!');
            return false;
        }
        
        // Verificar se a data não é muito antiga (mais de 5 anos atrás)
        const pastLimit = new Date();
        pastLimit.setFullYear(today.getFullYear() - 5);
        if (selectedDate < pastLimit) {
            setDateError('A data não pode ser mais de 5 anos no passado!');
            return false;
        }
        
        setDateError('');
        return true;
    };
    
    const validateCategory = (category: string): boolean => {
        if (!category) {
            setCategoryError('Categoria é obrigatória!');
            return false;
        }
        
        if (!categoryKeys.includes(category)) {
            setCategoryError('Categoria inválida!');
            return false;
        }
        
        setCategoryError('');
        return true;
    };
    
    const validateTitle = (title: string): boolean => {
        if (!title.trim()) {
            setTitleError('Título é obrigatório!');
            return false;
        }
        
        if (title.trim().length < 3) {
            setTitleError('Título deve ter pelo menos 3 caracteres!');
            return false;
        }
        
        if (title.trim().length > 50) {
            setTitleError('Título deve ter no máximo 50 caracteres!');
            return false;
        }
        
        setTitleError('');
        return true;
    };
    
    const validateValue = (value: number): boolean => {
        if (isNaN(value) || value <= 0) {
            setValueError('Valor deve ser maior que zero!');
            return false;
        }
        
        if (value > 1000000) {
            setValueError('Valor não pode exceder R$ 1.000.000,00!');
            return false;
        }
        
        setValueError('');
        return true;
    };
    
    // Validar ao mudar os campos
    useEffect(() => {
        if (dateField) validateDate(dateField);
    }, [dateField]);
    
    useEffect(() => {
        if (categoryField) validateCategory(categoryField);
    }, [categoryField]);
    
    useEffect(() => {
        if (titleField) validateTitle(titleField);
    }, [titleField]);
    
    useEffect(() => {
        if (valueField !== 0) validateValue(valueField);
    }, [valueField]);
    
    const handleAddEvent = () => {
        setIsSubmitting(true);
        
        // Validar todos os campos
        const isDateValid = validateDate(dateField);
        const isCategoryValid = validateCategory(categoryField);
        const isTitleValid = validateTitle(titleField);
        const isValueValid = validateValue(valueField);
        
        if (!isDateValid || !isCategoryValid || !isTitleValid || !isValueValid) {
            const errors = [
                dateError, 
                categoryError, 
                titleError, 
                valueError
            ].filter(err => err !== '');
            
            error(errors.join("\n"));
            setIsSubmitting(false);
            return;
        }
        
        // Adiciona uma pequena animação de carregamento
        setTimeout(() => {
            try {
                onAdd({
                    date: new Date(dateField),
                    category: categoryField,
                    title: titleField,
                    value: valueField
                });
                clearFields();
            } catch (err) {
                error('Erro ao adicionar item. Tente novamente.');
                console.error(err);
            } finally {
                setIsSubmitting(false);
            }
        }, 300);
    }

    const clearFields = () => {
        setDateField('');
        setCategoryField('');
        setTitleField('');
        setValueField(0);
    }

    return (
        <div className="input-area">
            <label className="input-area__label">
                <div className="input-area__title">Data</div>
                <input 
                    type="date" 
                    className={`input-area__input ${dateError ? 'input-area__input--error' : ''}`}
                    value={dateField} 
                    onChange={e => setDateField(e.target.value)} 
                    aria-required="true"
                    aria-invalid={!!dateError}
                    aria-describedby={dateError ? "date-error" : undefined}
                />
                {dateError && <div id="date-error" className="input-area__error">{dateError}</div>}
            </label>
            <label className="input-area__label">
                <div className="input-area__title">Categoria</div>
                <select 
                    className={`input-area__select ${categoryError ? 'input-area__select--error' : ''}`}
                    value={categoryField} 
                    onChange={e => setCategoryField(e.target.value)}
                    aria-required="true"
                    aria-invalid={!!categoryError}
                    aria-describedby={categoryError ? "category-error" : undefined}
                >
                    <option value="">Selecione uma categoria</option>
                    {categoryKeys.map((key, index) => (
                        <option key={index} value={key}>{categories[key].title}</option>
                    ))}
                </select>
                {categoryError && <div id="category-error" className="input-area__error">{categoryError}</div>}
            </label>
            <label className="input-area__label">
                <div className="input-area__title">Título</div>
                <input 
                    type="text" 
                    className={`input-area__input ${titleError ? 'input-area__input--error' : ''}`}
                    value={titleField} 
                    onChange={e => setTitleField(e.target.value)} 
                    maxLength={50}
                    aria-required="true"
                    aria-invalid={!!titleError}
                    aria-describedby={titleError ? "title-error" : undefined}
                />
                {titleError && <div id="title-error" className="input-area__error">{titleError}</div>}
            </label>
            <label className="input-area__label">
                <div className="input-area__title">Valor</div>
                <input 
                    type="number"
                    className={`input-area__input ${valueError ? 'input-area__input--error' : ''}`}
                    value={valueField} 
                    onChange={e => setValueField(parseFloat(e.target.value) || 0)} 
                    min="0.01"
                    step="0.01"
                    aria-required="true"
                    aria-invalid={!!valueError}
                    aria-describedby={valueError ? "value-error" : undefined}
                />
                {valueError && <div id="value-error" className="input-area__error">{valueError}</div>}
            </label>
            <label className="input-area__label">
                <div className="input-area__title">&nbsp;</div>
                <button 
                    className={`input-area__button ${isSubmitting ? 'input-area__button--loading' : ''}`}
                    onClick={handleAddEvent}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Adicionando...' : 'Adicionar'}
                </button>
            </label>
        </div>
    );
}