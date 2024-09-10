import React, { useState } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {Link, useNavigate } from "react-router-dom";

/**
 * DeleteUser
 * Form for editing a user. Only the user or an admin should be able to access
 */
const DeleteUser = ({ deleteUser ,token}) => {

  // Route is under /users/:username/edit, so username can be fetched here
  const params = useParams()

  const [isLoaded, setIsLoaded] = useState(false)

  const navigate = useNavigate();

  useEffect( () => {
        async function getProfile(){
            if(localStorage.user !== params.username){
              alert("Cannot delete user profile.")
              navigate('/')
            }
        }
        getProfile()
        setIsLoaded(true)
        }
    , [isLoaded, params.username, navigate ])



  const handleSubmit = async (e) => {
    e.preventDefault();
    
  
    try {
      await deleteUser(params.username, token);
      alert(`Successfully deleted ${params.username}`)
      navigate('/')
      
    } catch (error) {
      console.error("Error deleting user:", error);
      
      // Handle error appropriately (e.g., show error message)
      alert("Failed to delete user");
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle><h1>Are you sure you want to delete user {params.username}?</h1></CardTitle>

        <form onSubmit={handleSubmit}>
            
          <button type='submit' className='btn btn-danger p-2 m-2'>Confirm</button>
          <Link to='/'><button type='submit' className='btn btn-primary p-2'>Back</button></Link>
        </form>
      </CardBody>
    </Card>
  );
};

export default DeleteUser;
