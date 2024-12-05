import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Attraction, Event } from "../types/customTypes";
import { useParams } from "react-router-dom";
import AttractionPoster from "../components/AttractionPoster";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import { AuthContext } from "../context/AuthContext";
import ExternalLinks from "../components/ExternalLinks";

function EventDetails() {
  const { eventId } = useParams();
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [events, setEvent] = useState<Event[] | null>(null);

  const [numberOfDisplayedEvents, setNumberOfDisplayedEvents] =
    useState<number>(2);
  const [displayShowAll, setDisplayShowAll] = useState<boolean>(false);

  const [comments, setComments] = useState<Comment[] | null>(null);
  const [text, setText] = useState("");
  const [editedText, setEditedText] = useState("");

  const [editingMode, setEditingMode] = useState<boolean>(false);
  const [editingComment, setEditingComment] = useState<Comment>();

  const { user } = useContext(AuthContext);

  const getAttractionDetails = async () => {
    try {
      const response = await fetch(
        `https://app.ticketmaster.com/discovery/v2/attractions/${eventId}?apikey=AxBTJmI5aOb8JgBJET0yN8qoU39vzfOu`
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      if (response.ok) {
        const result = await response.json();
        console.log("result :>> ", result);
        setAttraction(result);
      }
    } catch (err) {
      const error = err as Error;
      console.log("error", error.message);
    }
  };

  // we have to fetch the event data
  const getAllEvents = async () => {
    try {
      const response = await fetch(
        `https://app.ticketmaster.com/discovery/v2/events/?apikey=${
          import.meta.env.VITE_TM_APIKEY
        }&sort=date,asc&attractionId=${eventId}`
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      if (response.ok) {
        const result = await response.json();
        setEvent(result._embedded.events);
        console.log("Events", result);
      }
    } catch (err) {
      const error = err as Error;
      console.log("error", error.message);
    }
  };

  const handleShowAll = () => {
    const numberOfEvents = events?.length; // All of the events
    if (numberOfEvents) {
      setNumberOfDisplayedEvents(numberOfEvents);
      setDisplayShowAll(false); // This handles what button to show false means "Show Less" and true mean "Show all"
    }
  };

  const handleShowLess = () => {
    setNumberOfDisplayedEvents(2);
    setDisplayShowAll(true);
  };

  useEffect(() => {
    getAttractionDetails();
    getAllEvents();
  }, []);

  useEffect(() => {
    if (events && events.length > numberOfDisplayedEvents) {
      setDisplayShowAll(true);
    }
  }, [events]);

  // get the comments in real time
  const getCommentsRealTime = () => {
    const q = query(
      collection(db, "comments"),
      where("eventId", "==", eventId)
    );
    onSnapshot(q, (querySnapshot) => {
      const eventComments: Comment[] = [];
      querySnapshot.forEach((doc) => {
        const comment = doc.data() as Comment;
        eventComments.push(comment);
      });
      setComments(eventComments);
    });
  };

  // send a comment
  const handleSendComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newComment: Comment = {
      author: user!.name,
      text: text,
      eventId: eventId!,
      commentId: "",
      userId: "",
    };

    const docRef = await addDoc(collection(db, "comments"), newComment);

    await updateDoc(docRef, {
      commentId: docRef.id,
      userId: user?.uid,
    });

    console.log("Document written with ID: ", docRef.id);
  };

  // setting the comment text
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleEditText = (e: ChangeEvent<HTMLInputElement>) => {
    setEditedText(e.target.value);
  };

  // enable editing mode
  const enableEditingMode = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    comment: Comment
  ) => {
    e.preventDefault();
    setEditingMode(true);
    setEditingComment(comment);
  };

  // delete a comment
  const handleDeleteComment = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    commentId: string
  ) => {
    e.preventDefault();
    const comment: Comment = {
      author: user!.name,
      text: text,
      eventId: eventId!,
      commentId: commentId,
      userId: user!.uid,
    };

    try {
      if (comment.userId === user!.uid) {
        const commentDocRef = doc(db, "comments", commentId);

        await deleteDoc(commentDocRef);

        console.log("Deleted comment with ID:", commentId);
      } else {
        console.log("You can only delete your own comments.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // comment type
  type Comment = {
    author: string;
    text: string;
    eventId: string;
    commentId: string;
    userId: string;
  };

  const handleEditComment = async (
    e: React.FormEvent<HTMLFormElement>,
    commentId: string
  ) => {
    e.preventDefault();

    if (editingComment && editingComment.userId !== user?.uid) {
      console.log(
        "You do not have permission to edit this comment or editing mode is not active."
      );
      return;
    }

    try {
      const editDocRef = doc(db, "comments", commentId);

      await setDoc(
        editDocRef,
        {
          text: editedText,
        },
        { merge: true }
      );

      console.log("Comment successfully updated!");
    } catch (error) {
      console.error("Error editing comment:", error);
    }
    setEditingMode(false);
    setEditedText("");
  };

  useEffect(() => {
    console.log("editingMode :>> ", editingMode);
  }, [editingMode]);

  useEffect(() => {
    getCommentsRealTime();
  }, []);

  return (
    <div className="details-page">
      <h1 className="bungee-regular attraction-name">{attraction?.name}</h1>
      <p className="poppins-regular segments">
        {attraction?.classifications[0].segment.name} /{" "}
        {attraction?.classifications[0].genre.name} /{" "}
        {attraction?.classifications[0].subGenre.name}
      </p>
      <div className="attraction-poster">
        <AttractionPoster key={attraction?.id} attraction={attraction} />
      </div>
      <br />
      <div className="attraction-event-container">
        {events && events.length > 1 ? (
          <h2 className="bungee-regular upcoming-events-title">
            Upcoming Events
          </h2>
        ) : (
          <div>
            <h3 className="bungee-regular upcoming-events-title">Oh no!</h3>
            <h4 className="poppins-regular">
              Looks like we're event-less for now &#58;&#40;
            </h4>
          </div>
        )}
        <div className="upcoming-events">
          {events &&
            events.slice(0, numberOfDisplayedEvents).map((event) => {
              return (
                <div key={event.id} className="events-date">
                  <div className="poppins-regular bold small">
                    <p>
                      <span
                        style={{ display: "block", textTransform: "uppercase" }}
                      >
                        {new Date(
                          event.dates.start.localDate
                        ).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span
                        className="bungee-regular day"
                        style={{ display: "block" }}
                      >
                        {new Date(
                          event.dates.start.localDate
                        ).toLocaleDateString("en-US", { day: "2-digit" })}
                      </span>
                      <span style={{ display: "block" }}>
                        {new Date(
                          event.dates.start.localDate
                        ).toLocaleDateString("en-US", { year: "numeric" })}
                      </span>
                    </p>
                  </div>
                  <div className="event-box">
                    <h4 className="bungee-regular event-name">{event.name}</h4>
                    <p className="poppins-regular venue-info">
                      {event._embedded.venues[0].name} <br />
                      {event._embedded.venues[0].address?.line1},{" "}
                      {event._embedded.venues[0].city.name}
                    </p>
                  </div>
                  <img
                    className="event-poster"
                    src={event.images[0].url}
                    alt="Event Poster"
                  />
                </div>
              );
            })}
          <br />
          {events && events.length > 2 ? (
            displayShowAll ? (
              <button
                className="load-button bungee-regular"
                onClick={handleShowAll}
              >
                Show All
              </button>
            ) : (
              <button
                className="load-button bungee-regular"
                onClick={handleShowLess}
              >
                Show Less
              </button>
            )
          ) : null}
        </div>
      </div>
      <div className="event-bottom-info">
        <div className="events-bottom-component">
          <h3 className="bungee-regular">Comments</h3>
          <div className="comments-section">
            <div className="commentscontainer poppins-regular">
              {comments &&
                comments.map((comment, i) => {
                  return (
                    <div className="comment-box" key={i}>
                      <div>
                        {" "}
                        <p className="bold">{comment.author}:</p>{" "}
                        {editingMode === true &&
                        editingComment &&
                        editingComment.commentId == comment.commentId ? (
                          <form
                            className="comment"
                            onSubmit={(e) =>
                              handleEditComment(e, editingComment.commentId)
                            }
                          >
                            <input
                              className="poppins-regular comment-input"
                              placeholder="Edit your comment..."
                              type="text"
                              name="editedcomment"
                              id="editedcomment"
                              onChange={handleEditText}
                            />
                            <button
                              className="comment-button bungee-regular"
                              type="submit"
                            >
                              Confirm
                            </button>
                          </form>
                        ) : (
                          <p>{comment.text}</p>
                        )}
                      </div>
                      {comment.author === user!.name ? (
                        <div key={comment.commentId}>
                          <button
                            onClick={(e) => enableEditingMode(e, comment)}
                            className="edit-button"
                          >
                            <span className="material-symbols-outlined edit-delete-symbol">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={(e) =>
                              handleDeleteComment(e, comment.commentId)
                            }
                            className="delete-button"
                          >
                            <span className="material-symbols-outlined edit-delete-symbol">
                              delete
                            </span>
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
            </div>
            <form className="comment" onSubmit={handleSendComment}>
              <input
                className="poppins-regular comment-input"
                placeholder="Add a comment..."
                type="text"
                name="comment"
                id="comment"
                onChange={handleTextChange}
              />
              <button className="comment-button bungee-regular" type="submit">
                Send
              </button>
            </form>
          </div>
        </div>
        <ExternalLinks
          officialLink={attraction?.externalLinks?.homepage?.[0]?.url}
          facebookLink={attraction?.externalLinks?.facebook?.[0]?.url}
          instagramLink={attraction?.externalLinks?.instagram?.[0]?.url}
        />
      </div>
    </div>
  );
}

export default EventDetails;
