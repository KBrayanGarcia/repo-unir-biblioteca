import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../StatusBadge/StatusBadge';
import { DEFAULT_BOOK_IMAGE } from '../../constants';
import './BookCard.css';

const BookCard = ({ book }) => {
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <Link to={`/libro/${book.id}`} className="book-card">
      <div className="book-card__image-container">
        <img
          src={imgError ? DEFAULT_BOOK_IMAGE : book.imagen_portada}
          alt={book.titulo}
          className="book-card__image"
          onError={handleImageError}
        />
        <div className="book-card__badge">
          <StatusBadge estado={book.estado} />
        </div>
      </div>
      <div className="book-card__content">
        <h3 className="book-card__title">{book.titulo}</h3>
        <p className="book-card__author">{book.autor}</p>
        <div className="book-card__meta">
          <span className="book-card__category">{book.categoria}</span>
          <span className="book-card__year">{book.anio_publicacion}</span>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
