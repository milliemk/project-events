import { Link } from "react-router-dom";
import { app } from "../config/FirebaseConfig";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Attraction } from "../types/customTypes";

function Home() {
  console.log("app :>> ", app);
  const { user } = useContext(AuthContext);

  const [attractions, setAttractions] = useState<Attraction[] | null>(null);

  // get attractions
  const getAttractions = async () => {
    try {
      const response = await fetch(
        `https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${
          import.meta.env.VITE_TM_APIKEY
        }&size=24&classificationName=comedy`
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      if (response.ok) {
        const result = await response.json();
        console.log("result :>> ", result);
        setAttractions(result._embedded.attractions);
      }
    } catch (err) {
      const error = err as Error;
      console.log("error", error.message);
    }
  };

  useEffect(() => {
    getAttractions();
  }, []);

  return (
    <>
      <div className="home-container">
        <div className="hero-image">
          {
            <img
              src="https://static.vecteezy.com/system/resources/previews/002/558/858/non_2x/black-abstract-header-with-transparent-squares-mosaic-look-banner-modern-illustration-vector.jpg"
              alt="Crowd Banner"
              className="home-image"
            />
          }
          <div className="hero-text poppins-regular">
            {user ? (
              <h2 className="bungee-regular welcome-message">
                Welcome, {user.name}!
              </h2>
            ) : (
              <h2 className="bungee-regular">What's on?</h2>
            )}
            <p>
              Stay in the loop with the latest sports games, concerts, theater
              performances, and more! Whether you're a fan of live music,
              thrilling sports action, or captivating theater, our events
              calendar has something for everyone!
            </p>
            <Link to="events" className=" bungee-regular bold home-link">
              Show me all events
            </Link>
          </div>
        </div>
        <h3 className="bungee-regular home-genre-title">Highlights</h3>
        <div className="home-comedy">
          {attractions &&
            attractions.slice(0, 10).map((attraction) => {
              return (
                <div className="highlight-link" key={attraction.id}>
                  <Link to={`events/${attraction.id}`}>
                    <img
                      src={attraction.images[7].url}
                      alt="Attraction Poster"
                    />
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default Home;
