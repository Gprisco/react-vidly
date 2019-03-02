import http from "./httpService";
import db from "../config/db_config.json";

export const getMovies = () => {
  const movies = http.get(db.apiEndpoint + "/movies");

  return movies;
};

export const deleteMovie = _id => {
  return http.delete(db.apiEndpoint + `/movies/${_id}`);
};

export const saveMovie = async (movie, _id) => {
  let savedMovie = {};

  if (_id !== "new")
    savedMovie = http.put(db.apiEndpoint + `/movies/${_id}`, movie);
  else
    savedMovie = http.post(db.apiEndpoint + "/movies", movie);

  return savedMovie;
};