// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./components/Home.jsx";
import Catalog from "./components/Catalog.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import Learn from "./components/Learn.jsx";
import Custom from "./components/Custom.jsx";
import Notify from "./components/Notify.jsx";
import Footer from "./components/Footer.jsx";
import { CartProvider } from "./cart/CartContext.jsx";
import "./App.css";

export default function App() {
    return (
        <CartProvider>
            <div className="layout">
                <Header />
                <main className="main">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Catalog />} />
                        <Route path="/product/:productId" element={<ProductDetail />} />
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
