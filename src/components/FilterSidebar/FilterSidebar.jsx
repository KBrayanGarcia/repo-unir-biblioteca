import React from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({
  categorias,
  categoriaSeleccionada,
  onCategoriaChange,
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
            Todas
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria}
              className={`filter-sidebar__option ${
                categoriaSeleccionada === categoria
                  ? 'filter-sidebar__option--active'
                  : ''
              }`}
              onClick={() => onCategoriaChange(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
