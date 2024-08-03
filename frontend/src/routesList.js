import './routesList.css'
import React, { useState, useEffect } from "react";
import PokeAPI from "./api";
import { Link, useLocation, useParams } from "react-router-dom";
import { CardBody, CardTitle, Card } from "reactstrap";
import axios from "axios";
/**
 * List
 *
 * Used for /companies, /jobs, and /users. This is the table.
 * Data fetched is dependent on the location.
 */
export function List({ type }) {

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  const location = useLocation();

  // Depending on type passed, fetches different data
  async function getItems() {
    let items;
    switch (type) {
      case "users":
        items = await PokeAPI.getUsers(localStorage.token);
        break;
    case "pokemon":
        items = (await PokeAPI.getAllPokemon()).results
        break;
      default:
        console.log("Invalid type");
        items = [];
        break;
    }

    // Items are then sorted by id, if applicable
    items = items.sort((a, b) => a.id - b.id);

    // Set data state here. data is then mapped as Items
    setData(items);

    // Disable loading icon
    setIsLoading(false);
  }

  // Upon first render, get the appropriate item
  useEffect(() => {
    getItems();
  }, [type]);

  // While fetching data from API, show loading icon
  if (isLoading) {
    return <p>Loading &hellip;</p>;
  }

  // The actual content to return
  return (
    <section class='content'>
      {/* Search bar. Items, location, and data are passed to redirect to appropriate route */}
      <Search getItems={getItems} location={location} setData={setData} />

      <table className="table table-responsive table-striped">
        <thead>

          {/* If route is /users, show users table */}
          {type === "users" && (
            <tr>
              <th>Username</th>
              <th>Email</th>
            </tr>
          )}
          {type === "pokemon" && (
            <tr>
              <th>Pokemon</th>
            </tr>
          )}
        </thead>
        <tbody>
          {/* Each row in a List is considered an Item */}
          {data.map((d) => (
            <Item key={d.id} data={d} type={type}/>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/**
 * Item
 *
 * An individual company, user, or job.
 * A List will render several Items (i.e. Users, Companies, Jobs)
 */

export function Item({ data, type }) {
  const [imageUrl, setImageUrl] = useState("");

  // Fetch the image URL when the component mounts
  useEffect(() => {
    if (type === "pokemon") {
      const fetchImage = async () => {
        const url = await PokeAPI.getPokemonSpriteByURL(data.url);
        setImageUrl(url);
      };

      fetchImage();
    }
  }, [data.url, type]);

  // Render the component based on the type
  switch (type) {
    case "users":
      return (
        <tr key={data.username}>
          <td>{data.username}</td>
          <td>{data.email}</td>
        </tr>
      );
    case "pokemon":
      return (
        <tr key={data.name}>
          <td><img src={imageUrl} alt={data.name} /></td>
          <td>{data.name}</td>
        </tr>
      );
    default:
      console.log("Invalid type");
      return null;
  }
}

/**
 * Search
 *
 * Search bar rendered inside a List, above the table.
 * Will update the table to match the search query.
 * The entire table will return with an empty search query.
 */
export function Search({ getItems, location, setData }) {
  const [search, setSearch] = useState("");

  return (
    <section>
      {/* This is the actual search bar */}
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => {
          // Update search state after trimming for whitespace
          setSearch(e.target.value.trim());
        }}
      />
      <button
        className="btn btn-primary"
        onClick={() => {
          // If the query is empty, just get all the items again
          if (search == ""){
            console.debug("Search bar is empty")
            return getItems();
          }
          async function lookUp() {
            let searchTerm;

            // Filter by location.
            switch (location.pathname) {

              case "/users":
                searchTerm = await PokeAPI.getUsers(search);
                break;
                case "/pokemon":
                searchTerm = await PokeAPI.getAllPokemon(search);
                searchTerm = searchTerm.results
                const results = searchTerm.filter( (e) => 
                  e.name.includes(search))
                setData(results)
                break;
              default:
                console.log("cant find that shit")
                break;
            }
          }
          lookUp();
        }}
      >
        Submit
      </button>
    </section>
  );
}