import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardBody, Card, CardTitle } from "reactstrap";

const LoginUser = ({ login }) => {
  const INITIAL_STATE = {
    username: '',
    password: '',
  }
  const [formData, setFormData] = useState(INITIAL_STATE);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(formData => ({
      ...formData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.username.trim() !== '' && formData.password.trim() !== '' ) {
        await login({ ...formData });
        setFormData(INITIAL_STATE);
        navigate("/");
    } else { 
        alert("Incorrect username or password");
    }
  }

  return (
    <Card>
      <CardBody>
        <CardTitle><h1>Log in here:</h1></CardTitle>
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
            <label htmlFor="password">Password: </label>
            <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className='form-control'
            />
          </div>
          <button type='submit' className='btn btn-primary p-2'>Log in</button>
        </form>
      </CardBody>
    </Card>
  )
}

export default LoginUser;
