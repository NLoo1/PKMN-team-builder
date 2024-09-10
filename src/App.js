import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./NavBar";
import "./App.css";
import { useState, React, Fragment } from "react";
import Home from "./Home";
import PokeAPI from "./api.js";
import LoginUser from "./LoginForm.js";
import SignupUser from "./Signup.js";
import { Profile } from "./Profile.js";
import DeleteUser from "./DeleteUser.js";
import Page from "./Page.js";
import EditUser from "./EditProfile.js";
import axios from 'axios';
import DeleteTeam from "./DeleteTeam.js";
import { EditTeam } from "./EditTeam.js";

/**
 * App
 * Main, top-level component for Pokemon Team Builder. Contains the states, functions, and routes necessary for running Pokemon Team Builder
 */
function App() {
  // Keep track of current user. If there is no local storage (the user is logged out), just set to null
  const [currentUser, setCurrentUser] = useState(localStorage.user || null);
  const [token, setToken] = useState(localStorage.token || null);

  /**
   * addUser
   * Passed to signup form and takes form data. Registers a new user and sets local storage to said user and corresponding token
   * @param {*} user The form data from Signup.js
   */
  async function addUser(user) {
    console.log(user)
    try {
      const resp = await PokeAPI.register({
        username: user.username,
        password: user.password,
        email: user.email,
      });

      setToken(resp.token);
      setCurrentUser(resp.username);
      localStorage.user = resp.username;
      localStorage.token = resp.token;

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
      localStorage.user = username;
      localStorage.token = resp.token;
      localStorage.isAdmin = resp.isAdmin;
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
    PokeAPI.token = null;
    localStorage.clear();
  }

// Edit user. Admin or same user only
async function editUser(user, username) {

  // console.log(user)
  try {
    // Make the API call to update the user's profile
    const resp = await PokeAPI.patchUser(
      {
        username: user.username,
        password: user.password,
        email: user.email,
        bio: user.bio,
        isAdmin: user.makeAdmin,
      },
      username,
      localStorage.token
    );

    console.log(`Successfully edited ${resp.username}!`);

    // Check if the edited user is the same as the currently logged-in user
    if (localStorage.user === username) {
      // If the username has been changed, update it in local storage
      if (localStorage.user !== user.username) {
        localStorage.user = user.username;
        setCurrentUser(user.username);
      }

      // Re-authenticate and update the token if the current user edited their own profile
      const newTokenResp = PokeAPI.login(user.username, user.password);
      localStorage.token = newTokenResp.token;
      setToken(newTokenResp.token);

      console.log('Token updated successfully after username change.');
    }

  } catch (e) {
    console.error(`Failed to edit user: ${e}`);
  }
}


  // Delete user. Only an admin or same user should be able to use this
  async function deleteUser(username) {
    try {
      await PokeAPI.deleteUser(username,
        localStorage.token
      );
      console.log(`Successfully deleted ${username}!`);
      logout()
    } catch (e) {
      console.error(`Failed to delete user: ${e}`);
    }
  }
  // Function to save team changes
  async function saveTeamChanges(teamId, newOrder) {
    try {
      const response = await axios.patch(`/teams/${teamId}/reorder`, { newOrder });
      console.log('Team reordered successfully:', response.data.message);
    } catch (error) {
      console.error('Error reordering team:', error.response ? error.response.data : error.message);
    }
  }

  return (
    <div className="app">
      <BrowserRouter>
        <NavBar currentUser={currentUser} logout={logout} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* If a user is an admin, show the hidden Users route */}
            {localStorage.isAdmin === "true" && <Route path="/users" element={<Page type="users" />} />}
            
            {/* If the user isn't logged in, show the login and signup routes */}
            {currentUser == null ? (
              <Fragment>
                <Route path="/login" element={<LoginUser login={login} />} />
                <Route path="/signup" element={<SignupUser addUser={addUser} />} />
              </Fragment>
            ) : (
              <Fragment>
                <Route path="/profile" element={<Profile currentUser={currentUser} token={token} editUser={editUser} deleteUser={deleteUser} />} />
                <Route path="/logout" element={<Navigate to="/" />} />

                <Route path="/users/:username" element={<Profile currentUser={currentUser} token={token} editUser={editUser} deleteUser={deleteUser} />} />
                <Route path="/users/:username/edit" element={<EditUser currentUser={currentUser} token={token} editUser={editUser} />} />
                <Route path="/users/:username/delete" element={<DeleteUser currentUser={currentUser} token={token} deleteUser={deleteUser} />} />

                <Route path="/teams" element={<Page type='teams' />} />
                <Route path="/teams/:id" element={<Page type='team-details' />} />
                <Route path="/teams/:id/edit" element={<EditTeam />} />
                <Route path="/teams/:id/delete" element={<DeleteTeam />} />
                <Route path="/teams/new" element={<Page type='new-team' />} />
                <Route path="/my-teams" element={<Page type='my-teams' />} />
                {/* <Route path="/my-teams/:name" element={<Page type='my-teams' />} /> */}
              </Fragment>
            )}

            <Route path="/pokemon" element={<Page type='pokemon' />} />
            <Route path="/pokemon/:id" element={<Page type='pokemon-detail' />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <footer>
            <p>
              Pokemon icons created by Nikita Golubev -{" "}
              <a href="https://www.flaticon.com/free-icons/pokemon" title="pokemon icons" id="credit">
                Flaticon.
              </a>
            </p>
            <p>
              All Pokemon data is sourced directly from the free open-source Pokemon database API, <a href="https://pokeapi.co/">PokeAPI.</a>
            </p>
          </footer>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
