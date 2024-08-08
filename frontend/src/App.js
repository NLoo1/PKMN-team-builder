import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./NavBar";
import "./App.css";
import { useState, React, Fragment, useEffect } from "react";
import Home from "./Home";
import PokeAPI from "./api.js";
import LoginUser from "./LoginForm.js";
import SignupUser from "./Signup.js";
import { Profile } from "./Profile.js";
import DeleteUser from "./DeleteUser.js";
import Page from "./Page.js";
import EditUser from "./EditProfile.js";

/**
 * App
 * Main, top-level component for Jobly. Contains the states, functions, and routes necessary for running Jobly
 */
function App() {

  // Keep track of current user. If there's no local storage (the user is logged out), just set to null
  const [currentUser, setCurrentUser] = useState(localStorage.user || null);
  const [token, setToken] = useState(localStorage.token || null);


  /**
   * addUser
   * Passed to signup form and takes form data. Registers a new user and sets local storage to said user and corresponding token
   * @param {*} user The form data from Signup.js
   */
  async function addUser(user) {
    try {

      // Attempt to register, assuming all fields meet the schema requirements
      const resp = await PokeAPI.register({
        username: user.username,
        password: user.password,
        email: user.email
      });

      // Set states for token and current user
      setToken(resp.token);
      setCurrentUser(resp.username);

      // To maintain persistent login, use local storage
      localStorage.user = resp.username
      localStorage.token = resp.token

      console.log(`Successfully registered ${resp.username}!`);
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  /**
   * Login
   * Passed to login form and takes form data. Credentials are verified via API. If login successful, local storage and states are updated.
   * If not, logs an error.
   * 
   * @param {String} username 
   * @param {String} password 
   */
  async function login({ username, password }) {
    try {
      const resp = await PokeAPI.login(username, password);
      setToken(resp.token);
      setCurrentUser(username);
      localStorage.user = username
      localStorage.token = resp.token
      localStorage.isAdmin = resp.isAdmin
    } catch (e) {
      console.error("Could not login: " + e);
    }
  }

  /**
   *  logout()
   *  Log user out. Clears state and local storage.
   */
  async function logout() {
    setCurrentUser(null);
    setToken(null);
    PokeAPI.token = null
    localStorage.clear()
  }


  // Edit user. Admin or same user only
  async function editUser(user, username) {
    try {
      const resp = await PokeAPI.patchUser({
        username: user.username,
        email: user.email
      }, username, localStorage.token)

      console.log(`Successfully edited ${resp.username}!`);

    } catch (e) {
      console.error(`Failed to edit user: ${e}`)
    }

  }
  
  // Delete user. Only an admin should be able to use this
  async function deleteUser(username) {
    try {
      const resp = await PokeAPI.deleteUser({
        username: username}, localStorage.token)
      console.log(`Successfully deleted ${resp.username}!`);

    } catch (e) {
      console.error(`Failed to delete user: ${e}`)
    }

  }

  return (
    <div className="app">
      <BrowserRouter>
        <NavBar currentUser={currentUser} logout={logout} />
        <main>
          <Routes>

            <Route exact path="/" element={<Home />} />

            {/* If a user is an admin, show the hidden Users route */}
            {localStorage.isAdmin=='true' &&
              <Route exact path="/users" />
            }
            {/* IF the user isn't logged in, show the login and signup routes. */}
            {currentUser == null ? (
              <Fragment>
                <Route exact path="/login" element={<LoginUser login={login} />} />
                <Route exact path="/signup" element={<SignupUser addUser={addUser} />} />

              </Fragment>
            ) : (

              // If the user IS logged in, show profile and the ability to logout
              <Fragment>
                <Route exact path="/profile" element={<Profile currentUser={currentUser} token={token} editUser={editUser} deleteUser={deleteUser} />} />
                <Route exact path="/logout" element={<Navigate to="/" />} />

                {/* Allows a user to see profiles of other users. */}
                <Route exact path='/users/:username' element={<Profile currentUser={currentUser} token={token} editUser={editUser} deleteUser={deleteUser}  />} />

                
                {/* Allow a user to edit their profile. Can also be changed by an admin. */}
                <Route exact path='/users/:username/edit' element={<EditUser currentUser={currentUser} token={token} editUser={editUser} />} />
                <Route exact path='/users/:username/delete' element={<DeleteUser currentUser={currentUser} token={token} deleteUser={deleteUser} />} />
              </Fragment>
            )}

            
            <Route exact path='/pokemon' element={<Page />} />
            <Route exact path='/pokemon/:id' />

            {/* For admin accounts. Shows list of users */}
            {localStorage.isAdmin == 'true' &&
              <Fragment>
                <Route exact path="/users" element={<Page type='users' />} />
              </Fragment>

            }

<Route exact path="/users/:username" ele/>

            {/* Modify a user's profile */}
            <Route path='/users/:username/edit' />

            {/* If route not found navigate to root */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <footer>
          <p>Pokemon icons created by Nikita Golubev - <a href="https://www.flaticon.com/free-icons/pokemon" title="pokemon icons" id="credit">Flaticon.</a></p>
          <p>All Pokemon data is sourced directly from the free open-source Pokemon database API, <a href='https://pokeapi.co/'>PokeAPI.</a></p>
          </footer>

        </main>

      </BrowserRouter>


    </div>
  );
}

export default App;
