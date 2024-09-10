import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 * @description Static class tying together methods used to get/send to the API.
 * @async
*/
class PokeAPI {
  // the token for interacting with the API will be stored here.
  static token;

/** General method for handling axios request 
 * @param {String} endpoint
 * @param {JSON} data 
 * @param {String} method - post, patch, update, get, delete, etc
 * @param {String} token - requests won't work with no token
 * @returns {*} - relevant data 
 */

  static async request(endpoint, data = {}, method = "get", token=PokeAPI.token) {

    // API related info will be logged for each request

    console.debug("API Call:", endpoint, data, method);
    // console.debug("Token: " + token)
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {

      // Any errors such as unauthorized will display here
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }


    /** ----------------------------------- USERS ------------------------------------------------------------ */


  /**
   * @typedef {User}
   * @property {String} username
   * @property {String} password 
   * @property {String} email
   * @property {Boolean} is_admin
   */

  /**
   * Login a user.
   * @param {String} username 
   * @param {String} password 
   * @returns {username, email, is_admin}
   */ 
  static async login(username, password) {
    let res = await this.request(`auth/token`, {username, password}, 'post');
    return res;
  }

  /** Given a username, return data about user.
   * @param {String} username
   * @param {String} token 
   * @returns {User}
   * @throws {NotFoundError} if user not found.
   **/
  static async getUser(username, token) {
    let res = await this.request(`users/${username}`, {}, "get", token)
    return res
  }

  /**
   * Gets all users
   * @param {String} token 
   * @returns {[User]} 
   */
  static async getUsers(token) {
    let res = await this.request(`users/`, {}, 'get', token);
    return res.users;
  }

    
  /**
   * Register a user
   * @param {User} - username, password, and email
   * @returns {User} - username, email, isAdmin 
   */
  static async register({username, password, email}) {
    let res = await this.request(`auth/register`, {username, password, email}, 'post');
    return res
  }

  /**
   * Alternative way for admins to add a user
   * @param {User} - username, email, isAdmin
   * @param {String} token 
   * @returns {User} - {username, email, isAdmin} if successful
   */
  static async postUserAdmin({user, token}){
    let res = await this.request(`users/`, {user, token}, 'post');
    return res.user;
  }

  /**
   * Filters users given a string. Partial matches included
   * @description Search function
   * @param {String} username - String to filter by
   * @param {String} token  
   * @returns {Array} - List of found users
   * 
   * @example
   * console.log(filterUsers('test', 'testtoken')) // { [user, email, isAdmin], ... }
   */
  static async filterUsers(username, token) {
    let res = await this.request(`users?username=${username}`, {}, 'get', token);
    return res.users;
  }

  /** Update details of a user by id. 
   *
   * @param {User} data - data to update
   * @param {String} username
   * @param {String} token
  */
  static async patchUser(data, username, token) {
    let res = await this.request(`users/${username}`, data, 'patch', token);
    return res.user
  }

  /**
   * Delete a user
   * @param {String} username 
   * @param {String} token 
   * @returns
   */
  static async deleteUser(username, token) {
    let res = await this.request(`users/${username}`, {}, 'delete', token);
    return res;
  }



// POKEMON

/**
 * Gets data from PokeAPI given a range (offset + )
 * @param {*} offset Pokemon ID to start fetching data from
 * @param {*} limit Add this to offset to get the number of Pokemon in array
 * @returns Array of Pokemon
 */
static async getAllPokemon(offset = 0, limit = 100) {
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
  return response.data.results;
}

/**
 * Fetches Pokemon sprite from PokeAPI.
 * 
 * @async
 * @param {String} url - link to PokeAPI images   
 * @returns {String} - url for front sprite
 * 
 * @example 
 * let url = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/35.png'
 * let image = await getPokemonSpriteByURL(url)
 * <img src={image} /> The front sprite for Clefairy
 */
static async getPokemonSpriteByURL(url) {
  const response = await axios.get(url);
  return response.data.sprites.front_default;
}


// TODO: Filter by gen
static async getPokemonByGen(){

}


// TEAMS


/**
 * Gets all teams
 * @param {String} token 
 * @returns {[Team]} All teams
 */
static async getAllTeams(token){
  const response = this.request(`teams/`, {}, 'get', token)
  return response || []
}

/**
 * Fetch team given ID
 * @param {Integer} id - the team id
 * @param {String} token 
 * @returns the team.
 */
static async getTeamById(id, token){
  const response = this.request(`teams/${id}`, {}, 'get', token)
  return response
}

/**
 * Takes form data, logged in username and token to create a team.
 * 
 * @param {Object} data -- Should be formatted as {name (String), pokemon (Array)} 
 * @param {String} token 
 */
static async createTeam(data, token){


  const response = this.request(`teams`, 
    {
    team_name: data.team_name,
    user_id: data.user_id,
  }, 'post', token)
  return response
}


/**
 * Update a team
 * @param {Integer} id - team id
 * @param {*} data 
 * @param {String} token 
 */
static async patchTeam(id, data, token){
  const response = this.request(`teams/${id}`, {data}, 'patch', token)
  return response
}

/**
 * Delete a team
 * @param {Integer} id - team id
 * @param {String} token 
 */
static async deleteTeam(id, token){
  const response = this.request(`teams/${id}`, {}, 'delete', token)
}

// TEAMS_POKEMON
// Methods to modify Pokemon in a team. Requires a created team first in teams table

/**
 * Add pokemon to team
 * @param {*} data -> {team_id, user_id, Array(Pokemon)} 
 * @param {String} token 
 */
static async addPokemonToTeam(id, data, token) {
  const formattedPokemon = data.pokemon.map((poke, index) => ({
    pokemon_id: poke.pokemon_id,
    pokemon_name: poke.pokemon_name, 
    position: index + 1,          
    nickname: poke.nickname || ""
  }));

  const response = await this.request(
    `pokemon-teams/${id}`,
    {
      user_id: data.user_id,
      team_id: data.team_id,
      pokemon: formattedPokemon // Send as array of objects
    },
    'post',
    token
  );

  return response; // Ensure to return the response
}


static async getAllPokemonInTeam(id, token){
  const resp = await this.request(`pokemon-teams/${id}`, {}, 'get', token)
  return resp
}

// USER TEAMS
// This refers to all teams under one user

/**
 * Get all teams under a user
 * @description - teams are relative to currently logged in user
 * @param {String} token - passed from local storage
 */
static async getAllUserTeams(token){
  const response = this.request(`my-teams/`, {}, 'get', token)
  return response
}

/**
 * @deprecated Serves same purpose as teams/id GET
 * 
 * Get a user's team
 * @param {Integer} id 
 * @param {*} token 
 * @returns the users team
 */
static async getUserTeamById(id, token){
  const response = this.request(`user-teams/${id}`, {}, 'get', token)
  return response
}

// Add a Pokemon to a team
static async createUserTeam(data, token){
  const response = this.request(`user-teams`, {data}, 'post', token)
  return response
}

/**
 * 
 * @param {*} id 
 * @param {*} data 
 * @param {*} token 
 * @returns 
 */
static async patchUserTeam(id, data, token){
  const response = this.request(`user-teams/${id}`, {data}, 'patch', token)
  return response
}

// Deletes a user's team given ID. Basically does the same thing as deleteTeam
static async deleteUserTeam(id, token){
  const response = this.request(`user-teams/${id}`, {}, 'delete', token)
  return response
}


}
// For now, put token ("testuser" / "password" on class)
PokeAPI.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
  "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
  "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

export default PokeAPI;
