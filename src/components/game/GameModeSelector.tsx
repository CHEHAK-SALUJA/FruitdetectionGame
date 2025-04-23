
import React from "react";
import { Button } from "@/components/ui/button";
import { Camera, Image as ImageIcon } from "lucide-react";

type GameMode = "camera" | "image";

type Props = {
  gameMode: GameMode;
  switchGameMode: (mode: GameMode) => void;
};

const GameModeSelector: React.FC<Props> = ({ gameMode, switchGameMode }) => (
  <div className="flex space-x-4 mb-6">
    <Button
      variant={gameMode === "camera" ? "default" : "outline"}
      className={gameMode === "camera"
        ? "bg-fruit-apple text-white flex-1"
        : "border-fruit-teal text-fruit-teal flex-1"}
      onClick={() => switchGameMode("camera")}
    >
      <Camera className="mr-2 h-4 w-4" /> Camera Mode
    </Button>
    <Button
      variant={gameMode === "image" ? "default" : "outline"}
      className={gameMode === "image"
        ? "bg-fruit-apple text-white flex-1"
        : "border-fruit-teal text-fruit-teal flex-1"}
      onClick={() => switchGameMode("image")}
    >
      <ImageIcon className="mr-2 h-4 w-4" /> Image Mode
    </Button>
  </div>
);

export default GameModeSelector;
