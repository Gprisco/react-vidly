import jwtDecode from "jwt-decode";
import http from "./httpService";
import db from "../config/db_config.json";

const tokenKey = "token";

http.setJwt(getJwt());

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export const login = async (email, password) => {
  const {
    data: jwt
  } = await http.post(db.apiEndpoint + "/auth", {
    email,
    password
  });
  localStorage.setItem(tokenKey, jwt);
}

export const loginWithJwt = jwt => {
  localStorage.setItem(tokenKey, jwt);
}

export const logout = () => {
  localStorage.removeItem(tokenKey);
}

export const getCurrentUser = () => {

  //Return the user logged in, otherwise return null if an error occurs 
  //(e.g the user is anonymous)

  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export default {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt
}