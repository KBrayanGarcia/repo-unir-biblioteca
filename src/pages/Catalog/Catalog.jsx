import { useState, useMemo } from 'react';
import { useBookManager } from '../../hooks/useBookManager';
import BookList from '../../components/BookList/BookList';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import './Catalog.css';

const Catalog = () => {
  const { books } = useBookManager();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(books.map(book => book.categoria)));
    return uniqueCategories.sort();
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch =
        book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.autor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory =
        selectedCategory === '' || book.categoria === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [books, searchTerm, selectedCategory]);

  return (
    <div className="catalog">
      <h1 className="catalog__title">Catálogo Completo</h1>
      
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <div className="catalog__content">
        <FilterSidebar
          categorias={categories}
          categoriaSeleccionada={selectedCategory}
          onCategoriaChange={setSelectedCategory}
        />

        <div className="catalog__books">
          <p className="catalog__results">
            {filteredBooks.length} {filteredBooks.length === 1 ? 'libro encontrado' : 'libros encontrados'}
          </p>
          <BookList books={filteredBooks} />
        </div>
      </div>
    </div>
  );
};

export default Catalog;
