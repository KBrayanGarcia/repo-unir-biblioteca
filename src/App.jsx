import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import BookDetailPage from './pages/BookDetailPage/BookDetailPage';
import Login from './pages/Login/Login';
import MyRentals from './pages/MyRentals/MyRentals';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="catalogo" element={<Catalog />} />
            <Route path="libro/:id" element={<BookDetailPage />} />
            <Route path="login" element={<Login />} />
            <Route
              path="mis-prestamos"
              element={
                <ProtectedRoute>
                  <MyRentals />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
