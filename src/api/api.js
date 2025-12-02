import axios from 'axios';

const api = axios.create({
  baseURL: '/', 
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

export const fetchUsers = async () => {
  try {
    const response = await api.get('/data/users.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};



export default {
  fetchBooks,
  fetchUsers,
};
