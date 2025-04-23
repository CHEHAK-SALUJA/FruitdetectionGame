
import React from "react";

type StoryCardProps = {
  title: string;
  description: string;
  fruit: string;
  image: string;
  mission: React.ReactNode;
};

const StoryCard: React.FC<StoryCardProps> = ({ title, description, fruit, image, mission }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-2xl font-bold text-fruit-dark mb-2">{title}</h2>
    <p className="text-gray-600 mb-4">{description}</p>
    <div className="mb-4 flex justify-center items-center bg-white rounded-md" style={{ height: "220px" }}>
      <img
        src={image}
        alt={fruit}
        className="max-h-full max-w-full object-contain"
        loading="lazy"
        onError={(e) => {
          console.log(`Error loading story image: ${image}`);
          const target = e.target as HTMLImageElement;
          target.onerror = null; // Prevent infinite loops
          target.src = "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=480"; // Fallback image
        }}
      />
    </div>
    <div className="text-center py-4">
      <p className="text-xl font-semibold mb-2">Your mission:</p>
      {mission}
    </div>
  </div>
);

export default StoryCard;
