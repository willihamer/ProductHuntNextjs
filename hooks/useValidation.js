import React, { useEffect, useState } from 'react';

/**
 * 
 * @param {initial state} initialState 
 * @param {the value that we need to validate} validate 
 * @param { function to execute when the we do the submit} fn 
 * @returns 
 */
const useValidation = (initialState, validate, fn) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [submitForm, setSubmitForm] = useState(false);

    useEffect(() => {
        if (submitForm) {
            const noErrors = Object.keys(errors).length === 0;

            if (noErrors) {
                fn();
            }
            setSubmitForm(false);
        }
    }, [errors]);

    // Function that is executed when the user writes
    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }

    // Function that is executed when the user makes submit
    const handleSubmit = e => {
        e.preventDefault();

        const errorsValidation = validate(values);
        setErrors(errorsValidation);
        setSubmitForm(true);

    }

    const handleBlur = () => {
        const errorsValidation = validate(values);
        setErrors(errorsValidation);
    }

    return {
        values,
        errors,
        submitForm,
        handleChange,
        handleSubmit,
        handleBlur
    };
}

export default useValidation;