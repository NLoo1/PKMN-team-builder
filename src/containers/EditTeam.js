import { useState, useEffect } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { useParams } from "react-router-dom";
import PokeAPI from "./api";
import useFetchItems from "./hooks/useFetchItems"; // Custom hook for fetching items
import Item from "./Item"; // Component for displaying a Pokémon row

/**
 * For editing an existing team with prefilled team name and selectable Pokémon.
 * @description Allows users to edit the team name and select up to 6 Pokémon.
 * @requires token - user should be logged in
 */
export function EditTeam() {
  const [selectedPokemon, setSelectedPokemon] = useState(new Set());
  const [formData, setFormData] = useState({ teamName: "" });
  const [offset, setOffset] = useState(0);
  const [loadMoreCount] = useState(20);
  const [isSearching, setIsSearching] = useState(false);
  const { id } = useParams(); // Get team ID from URL params

  const { data, isLoading, getItems } = useFetchItems("new-team", offset, loadMoreCount);

  // Fetch Pokémon list and team data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Pokémon list
        await getItems();
        
        // Fetch existing team data
        const teamData = await PokeAPI.getTeamById(id, localStorage.token);
        const { team_name } = teamData;

        // const teamPokemon = await PokeAPI.getAllPokemonInTeam(id, localStorage.token);

        // Set the team name and pre-select Pokémon
        setFormData({ teamName: team_name });
        // setSelectedPokemon(new Set(teamPokemon.map(p => ({ id: p.pokemon_id, name: p.pokemon_name }))));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, getItems]);

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
      const user = await PokeAPI.getUser(localStorage.user, localStorage.token);

      // Prepare the selected Pokémon for the API request
      const pokemonToAdd = Array.from(selectedPokemon).map(p => ({
        pokemon_id: p.id,
        pokemon_name: p.name,
      }));

      await PokeAPI.updateTeam(id, {
        team_name: formData.teamName || "Updated Team",
        user_id: user.user.user_id,
        pokemon: pokemonToAdd,
      }, localStorage.token);

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

      {!isSearching && (
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
