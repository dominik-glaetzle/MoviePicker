import { useState, useEffect, use } from 'react';
import { useDebounce } from 'react-use';
import Search from './components/Search.jsx';
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import { getTrendingMovies, updateSearchCount } from './appwrite.js';

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
    const [allErrorMessage, setAllErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [trendingMovies, setTrendingMovies] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // Debounce the search term so we don't make a request for every keystroke
    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

    /*
     * Fetch movies from the API
     * @param {string} query - Search query
     * @returns {Promise<void>}
     */
    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        setAllErrorMessage('');
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
                allErrorMessage(data.Error || 'Failed to fetch movies');
                setMovies([]);
                return;
            }
            setMovies(data.results || []);
            if (query && data.results.length > 0) {
                updateSearchCount(query, data.results[0]);
            }
        } catch (error) {
            console.error(`Error fetching movies: ${error}`);
            setAllErrorMessage('Error fetching movies. Please try again later.');
        } finally {
            setIsLoading(false);
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
            setIsLoading(true);
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        } catch (error) {
            console.error(`Error fetching trending movies: ${error}`);
            setErrorMessage('Error fetching trending movies. Please try again later.');
        } finally {
            setIsLoading(false);
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

                {isLoading ? (
                    <Spinner />
                ) : errorMessage ? (
                    <p className="text-red-500">{errorMessage}</p>
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

                <section className={'all-movies'}>
                    <h2>All Movies</h2>
                    {isLoading ? (
                        <Spinner />
                    ) : allErrorMessage ? (
                        <p className={'text-red-500'}>{errorMessage}</p>
                    ) : (
                        <ul>
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
