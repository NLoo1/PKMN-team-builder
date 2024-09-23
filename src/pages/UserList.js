
import '../styles/List.css';  
import React, { useState } from "react";
import useFetchItems from '../hooks/useFetchItems'; 
import {Search} from '../components/Search';  
import Item from '../components/Item';  

/**
 * UserList displays a paginated list of users with search and load more functionality.
 * 
 * @returns {JSX.Element} - Rendered UserList component
 */
export function UserList({currentUser}) {

  console.log("THIS IS CURRENT USER FOR USER LIST")
  console.log(currentUser)
  const [offset, setOffset] = useState(0);
  const [loadMoreCount, setLoadMoreCount] = useState(20);
  const [isSearching, setIsSearching] = useState(false)
  const { data, isLoading, getItems, setData } = useFetchItems("users", offset, loadMoreCount, currentUser);

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
          type="users"  
        />
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, i) => (
              <Item key={i} data={user} type="users" />
            ))}
          </tbody>
        </table>
        {!isSearching &&
        <button onClick={handleLoadMore} className="btn btn-primary mx-auto d-block">
        Load More
      </button>
        }
        
      </div>
    </section>
  );

}
