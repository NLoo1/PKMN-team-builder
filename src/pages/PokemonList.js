import './List.css'
import React, { useState } from "react";
import useFetchItems  from "./hooks/useFetchItems";
import { Search } from "./Search";
import Item from "./Item";

export function PokemonList() {
  const [offset, setOffset] = useState(0);
  const [loadMoreCount, setLoadMoreCount] = useState(20);
  const [isSearching, setIsSearching] = useState(false)
  const { data, isLoading, getItems, setData } = useFetchItems("pokemon", offset, loadMoreCount);

  const handleLoadMore = (e) => {
    e.preventDefault();
    setOffset((prevOffset) => prevOffset + loadMoreCount);
  };

  if (isLoading && data.length === 0) {
    return <p>Loading &hellip;</p>;
  }

  return (
    <section className="content">
      <div className="search">
        <Search
          getItems={getItems}
          setData={setData}
          setLoadMoreCount={setLoadMoreCount}
          setOffset={setOffset}
          setIsSearching={setIsSearching}
          type="pokemon"
        />
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {data.map((pokemon, i) => (
              <Item key={i} data={pokemon} type="pokemon" />
            ))}
          </tbody>
        </table>
        <button onClick={handleLoadMore} className="btn btn-primary mx-auto d-block">
          Load More
        </button>
      </div>
    </section>
  );
}
