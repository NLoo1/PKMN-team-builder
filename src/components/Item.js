import React, { useState, useEffect } from "react";
import PokeAPI from '../services/api';
import { Fragment } from "react";
import { Link } from "react-router-dom";

/**
 * Item - A component for displaying data in a table row.
 * 
 * This component renders a table row (`<tr>`) based on the type of data provided. It can display Pokémon with
 * an image and name, user usernames as links, or team names with links. It supports optional selection functionality
 * for items.
 * 
 * @param {Object} props - The props for the component.
 * @param {Object} props.data - The data to display, varies based on `type`.
 * @param {string} props.type - The type of data to display. Can be "pokemon", "users", "teams", or "my-teams".
 * @param {boolean} [props.isSelectable=false] - Whether the item can be selected. If true, a checkbox will be shown.
 * @param {boolean} [props.isSelected=false] - Whether the item is currently selected. Used to control the checkbox state.
 * @param {Function} [props.onCheckboxChange] - Callback function to handle changes to the checkbox state. Only applicable if `isSelectable` is true.
 * 
 * @returns {JSX.Element} - Rendered table row with data based on `type`.
 */
export function Item({ data, type, isSelectable, isSelected, onCheckboxChange}) {
  const [imageUrl, setImageUrl] = useState("");

  // console.log(data)
  

  useEffect(() => {
    if (type === "pokemon" && data && data.url) { 
      const fetchImage = async () => {
        try {
          const url = await PokeAPI.getPokemonSpriteByURL(data.url);
          setImageUrl(url);
        } catch (error) {
          console.error("Error fetching Pokémon sprite:", error);
        }
      };
      fetchImage();
    }
  }, [data, type]); 

  return (
    <tr>
      {type === "pokemon" && data && data.name && (
        <Fragment>
          {isSelectable && (
            <td>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onCheckboxChange}
              />
            </td>
          )}
          <td>
            {imageUrl ? <img src={imageUrl} alt={data.name} /> : "Loading..."}
          </td>
          <td>
            {data.name ? data.name[0].toUpperCase() + data.name.slice(1) : 'Unknown'}
          </td>
        </Fragment>
      )}
      {type === "users" && data && data.username && (
        <td><Link to={'/users/' + data.username}>{data.username}</Link></td>
      )}

      {(type === 'teams' || type === 'my-teams') && data && data.team_id && (
        <td><Link to={'/teams/' + data.team_id}>{data.team_name}</Link></td>
      )}
    </tr>
  );
}

export default Item;
