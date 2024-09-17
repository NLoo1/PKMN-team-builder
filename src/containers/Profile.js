import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import PokeAPI from "../services/api";
import { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "react-router-dom";

export function Profile({ currentUser, token, editUser, deleteUser }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userTeams, setUserTeams] = useState([]);
  const [error, setError] = useState(null); // Added error state

  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    async function getProfile() {
      try {
        let resp;

        if (location.pathname.includes("/profile")) {
          resp = await PokeAPI.getUser(currentUser.username, token);
        } else if (location.pathname.includes("/users")) {
          resp = await PokeAPI.getUser(params.username, token);
        }

        if (!resp) {
          throw new Error("No user data returned");
        }

        setUserData(resp);
        const team = await PokeAPI.getProfileTeams(resp.user.username);
        setUserTeams(team);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message || "Failed to fetch user data.");
        setIsLoaded(true); // Ensure loading state is set to true even on error
      }
    }

    getProfile();
  }, [currentUser, location.pathname, params.username, token]);

  return (
    <section>
      {error && <section>{error}</section>}
      {isLoaded && userData ? (
        <section>
          <Card>
            <CardTitle>
              <h1>{userData.user.username}</h1>
            </CardTitle>
            <CardBody>{userData.user.bio}</CardBody>

            {location.pathname.includes("/profile") && (
              <section>
                <Link to={"/users/" + localStorage.user + "/edit"}>
                  <button className="btn btn-primary">Edit user</button>
                </Link>
                <Link to={"/users/" + localStorage.user + "/delete"}>
                  <button className="btn btn-danger mx-2">Delete user</button>
                </Link>
              </section>
            )}

            {location.pathname.includes("/users/") && (
              <section>
                <Link to={`/users/${params.username}/edit`}>
                  <button className="btn btn-primary">Edit user</button>
                </Link>
                {(currentUser?.isAdmin || currentUser?.username === params.username) && (
                  <Link to={`/users/${params.username}/delete`}>
                    <button className="btn btn-danger mx-2">Delete user</button>
                  </Link>
                )}
              </section>
            )}

            <table className="table table-striped my-3">
              <thead>
                <tr>
                  <th>Teams</th>
                </tr>
              </thead>
              <tbody>
                {userTeams.length > 0 ? (
                  userTeams.map((team, index) => (
                    <tr key={index}>
                      <td>
                        <Link to={`/teams/${team.team_id}`}>
                          {team.team_name}
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>This user has no teams.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </section>
      ) : (
        !error && <section>Loading...</section>
      )}
    </section>
  );
}
