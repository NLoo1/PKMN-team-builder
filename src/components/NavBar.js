import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import '../styles/NavBar.css';
import pokeballImage from '../assets/pokeball.png';

/**
 * NavBar - A navigation bar component that displays links based on user authentication and route.
 * 
 * @param {Object} props - The props for the component.
 * @param {Object|null} props.currentUser - The currently logged-in user. If null, no user is logged in.
 * @param {Function} props.logout - Function to handle user logout.
 * 
 * @returns {JSX.Element} - Rendered navigation bar with conditionally displayed links.
 */
function NavBar({ currentUser, logout }) {
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
          <img src={pokeballImage} alt="Pokemon" className="logo" />
        </NavLink>

        <Nav className="ml-auto navbar-nav" navbar>
          {/* Login */}
          {!currentUser && location.pathname !== "/login" && (
            <NavItem>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
            </NavItem>
          )}

          {/* Signup */}
          {!currentUser && location.pathname !== "/signup" && (
            <NavItem>
              <NavLink to='/signup' className="nav-link">
                Sign up
              </NavLink>
            </NavItem>
          )}

          {/* Logout */}
          {currentUser && location.pathname !== "/logout" && (
            <NavItem>
              <span onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}>
                Logout
              </span>
            </NavItem>
          )}

          {/* Profile */}
          {currentUser && location.pathname !== "/profile" && (
            <NavItem>
              <NavLink to='/profile' className="nav-link">
                Profile
              </NavLink>
            </NavItem>
          )}

          {/* Pokemon */}
          {location.pathname !== "/pokemon" && (
            <NavItem>
              <NavLink to='/pokemon' className="nav-link">
                Pokemon
              </NavLink>
            </NavItem>
          )}

          {/* Users */}
          {currentUser?.isAdmin === 'true' && location.pathname !== "/users" && (
            <NavItem>
              <NavLink to='/users' className="nav-link">
                Users
              </NavLink>
            </NavItem>
          )}

          {/* All teams */}
          {location.pathname !== '/teams' && (
            <NavItem>
              <NavLink to='/teams' className='nav-link'>All teams</NavLink>
            </NavItem>
          )}

          {/* My teams */}
          {currentUser && location.pathname !== '/my-teams' && (
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
