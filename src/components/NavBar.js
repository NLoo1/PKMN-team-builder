import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import '../styles/NavBar.css';
import pokeballImage from '../assets/pokeball.png';
import { useLocation, useNavigate } from "react-router-dom";

 
/**
 * NavBar - A navigation bar component that displays links based on user authentication and route.
 * 
 * This component includes navigation links that persist between routes. It conditionally shows or hides links
 * based on the current route and user authentication status. It also handles user logout functionality.
 * 
 * @param {Object} props - The props for the component.
 * @param {Object|null} props.currentUser - The currently logged-in user. If null, no user is logged in.
 * @param {Function} props.logout - Function to handle user logout.
 * 
 * @returns {JSX.Element} - Rendered navigation bar with conditionally displayed links.
 */
function NavBar({currentUser, logout}) {


  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate('/');
  };

  return (
    <div>
      <Navbar expand="md">

        {/* The logo. Click to navigate home */}
        <NavLink to="/" className="navbar-brand">
          <img src={pokeballImage} alt="Pokemon" className="logo"/>
        </NavLink>

        <Nav className="ml-auto navbar-nav" navbar>

          {/* Login 
          Hide if user is logged in*/}
          {location.pathname !== "/login" && currentUser == null && (
            <NavItem>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
            </NavItem>
          )}



          {/* Signup 
            Hide this if a user is logged in.
          */}
          {location.pathname !== "/signup" && currentUser==null && (
            <NavItem>
              <NavLink to='/signup' className="nav-link">
                Sign up
              </NavLink>
            </NavItem>
          )}

          {/* Logout. Only available to logged-in users */}
          {location.pathname !== "/logout" && currentUser && (
            <NavItem>
              <span onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}>
              Logout
              </span>
            </NavItem>
          )}
          
          {/* Profile. takes logged-in user directly to their own profile */}
          {location.pathname !== "/profile" && currentUser && (
            <NavItem>
              <NavLink to='/profile' className="nav-link" >
              Profile
              </NavLink>
            </NavItem>
          )}
          
          {/* Pokemon */}
          {location.pathname !== "/pokemon" && (
            <NavItem>
              <NavLink to='/pokemon' className="nav-link" >
              Pokemon
              </NavLink>
            </NavItem>
          )}
          
          {/* Users. Should only be accessible to admins */}
          {location.pathname !== "/users" && localStorage.isAdmin === 'true' && (
            <NavItem>
              <NavLink to='/users' className="nav-link" >
              Users
              </NavLink>
            </NavItem>
          )}


          {/* Show all teams*/ }

          {location.pathname !== '/teams' && (
            <NavItem>
              <NavLink to='/teams' className='nav-link'>All teams</NavLink>
            </NavItem>
          )}


          {/* Show all teams for the logged in user */}

          {location.pathname !== '/my-teams' && currentUser && (
            <NavItem>
              <NavLink to='/my-teams' className='nav-link'>My teams</NavLink>
            </NavItem>
          )}

        </Nav>
      </Navbar>
    </div>
  );
}

export default NavBar;
