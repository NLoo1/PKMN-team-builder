import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import {TeamList, MyTeamList, NewTeam} from "./TeamList.js";  
import {UserList} from "./UserList.js"; 
import {PokemonList} from "./PokemonList.js";  
import { Team } from "./Team.js";
import './Page.css';


/**
 * Generic Page component to display basic banner card. 
 * Renders different components depending on passed 'type' prop
 */
export default function Page({ type }) {
  let ContentComponent;
  let title;

  switch (type) {
    case "new-team":
      ContentComponent = NewTeam;
      title = "Create a new team"
      break
    case "pokemon":
      title="All Pokemon"
      ContentComponent = PokemonList; 
      break;
    case "teams":
      title="All teams"
      ContentComponent = TeamList; 
      break;
    case "my-teams":
      title ="Your teams"
      ContentComponent = MyTeamList; 
      break;
    case "users":
      title = "All users"
      ContentComponent = UserList;
      break;
    case "team-details":
      title = "Team details"
      ContentComponent = Team;
      break;
    default:
      ContentComponent = () => <div>Type not supported</div>;
  }

  return (
    <div className="page">
      <section>
        <Card>
          <CardBody className="text-center">
            <CardTitle>
              <h3 className="font-weight-bold">
                {title}
              </h3>
            </CardTitle>
          </CardBody>
        </Card>
      </section>
      <hr />
      
      {/* Render the specific component based on type */}
      <ContentComponent />
    </div>
  );
}
