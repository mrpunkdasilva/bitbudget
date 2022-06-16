export type Category = {    
    //* Define que uma tag (um valor qualquer) será do tipo
    [tag: string]: {
        title: string;
        color: string;
        expense: boolean;
    }
}