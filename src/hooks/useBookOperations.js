import { BOOK_STATUS } from '../types';
import { prestarLibro, devolverLibroApi, extenderPlazoApi } from '../api/api';

export const useBookOperations = (books, saveBooks) => {
  const alquilarLibro = async (id, userId) => {
    const book = books.find(b => b.id === id);
    if (!book || book.estado === BOOK_STATUS.ALQUILADO) {
      return false;
    }

    try {
      await prestarLibro({
        id,
        userId,
        timestamp: new Date().toISOString()
      });

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

      saveBooks(updatedBooks);
      return true;
    } catch (error) {
      console.error('No se pudo alquilar el libro a través del operador:', error);
      return false;
    }
  };

  const devolverLibro = async (id, userId) => {
    const book = books.find(b => b.id === id);
    if (!book || book.estado === BOOK_STATUS.DISPONIBLE) {
      return false;
    }

    if (book.rentedBy !== userId) {
      console.error('Intento de devolución no autorizado: El libro no pertenece al usuario');
      return false;
    }

    try {
      await devolverLibroApi({
        id,
        userId,
        timestamp: new Date().toISOString()
      });

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

      saveBooks(updatedBooks);
      return true;
    } catch (error) {
      console.error('No se pudo devolver el libro a través del operador:', error);
      return false;
    }
  };

  const extenderPlazo = async (id, dias) => {
    const book = books.find(b => b.id === id);
    if (!book || book.estado === BOOK_STATUS.DISPONIBLE || !book.fecha_devolucion) {
      return false;
    }

    try {
      await extenderPlazoApi({
        id,
        dias,
        timestamp: new Date().toISOString()
      });

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

      saveBooks(updatedBooks);
      return true;
    } catch (error) {
      console.error('No se pudo extender el plazo a través del operador:', error);
      return false;
    }
  };

  return {
    alquilarLibro,
    devolverLibro,
    extenderPlazo,
  };
};
