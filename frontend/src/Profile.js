import { Card, CardBody, CardTitle } from "reactstrap";
import PokeAPI from "./api";
import { useState, useEffect } from "react";
import EditUser from "./EditProfile";
import {Route, Routes, useLocation, useParams } from "react-router-dom";

import { Link } from "react-router-dom";
/**
 * Profile
 * Component exclusively for rendering a user's profile.
 */
export function Profile({currentUser, token, editUser, deleteUser}){
    const [isLoaded, setIsLoaded] = useState(false)
    const [userData, setUserData] = useState(null)

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
        }
        getProfile()
        setIsLoaded(true)

        }
    , [isLoaded])


    return(
        <section>
            {isLoaded && userData ? 
            <section>
                <Card>
                    <CardTitle><h1>{userData.user.username}</h1></CardTitle>
                    <CardBody>
                        yes
                    </CardBody>

                    {/* User edits their own profile if routed here via /profile */}
                    {location.pathname.includes('/profile') 
                    && 
                        <section>
                            <Link to={'/users/' + localStorage.user + '/edit'}><button className='btn btn-primary'>Edit user</button></Link>
                            {localStorage.isAdmin == 'true' &&
                            <Link to={'/users/' + localStorage.user + '/delete'}><button className='btn btn-danger'>Delete user</button></Link>
        
                            }
                        </section>
                    }


                    {/* If routed here through /users, display these for admins only  */}
                    {location.pathname.includes('/users/' ) &&
                        <section>
                            <Link to={'/users/' + params.username + '/edit'}><button className='btn btn-primary'>Edit user</button></Link>
                            {localStorage.isAdmin == 'true' &&
                            <Link to={'/users/' + params.username + '/delete'}><button className='btn btn-danger'>Delete user</button></Link>
                            }
                        </section>
                    }



                </Card>
        
                </section>    
            :
            <section>Loading...</section>
        }

        </section>
    )
}