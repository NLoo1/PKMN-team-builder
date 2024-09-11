import React, { useState } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { useNavigate } from "react-router-dom";

/**
 * SignupUser - Component for rendering a sign-up form for new users.
 * Allows users to create a new account by providing a username, email, and password.
 * Handles form validation and submission, and provides feedback on errors.
 * 
 * @param {Object} props - The props for the component.
 * @param {Function} props.addUser - Function to handle adding a new user.
 * 
 * @returns {JSX.Element} - Rendered sign-up form with validation and error handling.
 */
const SignupUser = ({ addUser }) => {
  const INITIAL_STATE = {
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  };

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(formData => ({
      ...formData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (
      formData.username.trim() === '' ||
      formData.password.trim() === '' ||
      formData.email.trim() === ''
    ) {
      setError("Please fill out all fields.");
      return;
    } 

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    // Call addUser with form data
    try {
      await addUser(formData);
      setFormData(INITIAL_STATE); // Clear form after successful submission
      navigate('/'); // Redirect to homepage
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Failed to register user.");
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle><h1>Sign up here:</h1></CardTitle>
        {error && <div className="alert alert-danger">{error}</div>}
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
            <label htmlFor="password">Password: </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className='form-control'
              autoComplete="new-password"
            />
          </div>

          <div className="form-group p-2">
            <label htmlFor="confirmPassword">Re-enter password: </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className='form-control'
              autoComplete="new-password"
            />
          </div>

          <button type='submit' className='btn btn-primary p-2'>Sign up</button>
        </form>
      </CardBody>
    </Card>
  );
};

export default SignupUser;
