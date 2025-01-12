export type FormProps<DataProps> = {
    onFormSubmit: (ok : boolean , data: any) => void;
    defaultData: DataProps;
    formRef : any;
    showSubmit ? : boolean;
}
