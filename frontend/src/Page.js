import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { useLocation } from "react-router-dom";
import { List } from "./routesList";
import './Page.css'

/**
 * Generic Page component.
 */
export default function Page() {

  // Used to determine what page the user is on
  let location = useLocation()

  // This will show a Welcome page dependent on the route
  location = location.pathname.split('/')[1]
  return (
    <div className="page" >
      <section>
      <Card>
        <CardBody className="text-center">
          <CardTitle>
            <h3 className="font-weight-bold">
              Welcome to {location.slice(0,1).toUpperCase() + location.slice(1)}!
            </h3>
          </CardTitle>

        </CardBody>
      </Card>
      </section>
      <hr />
      
      {/* The location is passed to List to determine what to render 
      If it's /pokemon, show all the Pokemon */}
      <List type={location} />
    </div>
    
  );
}
