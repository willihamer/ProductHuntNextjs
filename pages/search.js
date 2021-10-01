import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import ProductDetail from '../components/layout/ProductDetail'
import useProducts from '../hooks/useProducts'

const Search = () => {

    const router = useRouter();
    const { query: { q } } = router;

    const { products } = useProducts('createAt');
    const [result, setResult] = useState([]);

    useEffect(() => {
        const dataSearch = q.toLowerCase();
        const filter = products.filter(product => {
            return (
                product.name.toLowerCase().includes(dataSearch) ||
                product.description.toLowerCase().includes(dataSearch)
            )
        });
        setResult(filter);
    }, [q, products])

    return (
        <Layout>
            <div className='list-products'>
                <div className="container">
                    <div className="bg-white">
                        {result.map(product => (
                            <ProductDetail
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Search;