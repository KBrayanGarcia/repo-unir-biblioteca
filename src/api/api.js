import axios from 'axios';

const gatewayUrl = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/', 
});

const buscadorApi = axios.create({
  baseURL: `${gatewayUrl}/buscador-service`,
});

const operadorApi = axios.create({
  baseURL: `${gatewayUrl}/operador-service`,
});

export const fetchBooks = async () => {
  try {
    const response = await api.get('/data/books.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

export const searchBooks = async (query) => {
  try {
    const response = await buscadorApi.get('/libros/buscar', {
      params: { q: query }
    });
    return response.data.content || [];
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

export const fetchSuggestions = async (query) => {
  try {
    const response = await buscadorApi.get('/libros/sugerencias', {
      params: { q: query }
    });
    return response.data.sugerencias || [];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

export const fetchFacets = async () => {
  try {
    const response = await buscadorApi.get('/libros/facets');
    console.log(response)
    return response.data.categorias || [];
  } catch (error) {
    console.error('Error fetching facets:', error);
    return [];
  }
};

export const fetchUsers = async () => {
  try {
    const response = await api.get('/data/users.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};


export const prestarLibro = async (data) => {
  try {
    const response = await operadorApi.post('/operador/prestar', data);
    return response.data;
  } catch (error) {
    console.error('Error en servicio de préstamo:', error);
    throw error;
  }
};

export const devolverLibroApi = async (data) => {
  try {
    const response = await operadorApi.post('/operador/devolver', data);
    return response.data;
  } catch (error) {
    console.error('Error en servicio de devolución:', error);
    throw error;
  }
};

export const extenderPlazoApi = async (data) => {
  try {
    const response = await operadorApi.put('/operador/extender', data);
    return response.data;
  } catch (error) {
    console.error('Error en servicio de extensión:', error);
    throw error;
  }
};

export default {
  fetchBooks,
  fetchUsers,
  searchBooks,
  fetchSuggestions,
  fetchFacets,
  prestarLibro,
  devolverLibroApi,
  extenderPlazoApi,
};
