import { useState, useEffect } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { useParams } from "react-router-dom";
import PokeAPI from '../services/api';
import useFetchItems from '../hooks/useFetchItems';
import Item from '../components/Item';

/**
 * EditTeam - Component for editing an existing team with options to update the team name 
 * and select up to 6 Pokémon from a list. Ensures that only the team owner or an admin 
 * can perform edits. Handles Pokémon selection and form submission to update the team.
 * 
 * @param {Object} props - The props for the component.
 * @param {Object} props.currentUser - The currently logged-in user object.
 * @param {string} props.token - Authentication token used for API requests.
 * 
 * @returns {JSX.Element} - Rendered EditTeam component with form for updating the team name, 
 *                           selectable Pokémon list, and "Load More" functionality for the Pokémon list.
 */
export function EditTeam({ currentUser, token }) {
  const [selectedPokemon, setSelectedPokemon] = useState(new Set());
  const [formData, setFormData] = useState({ teamName: "" });
  const [offset, setOffset] = useState(0);
  const [loadMoreCount] = useState(20);
  const { id } = useParams(); // Get team ID from URL params
  const [teamOwnerId, setTeamOwnerId] = useState(null);

  const { data, getItems } = useFetchItems("new-team", offset, loadMoreCount);

  // Fetch Pokémon list and team data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Pokémon list
        await getItems();
        
        // Fetch existing team data
        const teamData = await PokeAPI.getTeamById(id, token);
        const { team_name, user_id } = teamData;
        
        // Fetch the owner ID
        setTeamOwnerId(user_id);

        // Set the team name and pre-select Pokémon
        setFormData({ teamName: team_name });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, getItems, token]);

  // Check if the current user is the owner or an admin
  useEffect(() => {
    if (teamOwnerId && currentUser) {
      if (teamOwnerId !== currentUser.user_id && currentUser.isAdmin === 'false') {
        alert("You do not have permission to edit this team.");
        window.history.back(); 
      }
    }
  }, [teamOwnerId, currentUser]);

  // Handle Pokémon selection changes
  const handleCheckboxChange = (pokemon) => {
    setSelectedPokemon(prevSelected => {
      const newSelected = new Set(prevSelected);
      const isSelected = Array.from(newSelected).some(p => p.id === pokemon.id);

      if (isSelected) {
        newSelected.delete(pokemon);
      } else if (newSelected.size < 6) {
        newSelected.add(pokemon);
      } else {
        alert("Up to 6 Pokémon may be added.");
      }

      return newSelected;
    });
  };

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle team update
  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    if (selectedPokemon.size === 0) {
      alert("Please select at least one Pokémon to update the team.");
      return;
    }

    try {
      // Prepare the selected Pokémon for the API request
      const pokemonToAdd = Array.from(selectedPokemon).map(p => ({
        pokemon_id: p.id,
        pokemon_name: p.name,
      }));

      await PokeAPI.updateTeam(id, {
        team_name: formData.teamName || "Updated Team",
        user_id: currentUser.user_id,
        pokemon: pokemonToAdd,
      }, token);

      alert("Team updated successfully!");
      setSelectedPokemon(new Set()); // Reset after update
    } catch (error) {
      console.error("Error updating team:", error);
      alert("Failed to update team.");
    }
  };

  // Load more Pokémon
  const handleLoadMore = (e) => {
    e.preventDefault();
    setOffset(prevOffset => prevOffset + loadMoreCount);
  };

  return (
    <section className="content">
      <form className="form mb-2" onSubmit={handleUpdateTeam}>
        <Card>
          <CardTitle>
            <label htmlFor="teamName">Edit team name:</label>
          </CardTitle>
          <CardBody>
            <div className="form-group p-2">
              <input
                id="teamName"
                type="text"
                name="teamName"
                placeholder="Team name..."
                value={formData.teamName}
                onChange={handleChange}
                className="form-control"
                autoComplete="off"
              />
            </div>
          </CardBody>
          <button type="submit" className="btn btn-primary mx-auto d-block">
            Update Team
          </button>
        </Card>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Image</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((pokemon) => (
            <Item
              key={pokemon.id}
              data={pokemon}
              type="pokemon"
              isSelectable={true}
              isSelected={Array.from(selectedPokemon).some(p => p.id === pokemon.id)}
              onCheckboxChange={() => handleCheckboxChange(pokemon)}
            />
          ))}
        </tbody>
      </table>

      {data.length >= loadMoreCount && (
        <button
          onClick={handleLoadMore}
          className="btn btn-primary mx-auto d-block"
        >
          Load More
        </button>
      )}
    </section>
  );
}
