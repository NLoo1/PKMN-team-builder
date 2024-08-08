
import Pokedex from 'pokedex-promise-v2';
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";
const P = new Pokedex();

/** API Class.
 *
 * Static class tying together methods used to get/send to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class PokeAPI {
  // the token for interacting with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get", token=PokeAPI.token) {
    console.debug("API Call:", endpoint, data, method);
    // There are multiple ways to pass an authorization token, this is how you pass it in the header.
    // This has been provided to show you another way to pass the token. You are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

    /** ----------------------------------- USERS ------------------------------------------------------------ */


  static async login(username, password) {
    let res = await this.request(`auth/token`, {username, password}, 'post');
    return res;
  }

  // Get a user by id
  static async getUser(username, token) {
    let res = await this.request(`users/${username}`, {}, "get", token)
    return res
  }

  // Get ALL users.
  static async getUsers(token) {
    let res = await this.request(`users/`, {}, 'get', token);
    return res.users;
  }

    /** Add a new user. */
  static async register({username, password, firstName, lastName, email}) {
    let res = await this.request(`auth/register`, {username, password, firstName, lastName, email}, 'post');
    return res
  }

  static async postUserAdmin({user, token}){
    let res = await this.request(`users/`, {user, token}, 'post');
    return res.user;
  }

  // Get all users matching an id, partial matches included.
  static async filterUsers(id) {
    let res = await this.request(`users?id=${id}`);
    return res.users;
  }

  /** Update details of a user by id. */
  static async patchUser(data, username, token) {
    let res = await this.request(`users/${username}`, data, 'patch', token);
    return res.company;
  }

  static async deleteUser(id, token) {
    let res = await this.request(`users/${id}`, {}, 'delete', token);
    return res;
  }



// POKEMON

static async getAllPokemon(){
  const interval = {
    limit: 2000
  }
  const resp = await P.getPokemonsList(interval)
  return resp
}

static async getPokemonSpriteByURL(url){
  const resp = await axios.get(url)
  return resp.data.sprites.front_default
}

static async getPokemonFromSearch(search){
}
}
// For now, put token ("testuser" / "password" on class)
PokeAPI.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
  "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
  "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

export default PokeAPI;
