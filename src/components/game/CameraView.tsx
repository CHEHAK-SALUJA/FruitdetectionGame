
import React, { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff } from "lucide-react";

type Props = {
  cameraEnabled: boolean;
  videoRef: RefObject<HTMLVideoElement>;
  enableCamera: () => void;
};

const CameraView: React.FC<Props> = ({ cameraEnabled, videoRef, enableCamera }) => {
  const handleEnableCamera = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Camera enable button clicked");
    enableCamera();
  };

  return (
    <div className="relative aspect-video bg-gray-900">
      {!cameraEnabled ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <CameraOff size={48} className="mb-4 text-fruit-apple" />
          <p className="text-center mb-4">
            Camera access is required to play FruitQuest in camera mode.
            Please enable your camera to continue.
          </p>
          <Button
            onClick={handleEnableCamera}
            className="bg-fruit-apple hover:bg-opacity-90 text-white"
          >
            <Camera className="mr-2 h-4 w-4" /> Enable Camera
          </Button>
        </div>
      ) : null}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${cameraEnabled ? 'block' : 'hidden'}`}
      ></video>
    </div>
  );
};

export default CameraView;
