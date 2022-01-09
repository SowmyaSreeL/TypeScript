namespace App {
    //Validator
    export interface validatable {
        value: string | number;
        required?: boolean; // ? or boolean | undefined bothe are same
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number
    }

    export function validate(validateInp: validatable) {
        let isValid = true;
        if(validateInp.required) {
            isValid = isValid && validateInp.value.toString().trim().length !== 0;
        }
        if(validateInp.minLength != null && typeof validateInp.value === 'string') {
            isValid = isValid && validateInp.value.length >= validateInp.minLength;
        }
        if(validateInp.maxLength != null && typeof validateInp.value === 'string') {
            isValid = isValid && validateInp.value.length <= validateInp.maxLength;
        }
        if(validateInp.min != null && typeof validateInp.min === 'number') {
            isValid = isValid && validateInp.value >= validateInp.min;
        }
        if(validateInp.max != null && typeof validateInp.min === 'number') {
            isValid = isValid && validateInp.value <= validateInp.max;
        }
        return isValid;
    }
}