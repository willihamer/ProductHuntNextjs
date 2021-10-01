import { css, cx } from '@emotion/css'
import Router, { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import Layout from '../components/layout/Layout';
import { Field, Form, InputSubmit, Error } from '../components/ui/Form';
import { FirebaseContext } from '../firebase';
import FileUploader from 'react-firebase-file-uploader';
import useValidation from '../hooks/useValidation';
import validateCreateProduct from '../validation/validateCreateProduct';
import Error404 from '../components/layout/404';

const INITIAL_STATE = {
    name: '',
    company: '',
    // image: '',
    url: '',
    description: '',
}


const NewProduct = () => {

    const [imageName, setImageName] = useState('');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [urlImage, setUrlImage] = useState('');
    const [error, setError] = useState('');
    const { values, errors, handleChange, handleSubmit, handleBlur } = useValidation(INITIAL_STATE, validateCreateProduct, createProductSubmit);
    const router = useRouter();

    const { name, company, image, url, description } = values;

    const { user, firebase } = useContext(FirebaseContext);

    async function createProductSubmit() {

        if (!user) {
            return router.push('login');
        }

        const product = {
            name,
            company,
            url,
            urlImage,
            description,
            votes: 0,
            comments: [],
            createAt: Date.now(),
            creator: {
                id: user.uid,
                name: user.displayName
            },
            hasVoted: []
        }

        try {
            firebase.db.collection('products').add(product);
            return router.push('/');
        } catch (error) {
            console.error('Error creating the product', error);
            setError(error.message);
        }
    }

    const handleUploadStart = () => {
        setProgress(0);
        setUploading(true);
    }

    const handleProgress = progress => setProgress({ progress });

    const handleUploadError = error => {
        setUploading(error);
        console.error(error);
    };

    const handleUploadSuccess = name => {
        setProgress(100);
        setUploading(false);
        setImageName(name)
        firebase
            .storage
            .ref("products")
            .child(name)
            .getDownloadURL()
            .then(url => {
                setUrlImage(url);
            });
    };

    return (
        <Layout>
            {!user ? <Error404 /> : (
                <>
                    <h1
                        className={css`
                    text-align: center;
                    margin-top: 5rem;
                `}
                    >New Product</h1>
                    <Form
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <fieldset>
                            <legend>General Info</legend>

                            <Field>
                                <label htmlFor="name">Name</label>
                                <input type="text" id="name" placeholder="name" name="name" value={name} onChange={handleChange} onBlur={handleBlur} />
                            </Field>
                            {errors.name && <Error>{errors.name}</Error>}

                            <Field>
                                <label htmlFor="company">Company</label>
                                <input type="text" id="company" placeholder="company name" name="company" value={company} onChange={handleChange} onBlur={handleBlur} />
                            </Field>
                            {errors.company && <Error>{errors.company}</Error>}

                            <Field>
                                <label htmlFor="image">Image</label>
                                <FileUploader
                                    accept='image/*'
                                    id="image"
                                    name="image"
                                    randomizeFilename
                                    storageRef={firebase.storage.ref("products")}
                                    onUploadStart={handleUploadStart}
                                    onUploadError={handleUploadError}
                                    onUploadSuccess={handleUploadSuccess}
                                    onProgress={handleProgress} />
                            </Field>

                            <Field>
                                <label htmlFor="url">URL</label>
                                <input type="url" id="url" name="url" value={url} onChange={handleChange} onBlur={handleBlur} />
                            </Field>
                            {errors.url && <Error>{errors.url}</Error>}
                        </fieldset>

                        <fieldset>
                            <legend>About your product</legend>
                            <Field>
                                <label htmlFor="description">Description</label>
                                <textarea id="description" name="description" value={description} onChange={handleChange} onBlur={handleBlur} />
                            </Field>
                            {errors.description && <Error>{errors.description}</Error>}
                        </fieldset>

                        {error && <Error>{error}</Error>}
                        <InputSubmit type="submit" value="Create Product" />
                    </Form>
                </>
            )}
        </Layout>
    );
}

export default NewProduct;