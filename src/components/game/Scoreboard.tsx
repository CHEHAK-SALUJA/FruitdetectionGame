
import React from "react";
import { Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

type ScoreboardProps = {
  userScore: number;
  highestScore: number;
  globalHighScore: number;
  onReset: () => void;
  onBack: () => void;
};

const Scoreboard: React.FC<ScoreboardProps> = ({
  userScore,
  highestScore,
  globalHighScore,
  onReset,
  onBack
}) => (
  <div className="flex items-center space-x-4">
    <div className="bg-fruit-apple text-white px-3 py-2 rounded-full flex items-center">
      <Star className="h-5 w-5 mr-1" />
      <span className="font-bold">Score: {userScore}</span>
    </div>
    <div className="bg-fruit-teal text-white px-3 py-2 rounded-full flex items-center">
      <Trophy className="h-5 w-5 mr-1" />
      <span className="font-bold">Best: {highestScore}</span>
    </div>
    <div className="bg-gray-700 text-white px-3 py-2 rounded-full flex items-center">
      <Star className="h-5 w-5 mr-1" />
      <span className="font-bold">Global: {globalHighScore}</span>
    </div>
    <Button
      variant="outline"
      onClick={onReset}
      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
    >
      <RefreshCcw className="h-4 w-4 mr-2" />
      Reset Score
    </Button>
    <Button
      variant="outline"
      onClick={onBack}
      className="border-fruit-teal text-fruit-teal hover:bg-fruit-teal hover:text-white"
    >
      Back to Stories
    </Button>
  </div>
);

export default Scoreboard;
