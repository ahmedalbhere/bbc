import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BarcodeScanner from './components/BarcodeScanner';
import Products from './components/Products';
import Cart from './components/Cart';
import Reports from './components/Reports';
import Navbar from './components/Navbar';
import Login from './components/Login';
import api from './api';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/verify').then(res => {
        setIsAuthenticated(true);
        setUser(res.data.user);
      }).catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, []);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const checkout = async () => {
    try {
      await api.post('/sales', { items: cart });
      toast.success('تمت عملية البيع بنجاح');
      setCart([]);
    } catch (err) {
      toast.error('حدث خطأ أثناء عملية البيع');
    }
  };

  if (!isAuthenticated) {
    return <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />;
  }

  return (
    <Router>
      <div className="app">
        <Navbar user={user} setIsAuthenticated={setIsAuthenticated} />
        <ToastContainer position="top-right" rtl />
        
        <div className="container mt-4">
          <Switch>
            <Route path="/" exact>
              <BarcodeScanner onScan={addToCart} />
              <Products products={products} setProducts={setProducts} onAddToCart={addToCart} />
            </Route>
            <Route path="/cart">
              <Cart 
                cart={cart} 
                onRemove={removeFromCart} 
                onUpdateQuantity={updateQuantity} 
                onCheckout={checkout} 
              />
            </Route>
            <Route path="/reports">
              <Reports />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
