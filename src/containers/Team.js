import React, { useState, useEffect, Fragment, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardBody, CardTitle } from "reactstrap";
import PokeAPI from "../services/api";
import "../styles/List.css";

export function Team({ token, editTeam, deleteTeam, currentUser }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [teamData, setTeamData] = useState([]);
  const [teamName, setTeamName] = useState({ team_name: "New Team", user_id: null });
  const [error, setError] = useState('');
  const params = useParams();

  useEffect(() => {
    async function fetchTeamData() {
      try {
        const [resp, name] = await Promise.all([
          PokeAPI.getAllPokemonInTeam(params.id),
          PokeAPI.getTeamById(params.id),
        ]);
        setTeamData(resp);
        setTeamName(name);
        setIsLoaded(true);
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError(err);
      }
    }
    fetchTeamData();
  }, [params.id]);

  const canEditOrDelete = useMemo(() => {
    return (
      currentUser &&
      (currentUser.isAdmin === "true" || (teamName.user_id && currentUser.user_id.toString() === teamName.user_id.toString()))
    );
  }, [currentUser, teamName]);

  return (
    <section className="content">
      {error && (
        <div className="error-message">
          {error.message || "An unknown error occurred"}
        </div>
      )}

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

              {canEditOrDelete && (
                <Fragment>
                  <Link to={`/teams/${params.id}/delete`}>
                    <button className="btn btn-danger my-2">Delete team</button>
                  </Link>
                  <Link to={`/teams/${params.id}/edit`}>
                    <button className="btn btn-primary my-2 mx-1">Edit team</button>
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
  