import 'react';

/**
 * A functional React component that renders a search input field with an accompanying search icon.
 *
 * @param {Object} props - The props object for the component.
 * @param {string} props.searchTerm - The current value of the search input field.
 * @param {Function} props.setSearchTerm - The function to update the searchTerm state when the input value changes.
 * @returns {JSX.Element} - A rendered search component containing an input field and a search icon.
 */
const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className={'search'}>
            <div>
                <img src={'./search.svg'} alt={'search'} />
                <input
                    type={'text'}
                    placeholder={'Search through thousands of movies'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    );
};
export default Search;
