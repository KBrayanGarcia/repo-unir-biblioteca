import { useState } from 'react';
import { useBookManager } from '../../hooks/useBookManager';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import RentalButton from '../../components/RentalButton/RentalButton';
import { DEFAULT_BOOK_IMAGE } from '../../constants';
import './MyRentals.css';
import { Link } from 'react-router-dom';

const MyRentals = () => {
  const { user } = useAuth();
  const { getLibrosAlquilados, devolverLibro, extenderPlazo } = useBookManager();
  const rentedBooks = getLibrosAlquilados(user?.id);
  const [extendDays, setExtendDays] = useState({});
  const [imgErrors, setImgErrors] = useState({});
  
  const handleImageError = (bookId) => {
    setImgErrors(prev => ({ ...prev, [bookId]: true }));
  };

  const handleReturn = (bookId) => {
    if (user) {
      const success = devolverLibro(bookId, user.id);
      if (!success) {
        alert('No se pudo devolver el libro. Verifica que sea tuyo.');
      }
    }
  };

  const handleExtend = (bookId) => {
    const days = extendDays[bookId] || 7;
    extenderPlazo(bookId, days);
    alert(`Plazo extendido por ${days} días`);
  };

  const handleExtendDaysChange = (bookId, days) => {
    setExtendDays(prev => ({ ...prev, [bookId]: days }));
  };

  if (rentedBooks.length === 0) {
    return (
      <div className="my-rentals">
        <h1 className="my-rentals__title">Mis Préstamos</h1>
        <div className="my-rentals__empty">
          <p className="my-rentals__empty-text">No tienes libros alquilados actualmente</p>
          <Link to="/catalogo" className="my-rentals__empty-link">
            Explorar catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-rentals">
      <h1 className="my-rentals__title">Mis Préstamos</h1>
      <p className="my-rentals__subtitle">
        Tienes {rentedBooks.length} {rentedBooks.length === 1 ? 'libro alquilado' : 'libros alquilados'}
      </p>

      <div className="my-rentals__list">
        {rentedBooks.map(book => (
          <div key={book.id} className="rental-card">
            <div className="rental-card__image-container">
              <img
                src={imgErrors[book.id] ? DEFAULT_BOOK_IMAGE : book.imagen_portada}
                alt={book.titulo}
                className="rental-card__image"
                onError={() => handleImageError(book.id)}
              />
              <div className="rental-card__badge">
                <StatusBadge estado={book.estado} />
              </div>
            </div>

            <div className="rental-card__content">
              <h3 className="rental-card__title">{book.titulo}</h3>
              <p className="rental-card__author">{book.autor}</p>
              
              <div className="rental-card__info">
                <div className="rental-card__info-item">
                  <span className="rental-card__label">Fecha de devolución:</span>
                  <span className="rental-card__value">{book.fecha_devolucion}</span>
                </div>
              </div>

              <div className="rental-card__actions">
                <RentalButton
                  estado={book.estado}
                  onClick={() => handleReturn(book.id)}
                  className="rental-card__button rental-card__button--return"
                />

                <div className="rental-card__extend">
                  <select
                    value={extendDays[book.id] || 7}
                    onChange={(e) => handleExtendDaysChange(book.id, Number(e.target.value))}
                    className="rental-card__select"
                  >
                    <option value={7}>7 días</option>
                    <option value={14}>14 días</option>
                    <option value={21}>21 días</option>
                  </select>
                  <button
                    onClick={() => handleExtend(book.id)}
                    className="rental-card__button rental-card__button--extend"
                  >
                    Extender
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRentals;
