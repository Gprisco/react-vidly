import React from "react";

const MovieDetails = props => {
  const handleSave = () => {
    //operations.........
    props.history.replace("/movies");
  }

  return (
    <div className="container">
      <h1>Movie {props.match.params.id}</h1>
      <button onClick={handleSave} className="btn btn-primary btn-sm">Save</button>
    </div>
  );
};

export default MovieDetails;
