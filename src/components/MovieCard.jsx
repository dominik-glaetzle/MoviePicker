/**
 * MovieCard is a React functional component used to display movie details in a structured format. It shows the movie title, rating, poster, language, and release year.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.movie - The movie object containing details about a specific movie.
 * @param {string} props.movie.title - The title of the movie.
 * @param {number} props.movie.vote_average - The average user rating for the movie.
 * @param {string} props.movie.poster_path - The path to the movie's poster image.
 * @param {string} props.movie.original_language - The language in which the movie was originally made.
 * @param {string} props.movie.release_date - The release date of the movie in YYYY-MM-DD format.
 *
 * @returns {JSX.Element} Renders a styled component displaying movie information.
 */
const MovieCard = ({ movie: { title, vote_average, poster_path, original_language, release_date } }) => {
    return (
        <div className={'movie-card'}>
            <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'} alt={title} />
            <div>
                <h3 className={'mt-4'}>{title}</h3>
                <div className={'content'}>
                    <div className={'rating'}>
                        <img src={'star.svg'} alt="Star Icon" />
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>
                    <span>•</span>
                    <p className={'lang'}>{original_language}</p>
                    <span>•</span>
                    <p className={'year'}>{release_date ? release_date.split('-')[0] : 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
