import { css, cx } from '@emotion/css'
import Router from 'next/router';
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Field, Form, InputSubmit, Error } from '../components/ui/Form';
import firebase from '../firebase';
import useValidation from '../hooks/useValidation';
import validateCreateAccount from '../validation/validateCreateAccount';

const INITIAL_STATE = {
    name: '',
    email: '',
    password: ''
}

const CreateAccount = () => {

    const [error, setError] = useState('');
    const { values, errors, handleChange, handleSubmit, handleBlur } = useValidation(INITIAL_STATE, validateCreateAccount, createAccountSubmit);

    const { name, email, password } = values;

    async function createAccountSubmit() {
        try {
            await firebase.register(name, email, password);
            Router.push('/');
        } catch (error) {
            console.error('Error creating the user', error);
            setError(error.message);
        }
    }

    return (
        <Layout>
            <>
                <h1
                    className={css`
                    text-align: center;
                    margin-top: 5rem;
                `}
                >Create Account</h1>
                <Form
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Field>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" placeholder="name" name="name" value={name} onChange={handleChange} onBlur={handleBlur} />
                    </Field>
                    {errors.name && <Error>{errors.name}</Error>}
                    <Field>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="email" name="email" value={email} onChange={handleChange} onBlur={handleBlur} />
                    </Field>
                    {errors.email && <Error>{errors.email}</Error>}
                    <Field>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="password" name="password" value={password} onChange={handleChange} onBlur={handleBlur} />
                    </Field>
                    {errors.password && <Error>{errors.password}</Error>}
                    {error && <Error>{error}</Error>}
                    <InputSubmit type="submit" value="Create Account" />
                </Form>
            </>
        </Layout>
    );
}

export default CreateAccount;