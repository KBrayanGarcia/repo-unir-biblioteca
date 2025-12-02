import { useBookStorage } from './useBookStorage';
import { useBookOperations } from './useBookOperations';
import { BOOK_STATUS } from '../types';

// Orchestrator hook
export const useBookManager = () => {
  const { books, loading, saveBooks } = useBookStorage();
  const { alquilarLibro, devolverLibro, extenderPlazo } = useBookOperations(books, saveBooks);

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
    loading,
    alquilarLibro,
    devolverLibro,
    extenderPlazo,
    getLibrosAlquilados,
    getLibroById,
  };
};
