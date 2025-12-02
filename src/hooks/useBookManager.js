import { useState, useEffect } from 'react';
import { BOOK_STATUS } from '../types';
import { booksData } from '../data/books';

const STORAGE_KEY_LIBROS = 'biblioteca_books';

// Con persistencia de datos en localStorage
export const useBookManager = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const storedBooks = localStorage.getItem(STORAGE_KEY_LIBROS);
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
      setBooks(booksData);
      localStorage.setItem(STORAGE_KEY_LIBROS, JSON.stringify(booksData));
    }
  }, []);

  const alquilarLibro = (id, userId) => {
    const book = books.find(b => b.id === id);
    if (!book || book.estado === BOOK_STATUS.ALQUILADO) {
      return false;
    }

    const updatedBooks = books.map(b => {
      if (b.id === id) {
        const fechaDevolucion = new Date();
        fechaDevolucion.setDate(fechaDevolucion.getDate() + 14);
        return {
          ...b,
          estado: BOOK_STATUS.ALQUILADO,
          fecha_devolucion: fechaDevolucion.toISOString().split('T')[0],
          rentedBy: userId,
        };
      }
      return b;
    });

    setBooks(updatedBooks);
    localStorage.setItem(STORAGE_KEY_LIBROS, JSON.stringify(updatedBooks));
    return true;
  };

  const devolverLibro = (id, userId) => {
    const book = books.find(b => b.id === id);
    if (!book || book.estado === BOOK_STATUS.DISPONIBLE) {
      return false;
    }

    if (book.rentedBy !== userId) {
      console.error('Intento de devolución no autorizado: El libro no pertenece al usuario');
      return false;
    }

    const updatedBooks = books.map(b => {
      if (b.id === id) {
        return {
          ...b,
          estado: BOOK_STATUS.DISPONIBLE,
          fecha_devolucion: null,
          rentedBy: null,
        };
      }
      return b;
    });

    setBooks(updatedBooks);
    localStorage.setItem(STORAGE_KEY_LIBROS, JSON.stringify(updatedBooks));
    return true;
  };

  const extenderPlazo = (id, dias) => {
    const book = books.find(b => b.id === id);
    if (!book || book.estado === BOOK_STATUS.DISPONIBLE || !book.fecha_devolucion) {
      return false;
    }

    const nuevaFecha = new Date(book.fecha_devolucion);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);

    const updatedBooks = books.map(b => {
      if (b.id === id) {
        return {
          ...b,
          fecha_devolucion: nuevaFecha.toISOString().split('T')[0],
        };
      }
      return b;
    });

    setBooks(updatedBooks);
    localStorage.setItem(STORAGE_KEY_LIBROS, JSON.stringify(updatedBooks));
    return true;
  };

  const getLibrosAlquilados = (userId) => {
    return books.filter(book => {
      const isAlquilado = book.estado === BOOK_STATUS.ALQUILADO;
      if (userId) {
        return isAlquilado && book.rentedBy === userId;
      }
      return isAlquilado;
    });
  };

  const getLibroById = (id) => {
    return books.find(b => b.id === id);
  };

  return {
    books,
    alquilarLibro,
    devolverLibro,
    extenderPlazo,
    getLibrosAlquilados,
    getLibroById,
  };
};
