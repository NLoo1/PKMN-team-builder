import { Card, CardBody, CardTitle } from "reactstrap";
import PokeAPI from "./api";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

import { Link } from "react-router-dom";
/**
 * Profile
 * Component exclusively for rendering a user's profile.
 */
export function Profile({currentUser, token, editUser, deleteUser}){
    const [isLoaded, setIsLoaded] = useState(false)
    const [userData, setUserData] = useState(null)
    const [userTeams, setUserTeams] = useState([])

    // Location and params help determine if this is the logged-in user's profile or someone else's.
    const location = useLocation()
    const params = useParams()
    
    useEffect( () => {

        // Fetch a user's profile
        async function getProfile(){

            let resp = ''

            // Check if a user is checking their own profile
            if(location.pathname.includes('/profile')){
                resp = await PokeAPI.getUser(currentUser, token)
            } 
            
            // If routing to a user profile via the /users route
            else if(location.pathname.includes('/users')){
                resp = await PokeAPI.getUser(params.username, token)
            }
            setUserData(resp)

            let team = await PokeAPI.getAllUserTeams(resp.user_id, localStorage.token)
            setUserTeams(team)
        }

        getProfile()
        setIsLoaded(true)

        }
    , [isLoaded, currentUser, location.pathname, params.username, token])


    return(
        <section>
            {isLoaded && userData ? 
            <section>
                <Card>
                    <CardTitle><h1>{userData.user.username}</h1></CardTitle>
                    <CardBody>
                        {userData.user.bio}
                    </CardBody>

                    {/* User edits their own profile if routed here via /profile */}
                    {location.pathname.includes('/profile') 
                    && 
                        <section>
                            <Link to={'/users/' + localStorage.user + '/edit'}><button className='btn btn-primary'>Edit user</button></Link>
                            <Link to={'/users/' + localStorage.user + '/delete'}><button className='btn btn-danger mx-2'>Delete user</button></Link>
        
                        </section>
                    }


                    {/* If routed here through /users, display these for admins only  */}
                    {location.pathname.includes('/users/' ) &&
                        <section>
                            <Link to={'/users/' + params.username + '/edit'}><button className='btn btn-primary'>Edit user</button></Link>
                            {((localStorage.isAdmin === 'true' && localStorage.user === params.username) || localStorage.user === params.username) &&
                            <Link to={'/users/' + params.username + '/delete'}><button className='btn btn-danger mx-2'>Delete user</button></Link>
                            }
                        </section>
                    }

<table className="table table-striped my-3">
    <thead>
        <tr>
            <th>Teams</th> {/* Changed from <tr> to <th> for table header */}
        </tr>
    </thead>
    <tbody> {/* Added tbody for table body */}
        {userTeams.map((team, index) => (
            <tr key={index}> {/* Added key prop */}
                <td><Link to={`/teams/${team.team_id}`}>{team.team_name}</Link></td>
            </tr>
        ))}
    </tbody>
</table>




                </Card>
        
                </section>    
            :
            <section>Loading...</section>
        }

        </section>
    )
}