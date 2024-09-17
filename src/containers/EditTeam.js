import React, { useState, useEffect } from "react";
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
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message

  const { data, getItems } = useFetchItems("new-team", offset, loadMoreCount);

  // Fetch Pokémon list and team data
  useEffect(() => {
    if (!id) {
      console.error("No team ID provided.");
      return;
    }
  
    const fetchData = async () => {
      try {
        await getItems();
        const teamData = await PokeAPI.getTeamById(id, token);
        const team_name = teamData?.team_name || "Default Team Name";
const user_id = teamData?.user_id || null;

        setTeamOwnerId(user_id);
        setFormData({ teamName: team_name });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch team data");
      }
    };
  
    fetchData();
  }, [id, getItems, token]);
  

  // Check if the current user is the owner or an admin
  useEffect(() => {
    if (teamOwnerId && currentUser) {
      if (teamOwnerId.toString() !== currentUser.user_id && currentUser.isAdmin === 'false') {
        alert("You do not have permission to edit this team.");
        window.history.back(); 
      }
    }
  }, [teamOwnerId, currentUser]);

  // Handle Pokémon selection changes
  const handleCheckboxChange = (pokemon) => {
    setSelectedPokemon((prevSelected) => {
      const newSelected = new Set(prevSelected);

      // Check if the Pokémon is already selected based on its ID
      if (newSelected.has(pokemon)) {
        newSelected.delete(pokemon); // Remove Pokémon
      } else if (newSelected.size < 6) {
        newSelected.add(pokemon); // Add Pokémon if less than 6 are selected
      } else {
        alert("You can only add up to 6 Pokémon to a team.");
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
      alert("Please select at least one Pokémon to create a team.");
      return;
    }
  
    try {
      const user = await PokeAPI.getUser(currentUser.username, currentUser.token);
      const team_id = id;

      // Prepare an array of Pokémon objects with required properties
      const pokemonToAdd = Array.from(selectedPokemon).map((pokemon, index) => ({
        pokemon_id: pokemon.pokemon_id,
        pokemon_name: pokemon.name,
        position: index + 1
      }));

      await PokeAPI.editPokemonInTeam(
        team_id,
        {
          user_id: user.user.user_id,
          team_id: team_id,
          pokemon: pokemonToAdd,
        },
        currentUser.token
      );
      
      setSuccessMessage("Team edited successfully!"); // Set success message
      setSelectedPokemon(new Set()); // Reset selected Pokémon
    } catch (error) {
      console.error("Error editing team:", error);
      setError("Failed to edit team.");
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
          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>} {/* Render success message */}

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
          {data.map((pokemon, i) => (
            <Item
              key={pokemon.id || i} // Use the ID or fallback to the index
              data={pokemon}
              type="pokemon"
              isSelectable={true}
              isSelected={selectedPokemon.has(pokemon)}
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

export default EditTeam;
