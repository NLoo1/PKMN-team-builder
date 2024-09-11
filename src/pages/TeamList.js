import '../styles/List.css';
import React, { useEffect, useState } from "react";
import useFetchItems from '../hooks/useFetchItems';
import {Search} from '../components/Search';
import Item from '../components/Item';
import { Link } from "react-router-dom";
import PokeAPI from '../services/api';
import { Card, CardBody, CardTitle } from "reactstrap";
import { Fragment } from 'react';

/**
 * ListComponent displays a list of items with support for search and pagination. Reusable for creation and editing of teams.
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Type of items being fetched (e.g., 'pokemon', 'teams')
 * @param {string} props.title - Title of the table header
 * @param {boolean} [props.createTeamButton=false] - If true, displays a button to create a new team
 * @param {function(Array): JSX.Element} props.renderItems - Function to render items in the table body
 * @param {string} props.noItemsMessage - Message to display when no items are available
 * 
 * @returns {JSX.Element} - Rendered ListComponent
 */
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

/**
 * TeamList displays a list of teams using the ListComponent.
 * 
 * @returns {JSX.Element} - Rendered TeamList component
 */
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

/**
 * MyTeamList displays a list of teams owned by the logged-in user using the ListComponent.
 * 
 * @returns {JSX.Element} - Rendered MyTeamList component
 */
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
  }, [getItems, setData]);

  const handleLoadMore = (e) => {
    e.preventDefault();
    setOffset((prevOffset) => prevOffset + loadMoreCount);
  };

  // Handle checkbox changes
  const handleCheckboxChange = (pokemon) => {
    setSelectedPokemon((prevSelected) => {
      const newSelected = new Set(prevSelected);

      // Check if the Pokémon is already selected based on its ID
      if (newSelected.has(pokemon.id)) {
        newSelected.delete(pokemon.id); // Remove Pokémon
      } else if (newSelected.size < 6) {
        newSelected.add(pokemon.id); // Add Pokémon if less than 6 are selected
      } else {
        alert("You can only add up to 6 Pokémon to a team.");
      }

      console.log(newSelected);
      return newSelected;
    });
  };

  // Handle changes to the team name input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle team creation
  const handleCreateTeam = async (e) => {
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
          user_id: user.user.user_id,
        },
        localStorage.token
      );

      const team_id = team.team.team_id;

      // Prepare an array of Pokémon IDs
      const pokemonToAdd = Array.from(selectedPokemon).map((pokemon_id) => ({
        pokemon_id,
      }));

      // Populate teams_pokemon
      await PokeAPI.addPokemonToTeam(
        team_id,
        {
          team_id,
          pokemon: pokemonToAdd,
        },
        localStorage.token
      );

      alert("Team created successfully!");
      setSelectedPokemon(new Set()); // Reset selected Pokémon
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team.");
    }
  };

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
              key={pokemon.id || i} // Use the ID or fallback to the index
              data={pokemon}
              type="pokemon"
              isSelectable={true}
              isSelected={selectedPokemon.has(pokemon.id)}
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
