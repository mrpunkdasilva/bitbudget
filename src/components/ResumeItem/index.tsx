type Props = {
    title: string;
    value: number;
    type?: 'income' | 'expense' | 'balance';
}

export const ResumeItem = ({ title, value, type = 'balance' }: Props) => {
    // Formatar o valor para exibir como moeda brasileira
    const formattedValue = value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return (
        <div className="resume-item">
            <div className="resume-item__title">{title}</div>
            <div className={`resume-item__info resume-item__info--${type}`}>
                {formattedValue}
            </div>
        </div>
    );
}