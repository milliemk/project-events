import React from "react";

type SearchProps = {
  handleInputSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

type ButtonProps = {
  handleSearchClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

type CombinedProps = SearchProps & ButtonProps;

function Search({
  handleInputSearch,
  handleSearchClick,
  handleKeyPress,
}: CombinedProps) {
  return (
    <div>
      <div
        className="search-button-group "
        color="primary"
        aria-label="Basic button group"
      >
        <input
          className="search-input poppins-regular"
          type="text"
          onChange={handleInputSearch}
          onKeyDown={handleKeyPress}
          placeholder="Search events..."
        />
        {
          <button onClick={handleSearchClick} className="search-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </button>
        }
      </div>
    </div>
  );
}

export default Search;
