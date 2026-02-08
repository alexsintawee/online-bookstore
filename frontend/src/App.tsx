import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getSiteTitle } from './core/config';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';

function App() {
  useEffect(() => {
    document.title = getSiteTitle();
  }, []);

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:sku" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
