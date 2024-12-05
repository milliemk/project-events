import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("second");
  const [error, setError] = useState(false);

  const navigateTo = useNavigate();
  const redirectToHomePage = () => {
    navigateTo("/");
  };

  const { register, user } = useContext(AuthContext);

  // handle namechange
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  //handle emailchange
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // handle passwordchange
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  //handle registerclick
  const handleRegisterClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await register(email, password, name);
    } catch (error) {
      console.log("Error during login:", error);
      setError(true);
    }
  };

  useEffect(() => {
    if (user) {
      redirectToHomePage();
    }
  }, [user]);

  return (
    <div className="register-login-container">
      <h2 className="bungee-regular">Register</h2>
      {error && (
        <p className="failed-login bold poppins-regular">
          Sign up failed, please try again
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
      <form className="register-form" onSubmit={handleRegisterClick}>
        <div className="name-component">
          <label className="form-label poppins-regular" htmlFor="name">
            <span className="material-symbols-outlined">person</span>
          </label>
          <input
            className="form-input poppins-regular"
            placeholder="Name..."
            type="text"
            name="name"
            id="name"
            onChange={handleNameChange}
          />
        </div>
        <div className="email-component">
          <label className="form-label poppins-regular" htmlFor="email">
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
        <button className="form-button bungee-regular">Register</button>
        <p className="poppins-regular">
          Already have an account? Log in{" "}
          <Link to={"/login"} className="register-login-link poppins-regular">
            here!
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
