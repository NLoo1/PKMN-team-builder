import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./NavBar";
import "./App.css";
import { useState, React, Fragment, useEffect } from "react";
import Home from "./Home";
import PokeAPI from "./api.js";
import LoginUser from "./LoginForm.js";
import SignupUser from "./Signup.js";
import { Profile } from "./Profile.js";

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
      console.log(resp)
      setToken(resp.token);
      setCurrentUser(username);
      console.log("Successfully logged in!");
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
    // JoblyApi.token = null
    localStorage.clear()
  }

  async function editUser(user, username){
    try{
        // const resp = await JoblyApi.patchUser({
        // firstName: user.firstname, 
        //  lastName: user.lastname,
          // email: user.email}, username, localStorage.token)

      // console.log(`Successfully edited ${resp.username}!`);

    } catch(e){
    }

  }

  return (
    <div className="app">
      <BrowserRouter>

        <NavBar currentUser={currentUser} logout={logout} />
        <main>
          <Routes>

            <Route exact path="/" element={<Home />}/>

            {localStorage.isAdmin && 
            <Route exact path="/users"/>
            }
            {/* IF the user isn't logged in, show the login and signup routes. */}
            {currentUser == null ? (
              <Fragment>
                <Route exact path="/login" element={<LoginUser login={login} />} />
                <Route exact path="/signup" element={<SignupUser addUser={addUser} />}/>
              </Fragment>
            ) : (

              // If the user IS logged in, show profile and the ability to logout
              <Fragment>
                <Route exact path="/profile" element={<Profile currentUser={currentUser} token={token} />}/>
                <Route exact path="/logout" element={<Navigate to="/"/>} />

              </Fragment>
            )}


            <Route exact path="/users/:username"/>

            {/* For admin accounts. Shows list of users */}
            {localStorage.isAdmin == 'true' && 
            <Route exact path="/users" />
            
            }

            {/* Modify a user's profile */}
            <Route path='/users/:username/edit' />

            {/* If route not found navigate to root */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
