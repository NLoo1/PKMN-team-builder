import { Card, CardBody, CardTitle } from "reactstrap";
import PokeAPI from "../services/api";
import { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "react-router-dom";

/**
 * Profile - Component for rendering a user's profile. Displays user information,
 * user's teams, and provides options for editing or deleting the user based on
 * routing and permissions.
 * 
 * @param {Object} props - The props for the component.
 * @param {Object} props.currentUser - The currently logged-in user object.
 * @param {string} props.token - Authentication token used for API requests.
 * @param {Function} props.editUser - Function to handle user editing.
 * @param {Function} props.deleteUser - Function to handle user deletion.
 * 
 * @returns {JSX.Element} - Rendered Profile component with user details, user's teams,
 *                           and action buttons (edit and delete) based on user role
 *                           and routing.
 */
export function Profile({ currentUser, token, editUser, deleteUser }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userTeams, setUserTeams] = useState([]);

  // Location and params help determine if this is the logged-in user's profile or someone else's.
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    async function getProfile() {
      let resp;

      if (location.pathname.includes("/profile")) {
        resp = await PokeAPI.getUser(currentUser, token);
      } else if (location.pathname.includes("/users")) {
        resp = await PokeAPI.getUser(params.username, token);
      }

      setUserData(resp);
      const team = await PokeAPI.getAllUserTeams(resp.user_id, token);
      setUserTeams(team);

      setIsLoaded(true);
    }

    getProfile();
  }, [currentUser, location.pathname, params.username, token]);

  return (
    <section>
      {isLoaded && userData ? (
        <section>
          <Card>
            <CardTitle>
              <h1>{userData.user.username}</h1>
            </CardTitle>
            <CardBody>{userData.user.bio}</CardBody>

            {/* User edits their own profile if routed here via /profile */}
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

            {/* If routed here through /users, display these for admins only  */}
            {location.pathname.includes("/users/") && (
              <section>
                <Link to={`/users/${params.username}/edit`}>
                  <button className="btn btn-primary">Edit user</button>
                </Link>
                {(currentUser?.isAdmin ||
                  currentUser?.username === params.username) && (
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
                {" "}
                {/* Added tbody for table body */}
                {userTeams.map((team, index) => (
                  <tr key={index}>
                    {" "}
                    {/* Added key prop */}
                    <td>
                      <Link to={`/teams/${team.team_id}`}>
                        {team.team_name}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>
      ) : (
        <section>Loading...</section>
      )}
    </section>
  );
}
