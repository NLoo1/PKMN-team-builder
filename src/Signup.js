import React, { useState } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { useNavigate } from "react-router-dom";


const SignupUser = ({ addUser }) => {
  const INITIAL_STATE = {
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  };

  const [formData, setFormData] = useState(INITIAL_STATE);
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
      alert("Please fill out all fields");
      return;
    } 

    if(formData.password !== formData.confirmPassword){
      alert('Passwords do not match')
      return;
    }
  
    // Call addUser with form data
    try {
      await addUser(formData);
      // window.location.href = '/'
      navigate('/')
      setFormData(INITIAL_STATE); // Clear form after successful submission
      
    } catch (error) {
      console.error("Error adding user:", error);
      // Handle error appropriately (e.g., show error message)
      alert("Failed to register user");
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle><h1>Sign up here:</h1></CardTitle>

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
              autoComplete="true"
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
              autoComplete="true"

            />
          </div>

          <button type='submit' className='btn btn-primary p-2'>Sign up</button>
        </form>
      </CardBody>
    </Card>
  );
};

export default SignupUser;
