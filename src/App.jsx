import { useState, useEffect, use } from 'react';
import { useDebounce } from 'react-use';
import Search from './components/Search.jsx';
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import { getTrendingMovies, updateSearchCount } from './appwrite.js';
import SkeletionLoader from './components/TrendingLoader.jsx';
import MovieLoader from './components/MovieLoader.jsx';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Options for the API fetch request
 */
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    },
};

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const [movies, setMovies] = useState([]);
    const [movieError, setMovieError] = useState('');
    const [moviesLoading, setMoviesLoading] = useState(true);

    const [trendingMovies, setTrendingMovies] = useState([]);
    const [trendingError, setTrendingError] = useState('');
    const [trendingLoading, setTrendingLoading] = useState(false);

    // Debounce the search term so we don't make a request for every keystroke
    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

    /*
     * Fetch movies from the API
     * @param {string} query - Search query
     * @returns {Promise<void>}
     */
    const fetchMovies = async (query = '') => {
        setMoviesLoading(true);
        setMovieError('');
        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            const data = await response.json();

            if (data.Response === 'False') {
                movieError(data.Error || 'Failed to fetch movies');
                setMovies([]);
                return;
            }
            setMovies(data.results || []);
            if (query && data.results.length > 0) {
                updateSearchCount(query, data.results[0]);
            }
        } catch (error) {
            console.error(`Error fetching movies: ${error}`);
            setMovieError('Error fetching movies. Please try again later.');
        } finally {
            setMoviesLoading(true);
        }
    };
    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, []); // only load at mount

    const loadTrendingMovies = async () => {
        try {
            setTrendingLoading(true);
            setTrendingError('');
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        } catch (error) {
            console.error(`Error fetching trending movies: ${error}`);
            setTrendingError('Error fetching trending movies. Please try again later.');
        } finally {
            setTrendingLoading(false);
        }
    };

    return (
        <main>
            <div className={'pattern'} />

            <div className={'wrapper'}>
                <header>
                    <img src={'./hero.png'} alt={'Hero Banner'} />
                    <h1>
                        {' '}
                        Find <span className={'text-gradient'}>Movies</span> You'll Enjoy Without the Hassle
                    </h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                {trendingLoading ? (
                    <SkeletionLoader />
                ) : trendingError ? (
                    <p className="text-red-500">{trendingError}</p>
                ) : (
                    trendingMovies.length > 0 && (
                        <section className="trending">
                            <h2>Trending Movies</h2>
                            <ul>
                                {trendingMovies.map((movie, index) => (
                                    <li key={movie.$id}>
                                        <p>{index + 1}</p>
                                        <img src={movie.poster_url} alt={movie.title} />
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )
                )}

                <section className="all-movies">
                    <h2>All Movies</h2>
                    {moviesLoading ? (
                        <div className="flex flex-wrap gap-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <MovieLoader key={index} />
                            ))}
                        </div>
                    ) : movieError ? (
                        <p className="text-red-500">{movieError}</p>
                    ) : (
                        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {movies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}

export default App;
