
/**
 * Mock implementation of fruit detection
 * In a real application, this would be replaced with TensorFlow.js or ONNX.js
 * and a pre-trained model for fruit recognition
 */

export type DetectionResult = {
  detected: boolean;
  fruit: string;
  confidence: number;
};

// List of fruits our mock detector can "recognize"
const DETECTABLE_FRUITS = [
  "Apple",
  "Banana",
  "Orange",
  "Strawberry",
  "Pineapple",
  "Watermelon",
  "Grape",
  "Mango",
  "Kiwi",
  "Lemon",
];

/**
 * Mock function that simulates fruit detection
 * In a real app, this would process video frames using ML
 * 
 * @param targetFruit The fruit we're looking for
 * @param videoElement Optional video element for "detection"
 * @returns Detection result with detected fruit and confidence
 */
export const detectFruit = (
  targetFruit: string,
  videoElement?: HTMLVideoElement
): DetectionResult => {
  // For demo purposes, we'll randomly "detect" a fruit
  // With a bias toward the target fruit (50% chance of detecting the target)
  const isTargetDetected = Math.random() > 0.5;
  
  const fruit = isTargetDetected
    ? targetFruit
    : DETECTABLE_FRUITS[Math.floor(Math.random() * DETECTABLE_FRUITS.length)];
    
  // Generate a random confidence score between 50-100% for the target fruit
  // and 20-90% for other fruits
  const confidence = isTargetDetected
    ? 50 + Math.random() * 50
    : 20 + Math.random() * 70;
    
  return {
    detected: true,
    fruit,
    confidence: parseFloat(confidence.toFixed(2)),
  };
};

/**
 * Helper function to request camera access
 * @returns Promise with the media stream
 */
export const requestCameraAccess = async (): Promise<MediaStream> => {
  try {
    console.log("Requesting camera access...");
    const constraints = { 
      video: { 
        facingMode: "environment", // Prefer back camera if available
        width: { ideal: 1280 },
        height: { ideal: 720 } 
      } 
    };
    
    console.log("Camera constraints:", constraints);
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("MediaDevices API not supported in this browser");
    }
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log("Camera access granted:", stream.getVideoTracks().length > 0);
    
    // Log camera track info for debugging
    if (stream.getVideoTracks().length > 0) {
      const videoTrack = stream.getVideoTracks()[0];
      console.log("Camera info:", videoTrack.label, videoTrack.enabled, videoTrack.readyState);
    }
    
    return stream;
  } catch (error) {
    console.error("Error accessing camera:", error);
    throw error;
  }
};
