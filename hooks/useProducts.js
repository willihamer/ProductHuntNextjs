import React, { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../firebase';

const useProducts = order => {
    const [products, setProducts] = useState([]);
    const { firebase } = useContext(FirebaseContext);



    useEffect(() => {
        const getProducts = () => {
            firebase.db.collection('products').orderBy(order, 'desc').onSnapshot(handleSnapshot)
        }
        getProducts();
    }, []);

    function handleSnapshot(snapshot) {
        const prods = snapshot.docs.map(doc => {
            console.log(doc);
            return {
                id: doc.id,
                ...doc.data()
            }
        });
        setProducts(prods);
    }

    return {
        products
    }
}

export default useProducts;