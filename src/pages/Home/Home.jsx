import { useBookManager } from '../../hooks/useBookManager';
import BookList from '../../components/BookList/BookList';
import './Home.css';

const Home = () => {
  const { books } = useBookManager();
  
  const featuredBooks = books.filter(book => book.estado === 'DISPONIBLE').slice(0, 6);

  return (
    <div className="home">
      <section className="home__hero">
        <h1 className="home__title">Bienvenido a Biblioteca Online</h1>
        <p className="home__subtitle">
          Descubre, alquila y disfruta de nuestra colección de libros
        </p>
      </section>

      <section className="home__featured">
        <h2 className="home__section-title">Libros Destacados</h2>
        <BookList books={featuredBooks} />
      </section>
    </div>
  );
};

export default Home;
