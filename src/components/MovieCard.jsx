import { useState } from 'react';
import MovieModal from './MovieModal.jsx';

const MovieCard = ({ movie }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div
                className="movie-card cursor-pointer hover:opacity-80 transition duration-300"
                onClick={() => setIsOpen(true)}
            >
                <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'}
                    alt={movie.title}
                />
                <div>
                    <h3 className="mt-4">{movie.title}</h3>
                    <div className="content">
                        <div className="rating">
                            <img src="star.svg" alt="Star Icon" />
                            <p>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
                        </div>
                        <span>•</span>
                        <p className="lang">{movie.original_language}</p>
                        <span>•</span>
                        <p className="year">{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
                    </div>
                </div>
            </div>

            {isOpen && <MovieModal movie={movie} handleClose={() => setIsOpen(false)} />}
        </>
    );
};

export default MovieCard;
