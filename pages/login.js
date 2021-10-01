import { css, cx } from '@emotion/css'
import Router from 'next/router';
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Field, Form, InputSubmit, Error } from '../components/ui/Form';
import firebase from '../firebase';
import useValidation from '../hooks/useValidation';
import validateLogin from '../validation/validateLogin';

const INITIAL_STATE = {
    email: '',
    password: ''
}


const Login = () => {

    const [error, setError] = useState('');
    const { values, errors, handleChange, handleSubmit, handleBlur } = useValidation(INITIAL_STATE, validateLogin, loginSubmit);

    const { email, password } = values;

    async function loginSubmit() {
        try {
            await firebase.login(email, password);
            Router.push("/");
        } catch (error) {
            console.error('Error authenticating the user', error);
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
                >Login</h1>
                <Form
                    onSubmit={handleSubmit}
                    noValidate
                >
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
                    <InputSubmit type="submit" value="Login" />
                </Form>
            </>
        </Layout>
    );
}

export default Login;