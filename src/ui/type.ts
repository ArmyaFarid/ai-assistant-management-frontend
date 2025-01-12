export type FieldElement<e> = {
    fieldName: e;
    label : string;
    inputType : string;
    placeholder?: string;
    required?: boolean;
    canBeConfidential? : boolean;
}
