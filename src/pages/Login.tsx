import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const { login, user } = useContext(AuthContext);

  //handle emailchange
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  //handle passwordchange
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  //handle loginclick
  const handleLoginClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.log("Error during login:", error);
      setError(true);
    }
  };

  useEffect(() => {
    if (user) {
      window.history.back();
    }
  }, [user]);

  return (
    <div className="login-container">
      <h2 className="bungee-regular">Login</h2>
      {error && (
        <p className="failed-login poppins-regular bold">
          Login failed, please try again
        </p>
      )}
      {email && !email.includes("@") ? (
        <p className="failed-login poppins-regular small">
          Please enter a valid email address
        </p>
      ) : null}
      {password && password.length < 6 ? (
        <p className="failed-login-password poppins-regular small">
          Password must contain at least 6 characters
        </p>
      ) : null}
      <form className="register-form-login" onSubmit={handleLoginClick}>
        <div className="email-component">
          <label className="form-label poppins-regular" htmlFor="password">
            <span className="material-symbols-outlined">mail</span>
          </label>
          <input
            className="form-input poppins-regular"
            placeholder="Email..."
            type="text"
            name="email"
            id="email"
            onChange={handleEmailChange}
          />
        </div>
        <div className="password-component">
          <label className="form-label poppins-regular" htmlFor="password">
            <span className="material-symbols-outlined">lock</span>
          </label>
          <input
            className="form-input poppins-regular"
            placeholder="Password..."
            type="password"
            name="password"
            id="password"
            onChange={handlePasswordChange}
          />
        </div>
        <button className="form-button bungee-regular">Login</button>
        <p className="poppins-regular">
          Don't have an account yet? Create one{" "}
          <Link
            to={"/register"}
            className="register-login-link poppins-regular"
          >
            here!
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
