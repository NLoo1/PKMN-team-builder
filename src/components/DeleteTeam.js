import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import PokeAPI from '../services/api';


/**
 * DeleteTeam
 * Form for deleting a team. Only the user or an admin should be able to access
 */
const DeleteTeam = ({ deleteTeam ,token}) => {

  // Route is under /users/:username/edit, so username can be fetched here
  const params = useParams()
  const [teamName, setTeamName] = useState('New Team')

  const [isLoaded, setIsLoaded] = useState(false)

  const navigate = useNavigate();

  // Delete team. Only an admin or same user should be able to use this
  async function deleteTeam(id) {
    try {
      await PokeAPI.deleteTeam(id,
        localStorage.token
      );
      console.log(`Successfully deleted ${id}!`);
    } catch (e) {
      console.error(`Failed to delete team: ${e}`);
    }
  }


  useEffect( () => {

        async function getTeam(){

            // Fetch team name
            const resp = await PokeAPI.getTeamById(params.id, localStorage.token)
            const username = await PokeAPI.getUser(localStorage.user, localStorage.token)


            if((resp.user_id !== username.user.user_id) && localStorage.isAdmin === 'false'){
                alert('No.')
                navigate('/')
            }

            setTeamName(resp.team_name)
        }
        getTeam()
        setIsLoaded(true)
        }
    , [isLoaded, params.id, navigate ])



  const handleSubmit = async (e) => {
    e.preventDefault();
    
  
    try {
      await deleteTeam(params.id, token);
      alert(`Successfully deleted`)
      navigate('/')
      
    } catch (error) {
      console.error("Error deleting team:", error);
      
      // Handle error appropriately (e.g., show error message)
      alert("Failed to delete team");
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle><h1>Are you sure you want to delete team {teamName}?</h1></CardTitle>

        <form onSubmit={handleSubmit}>
            
          <button type='submit' className='btn btn-danger p-2 m-2'>Confirm</button>
          <Link to='/'><button type='submit' className='btn btn-primary p-2'>Back</button></Link>
        </form>
      </CardBody>
    </Card>
  );
};

export default DeleteTeam;
