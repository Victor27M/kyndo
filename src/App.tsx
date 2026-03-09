import { Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/cart/CartContext';
import Header from '@/components/Header';
import Home from '@/components/Home';
import Catalog from '@/components/Catalog';
import ShopProduct from '@/components/ShopProduct';
import Learn from '@/components/Learn';
import Custom from '@/components/Custom';
import Notify from '@/components/Notify';
import Footer from '@/components/Footer';
import '@/App.css';

export default function App(): React.JSX.Element {
  return (
    <CartProvider>
      <div className="layout">
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Catalog />} />
            <Route path="/shop/:productSlug" element={<ShopProduct />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/custom" element={<Custom />} />
            <Route path="/notify" element={<Notify />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
