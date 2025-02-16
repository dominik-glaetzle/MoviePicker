import React, { useEffect, useState } from 'react';

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

const MovieModal = ({ movie, handleClose }) => {
    const [trailerKey, setTrailerKey] = useState(null);

    const fetchTrailer = async (movieId) => {
        try {
            const endpoint = `${API_BASE_URL}/movie/${movieId}/videos`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('Failed to fetch trailer');
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (!data.results || data.results.length === 0) {
                setTrailerKey(null);
                console.error('No videos found for this movie.');
                return;
            }

            const trailer = data.results.find((video) => video.type === 'Trailer' && video.site === 'YouTube');

            if (trailer) {
                setTrailerKey(trailer.key);
            } else {
                setTrailerKey(null);
                console.error('No YouTube trailer found.');
            }
        } catch (error) {
            console.error(`Error fetching trailer: ${error}`);
        }
    };

    useEffect(() => {
        fetchTrailer(movie.id);
    }, [movie]);

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
            <div className="bg-black/60 backdrop-blur-md p-6 rounded-lg shadow-lg max-w-lg z-50 relative">
                <h2 className="text-xl text-white ">{movie.title}</h2>
                <h3 className="text-lg text-white">Description:</h3>
                <p className={'text-white'}>{movie.overview || 'No description available'}</p>
                <h3 className="text-lg text-white">Trailer:</h3>
                {trailerKey ? (
                    <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${trailerKey}`}
                        title={`${movie.title} Trailer`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="mt-4 rounded-lg"
                    ></iframe>
                ) : (
                    <p className="text-white">No trailer available.</p>
                )}
                <button onClick={handleClose} className="mt-4 px-4 py-2 bg-dark-100 text-white rounded">
                    Close
                </button>
            </div>
        </div>
    );
};

export default MovieModal;
