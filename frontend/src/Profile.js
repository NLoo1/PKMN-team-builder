import { Card, CardBody, CardTitle } from "reactstrap";
import PokeAPI from "./api";
import { useState, useEffect } from "react";
import EditUser from "./EditProfile";
import { useLocation, useParams } from "react-router-dom";
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

                    {/* If logged in user is actual user or admin */}
                    {(location.pathname.includes('/profile') || localStorage.isAdmin=='true') 
                    && 
                        <div className='buttons'>
                        <button className='btn btn-primary'>Edit user</button>
                        <button className='btn btn-danger'>Delete user</button>   
                        </div>
                    }


                    {/* {location.pathname.includes('/users') && !location.pathname.includes(localStorage.user) &&  */}
                    {/* <h1>:(</h1>} */}

                
        {/* <button className="btn btn-primary">
            {location.pathname.includes('/profile') ? 
        :
            <Link to={'/users/' + params.username + '/edit'} style={{color:'white'}}>Edit profile</Link>
        }
            </button> */}

            {localStorage.isAdmin == true &&
        <button className="btn btn-danger">Delete user</button>
            }
                </Card>
                
                </section>    
            :
            <section>Loading...</section>
        }

        </section>
    )
}