import React from 'react';
import { css, cx } from '@emotion/css'


const Error404 = () => {
    return (
        <h1
            className={css`
                margin-top: 5rem;
                text-align: center;
            `}
        >The page can't be found </h1>
    );
}

export default Error404;