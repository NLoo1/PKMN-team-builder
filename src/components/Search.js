import React, { useState } from "react";
import PokeAPI from '../services/api';


/**
 * Search
 *
 * Search bar rendered inside a List, above the table.
 * Will update the table to match the search query.
 * The entire table will return with an empty search query.
 */
export function Search({ getItems, location, setData, setLoadMoreCount, setOffset, setIsSearching, type }) {
  const [search, setSearch] = useState("");

  const handleSearch = async () => {
    if (search.trim() === "") {
      console.debug("Search bar is empty");
      setLoadMoreCount(20); // Reset initial load count
      setOffset(0); // Reset offset
      setIsSearching(false)
      setData([])
      return getItems(); // Fetch all items again
    }

    try {
      let searchTerm;
      setIsSearching(true)

      // Filter by location
      switch (type) {
        case "users":
          searchTerm = await PokeAPI.filterUsers(search, localStorage.token);
          setData(searchTerm);
          break;
        case "new-team":
        case "pokemon":
          searchTerm = await PokeAPI.getAllPokemon(0, 2000); // Fetch all Pokémon
          searchTerm = searchTerm.filter(pokemon =>
            pokemon.name.toLowerCase().includes(search.toLowerCase())
          );
          setData(searchTerm);
          break;
        case "teams":
          searchTerm = await PokeAPI.getAllTeams(localStorage.token)
          break;
        case "my-teams":
          searchTerm = await PokeAPI.getAllUserTeams(localStorage.token)
          break;

        default:
          console.log("Cannot find that");
          break;
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <section className="search">
      {/* This is the actual search bar */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        className="btn btn-primary mx-2"
        onClick={handleSearch}
      >
        Submit
      </button>
    </section>
  );
}
