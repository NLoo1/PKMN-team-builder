import "../styles/List.css";
import { Card, CardBody, CardTitle } from "reactstrap";
import PokeAPI from "../services/api";
import { useState, useEffect, Fragment } from "react";
import { useParams, Link } from "react-router-dom";

/**
 * Team - Component for rendering a team. Displays team details, including Pokémon 
 * in the team, and allows for editing and deletion based on permissions.
 * 
 * @param {Object} props - The props for the component.
 * @param {string} props.token - Authentication token used for API requests.
 * @param {Function} props.editTeam - Function to handle team editing.
 * @param {Function} props.deleteTeam - Function to handle team deletion.
 * @param {Object} [props.currentUser] - The current user object, optional prop used 
 *                                       for permission checks.
 * 
 * @returns {JSX.Element} - Rendered Team component with team details and action buttons 
 *                           (edit and delete) based on user permissions.
 */
export function Team({ token, editTeam, deleteTeam, currentUser }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [teamData, setTeamData] = useState([]);
  const [teamName, setTeamName] = useState("New Team");
  const params = useParams();
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTeamData() {
      try {
        const resp = await PokeAPI.getAllPokemonInTeam(params.id);
        const name = await PokeAPI.getTeamById(params.id);
        setTeamData(resp);
        setTeamName(name);
        setIsLoaded(true);
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError(err)
      }
    }
    fetchTeamData();
  }, [params.id]);

  return (
    <section className="content">
      {error && <div className="alert alert-danger">{error}</div>}
      {isLoaded && teamData.length > 0 ? (
        <section>
          <Card>
            <CardTitle>
              <h1>{teamName.team_name}</h1>
            </CardTitle>
            <CardBody>
              <table>
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Sprite</th>
                    <th>Pokemon</th>
                  </tr>
                </thead>
                <tbody>
                  {teamData.map((pkmn, index) => (
                    <tr key={index}>
                      <td>{pkmn.position}</td>
                      <td>
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pkmn.pokemon_id}.png`}
                          alt={pkmn.pokemon_name}
                        />
                      </td>
                      <td>
                        {pkmn.pokemon_name[0].toUpperCase() +
                          pkmn.pokemon_name.slice(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {(currentUser && 
  (currentUser.isAdmin === "true" || currentUser.user_id === teamName.user_id.toString())) && (
  <Fragment>
    <Link to={`/teams/${params.id}/delete`}>
      <button className="btn btn-danger my-2">Delete team</button>
    </Link>
    <Link to={`/teams/${params.id}/edit`}>
      <button className="btn btn-primary my-2 mx-1">
        Edit team
      </button>
    </Link>
  </Fragment>
)}

            </CardBody>
          </Card>
        </section>
      ) : (
        <section>Loading...</section>
      )}
    </section>
  );
}
