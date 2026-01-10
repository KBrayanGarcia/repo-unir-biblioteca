import React from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({
  categorias = [],
  categoriaSeleccionada,
  onCategoriaChange,
  totalLibros,
}) => {
  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__title">Categorías</h3>
        <div className="filter-sidebar__options">
          <button
            className={`filter-sidebar__option ${
              categoriaSeleccionada === ''
                ? 'filter-sidebar__option--active'
                : ''
            }`}
            onClick={() => onCategoriaChange('')}
          >
            <span className="filter-sidebar__option-name">Todas</span>
            {totalLibros !== undefined && (
              <span className="filter-sidebar__option-count">({totalLibros})</span>
            )}
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria.name}
              className={`filter-sidebar__option ${
                categoriaSeleccionada === categoria.name
                  ? 'filter-sidebar__option--active'
                  : ''
              }`}
              onClick={() => onCategoriaChange(categoria.name)}
            >
              <span className="filter-sidebar__option-name">{categoria.name}</span>
              {categoria.count !== null && (
                <span className="filter-sidebar__option-count">({categoria.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
