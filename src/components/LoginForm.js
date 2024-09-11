import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardBody, Card, CardTitle } from "reactstrap";

/**
 * LoginUser - A form component that allows users to log in.
 * 
 * This component provides a login form where users can enter their username and password. Upon successful login,
 * the user is navigated to the homepage. If login fails, an error message is displayed.
 * 
 * @param {Object} props - The props for the component.
 * @param {Function} props.login - Function to handle user login. The form data is passed to this function.
 * 
 * @returns {JSX.Element} - Rendered login form with error handling.
 */
const LoginUser = ({ login }) => {
  const INITIAL_STATE = {
    username: '',
    password: '',
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /**
   * handleChange
   * Form data will constantly be updated based on user input.
   * This is important to pass the right data to login
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(formData => ({
      ...formData,
      [name]: value
    }));
  };

  /**
   * handleSubmit
   * Handles form submission. Will alert user if login failed
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.username.trim() === '' || formData.password.trim() === '') {
      setError("Please fill out both fields.");
      return;
    }

    try {
      await login(formData);
      setFormData(INITIAL_STATE);
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Incorrect username or password.");
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle><h1>Log in here:</h1></CardTitle>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Username login */}
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

          {/* Password here */}
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
              autoComplete="true"
            />
          </div>

          {/* Click here to submit the form */}
          <button type='submit' className='btn btn-primary p-2'>Log in</button>
        </form>
      </CardBody>
    </Card>
  );
};

export default LoginUser;
