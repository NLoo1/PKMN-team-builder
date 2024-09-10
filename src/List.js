

/**
 * Deprecated: do not use.
 * The List component became exceedingly complex after rendering completely differently on the DOM based on specific conditions.
 * This has since been separated into TeamList, userList, and Pokemon List.
 */

import "./List.css";
import React, { useState, useEffect, useCallback } from "react";
import PokeAPI from "./api";
import { useLocation, Link } from "react-router-dom";
import Item from "./Item";
import { Search } from "./Search";
import { Fragment } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";

export function List({ type }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [loadMoreCount, setLoadMoreCount] = useState(20);
  const [offset, setOffset] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState(new Set());
  const [formData, setFormData] = useState({ teamName: "" });

  const location = useLocation();

  const getItems = useCallback(async () => {``
    setIsLoading(true);

    try {
      let items = [];
      switch (type) {
        case "pokemon":
        case "new-team":
          items = await PokeAPI.getAllPokemon(offset, loadMoreCount);
          break;
        case "users":
          items = await PokeAPI.getUsers(localStorage.token);
          break;
        case "teams":
          items = await PokeAPI.getAllTeams(localStorage.token);
          break;
        case "my-teams":
          items = await PokeAPI.getAllUserTeams(localStorage.token);
          break;
        default:
          console.error(`Unknown type: ${type}`);
          return;
      }

      setData((prevData) => [
        ...prevData,
        ...items.sort((a, b) => a.id - b.id),
      ]);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
    }
  }, [offset, loadMoreCount, type]);

  useEffect(() => {
    setData([]);
    setOffset(0);
    getItems();
  }, [getItems, type, location.pathname]);

  const handleLoadMore = (e) => {
    e.preventDefault();
    setOffset((prevOffset) => prevOffset + loadMoreCount);
  };

  const handleCheckboxChange = (pokemonName) => {
    setSelectedPokemon((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(pokemonName)) {
        newSelected.delete(pokemonName);
      } else {
        if (newSelected.size < 6) {
          newSelected.add(pokemonName);
        } else if (newSelected.size == 6) {
          alert("Up to 6 Pokemon may be added.");
        }
      }
      console.log(newSelected);
      return newSelected;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  async function handleCreateTeam(e) {
    e.preventDefault();

    // Prevent empty teams
    if (selectedPokemon.size === 0) {
      alert("Please select at least one Pokémon to create a team.");
      return;
    }

    const pokemonIds = Array.from(selectedPokemon);

    console.log("CREATING");
    console.log(selectedPokemon);

    // First, enter into teams table
    try {
      // Get the user's id
      const user = await PokeAPI.getUser(localStorage.user);

      // Pass user id to create team
      const team = await PokeAPI.createTeam(
        {
          team_name: formData.teamName || "New Team",
          user_id: user.user_id,
        },
        localStorage.token
      );

      // team should return {team_id, team_name, user_id}
      const team_id = team.team_id;
      // Get the Set of Pokemon
      const pokemon = selectedPokemon;

      // await PokeAPI.addPokemonToTeam()

      // Create a related row in teams_pokemon
      alert("Team created successfully!");
      setSelectedPokemon(new Set());
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team.");
    }
  }

  const renderTable = () => {
    switch (type) {
      case "pokemon":
      case "new-team":
        return (
          <Fragment>
            {type === "new-team" && (
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
                  <button
                    type="submit"
                    className="btn btn-primary mx-auto d-block"
                  >
                    Create Team
                  </button>
                </Card>
              </form>
            )}
            <table className="table">
              <thead>
                <tr>
                  {type === "new-team" && <th>Select</th>}
                  <th>Image</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {data.map((pokemon, i) => (
                  <Item
                    key={i}
                    data={pokemon}
                    type="pokemon"
                    isSelectable={type === "new-team"}
                    isSelected={selectedPokemon.has(pokemon.name)}
                    onCheckboxChange={() => handleCheckboxChange(pokemon.name)}
                  />
                ))}
              </tbody>
            </table>
          </Fragment>
        );

      case "users":
        return (
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user, i) => (
                <Item key={i} data={user} type="users" />
              ))}
            </tbody>
          </table>
        );

      case "teams":
        return (
          <Fragment>
            <Link to="/teams/new">
              <button className="btn btn-primary mx-auto mb-1">
                Create a team
              </button>
            </Link>
            <table className="table">
              <thead>
                <tr>
                  <th>Teams</th>
                </tr>
              </thead>
              <tbody>
                {data.map((team, i) => (
                  <Item key={i} data={team} type="teams" />
                ))}
              </tbody>
            </table>
          </Fragment>
        );

      case "my-teams":
        return (
          <Fragment>
            <Link to="/teams/new">
              <button className="btn btn-primary mx-auto mb-1">
                Create a team
              </button>
            </Link>
            <table className="table">
              <thead>
                <tr>
                  <th>My teams</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((team, i) => (
                    <Item key={i} data={team} type="my-teams" />
                  ))
                ) : (
                  <tr>
                    <td>You don't have any teams!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Fragment>
        );

      default:
        return null;
    }
  };

  if (isLoading && data.length === 0) {
    return <p>Loading &hellip;</p>;
  }

  return (
    <section className="content">
      <div className="search">
        <Search
          getItems={getItems}
          location={location}
          setData={setData}
          setLoadMoreCount={setLoadMoreCount}
          setOffset={setOffset}
          setIsSearching={setIsSearching}
        />
      </div>

      <div className="table-container">
        {renderTable()}
        {!isSearching && (
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

export default List;
