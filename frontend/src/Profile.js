import { Card, CardBody, CardTitle } from "reactstrap";
import PokeAPI from "./api";
import { useState, useEffect } from "react";


export function Profile({currentUser, token}){

    const [isLoaded, setIsLoaded] = useState(false)
    const [userData, setUserData] = useState(null)


    // console.log(localStorage)
    useEffect( () => {
        async function getProfile(){
            const resp = await PokeAPI.getUser(currentUser, token)
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
                    <CardTitle>yes.</CardTitle>
                    <CardBody>
                        y
                    </CardBody>
                </Card>
                </section>    
            :
            <section>I have not loaded :(</section>
        }
        </section>
    )
}