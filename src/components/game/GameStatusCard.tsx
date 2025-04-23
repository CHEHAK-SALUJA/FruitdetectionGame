
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer, CheckCircle } from "lucide-react";

type GameStatus = "ready" | "playing" | "success" | "fail";
type GameMode = "camera" | "image";

type Props = {
  gameStatus: GameStatus;
  gameMode: GameMode;
  timeRemaining: number;
  userScore: number;
  currentStreak: number;
  fruit: string;
  onStart: () => void;
  onReset: () => void;
  onBack: () => void;
  isCameraEnabled: boolean;
};

const GameStatusCard: React.FC<Props> = ({
  gameStatus, gameMode, timeRemaining, userScore, currentStreak,
  fruit, onStart, onReset, onBack, isCameraEnabled
}) => {
  if (gameStatus === "ready") {
    return (
      <div className="text-center space-y-4">
        <p>Click "Start Game" when you're ready {gameMode === "camera" && <>and make sure you have a <b>{fruit}</b> nearby</>}!</p>
        <Button
          className="bg-fruit-apple hover:bg-opacity-90 text-white"
          onClick={onStart}
          disabled={gameMode === "camera" && !isCameraEnabled}
        >Start Game</Button>
      </div>
    );
  }

  if (gameStatus === "playing") {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-medium flex items-center">
            <Timer className="mr-2 h-4 w-4" /> Time Remaining:
          </span>
          <span className="font-bold text-xl">{timeRemaining}s</span>
        </div>
        <Progress value={(timeRemaining / 60) * 100} className="h-2" />
        <div className="flex justify-between items-center mt-2">
          <span className="font-medium">Current Score:</span>
          <span className="font-bold text-fruit-apple">{userScore}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Current Streak:</span>
          <span className="font-bold text-fruit-teal">{currentStreak}</span>
        </div>
        <p className="text-center mt-4 text-lg font-bold text-fruit-apple animate-pulse-slow">
          {gameMode === "camera"
            ? `Show a ${fruit} to your camera!`
            : `Select the correct ${fruit} image!`}
        </p>
      </div>
    );
  }

  if (gameStatus === "success") {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-2">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-600">Success!</h3>
        <p>Great job! You found a {fruit} in time.</p>
        <p className="font-bold text-fruit-apple">Your score: {userScore}</p>
        <div className="flex space-x-4 justify-center">
          <Button
            variant="outline"
            onClick={onReset}
            className="border-fruit-teal text-fruit-teal hover:bg-fruit-teal hover:text-white"
          >
            Play Again
          </Button>
          <Button
            className="bg-fruit-apple hover:bg-opacity-90 text-white"
            onClick={onBack}
          >
            Choose Another Story
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <h3 className="text-2xl font-bold text-red-600">Game Over!</h3>
      <p>
        {timeRemaining === 0
          ? <>Time's up! You didn't find a {fruit} in time.</>
          : <>That's not a {fruit}. You've selected the wrong fruit!</>}
      </p>
      {userScore > 0 && (
        <p className="font-bold">Final Score: {userScore}</p>
      )}
      <div className="flex space-x-4 justify-center">
        <Button
          variant="outline"
          onClick={onReset}
          className="border-fruit-teal text-fruit-teal hover:bg-fruit-teal hover:text-white"
        >
          Try Again
        </Button>
        <Button
          className="bg-fruit-apple hover:bg-opacity-90 text-white"
          onClick={onBack}
        >
          Choose Another Story
        </Button>
      </div>
    </div>
  );
};

export default GameStatusCard;
