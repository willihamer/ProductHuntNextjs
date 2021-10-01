import React, { useEffect, useState } from 'react';
import firebase from '../firebase';

function useAuthentication() {
    const [userAuthenticated, setUserAuthenticated] = useState(null);

    useEffect(() => {
        const unsubscribe = firebase.auth.onAuthStateChanged(user => {
            if (user) {
                setUserAuthenticated(user);
            } else {
                setUserAuthenticated(null);
            }
        });
        return () => unsubscribe();
    }, []);

    return userAuthenticated;
}

export default useAuthentication;

