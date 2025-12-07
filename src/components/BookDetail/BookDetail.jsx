
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

  const reviews = book?.criticas ?? [];
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.puntuacion, 0) / reviews.length).toFixed(1)
    : null;

  const sortedReviews = [...reviews].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

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

          {/* Sección de Críticas */}
          <div className="book-detail__reviews">
            <div className="book-detail__reviews-header">
              <h3 className="book-detail__reviews-title">Críticas de lectores</h3>
              {averageRating && (
                <div className="book-detail__rating">
                  <span className="book-detail__rating-value">{averageRating}</span>
                  <span className="book-detail__rating-stars">{'⭐'.repeat(Math.round(averageRating))}</span>
                  <span className="book-detail__rating-count">({reviews.length} {reviews.length === 1 ? 'crítica' : 'críticas'})</span>
                </div>
              )}
            </div>

            {reviews.length === 0 ? (
              <p className="book-detail__no-reviews">Sin críticas disponibles</p>
            ) : (
              <div className="book-detail__reviews-list">
                {sortedReviews.map((review, index) => (
                  <div key={index} className="book-detail__review-item">
                    <div className="book-detail__review-header">
                      <span className="book-detail__review-user">{review.usuario}</span>
                      <span className="book-detail__review-rating">
                        {'⭐'.repeat(review.puntuacion)}
                      </span>
                    </div>
                    <p className="book-detail__review-comment">{review.comentario}</p>
                    <span className="book-detail__review-date">
                      {new Date(review.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
