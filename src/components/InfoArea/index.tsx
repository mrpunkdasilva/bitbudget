import { formatCurrentMonth } from '../../helpers/dateFilter';
import { ResumeItem } from '../ResumeItem';

type Props = {
    currentMonth: string;
    onMonthChange: (newMonth: string) => void;
    income: number;
    expense: number;
}

export const InfoArea = ({ currentMonth, onMonthChange, income, expense }: Props) => {
    const handlePrevMonth = () => {
        let [year, month] = currentMonth.split('-');
        let currentDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        currentDate.setMonth(currentDate.getMonth() - 1);
        onMonthChange(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`);
    }

    const handleNextMonth = () => {
        let [year, month] = currentMonth.split('-');
        let currentDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        currentDate.setMonth(currentDate.getMonth() + 1);
        onMonthChange(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`);
    }

    return (
        <div className="info-area">
            <div className="info-area__month">
                <div className="info-area__month-arrow" onClick={handlePrevMonth}>⬅️</div>
                <div className="info-area__month-title">
                    {formatCurrentMonth(currentMonth)}
                </div>
                <div className="info-area__month-arrow" onClick={handleNextMonth}>➡️</div>
            </div>

            <div className="info-area__resume">
                <ResumeItem 
                    title="Receitas" 
                    value={income} 
                    type="income"
                />               
                <ResumeItem  
                    title="Despesas" 
                    value={expense} 
                    type="expense"
                />
                <ResumeItem 
                    title="Balanço" 
                    value={income - expense} 
                    type={income - expense < 0 ? 'expense' : 'income'}
                />
            </div>
        </div>
    );
}