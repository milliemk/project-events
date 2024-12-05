import { Attraction, Images } from "../types/customTypes";

type AttractionProps = {
  attraction: Attraction | null;
};

const AttractionPoster = ({ attraction }: AttractionProps) => {
  if (!attraction || !attraction.images.length) {
    return <p className="poppins.regular">No images available</p>;
  }

  // Find the image with the largest width using reduce
  const largestImage = attraction.images.reduce(
    (maxImage: Images | null, currentImage: Images) => {
      return currentImage.width > (maxImage?.width || 0)
        ? currentImage
        : maxImage;
    },
    null
  );

  // If no valid image found, fallback to a placeholder image
  const imageUrl = largestImage?.url || "https://via.placeholder.com/300";

  return (
    <div>
      <img
        key={attraction.id}
        src={imageUrl}
        alt="Attraction Poster"
        style={{ maxWidth: "1000px", width: "100%" }} //
      />
    </div>
  );
};

export default AttractionPoster;
