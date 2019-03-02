import React from "react";

const Search = props => {
  const { onSearch, value } = props;

  return (
    <form onSubmit={e => e.preventDefault()} onChange={e => onSearch(e)}>
      <div className="input-group mb-3">
        <input
          type="text"
          name="search"
          className="form-control"
          placeholder="Search..."
          defaultValue={value}
        />
      </div>
    </form>
  );
};

export default Search;
