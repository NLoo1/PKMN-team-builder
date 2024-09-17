import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import PokeAPI from '../services/api';

/**
 * EditUser - Component for rendering a form to edit a user's profile.
 * Allows the current user or an admin to update user details including username, email, 
 * bio, password, and admin status.
 * 
 * @param {Object} props - The props for the component.
 * @param {Function} props.editUser - Function to handle the user update.
 * @param {string} props.token - Authentication token used for API requests.
 * @param {Object} props.currentUser - The currently logged-in user object.
 * 
 * @returns {JSX.Element} - Rendered form for editing user profile with validation 
 *                           and submission functionality.
 */
const EditUser = ({ editUser, token, currentUser }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    password: '',
    confirmPassword: '',
    makeAdmin: false
  });

  useEffect(() => {
    async function getProfile() {
      // Check if the current user is authorized to edit this profile
      if (params.username !== currentUser.username && !currentUser.isAdmin) {
        alert("Cannot edit another user's profile.");
        navigate('/');
        return;
      }
      try {
        const resp = await PokeAPI.getUser(params.username, token);
        setFormData({
          username: resp.user.username || '',
          email: resp.user.email || '',
          bio: resp.user.bio || '',
          password: '',
          confirmPassword: '',
          makeAdmin: resp.user.isAdmin || false 
        });
        setIsAdmin(resp.user.isAdmin);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message || "Failed to fetch user data.");
      }
    }
    getProfile();
  }, [params.username, currentUser, token, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: type === 'checkbox' ? checked : value, // Handle checkbox state
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (
      formData.username.trim() === '' ||
      formData.email.trim() === '' ||
      formData.bio.trim() === '' ||
      formData.password.trim() === '' ||
      formData.confirmPassword.trim() === ''
    ) {
      setError("Please fill out all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await editUser(formData, params.username);
      alert(`Successfully changed profile for ${params.username}`);
      navigate('/');
    } catch (error) {
      console.error("Error editing user:", error);
      setError(error.message || "Failed to edit user");
    }
  };

  return (
    <Card>
      <CardBody>
        {error && <div className="alert alert-danger">{error}</div>}
        <CardTitle><h1>Change profile:</h1></CardTitle>

        <form onSubmit={handleSubmit}>
          <div className="form-group p-2">
            <label htmlFor="username">Username: </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              className='form-control'
            />
          </div>

          <div className="form-group p-2">
            <label htmlFor="email">Email: </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className='form-control'
            />
          </div>

          <div className="form-group p-2">
            <label htmlFor="password">New password: </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className='form-control'
              autoComplete='true'
            />
          </div>

          <div className="form-group p-2">
            <label htmlFor="confirmPassword">Confirm password: </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className='form-control'
              autoComplete='true'
            />
          </div>
          
          <div className="form-group p-2">
            <label htmlFor="bio">Bio: </label>
            <input
              id="bio"
              type="text"
              name="bio"
              placeholder="Enter bio"
              value={formData.bio}
              onChange={handleChange}
              className='form-control'
            />
          </div>
  
          {currentUser.isAdmin && !isAdmin &&
            <div className="form-check p-2">
              <input
                id="makeAdmin"
                type="checkbox"
                name="makeAdmin"
                checked={formData.makeAdmin}
                onChange={handleChange}
                className='form-check-input'
              />
              <label htmlFor="makeAdmin" className='form-check-label'>Make admin?</label>
            </div>
          }

          <button type='submit' className='btn btn-primary p-2'>Confirm changes</button>
          <Link to='/'><button type='button' className='btn btn-danger p-2 mx-2'>Cancel</button></Link>
        </form>
      </CardBody>
    </Card>
  );
};

export default EditUser;
