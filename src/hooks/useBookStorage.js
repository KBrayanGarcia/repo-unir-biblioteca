import { useState, useEffect } from 'react';
import { fetchBooks } from '../api/api';

const STORAGE_KEY_LIBROS = 'biblioteca_books';

export const useBookStorage = () => {
  const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const loadBooks = async () => {
      const storedBooks = localStorage.getItem(STORAGE_KEY_LIBROS);
      if (storedBooks) {
        setBooks(JSON.parse(storedBooks));
        setLoading(false);
      } else {
        try {
          const apiBooks = await fetchBooks();
          setBooks(apiBooks);
          localStorage.setItem(STORAGE_KEY_LIBROS, JSON.stringify(apiBooks));
        } catch (error) {
          console.error('Ocurrio un error al cargar los libros:', error);
        } finally {
          setLoading(false);
        }
      }
    };

  useEffect(() => {
    loadBooks();
  }, []);

  const saveBooks = (newBooks) => {
    setBooks(newBooks);
    localStorage.setItem(STORAGE_KEY_LIBROS, JSON.stringify(newBooks));
  };

  return {
    books,
    loading,
    saveBooks,
  };
};
