import http from "./httpService";
import db from "../config/db_config.json";

export const getGenres = async () => {
  const genres = await http.get(db.apiEndpoint + "/genres");

  return genres;
};