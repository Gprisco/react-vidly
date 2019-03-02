import http from "./httpService";
import db from "../config/db_config.json";

export const register = user => {
  return http.post(db.apiEndpoint + "/users", {
    email: user.username,
    password: user.password,
    name: user.name
  });
};