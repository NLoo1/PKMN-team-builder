import '../styles/List.css'; 
import { Card, CardBody, CardTitle } from "reactstrap";
import PokeAPI from '../services/api'; 
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";


/**
 * Team
 * Component for rendering a team. Allows for editing and deletion depending on permissions.
 */
export function Team({ token, editTeam, deleteTeam }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [teamData, setTeamData] = useState([]);
    const [teamName, setTeamName] = useState("New Team")
    const params = useParams();

    useEffect(() => {
        async function fetchTeamData() {
            try {
                const resp = await PokeAPI.getAllPokemonInTeam(params.id, localStorage.token);
                const name = await PokeAPI.getTeamById(params.id, localStorage.token)
                setTeamData(resp);  
                setTeamName(name)
                setIsLoaded(true);
            } catch (err) {
                console.error("Error fetching team data:", err);
            }
        }
        fetchTeamData();
    }, [params.id]);

    return (
        <section className='content'>
            {isLoaded && teamData.length > 0 ? (
                <section>
                    <Card>
                        <CardTitle><h1>
                            {teamName.team_name}</h1></CardTitle>
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
                                            <td>{pkmn.pokemon_name[0].toUpperCase() + pkmn.pokemon_name.slice(1)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Link to={`/teams/${params.id}/delete`}><button className='btn btn-danger my-2'>Delete team</button></Link>
                            <Link to={`/teams/${params.id}/edit`}><button className='btn btn-primary my-2 mx-1'>Edit team</button></Link>
                        </CardBody>
                    </Card>
                </section>
            ) : (
                <section>Loading...</section>
            )}
        </section>
    );
}
