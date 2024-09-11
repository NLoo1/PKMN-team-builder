import { useState, useEffect, useCallback } from 'react';
import PokeAPI from '../services/api';

/**
 * Custom hook to fetch data for List components.
 * Based on the 'type' prop, this hook will fetch different types of data (e.g., Pokémon, users, teams).
 * 
 * @param {string} type - The type of items to fetch. Can be 'pokemon', 'new-team', 'users', 'teams', or 'my-teams'.
 * @param {number} offset - The starting point from which data should be fetched.
 * @param {number} loadMoreCount - How many entries to fetch at a time (default is 20).
 * 
 * @returns {{
*   data: Object[],    // Array of items fetched based on the type.
*   isLoading: boolean, // Indicator for whether the data is currently being loaded.
*   getItems: Function, // Function to trigger fetching of more items.
*   setData: Function   // Function to manually update the data state.
* }}
*/
export default function useFetchItems(type, offset, loadMoreCount) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const getItems = useCallback(async () => {
    setIsLoading(true);
    try {
      let items = [];
      switch (type) {
        // Handle fetching Pokémon data with ID and name
        case "new-team":
        case "pokemon":
          items = await PokeAPI.getAllPokemon(offset, loadMoreCount);
          break;
        case "users":
          items = await PokeAPI.getUsers(localStorage.token);
          break;
        case "teams":
          items = await PokeAPI.getAllTeams();
          break;
        case "my-teams":
          items = await PokeAPI.getAllUserTeams(localStorage.token);
          break;
        default:
          console.error(`Unknown type: ${type}`);
          return;
      }

      // For Pokémon data, format items to include pokemon_id and pokemon_name
      if (type === "pokemon" || type === "new-team") {
        items = items.map(pokemon => ({
          pokemon_id: pokemon.id,
          pokemon_name: pokemon.name,
          ...pokemon
        }));
      }

      // If applicable, sort by id
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
  }, [getItems, type]);

  return { data, isLoading, getItems, setData };
}
