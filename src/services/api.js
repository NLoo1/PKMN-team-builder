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
   * 
   * @throws {Error} if request fails or error
   */ 
  static async login(username, password) {
    try {
      const res = await this.request(`auth/token`, { username, password }, 'post');
      return res;
    } catch (error) {
      console.error("Login Error:", error);
      throw new Error("Login failed. Please check your credentials.");
    }
  }


  /** Given a username, return data about user.
   * @param {String} username
   * @param {String} token 
   * @returns {User}
   * @throws {Error} if user not found.
   **/
  static async getUser(username, token) {
    try {
      const res = await this.request(`users/${username}`, {}, "get", token);
      return res;
    } catch (error) {
      console.error("Get User Error:", error);
      throw new Error("User not found.");
    }
  }

  /**
   * Gets all users
   * @param {String} token 
   * @returns {[User]} 
   * 
   * @throws {Error} if request fails or error
   */
  static async getUsers(token) {
    try {
      const res = await this.request(`users/`, {}, 'get', token);
      return res.users;
    } catch (error) {
      console.error("Get Users Error:", error);
      throw new Error("Failed to fetch users.");
    }
  }

    
  /**
   * Register a user
   * @param {User} - username, password, and email
   * @returns {User} - username, email, isAdmin 
   * 
   * @throws {Error} if request fails or error
   */
  static async register({ username, password, email }) {
    try {
      const res = await this.request(`auth/register`, { username, password, email }, 'post');
      return res;
    } catch (error) {
      console.error("Register Error:", error);
      throw new Error("Registration failed. Please try again.");
    }
  }

  /**
   * Alternative way for admins to add a user
   * @param {User} - username, email, isAdmin
   * @param {String} token 
   * @returns {User} - {username, email, isAdmin} if successful
   * 
   * @throws {Error} if request fails or error
   */
  static async postUserAdmin({ user, token }) {
    try {
      const res = await this.request(`users/`, { user, token }, 'post');
      return res.user;
    } catch (error) {
      console.error("Post User Admin Error:", error);
      throw new Error("Failed to add user.");
    }
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
   * 
   * @throws {Error} if request fails or error
   */
  static async filterUsers(username, token) {
    try {
      const res = await this.request(`users?username=${username}`, {}, 'get', token);
      return res.users;
    } catch (error) {
      console.error("Filter Users Error:", error);
      throw new Error("Failed to filter users.");
    }
  }

  /** Update details of a user by id. 
   *
   * @param {User} data - data to update
   * @param {String} username
   * @param {String} token
   * 
   * @throws {Error} if request fails or error
  */
  static async patchUser(data, username, token) {
    try {
      const res = await this.request(`users/${username}`, data, 'patch', token);
      return res.user;
    } catch (error) {
      console.error("Patch User Error:", error);
      throw new Error("Failed to update user.");
    }
  }

  /**
   * Delete a user
   * @param {String} username 
   * @param {String} token 
   * @returns
   * 
   * @throws {Error} if request fails or error
   */
  static async deleteUser(username, token) {
    try {
      const res = await this.request(`users/${username}`, {}, 'delete', token);
      return res;
    } catch (error) {
      console.error("Delete User Error:", error);
      throw new Error("Failed to delete user.");
    }
  }



// ************************************************************POKEMON************************************************************

/**
 * Gets data from PokeAPI given a range (offset + )
 * @param {*} offset Pokemon ID to start fetching data from
 * @param {*} limit Add this to offset to get the number of Pokemon in array
 * @returns Array of Pokemon
 * 
 * @throws {Error} if request fails or error
 */
static async getAllPokemon(offset = 0, limit = 100) {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    return response.data.results;
  } catch (error) {
    console.error("Get All Pokemon Error:", error);
    throw new Error("Failed to fetch Pokémon.");
  }
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
 * 
 * @throws {Error} if request fails or error
 */
static async getPokemonSpriteByURL(url) {
  try {
    const response = await axios.get(url);
    return response.data.sprites.front_default;
  } catch (error) {
    console.error("Get Pokémon Sprite Error:", error);
    throw new Error("Failed to fetch Pokémon sprite.");
  }
}


// TODO: Filter by gen
static async getPokemonByGen(){

}


// ************************************************************TEAMS************************************************************


/**
 * Gets all teams
 * @param {String} token 
 * @returns {[Team]} All teams
 * 
 * @throws {Error} if request fails or error
 */
static async getAllTeams() {
  try {
    const response = await this.request('teams/');
    return response || [];
  } catch (error) {
    console.error("Get All Teams Error:", error);
    return [];
  }
}


/**
 * Fetch team given ID
 * @param {Integer} id - the team id
 * @param {String} token 
 * @returns the team.
 * 
 * @throws {Error} if request fails or error
 */
static async getTeamById(id) {
  try {
    const response = await this.request(`teams/${id}`);
    return response;
  } catch (error) {
    console.error("Get Team By ID Error:", error);
    throw new Error("Failed to fetch team.");
  }
}

/**
 * Takes form data, logged in username and token to create a team.
 * 
 * @param {Object} data -- Should be formatted as {name (String), pokemon (Array)} 
 * @param {String} token 
 * 
 * @throws {Error} if request fails or error
 */
static async createTeam(data, token) {
  try {
    const response = await this.request('teams', data, 'post', token);
    return response;
  } catch (error) {
    console.error("Create Team Error:", error);
    throw new Error("Failed to create team.");
  }
}

/**
 * Update a team
 * @param {Integer} id - team id
 * @param {*} data 
 * @param {String} token 
 * 
 * @throws {Error} if request fails or error
 */
static async patchTeam(id, data, token) {
  try {
    const response = await this.request(`teams/${id}`, data, 'patch', token);
    return response;
  } catch (error) {
    console.error("Patch Team Error:", error);
    throw new Error("Failed to update team.");
  }
}

/**
 * Delete a team
 * @param {Integer} id - team id
 * @param {String} token 
 * 
 * @throws {Error} if request fails or error
 */
static async deleteTeam(id, token) {
  try {
    const response = await this.request(`teams/${id}`, {}, 'delete', token);
    return response;
  } catch (error) {
    console.error("Delete Team Error:", error);
    throw new Error("Failed to delete team.");
  }
}

// ************************************************************TEAMS_POKEMON************************************************************
// Methods to modify Pokemon in a team. Requires a created team first in teams table

/**
 * Add pokemon to team
 * @param {*} data -> {team_id, user_id, Array(Pokemon)} 
 * @param {String} token 
 * 
 * @throws {Error} if request fails or error
 */
static async addPokemonToTeam(id, data, token) {
  try {
    const formattedPokemon = data.pokemon.map((poke, index) => ({
      pokemon_id: poke.pokemon_id,
      pokemon_name: poke.pokemon_name,
      position: index + 1,
      nickname: poke.nickname || ""
    }));

    const response = await this.request(
      `pokemon-teams/${id}`,
      { user_id: data.user_id, team_id: data.team_id, pokemon: formattedPokemon },
      'post',
      token
    );

    return response;
  } catch (error) {
    console.error("Add Pokemon to Team Error:", error);
    throw new Error("Failed to add Pokémon to team.");
  }
}


/**
 * Retrieves all Pokemon details in a specific team.
 * 
 * @param {Integer} id
 *  * 
 * @throws {Error} if request fails or error
 */
static async getAllPokemonInTeam(id) {
  try {
    const response = await this.request(`pokemon-teams/${id}`);
    return response;
  } catch (error) {
    console.error("Get All Pokémon in Team Error:", error);
    throw new Error("Failed to fetch Pokémon in team.");
  }
}

// *********************************************************************USER TEAMS*********************************************************************
// This refers to all teams under one user

/**
 * Get all teams under a user
 * @description - teams are relative to currently logged in user
 * @param {String} token - passed from local storage
 * @throws {Error} if request fails or error
 */
static async getAllUserTeams(token) {
  try {
    const response = await this.request('my-teams/', {}, 'get', token);
    return response;
  } catch (error) {
    console.error("Get All User Teams Error:", error);
    throw new Error("Failed to fetch user's teams.");
  }
}

/**
 * @deprecated Serves same purpose as teams/id GET
 * 
 * Get a user's team
 * @param {Integer} id 
 * @param {*} token 
 * @returns the users team
 * @throws {Error} if request fails or error
 */
static async getUserTeamById(id, token) {
  try {
    const response = await this.request(`user-teams/${id}`, {}, 'get', token);
    return response;
  } catch (error) {
    console.error("Get User Team By ID Error:", error);
    throw new Error("Failed to fetch user's team.");
  }
}

/**
 * Creates a new team for a user
 * 
 * @param {Object} data 
 * @param {string} token 
 * 
 * @returns team details
 * 
 * @throws {Error} if request fails or error
 */
static async createUserTeam(data, token) {
  try {
    const response = await this.request('user-teams', { data }, 'post', token);
    return response;
  } catch (error) {
    console.error("Create User Team Error:", error);
    throw new Error("Failed to create user's team.");
  }
}


/**
 * Updates an existing user's team.
 * 
 * @param {number|string} id - 
 * @param {Object} data - the team data
 * @param {string} token 
 * 
 * @returns the updated team data
 * 
 * @throws {Error}  if request fails or error
 */
static async patchUserTeam(id, data, token) {
  try {
    const response = await this.request(`user-teams/${id}`, { data }, 'patch', token);
    return response;
  } catch (error) {
    console.error("Patch User Team Error:", error);
    throw new Error("Failed to update user's team.");
  }
}


/**
 * Deletes a user's team by ID.
 *  
 * @param {number|string} id 
 * @param {string} token 
 * 
 * @throws {Error} if request fails or error
 */
static async deleteUserTeam(id, token) {
  try {
    const response = await this.request(`user-teams/${id}`, {}, 'delete', token);
    return response;
  } catch (error) {
    console.error("Delete User Team Error:", error);
    throw new Error("Failed to delete user's team.");
  }
}


}
// For now, put token ("testuser" / "password" on class)
PokeAPI.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
  "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
  "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

export default PokeAPI;
