import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function NavBar() {
  const { user, logout } = useContext(AuthContext);

  console.log("user.imageUrl :>> ", user?.imageUrl);

  const handleLogoutClick = () => {
    logout();
  };
  return (
    <nav className="poppins-regular">
      <NavLink to="/" className={"nav-link"}>
        Home
      </NavLink>
      <br />
      <p>|</p>
      <br />
      <NavLink to="events" className={"nav-link"}>
        All Events
      </NavLink>
      <br />
      <p>|</p>
      <br />
      {user ? (
        <NavLink to="profile" className={"nav-link profile-link"}>
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="Avatar"
              style={{
                width: 30,
                borderRadius: "50%",
              }}
            />
          ) : (
            <span className="material-symbols-outlined">person</span>
          )}
        </NavLink>
      ) : null}
      <br />
      {user ? (
        <div>
          <button
            onClick={handleLogoutClick}
            className="bungee-regular logout-button"
          >
            Log out
          </button>
        </div>
      ) : (
        <button className="bungee-regular login-button">
          <Link className="login-button" to={"/login"}>
            Log in
          </Link>
        </button>
      )}
    </nav>
  );
}

export default NavBar;
