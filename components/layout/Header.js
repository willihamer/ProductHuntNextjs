import Link from 'next/link';
import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { css, cx } from '@emotion/css'
import Search from '../ui/Search';
import Navigation from './Navigation';
import Button from '../ui/Button';
import { FirebaseContext } from '../../firebase';

const HeaderContainer = styled.div`
    max-width: 1200px;
    width: 95%;
    margin: 0 auto;
    @media (min-width:768px) {
        display: flex;
        justify-content: space-between;
    }
`;

const Logo = styled.a`
    color: var(--orange);
    font-size: 4rem;
    font-weight: 700;
    font-family: 'Roboto Slab', serif;
    margin-right: 2rem;
`;

const Header = () => {

    const { user, firebase } = useContext(FirebaseContext);
    return (
        <header
            className={css`
                border-bottom: 2px solid var(--gris3);
                padding: 1rem 0;
            `}
        >
            <HeaderContainer>
                <div
                    className={css`
                    display:flex;
                    align-items: center;
                `}
                >
                    <Link href="/">
                        <Logo>P</Logo>
                    </Link>
                    <Search />

                    <Navigation />
                </div>
                <div
                    className={css`
                        display: flex;
                        align-items: center;
                    `}
                >
                    {user ? (
                        <>
                            <p className={css`
                            margin-right: 2rem;
                        `}
                            >Hello: {user.displayName}</p>

                            <Button bgColor="true" onClick={() => firebase.signOut()}>Sign Out</Button>

                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button>Login</Button>
                            </Link>
                            <Link href="/createaccount">
                                <Button>Create Account</Button>
                            </Link>
                        </>
                    )}
                </div>
            </HeaderContainer>
        </header>
    );
}

export default Header;