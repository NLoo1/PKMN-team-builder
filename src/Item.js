import React, { useState, useEffect } from "react";
import PokeAPI from "./api";
import { Fragment } from "react";
import { Link } from "react-router-dom";

export function Item({ data, type, isSelectable, isSelected, onCheckboxChange}) {
  const [imageUrl, setImageUrl] = useState("");

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
