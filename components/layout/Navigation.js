import styled from '@emotion/styled';
import Link from 'next/link';
import React, { useContext } from 'react';
import { FirebaseContext } from '../../firebase';

const Nav = styled.nav`
    padding-left: 2rem;
    a {
        font-size: 1.8rem;
        margin-left: 2rem;
        color: var(--gray2);
        font-family: 'PT Sans', sans-serif;
        &:last-of-type {
            margin-right: 0;
        }
    }
`;



const Navigation = () => {

    const { user } = useContext(FirebaseContext);

    return (
        <Nav>
            <Link href="/">
                <a>Home</a>
            </Link>
            <Link href="/popular">
                <a>Popular</a>
            </Link>
            {user && (
                <Link href="/newproduct">
                    <a>New Product</a>
                </Link>
            )}
        </Nav>
    );
}

export default Navigation;