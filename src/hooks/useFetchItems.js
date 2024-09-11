import { useState, useEffect, useCallback } from 'react';
import PokeAPI from '../services/api';

/**
 * Custom hook to fetch data for List components.
 * Based on the 'type' prop, this hook will fetch different types of data (e.g., Pokémon, users, teams).
 * 
 * @param {string} type - The type of items to fetch. Can be 'pokemon', 'new-team', 'users', 'teams', or 'my-teams'.
 * @param {number} offset - The starting point from which data should be fetched.
 * @param {number} loadMoreCount - How many entries to fetch at a time (default is 20).
 * @param {Object} currentUser - The current user object, required for fetching user-specific data.
 * 
 * @returns {{
 *   data: Object[],    // Array of items fetched based on the type.
 *   isLoading: boolean, // Indicator for whether the data is currently being loaded.
 *   getItems: Function, // Function to trigger fetching of more items.
 *   setData: Function   // Function to manually update the data state.
 * }}
 */
export default function useFetchItems(type, offset, loadMoreCount, currentUser) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getItems = useCallback(async () => {
    setIsLoading(true);
    try {
      let items = [];
      switch (type) {
        case "new-team":
        case "pokemon":
          items = await PokeAPI.getAllPokemon(offset, loadMoreCount);
          break;
        case "users":
          items = await PokeAPI.getUsers(currentUser.token); // Use currentUser.token
          break;
        case "teams":
          items = await PokeAPI.getAllTeams();
          break;
        case "my-teams":
          items = await PokeAPI.getAllUserTeams(currentUser.currentUser.token); // Use currentUser.token
          break;
        default:
          console.error(`Unknown type: ${type}`);
          return;
      }

      // Format Pokémon data
      if (type === "pokemon" || type === "new-team") {
        items = items.map(pokemon => ({
          pokemon_id: pokemon.id,
          pokemon_name: pokemon.name,
          ...pokemon
        }));
      }

      // Update state with fetched data
      setData(prevData => [...prevData, ...items.sort((a, b) => a.pokemon_id - b.pokemon_id)]);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
    }
  }, [type, offset, loadMoreCount]);

  useEffect(() => {
    if (type !== 'pokemon' && type !== 'new-team') setData([]);
    getItems();
  }, [getItems, type, offset]); // Ensure only necessary dependencies are included

  return { data, isLoading, getItems, setData };
}
