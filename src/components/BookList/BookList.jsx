import React from 'react';
import BookCard from '../BookCard/BookCard';
import './BookList.css';

const BookList = ({ books }) => {
  if (books.length === 0) {
    return (
      <div className="book-list book-list--empty">
        <p className="book-list__empty-message">No se encontraron libros</p>
      </div>
    );
  }

  return (
    <div className="book-list">
      {books.map(book => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookList;
