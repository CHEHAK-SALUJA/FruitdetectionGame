
import React from "react";

type Props = {
  imageOptions: string[];
  gameStatus: "ready" | "playing" | "success" | "fail";
  selectedImage: string | null;
  handleImageSelection: (url: string) => void;
};

const ImageOptions: React.FC<Props> = ({
  imageOptions,
  gameStatus,
  selectedImage,
  handleImageSelection
}) => {
  if (gameStatus !== "playing") {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Start the game to see image options.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {imageOptions.map((imageUrl, index) => (
        <div
          key={index}
          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 h-60
          ${selectedImage === imageUrl
            ? "border-fruit-apple"
            : "border-transparent hover:border-gray-300"}`}
          onClick={() => handleImageSelection(imageUrl)}
        >
          <div className="w-full h-full bg-white flex items-center justify-center p-2">
            <img
              src={imageUrl}
              alt={`Option ${index + 1}`}
              className="max-w-full max-h-full object-contain"
              loading="lazy"
              onError={(e) => {
                console.log(`Error loading image: ${imageUrl}`);
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite loops
                target.src = "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=480"; // Fallback image
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageOptions;
