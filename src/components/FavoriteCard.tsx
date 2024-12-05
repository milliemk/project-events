import AttractionPoster from "./AttractionPoster";
import { Attraction } from "../types/customTypes";

type CardProps = {
  name: string;
  attraction: Attraction;
  onDeleteFavorites: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
};

function FavoriteCard({ name, attraction, onDeleteFavorites }: CardProps) {
  return (
    <div className="favorite-image">
      <AttractionPoster key={attraction?.id} attraction={attraction} />
      <div className="favorite">
        <button
          className="transparent-button"
          onClick={(e) => {
            e.preventDefault();
            e.currentTarget.value = attraction.id;
            onDeleteFavorites(e);
          }}
        >
          <span className="material-symbols-outlined delete-favorite">
            close
          </span>
        </button>
      </div>
      <div className="favorite-text">
        {<p className=" poppins-regular">{name}</p>}
      </div>
    </div>
  );
}

export default FavoriteCard;
