import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { useParams, Link, useNavigate } from "react-router-dom";

/**
 * DeleteUser - A form component for deleting a user.
 * 
 * This component allows a user to delete their own account or allows an admin to delete any user. 
 * It checks the user's authorization before proceeding and confirms the deletion action.
 * 
 * @param {Object} props - The props for the component.
 * @param {Function} props.deleteUser - The function to call to delete a user, takes username and token as parameters.
 * @param {string} props.token - The authentication token for the current user.
 * @param {Object} props.currentUser - The currently logged-in user object, used to check authorization.
 * @param {string} props.currentUser.username - The username of the currently logged-in user.
 * 
 * @returns {JSX.Element} - Rendered card component for user deletion confirmation.
 */
const DeleteUser = ({ deleteUser, token, currentUser }) => {
  const params = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      // Check if currentUser matches params.username or if the user is an admin
      if (currentUser.username !== params.username && localStorage.isAdmin !== 'true') {
        alert("You are not authorized to delete this user.");
        navigate('/');
      }
      setIsLoaded(true);
    };

    getProfile();
  }, [params.username, navigate, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (window.confirm(`Are you sure you want to delete the user ${params.username}? This action cannot be undone.`)) {
      try {
        await deleteUser(params.username, token);
        alert(`Successfully deleted ${params.username}`);
        navigate('/');
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle>
          <h1>Are you sure you want to delete user {params.username}?</h1>
        </CardTitle>

        <form onSubmit={handleSubmit}>
          <button type='submit' className='btn btn-danger p-2 m-2'>Confirm</button>
          <Link to='/'><button type='button' className='btn btn-primary p-2'>Back</button></Link>
        </form>
      </CardBody>
    </Card>
  );
};

export default DeleteUser;
