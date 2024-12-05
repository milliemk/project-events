import { useState, useEffect, useContext } from "react";
import { Attraction } from "../types/customTypes";
import EventsCard from "../components/EventsCard";
import Search from "../components/Search";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";

function Events() {
  const [attractions, setAttractions] = useState<Attraction[] | null>(null);
  const [inputSearch, setInputSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [classification, setClassification] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const { refreshUser, user } = useContext(AuthContext);

  // get events
  const getEvents = async (page = 0, inputSearch = "", classification = "") => {
    try {
      const response = await fetch(
        `https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${
          import.meta.env.VITE_TM_APIKEY
        }&size=24&page=${page}&keyword=${inputSearch}&classificationName=${classification}`
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      if (response.ok) {
        const result = await response.json();
        console.log("result :>> ", result);
        setAttractions(result._embedded.attractions);
        setTotalPages(result.page.totalPages);
        console.log("totalPages", totalPages);
      }
    } catch (err) {
      const error = err as Error;
      console.log("error", error.message);
    } finally {
    }
  };

  useEffect(() => {
    getEvents(currentPage, inputSearch, classification);
  }, [currentPage, inputSearch, classification]);

  // pagination
  const handlePageChange = (direction: "prev" | "next") => {
    direction === "prev"
      ? setCurrentPage((page) => page - 1)
      : setCurrentPage((page) => page + 1);
  };

  // handle the search inputs
  const handleInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.value", e.target.value);
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  // handle search click
  const handleSearchClick = () => {
    setInputSearch(searchTerm); // Update actual search state after button click
    setCurrentPage(0);
  };

  // handle keypress
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Trigger the search button click behavior on 'Enter' key press
      setInputSearch(searchTerm);
    }
  };

  // dropdown
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassification(e.target.value); // Update the selected value
  };

  // add to users favorites
  const handleAddToFavorites = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const eventId = (e.currentTarget as HTMLButtonElement).value; // Get the event ID from the button
    console.log("eventId", eventId);

    // Ensure user data is available
    if (!user?.uid) {
      console.error("No user logged in");
      return;
    }

    const userRef = doc(db, "users", user.uid); // Reference the user's document by UID

    try {
      await updateDoc(userRef, {
        favorites: arrayUnion(eventId),
      });

      console.log("Event added to favorites successfully");
    } catch (error) {
      console.error("Error adding to favorites:", error);
    } finally {
      // Actually push the event in the favourties
      refreshUser();
    }
  };

  const eventIsAlreadyFavorite = (eventId: string) => {
    if (user && user.favorites) {
      return user.favorites.includes(eventId);
    } else {
      return false;
    }
  };

  return (
    <div className="events-page">
      <h1 className="bungee-regular all-events-title">All Events</h1>
      <div className="top-box">
        <div>
          <Search
            handleInputSearch={handleInputSearch}
            handleSearchClick={handleSearchClick}
            handleKeyPress={handleKeyPress}
          />
        </div>
        <div className="genre-dropdown poppins-regular">
          <select
            id="classificationDropdown"
            value={classification || ""}
            onChange={handleDropdownChange}
            className="dropdown-select poppins-regular"
          >
            <option value="">Select Genre</option>
            <option value="music">Music</option>
            <option value="sports">Sports</option>
            <option value="theatre">Theatre</option>
            <option value="comedy">Comedy</option>
          </select>
        </div>
      </div>
      <div className="events-container">
        {" "}
        {attractions &&
          attractions.map((event) => {
            return (
              <div key={event.id} className="event-card">
                <Link to={event.id}>
                  <EventsCard
                    name={event.name}
                    attraction={event}
                    onAddToFavorites={handleAddToFavorites}
                    isAlreadyFavorite={eventIsAlreadyFavorite(event.id)}
                  />
                </Link>
              </div>
            );
          })}
      </div>
      <br />
      <div className="pagination-container">
        <button
          className="prev-page-button material-symbols-outlined"
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 0}
        >
          arrow_back_ios
        </button>
        <p className="poppins-regular">{currentPage + 1}</p>
        <button
          className="next-page-button material-symbols-outlined"
          onClick={() => handlePageChange("next")}
          disabled={currentPage === totalPages}
        >
          arrow_forward_ios
        </button>
      </div>
    </div>
  );
}

export default Events;
