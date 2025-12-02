
import React, { useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import StatusBadge from '../StatusBadge/StatusBadge';
import RentalButton from '../RentalButton/RentalButton';
import { useBookManager } from '../../hooks/useBookManager';
import { useAuth } from '../../context/AuthContext';
import { DEFAULT_BOOK_IMAGE } from '../../constants';
import './BookDetail.css';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getLibroById, alquilarLibro, devolverLibro } = useBookManager();
  const { isAuthenticated, user } = useAuth();
  const book = getLibroById(Number(id));
  const [imgError, setImgError] = useState(false);

  if (!book) {
    return (
      <div className="book-detail book-detail--not-found">
        <h2>Libro no encontrado</h2>
        <button onClick={() => navigate('/catalogo')} className="rental-button">
          Volver al catálogo
        </button>
      </div>
    );
  }

  const handleRental = () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    if (book.estado === 'DISPONIBLE') {
      alquilarLibro(book.id, user.id);
    } else {
      devolverLibro(book.id, user.id);
    }
  };

  return (
    <div className="book-detail">
      <div className="book-detail__container">
        <div className="book-detail__cover">
          <img
            src={imgError ? DEFAULT_BOOK_IMAGE : book.imagen_portada}
            alt={book.titulo}
            className="book-detail__image"
            onError={() => setImgError(true)}
          />
          <div className="book-detail__status">
            <StatusBadge estado={book.estado} />
          </div>
        </div>

        <div className="book-detail__info">
          <h1 className="book-detail__title">{book.titulo}</h1>
          <p className="book-detail__author">Por {book.autor}</p>

          <div className="book-detail__metadata">
            <div className="book-detail__meta-item">
              <span className="book-detail__meta-label">Año:</span>
              <span className="book-detail__meta-value">{book.anio_publicacion}</span>
            </div>
            <div className="book-detail__meta-item">
              <span className="book-detail__meta-label">ISBN:</span>
              <span className="book-detail__meta-value">{book.isbn13}</span>
            </div>
            <div className="book-detail__meta-item">
              <span className="book-detail__meta-label">Categoría:</span>
              <span className="book-detail__meta-value">{book.categoria}</span>
            </div>
            {book.fecha_devolucion && (
              <div className="book-detail__meta-item">
                <span className="book-detail__meta-label">Fecha de devolución:</span>
                <span className="book-detail__meta-value">{book.fecha_devolucion}</span>
              </div>
            )}
          </div>

          <div className="book-detail__synopsis">
            <h3 className="book-detail__synopsis-title">Sinopsis</h3>
            <p className="book-detail__synopsis-text">{book.sinopsis}</p>
          </div>

          <div className="book-detail__actions">
            {book.estado === 'ALQUILADO' && book.rentedBy !== user?.id ? (
              <button className="rental-button rental-button--disabled" disabled>
                No Disponible
              </button>
            ) : (
              <RentalButton
                estado={book.estado}
                onClick={handleRental}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
