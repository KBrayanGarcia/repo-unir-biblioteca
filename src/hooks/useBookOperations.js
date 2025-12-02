import { BOOK_STATUS } from '../types';

export const useBookOperations = (books, saveBooks) => {
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

    saveBooks(updatedBooks);
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

    saveBooks(updatedBooks);
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

    saveBooks(updatedBooks);
    return true;
  };

  return {
    alquilarLibro,
    devolverLibro,
    extenderPlazo,
  };
};
