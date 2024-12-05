import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Attraction } from "../types/customTypes";
import { Link } from "react-router-dom";
import FavoriteCard from "../components/FavoriteCard";
import { db } from "../config/FirebaseConfig";
import {
  arrayRemove,
  deleteField,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

function MyProfile() {
  const { refreshUser, user } = useContext(AuthContext);
  const [attractions, setAttractions] = useState<Attraction[] | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState(
    "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436178.jpg?t=st=1733134601~exp=1733138201~hmac=cc89740d633b1032da56481bd981198fd0bb0057bb21ee12cc312cb4ec98ab96&w=1060"
  );

  // get events
  const getEvents = async () => {
    try {
      console.log(user);
      const favouritIds = user?.favorites?.join(",");
      if (favouritIds) {
        const response = await fetch(
          `https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${
            import.meta.env.VITE_TM_APIKEY
          }&size=24&id=${favouritIds}`
        );

        if (!response.ok) {
          throw new Error("Something went wrong");
        }
        if (response.ok) {
          const result = await response.json();
          setAttractions(result._embedded.attractions);
          setTotalPages(result.page.totalPages);
          console.log("totalPages", totalPages);
        }
      } else {
        setAttractions(null);
      }
    } catch (err) {
      const error = err as Error;
      console.log("error", error.message);
    }
  };

  // image options
  const imageOptions = [
    "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436178.jpg?t=st=1733134601~exp=1733138201~hmac=cc89740d633b1032da56481bd981198fd0bb0057bb21ee12cc312cb4ec98ab96&w=1060",
    "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses-green-hair_23-2149436201.jpg",
    "https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303087.jpg?uid=R174693513&ga=GA1.1.2043563709.1729164769&semt=ais_hybrid",
    "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436200.jpg?t=st=1733134495~exp=1733138095~hmac=8a3c51e98570777811a7404767b7db0d3d1954e2704b88cdd5d3980774b1c466&w=1060",
  ];

  // handle change of profile picture
  const handleImageChange = async (url: string) => {
    if (!user?.uid) {
      console.error("No user logged in");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
      const userSnapshot = await getDoc(userRef);

      const currentImageUrl = userSnapshot.data()?.ImageUrl;

      setSelectedImage(url);

      if (currentImageUrl) {
        await updateDoc(userRef, {
          imageUrl: deleteField(),
        });
      }

      await updateDoc(userRef, {
        imageUrl: url,
      });

      console.log("Profile picture successfully updated");
    } catch (error) {
      console.error("Error updating profile picture:", error);
    } finally {
      refreshUser();
    }
  };

  useEffect(() => {
    getEvents();
  }, [user]);

  // handle delete favorites
  const handleDeleteFavorite = async (
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

    const userRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userRef, {
        favorites: arrayRemove(eventId),
      });

      console.log("Event added to favorites successfully");
    } catch (error) {
      console.error("Error adding to favorites:", error);
    } finally {
      refreshUser();
    }
  };

  return (
    <div className="my-profile">
      <h1 className="bungee-regular">My Profile</h1>
      <div className="profile-info">
        <div className="profile-image">
          {user && user?.imageUrl ? (
            <img
              src={user?.imageUrl}
              alt="Selected Profile"
              style={{ maxWidth: "1000px", width: "100%" }}
            />
          ) : (
            <img
              src={
                "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436178.jpg?t=st=1733134601~exp=1733138201~hmac=cc89740d633b1032da56481bd981198fd0bb0057bb21ee12cc312cb4ec98ab96&w=1060"
              }
              alt="Selected Profile"
              style={{ maxWidth: "1000px", width: "100%" }}
            />
          )}
        </div>
        <div>
          <div className="profile-info-text">
            <div className="profile-email">
              <p className="poppins-regular bold">Name:</p>
              <p className="poppins-regular">{user?.name}</p>
            </div>
          </div>
          <div className="profile-info-text">
            <div className="profile-email">
              <p className="poppins-regular bold">Email:</p>
              <p className="poppins-regular">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="image-selection">
        <h4 className="poppins-regular">Select a Profile Picture</h4>
        <div className="image-options">
          {imageOptions.map((url, index) => (
            <label key={index} style={{ margin: "0 10px" }}>
              <input
                type="radio"
                name="profileImage"
                value={url}
                checked={selectedImage === url}
                onChange={() => handleImageChange(url)}
              />
              <img
                src={url}
                alt={`Option ${index + 1}`}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  marginLeft: "10px",
                  border: selectedImage === url ? "2px solid blue" : "none",
                }}
              />
            </label>
          ))}
        </div>
      </div>
      <h3 className="bungee-regular favorites-title">My Favorites</h3>
      <div className="favorites-container">
        {" "}
        {attractions &&
          attractions.map((event) => {
            return (
              <Link to={`/events/${event.id}`} key={event.id}>
                <div className="event-card">
                  <FavoriteCard
                    name={event.name}
                    attraction={event}
                    onDeleteFavorites={handleDeleteFavorite}
                  />
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

export default MyProfile;
