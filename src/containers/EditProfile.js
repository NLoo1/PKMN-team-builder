import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import PokeAPI from '../services/api';


/**
 * EditUser
 * Form for editing a user. Only the user or an admin should be able to access.
 */
const EditUser = ({ editUser, token }) => {
  const params = useParams();
  const navigate = useNavigate();

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
      if (params.username !== localStorage.user && localStorage.isAdmin === 'false') {
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
          makeAdmin: resp.user.isAdmin || false // Initialize checkbox based on user data
        });
        setIsAdmin(resp.user.isAdmin);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data.");
      }
    }
    getProfile();
  }, [params.username, token, navigate]);

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
      alert("Please fill out all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await editUser(formData, params.username);
      alert(`Successfully changed profile for ${params.username}`);
      navigate('/');
    } catch (error) {
      console.error("Error editing user:", error);
      alert("Failed to edit user");
    }
  };

  return (
    <Card>
      <CardBody>
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
  
          {localStorage.isAdmin === 'true' && !isAdmin &&
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
