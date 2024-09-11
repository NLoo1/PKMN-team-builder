import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { TeamList, MyTeamList, NewTeam } from '../pages/TeamList';
import { UserList } from '../pages/UserList';
import { PokemonList } from '../pages/PokemonList';
import { Team } from '../containers/Team';
import '../styles/Page.css';



/**
 * Page - Generic component to display a basic banner card and render different content 
 * based on the provided 'type' prop.
 * 
 * @param {Object} props - The props for the component.
 * @param {string} props.type - The type of content to display, which determines 
 *                               the component to render.
 * @param {Object} [props.currentUser] - The current user object, optional prop used 
 *                                       by some content components.
 * 
 * @returns {JSX.Element} - Rendered Page component with a banner and the appropriate 
 *                           content based on the 'type' prop.
 */
export default function Page({ type,currentUser }) {
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
      <ContentComponent currentUser={currentUser} />
    </div>
  );
}
