import React from 'react'
import Layout from '../components/layout/Layout'
import ProductDetail from '../components/layout/ProductDetail'
import useProducts from '../hooks/useProducts'

const Popular = () => {

    const { products } = useProducts('votes');

    return (
        <div>
            <Layout>
                <div className='list-products'>
                    <div className="container">
                        <div className="bg-white">
                            {products.map(product => (
                                <ProductDetail
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default Popular;