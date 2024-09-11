import React, { useState } from "react";
import PokeAPI from '../services/api';


/**
 * Search - A component for rendering a search bar to filter data in a list.
 * 
 * Provides a text input for users to type their search query and a button to trigger the search.
 * Based on the provided type, it will fetch and filter data accordingly, updating the displayed items.
 * Resets the search and fetches all items when the search query is empty.
 * 
 * @param {Object} props - The props for the component.
 * @param {Function} props.getItems - Function to fetch items when search is cleared or for initial load.
 * @param {string} props.location - The current location or route; can be used for context-specific logic (not used in the provided code).
 * @param {Function} props.setData - Function to set the data for the list based on the search result.
 * @param {Function} props.setLoadMoreCount - Function to set the number of items to load on further requests.
 * @param {Function} props.setOffset - Function to set the offset for pagination.
 * @param {Function} props.setIsSearching - Function to set the search state (true/false) while searching.
 * @param {string} props.type - The type of data to search (e.g., "users", "pokemon", "teams").
 * 
 * @returns {JSX.Element} - Rendered search bar with input and submit button.
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
