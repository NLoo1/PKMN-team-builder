import "./List.css";
import React, { useEffect, useState } from "react";
import useFetchItems from "./hooks/useFetchItems";
import { Search } from "./Search";
import Item from "./Item";
import { Link } from "react-router-dom";
import PokeAPI from "./api";
import { Card, CardBody, CardTitle } from "reactstrap";

// Reusable List Component
function ListComponent({
  type,
  title,
  createTeamButton,
  renderItems,
  noItemsMessage,
}) {
  const [offset, setOffset] = useState(0);
  const [loadMoreCount, setLoadMoreCount] = useState(20);
  const [isSearching, setIsSearching] = useState(false);
  const { data, isLoading, getItems, setData, totalCount } = useFetchItems(
    type,
    offset,
    loadMoreCount
  );

  // Handler for the 'Load More' button
  const handleLoadMore = (e) => {
    e.preventDefault();
    setOffset((prevOffset) => prevOffset + loadMoreCount);
  };

  // On load, get items
  useEffect(() => {
    getItems();
  }, [getItems]);

  return (
    <section className="content">
      <div className="search">
        <Search
          getItems={getItems}
          setData={setData}
          setOffset={setOffset}
          setIsSearching={setIsSearching}
          setLoadMoreCount={setLoadMoreCount}
          type={type}
        />
      </div>
      <div className="table-container">
        {createTeamButton && (
          <Link to="/teams/new">
            <button className="btn btn-primary mx-auto mb-1">
              Create a team
            </button>
          </Link>
        )}
        {isLoading && data.length === 0 ? (
          <p>Loading &hellip;</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>{title}</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                renderItems(data)
              ) : (
                <tr>
                  <td>{noItemsMessage}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {!isSearching && data.length < totalCount && (
          <button
            onClick={handleLoadMore}
            className="btn btn-primary mx-auto d-block"
          >
            Load More
          </button>
        )}
      </div>
    </section>
  );
}

// List of teams
export function TeamList() {
  return (
    <ListComponent
      type="teams"
      title="Teams"
      createTeamButton={true}
      renderItems={(data) =>
        data.map((team, i) => <Item key={i} data={team} type="teams" />)
      }
      noItemsMessage="No teams found!"
    />
  );
}

// List of teams owned by the logged-in user
export function MyTeamList() {
  return (
    <ListComponent
      type="my-teams"
      title="My Teams"
      createTeamButton={true}
      renderItems={(data) =>
        data.map((team, i) => <Item key={i} data={team} type="my-teams" />)
      }
      noItemsMessage="You don't have any teams!"
    />
  );
}

/**
 * For when the user wants to create a new team
 * @description same thing as /pokemon, but with checkboxes and ability to key in team name
 * @requires token - user should be logged in
 */
export function NewTeam() {
  const [selectedPokemon, setSelectedPokemon] = useState(new Set());
  const [formData, setFormData] = useState({ teamName: "" });
  const [offset, setOffset] = useState(0);
  const [loadMoreCount] = useState(20);
  const [isSearching, setIsSearching] = useState(false);

  const { data, isLoading, getItems, setData } = useFetchItems(
    "new-team",
    offset,
    loadMoreCount
  );

  useEffect(() => {
    setData([]);
    setOffset(0);
    getItems();
  }, [getItems]);

  const handleLoadMore = (e) => {
    e.preventDefault();
    setOffset((prevOffset) => prevOffset + loadMoreCount);
  };

// Handle any changes in checkboxes
const handleCheckboxChange = (pokemon) => {
  // Update selected Pokémon
  setSelectedPokemon((prevSelected) => {
    const newSelected = new Set(prevSelected);

    // Check if Pokémon is already selected based on its ID
    const isSelected = Array.from(newSelected).some(
      (p) => p.id === pokemon.id
    );

    if (isSelected) {
      // Remove Pokémon if already selected
      newSelected.forEach((p) => {
        if (p.id === pokemon.id) {
          newSelected.delete(p);
        }
      });
    } else if (newSelected.size < 6) {
      // Add Pokémon if less than 6 are selected
      newSelected.add(pokemon);
    } else {
      alert("Up to 6 Pokémon may be added.");
    }

    console.log(newSelected);
    return newSelected;
  });
};


  // Handle any changes in team name
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  /**
   * Handling for team creation.
   * @description accesses API to create team on Team table, then populates teams_pokemon table
   * @param {*} e - the Create Team button
   * @throws {Error} - if there's any issue with team creation (usually API issues)
   */
  async function handleCreateTeam(e) {
    e.preventDefault();
    if (selectedPokemon.size === 0) {
      alert("Please select at least one Pokémon to create a team.");
      return;
    }
  
    try {
      const user = await PokeAPI.getUser(localStorage.user, localStorage.token);
  
      // Create team
      const team = await PokeAPI.createTeam(
        {
          team_name: formData.teamName || "New Team",
          user_id: user.user.user_id, // Find user id
        },
        localStorage.token
      );
  
      const user_id = team.team.user_id;
      const team_id = team.team.team_id;
  
      // Prepare an array of Pokémon IDs for the API
      const pokemonToAdd = Array.from(selectedPokemon).map((p) => ({
        pokemon_id: p.id, // Using ID instead of name
        pokemon_name: p.name,
      }));
  
      // Populate teams_pokemon
      await PokeAPI.addPokemonToTeam(
        team_id,
        {
          user_id: user_id,
          team_id: team_id,
          pokemon: pokemonToAdd,
        },
        localStorage.token
      );
  
      alert("Team created successfully!");
  
      // Reset set
      setSelectedPokemon(new Set());
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team.");
    }
  }
  

  return (
    <section className="content">
      <Search
        getItems={getItems}
        setData={setData}
        setOffset={setOffset}
        setIsSearching={setIsSearching}
        type="new-team"
      />
      <form className="form mb-2" onSubmit={handleCreateTeam}>
        <Card>
          <CardTitle>
            <label htmlFor="teamName">Enter team name:</label>
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
            Create Team
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
    key={pokemon.id || i}  // Use the ID or fallback to the index
    data={pokemon}
    type="pokemon"
    isSelectable={true}
    isSelected={Array.from(selectedPokemon).some((p) => p.id === pokemon.id)}
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
