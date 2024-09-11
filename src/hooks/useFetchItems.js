import { useState, useEffect } from 'react';
import { fetchItems } from '../services/api';


/**
 * Custom hook to fetch data for List components. 
 * Based on props 'type' passed, different data will be fetched.
 * 
 * @param {String} type 
 * @param {Integer} offset Range from which to begin fetching data. 
 * @param {Integer} loadMoreCount Default 20; How many entries to load upon clicking Load More button 
 * 
 * RANGE OF LOADING ENTRIES ==> (0 + offset) to (offset+loadMoreCount)
 * 
 * @returns {[Object]} - the items
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
          items = await PokeAPI.getAllTeams(localStorage.token);
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
        // Assuming each item in the response has an id and name property
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
    // Reset data only if not in 'pokemon' or 'new-team' mode to expand the list
    if (type !== 'pokemon' && type !== 'new-team') setData([]);
    getItems();
  }, [getItems, type]);

  return { data, isLoading, getItems, setData };
}
