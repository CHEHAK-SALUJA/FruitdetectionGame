
import React from "react";
import { DetectionResult } from "@/utils/fruitDetection";

type Props = {
  detectionResults: DetectionResult[];
  gameStatus: "ready" | "playing" | "success" | "fail";
  gameMode: "camera" | "image";
  fruit: string;
};

const DetectionResults: React.FC<Props> = ({
  detectionResults,
  gameStatus,
  gameMode,
  fruit
}) => {
  return (
    <div>
      {detectionResults.length === 0 ? (
        <p className="text-center text-gray-500 py-4">
          {gameStatus === "playing"
            ? gameMode === "camera"
              ? "Scanning for fruits..."
              : "Select an image to analyze..."
            : "No detections yet. Start the game to begin scanning."}
        </p>
      ) : (
        <div className="space-y-3">
          {detectionResults.map((result, index) => (
            <div
              key={index}
              className={`flex justify-between items-center p-2 rounded ${
                result.fruit === fruit && result.confidence > 85
                  ? "bg-green-50 shadow-sm"
                  : "bg-white shadow-sm"
              }`}
            >
              <span className={`font-medium ${
                  result.fruit === fruit
                    ? result.confidence > 85
                      ? "text-green-600"
                      : "text-amber-600"
                    : "text-gray-600"
                }`}>
                {result.fruit}
              </span>
              <span className={`text-sm font-medium ${
                  result.confidence > 85 ? "text-green-600"
                    : result.confidence > 60 ? "text-amber-600"
                    : "text-gray-600"
                }`}>
                {result.confidence.toFixed(1)}% confidence
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetectionResults;
