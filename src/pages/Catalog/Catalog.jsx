import { useState, useMemo, useEffect } from 'react';
import { useBookManager } from '../../hooks/useBookManager';
import { searchBooks, fetchFacets, fetchSuggestions } from '../../api/api';
import BookList from '../../components/BookList/BookList';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import './Catalog.css';

const Catalog = () => {
  const { books } = useBookManager();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [facets, setFacets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [shouldFetchSuggestions, setShouldFetchSuggestions] = useState(true);

  useEffect(() => {
    const loadFacets = async () => {
      try {
        const categoriesFacets = await fetchFacets();
        setFacets(categoriesFacets);
      } catch (error) {
        console.error('Failed to fetch facets:', error);
      }
    };
    loadFacets();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      const trimmedSearch = searchTerm.trim();
      if (trimmedSearch.length > 0) {
        setIsLoadingSearch(true);
        try {
          if (shouldFetchSuggestions) {
            const [results, suggestionsList] = await Promise.all([
              searchBooks(trimmedSearch),
              fetchSuggestions(trimmedSearch)
            ]);
            setSearchResults(results);
            setSuggestions(suggestionsList);
          } else {
            const results = await searchBooks(trimmedSearch);
            setSearchResults(results);
            setSuggestions([]);
            setShouldFetchSuggestions(true);
          }
        } catch (error) {
          console.error('Search/Suggestions failed:', error);
          setSearchResults([]);
          setSuggestions([]);
        } finally {
          setIsLoadingSearch(false);
        }
      } else {
        setSearchResults([]);
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const categories = useMemo(() => {
    const activeBooks = searchTerm.trim().length > 0 ? searchResults : books;

    // Si hay búsqueda activa o no hay facets de la API, calculamos localmente para mayor precisión
    const categoryCounts = activeBooks.reduce((acc, book) => {
      if (book.categoria) {
        acc[book.categoria] = (acc[book.categoria] || 0) + 1;
      }
      return acc;
    }, {});

    // Combinar con los nombres de facetas de la API si existen, para asegurar que se muestren todas
    // aunque tengan count 0 (opcional, pero profesional)
    const apiCategoryNames = Array.isArray(facets) ? facets.map(f => typeof f === 'object' ? f.key : f) : [];
    const allCategoryNames = Array.from(new Set([...apiCategoryNames, ...Object.keys(categoryCounts)]));

    return allCategoryNames
      .map(name => ({
        name,
        count: categoryCounts[name] || 0
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [books, facets, searchResults, searchTerm]);

  const handleSuggestionClick = (suggestion) => {
    setShouldFetchSuggestions(false);
    setSearchTerm(suggestion);
  };

  const syncWithMockup = (externalBooks) => {
    return externalBooks.map(extBook => {
      const localBook = books.find(b => String(b.id) === String(extBook.id) || b.isbn13 === extBook.isbn13);
      return localBook ? { ...extBook, id: localBook.id, estado: localBook.estado, fecha_devolucion: localBook.fecha_devolucion } : extBook;
    });
  };

  const filteredBooks = useMemo(() => {
    let baseBooks = searchTerm.trim().length > 0 ? searchResults : books;
    
    // Sincronizar con el estado de alquileres local (mockup)
    baseBooks = syncWithMockup(baseBooks);

    return baseBooks.filter(book => {
      const matchesCategory =
        selectedCategory === '' || book.categoria === selectedCategory;

      return matchesCategory;
    });
  }, [books, searchResults, searchTerm, selectedCategory]);

  return (
    <div className="catalog">
      <h1 className="catalog__title">Catálogo Completo</h1>
      
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
      />

      <div className="catalog__content">
        <FilterSidebar
          categorias={categories}
          categoriaSeleccionada={selectedCategory}
          onCategoriaChange={setSelectedCategory}
          totalLibros={searchTerm.trim().length > 0 ? searchResults.length : books.length}
        />

        <div className="catalog__books">
          <p className="catalog__results">
            {isLoadingSearch 
              ? 'Buscando...' 
              : `${filteredBooks.length} ${filteredBooks.length === 1 ? 'libro encontrado' : 'libros encontrados'}`}
          </p>
          <BookList books={filteredBooks} />
        </div>
      </div>
    </div>
  );
};

export default Catalog;
