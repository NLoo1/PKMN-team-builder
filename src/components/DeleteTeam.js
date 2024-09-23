import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import PokeAPI from '../services/api';

/**
 * DeleteTeam
 * 
 * Form for deleting a team. Only the user who owns the team or an admin should be able to access this component.
 * It fetches the team details based on the team ID from the URL parameters, checks user permissions, and allows
 * the deletion of the team if authorized.
 * 
 * @param {Object} props - The props object.
 * @param {Function} props.deleteTeam - Function to call for deleting a team.
 * @param {Object} props.currentUser - The current logged-in user's information.
 * @param {string} props.currentUser.user_id - The ID of the current user.
 * @param {boolean} props.currentUser.isAdmin - Whether the current user is an admin.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const DeleteTeam = ({ deleteTeam, currentUser }) => {
  const params = useParams();
  const [teamName, setTeamName] = useState('New Team');
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getTeam() {
      try {
        // Fetch team details
        const resp = await PokeAPI.getTeamById(params.id, currentUser.token);

        // Check if the current user is allowed to delete the team
        if ((resp.user_id !== currentUser.user_id) && !currentUser.isAdmin) {
          alert('You are not authorized to delete this team.');
          navigate('/');
          return;
        }

        setTeamName(resp.team_name);
      } catch (error) {
        console.error("Error fetching team:", error);
        navigate('/'); // Redirect if there's an error fetching the team
      } finally {
        setIsLoaded(true);
      }
    }

    getTeam();
  }, [params.id, navigate, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // alert(currentUser.token)
      await PokeAPI.deleteTeam(params.id, currentUser.token);
      alert(`Successfully deleted team ${teamName}`);
      navigate('/');
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("Failed to delete team");
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle>
          <h1>Are you sure you want to delete team {teamName}?</h1>
        </CardTitle>
        {isLoaded && (
          <form onSubmit={handleSubmit}>
            <button type='submit' className='btn btn-danger p-2 m-2'>Confirm</button>
            <Link to='/'><button type='button' className='btn btn-primary p-2'>Back</button></Link>
          </form>
        )}
      </CardBody>
    </Card>
  );
};

export default DeleteTeam;
