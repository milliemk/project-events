import { ReactNode, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useContext(AuthContext);
  const isUserLoggedIn = user ? true : false;

  const navigateTo = useNavigate();
  const redirectToLogin = () => {
    navigateTo("/login");
  };

  return (
    <>
      {isUserLoggedIn ? (
        children
      ) : (
        <div>
          <div className="error-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              fill="currentColor"
              viewBox="0 -960 960 960"
            >
              <path d="M120-120v-80h80v-560q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v560h80v80H120Zm560-80v-560H280v560h400ZM560-440q17 0 28.5-11.5T600-480q0-17-11.5-28.5T560-520q-17 0-28.5 11.5T520-480q0 17 11.5 28.5T560-440ZM280-760v560-560Z" />
            </svg>
            <h2 className="bungee-regular log-in-first-title">
              Uh-oh! Looks like you're not logged in.
            </h2>
            <h3 className="poppins-regular">
              Please{" "}
              <a className="redirect-login-link" onClick={redirectToLogin}>
                log in
              </a>{" "}
              to access this page!
            </h3>
          </div>
        </div>
      )}
    </>
  );
}

export default ProtectedRoute;
