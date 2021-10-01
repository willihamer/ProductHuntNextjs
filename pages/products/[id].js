import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { FirebaseContext } from '../../firebase';
import Layout from '../../components/layout/Layout';
import { css, cx } from '@emotion/css'
import styled from '@emotion/styled';
import { formatDistanceToNow } from 'date-fns';
import { Field, InputSubmit } from '../../components/ui/Form';
import Button from '../../components/ui/Button';
import Error404 from '../../components/layout/404';

const ProductContainer = styled.div`
   @media (min-width:768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
   }
`;
const ProductCreator = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`

const Product = () => {

    const [product, setProduct] = useState({});
    const [error, setError] = useState(false);
    const [comment, setComment] = useState({});
    const [consultDatabase, setConsultDatabase] = useState(true);

    const router = useRouter();
    const { query: { id } } = router;

    const { firebase, user } = useContext(FirebaseContext);

    useEffect(() => {
        if (id && consultDatabase) {
            const getProduct = async () => {
                const productQuery = await firebase.db.collection('products').doc(id);
                const product = await productQuery.get();
                if (product.exists) {
                    setProduct(product.data());
                    setConsultDatabase(false);
                } else {
                    setError(true);
                    setConsultDatabase(false);
                }
            }
            getProduct();
        }
    }, [id, product]);

    if (Object.keys(product).length === 0 && !error) return 'Loading...';

    const { comments, createAt, description, company, name, url, urlImage, votes, creator, hasVoted } = product;

    const voteProduct = () => {
        if (!user) {
            return router.push('/login');
        }

        if (hasVoted.includes(user.uid)) return;
        const newTotal = votes + 1;
        const newTotalVotes = [...hasVoted, user.uid]
        firebase.db.collection('products').doc(id).update({ votes: newTotal, hasVoted: newTotalVotes });
        setProduct({
            ...product,
            votes: newTotal
        })
        setConsultDatabase(true);
    }

    const commentChange = e => {
        setComment({
            ...comment,
            [e.target.name]: e.target.value
        })
    }

    const isCreator = id => {
        if (creator.id === id) {
            return true;
        }
    }

    const addComment = (e) => {
        e.preventDefault();

        if (!user) return router.push('./login');

        comment.userId = user.uid;
        comment.username = user.displayName;

        const newComments = [...comments, comment];

        firebase.db.collection('products').doc(id).update({
            comments: newComments
        });

        setProduct({
            ...product,
            comments: newComments
        });
        setConsultDatabase(true);
    }

    const canDelete = () => {
        if (!user) return false;

        if (creator.id === user.uid) {
            return true;
        }

    }

    const deleteProduct = async () => {

        if (!user) return router.push('./login');
        if (creator.id !== user.uid) return router.push('/');
        
        try {
            await firebase.db.collection('products').doc(id).delete();
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <>
                {error ? <Error404 /> : (

                    <div className="container">
                        <h1 className={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}>{name}</h1>
                        <ProductContainer>
                            <div>
                                <p>Published: {formatDistanceToNow(new Date(createAt))} ago</p>
                                <p>By: {creator.name} from {company}</p>
                                <img src={urlImage} alt="image" />
                                <p>{description}</p>
                                {user && (
                                    <>
                                        <h2>Add your comment</h2>
                                        <form
                                            onSubmit={addComment}
                                        >
                                            <Field>
                                                <input
                                                    type="text"
                                                    name="message"
                                                    onChange={commentChange}
                                                />
                                            </Field>
                                            <InputSubmit
                                                type="submit"
                                                value="Add comment"
                                            />
                                        </form>
                                    </>
                                )}
                                <h2
                                    className={css`margin-top: 2rem;`}
                                >Comments</h2>

                                {comments.length === 0 ? "There is not comments yet" : (
                                    <ul>
                                        {comments.map((comment, index) => (
                                            <li
                                                key={index}
                                                className={css`
                                                border: 1px solid #e1e1e1;
                                                padding: 2rem;
                                            `}
                                            >
                                                <p>{comment.message}</p>
                                                <p>
                                                    Written by:
                                                    <span className={css`
                                                    font-weight: bold;
                                                `}>
                                                        {' '} {comment.username}
                                                    </span>
                                                </p>
                                                {isCreator(comment.userId) && (
                                                    <ProductCreator>Is creator</ProductCreator>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <aside>
                                <Button
                                    target="_blank"
                                    bgColor="true"
                                    href={url}
                                >Visit URL</Button>
                                <div className={css`margin-top: 5rem;`}>
                                    <p className={css`text-align: center`}>{votes} Votes</p>
                                    {user && (
                                        <Button
                                            onClick={voteProduct}
                                        >
                                            Vote
                                        </Button>
                                    )}
                                </div>
                            </aside>
                        </ProductContainer>
                        {canDelete() &&
                            <Button
                                onClick={deleteProduct}
                            >Delete Product</Button>
                        }
                    </div>
                )}
            </>
        </Layout>
    );
}

export default Product;