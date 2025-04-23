
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { detectFruitWithYolo, loadYoloModel, analyzeImage } from "@/ml/yoloDetection";
import { DetectionResult, requestCameraAccess } from "@/utils/fruitDetection";
import Scoreboard from "@/components/game/Scoreboard";
import StoryCard from "@/components/game/StoryCard";
import GameModeSelector from "@/components/game/GameModeSelector";
import GameStatusCard from "@/components/game/GameStatusCard";
import CameraView from "@/components/game/CameraView";
import ImageOptions from "@/components/game/ImageOptions";
import DetectionResults from "@/components/game/DetectionResults";

type Story = {
  id: number;
  title: string;
  description: string;
  fruit: string;
  difficulty: "easy" | "medium" | "hard";
  image: string;
};

type GameMode = "camera" | "image";

const Game = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [story, setStory] = useState<Story | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [gameStatus, setGameStatus] = useState<"ready" | "playing" | "success" | "fail">("ready");
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>("camera");
  const [modelLoaded, setModelLoaded] = useState(false);
  const [imageOptions, setImageOptions] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const [userScore, setUserScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [globalHighScore, setGlobalHighScore] = useState(95);
  const [currentStreak, setCurrentStreak] = useState(0);
  
  const fruitImages = {
    "Apple": [
      "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=480",
      "https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?q=80&w=480",
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=480",
      "https://images.unsplash.com/photo-1668634862083-0c31a172fec3?q=80&w=480",
    ],
    "Banana": [
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=480",
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=480",
      "https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=480",
      "https://images.unsplash.com/photo-1589876187889-95b438f6c0ab?q=80&w=480",
    ],
    "Orange": [
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?q=80&w=480",
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?q=80&w=480",
      "https://images.unsplash.com/photo-1625367601763-a38b85575ed6?q=80&w=480",
      "https://images.unsplash.com/photo-1622957346089-26998f4e4fcc?q=80&w=480",
    ],
    "Strawberry": [
      "https://images.unsplash.com/photo-1588165171080-c89371f2af4f?q=80&w=480",
      "https://images.unsplash.com/photo-1543528176-61b239494933?q=80&w=480",
      "https://images.unsplash.com/photo-1585059895267-95c659a41440?q=80&w=480",
      "https://images.unsplash.com/photo-1619772002752-450716c5191f?q=80&w=480",
    ],
    "Pineapple": [
      "https://images.unsplash.com/photo-1501986643110-e9b9fa9b6222?q=80&w=480",
      "https://images.unsplash.com/photo-1587883012610-e3df17d41270?q=80&w=480",
      "https://images.unsplash.com/photo-1487180144351-b8472da7d491?q=80&w=480",
      "https://images.unsplash.com/photo-1589820066958-593020bcf3f0?q=80&w=480",
    ],
    "Watermelon": [
      "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?q=80&w=480",
      "https://images.unsplash.com/photo-1563114773-84221bd62daa?q=80&w=480",
      "https://images.unsplash.com/photo-1625367601763-a38b85575ed6?q=80&w=480",
      "https://images.unsplash.com/photo-1622957346089-26998f4e4fcc?q=80&w=480",
    ],
    "Grape": [
      "https://images.unsplash.com/photo-1596363505729-4190a9506133?q=80&w=480",
      "https://images.unsplash.com/photo-1604882767135-b41cc354e2f1?q=80&w=480",
      "https://images.unsplash.com/photo-1602330104458-ae1be6499e63?q=80&w=480",
      "https://images.unsplash.com/photo-1537640538966-79f369143f8f?q=80&w=480",
    ],
    "Mango": [
      "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=480",
      "https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=480",
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=480",
      "https://images.unsplash.com/photo-1605027620664-ec4cff545d6b?q=80&w=480",
    ],
    "Kiwi": [
      "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?q=80&w=480",
      "https://images.unsplash.com/photo-1610917040803-1fccf9623064?q=80&w=480",
      "https://images.unsplash.com/photo-1585059895524-72359e06133a?q=80&w=480",
      "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?q=80&w=480",
    ],
    "Lemon": [
      "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=480",
      "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?q=80&w=480",
      "https://images.unsplash.com/photo-1582287064445-6754aa567fec?q=80&w=480",
      "https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?q=80&w=480",
    ],
    "Other": [
      "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=480",
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=480",
      "https://images.unsplash.com/photo-1622570553081-ea348eeb06d6?q=80&w=480",
      "https://images.unsplash.com/photo-1598234250818-4e5c3e9c467d?q=80&w=480",
    ]
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    let userHighestScore = parseInt(localStorage.getItem("userHighestScore") || "0", 10);
    setHighestScore(userHighestScore);

    const simulatedGlobalScore = parseInt(localStorage.getItem("globalHighScore") || "95", 10);
    setGlobalHighScore(simulatedGlobalScore);

    setUserScore(0);
    setCurrentStreak(0);

    loadYoloModel().then(() => {
      setModelLoaded(true);
      toast({
        title: "High-Performance Detection Model Loaded",
        description: "Our fruit detection model trained on 10,000+ images is ready!",
      });
    }).catch(error => {
      console.error("Error loading model:", error);
      toast({
        title: "Model loading error",
        description: "Unable to load the fruit detection model. Please try again later.",
        variant: "destructive",
      });
    });

    const mockStories: Story[] = [
      {
        id: 1,
        title: "An apple a day keeps the doctor away",
        description: "Learn about this famous saying and why apples are so healthy.",
        fruit: "Apple",
        difficulty: "easy",
        image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=480",
      },
      {
        id: 2,
        title: "Going bananas!",
        description: "Discover why monkeys love bananas so much and the nutritional benefits.",
        fruit: "Banana",
        difficulty: "easy",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=480",
      },
      {
        id: 3,
        title: "Orange you glad?",
        description: "Explore the vibrant world of citrus fruits and their vitamin C content.",
        fruit: "Orange",
        difficulty: "medium",
        image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?q=80&w=480",
      },
      {
        id: 4,
        title: "Berry delicious",
        description: "The sweet tale of strawberries and their journey from wild plants to desserts.",
        fruit: "Strawberry",
        difficulty: "medium",
        image: "https://images.unsplash.com/photo-1588165171080-c89371f2af4f?q=80&w=480",
      },
      {
        id: 5,
        title: "Pineapple paradise",
        description: "How this tropical fruit became a symbol of hospitality and exotic flavor.",
        fruit: "Pineapple",
        difficulty: "hard",
        image: "https://images.unsplash.com/photo-1501986643110-e9b9fa9b6222?q=80&w=480",
      },
      {
        id: 6,
        title: "Watermelon wonder",
        description: "The refreshing summer treat that's mostly water but all fun.",
        fruit: "Watermelon",
        difficulty: "hard",
        image: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?q=80&w=480",
      },
      {
        id: 7,
        title: "Grape expectations",
        description: "From ancient vineyards to modern table grapes - discover the diverse world of grapes.",
        fruit: "Grape",
        difficulty: "medium",
        image: "https://images.unsplash.com/photo-1596363505729-4190a9506133?q=80&w=480",
      },
      {
        id: 8,
        title: "Mango mania",
        description: "Explore the king of fruits and why it's beloved across tropical countries worldwide.",
        fruit: "Mango",
        difficulty: "medium",
        image: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=480",
      },
      {
        id: 9,
        title: "Kiwi discoveries",
        description: "The fuzzy fruit with a bright green interior and surprising health benefits.",
        fruit: "Kiwi",
        difficulty: "hard",
        image: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?q=80&w=480",
      },
      {
        id: 10,
        title: "Lemon squeeze",
        description: "When life gives you lemons - learn about this versatile citrus fruit.",
        fruit: "Lemon",
        difficulty: "easy",
        image: "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=480",
      }
    ];

    const foundStory = mockStories.find(s => s.id === Number(storyId));
    if (!foundStory) {
      navigate("/stories");
      return;
    }
    setStory(foundStory);

    const options = generateImageOptions(foundStory.fruit);
    setImageOptions(options);
  }, [storyId, navigate, toast]);

  const generateImageOptions = (correctFruit: string) => {
    const correctImages = fruitImages[correctFruit as keyof typeof fruitImages] || [];
    let correctImage: string = "";
    let attempts = 0;
    while (attempts < 5 && !correctImage) {
      const idx = Math.floor(Math.random() * correctImages.length);
      if (correctImages[idx]) correctImage = correctImages[idx];
      attempts++;
    }
    const otherFruits = Object.keys(fruitImages).filter(
      fruit => fruit !== correctFruit && fruit !== "Other"
    );
    let pool: string[] = [];
    otherFruits.forEach(fruit => {
      pool = pool.concat(fruitImages[fruit as keyof typeof fruitImages]);
    });
    pool = pool.concat(fruitImages["Other"]);
    const available = pool.filter(img => img !== correctImage);
    const shuffled = Array.from(new Set(available)).sort(() => Math.random() - 0.5);
    const optionImages = [correctImage, ...shuffled.slice(0, 5)];
    for (let i = optionImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionImages[i], optionImages[j]] = [optionImages[j], optionImages[i]];
    }
    return optionImages;
  };

  useEffect(() => {
    if (gameStatus !== "playing") return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameStatus("fail");
          setCurrentStreak(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    let detectionInterval: NodeJS.Timeout | null = null;
    
    if (gameMode === "camera" && cameraEnabled) {
      detectionInterval = setInterval(() => {
        if (gameStatus === "playing" && videoRef.current && story) {
          detectFruitWithYolo(videoRef.current, story.fruit)
            .then(result => {
              setDetectionResults(prev => [result, ...prev].slice(0, 5));
              
              if (result.fruit === story.fruit && result.confidence > 85) {
                handleSuccess();
              }
            })
            .catch(error => {
              console.error("Detection error:", error);
            });
        }
      }, 2000);
    }
    
    return () => {
      clearInterval(timer);
      if (detectionInterval) clearInterval(detectionInterval);
    };
  }, [gameStatus, gameMode, cameraEnabled, story]);

  const enableCamera = async () => {
    try {
      console.log("Starting camera access process...");
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser doesn't support camera access");
      }
      
      const stream = await requestCameraAccess();
      
      if (!videoRef.current) {
        throw new Error("Video element not found");
      }
      
      videoRef.current.srcObject = stream;
      console.log("Camera stream assigned to video element");
      
      setCameraEnabled(true);
      
      toast({
        title: "Camera enabled",
        description: "Your camera is now ready for fruit detection.",
      });
    } catch (error) {
      console.error("Failed to access camera:", error);
      toast({
        title: "Camera error",
        description: `Unable to access your camera. ${error instanceof Error ? error.message : "Please check permissions."}`,
        variant: "destructive",
      });
    }
  };

  const startGame = () => {
    if (gameMode === "camera" && !cameraEnabled) {
      toast({
        title: "Camera required",
        description: "Please enable your camera to play in camera mode.",
        variant: "destructive",
      });
      return;
    }
    
    setTimeRemaining(60);
    setGameStatus("playing");
    setDetectionResults([]);
    setSelectedImage(null);
    
    toast({
      title: "Game started!",
      description: gameMode === "camera" 
        ? `Show a ${story?.fruit} to your camera within 60 seconds.`
        : `Select the correct ${story?.fruit} image within 60 seconds.`,
    });
  };

  const resetGame = () => {
    setTimeRemaining(60);
    setGameStatus("ready");
    setDetectionResults([]);
    setSelectedImage(null);
    
    if (story) {
      const options = generateImageOptions(story.fruit);
      setImageOptions(options);
    }
  };

  const handleImageSelection = async (imageUrl: string) => {
    if (gameStatus !== "playing" || !story) return;

    setSelectedImage(imageUrl);

    const result = await analyzeImage(imageUrl, story.fruit);
    setDetectionResults(prev => [result, ...prev].slice(0, 5));

    if (result.fruit === story.fruit && result.confidence > 85) {
      handleSuccess();
    } else {
      setGameStatus("fail");
      setUserScore(0);
      setCurrentStreak(0);

      toast({
        title: "Wrong fruit detected",
        description: `This appears to be a ${result.fruit}, not a ${story.fruit}. Game over!`,
        variant: "destructive",
      });
    }
  };

  const handleSuccess = () => {
    setGameStatus("success");

    const newStreak = currentStreak + 1;
    setCurrentStreak(newStreak);

    const newScore = userScore + 1;
    setUserScore(newScore);

    if (newScore > highestScore) {
      setHighestScore(newScore);
      localStorage.setItem("userHighestScore", newScore.toString());

      if (newScore > globalHighScore) {
        setGlobalHighScore(newScore);
        localStorage.setItem("globalHighScore", newScore.toString());

        toast({
          title: "New Global Record!",
          description: "You've set a new global high score for FruitQuest!",
        });
      }
    }

    const gameResult = {
      date: new Date().toLocaleDateString(),
      storyId: storyId,
      fruit: story?.fruit,
      score: newScore,
      timeSpent: 60 - timeRemaining,
      success: true,
    };

    const gameHistory = JSON.parse(localStorage.getItem("gameHistory") || "[]");
    localStorage.setItem("gameHistory", JSON.stringify([gameResult, ...gameHistory]));

    toast({
      title: "Success!",
      description: `You found a ${story?.fruit}! Your score is now ${newScore}.`,
    });
  };

  const resetScore = () => {
    setUserScore(0);
    setCurrentStreak(0);

    const gameHistory = JSON.parse(localStorage.getItem("gameHistory") || "[]");
    if (gameHistory.length > 0) {
      const updatedHistory = gameHistory.map((game: any) => ({
        ...game,
        score: 0
      }));
      localStorage.setItem("gameHistory", JSON.stringify(updatedHistory));
    }

    toast({
      title: "Score Reset",
      description: "Your score has been reset to zero.",
    });
  };

  const switchGameMode = (mode: GameMode) => {
    if (gameStatus === "playing") {
      toast({
        title: "Game in progress",
        description: "Please finish or reset the current game before switching modes.",
        variant: "destructive",
      });
      return;
    }

    setGameMode(mode);
    resetGame();
  };

  if (!story) return null;

  return (
    <div className="min-h-screen bg-fruit-mint">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-fruit-dark">FruitQuest</h1>
          </div>
          <Scoreboard
            userScore={userScore}
            highestScore={highestScore}
            globalHighScore={globalHighScore}
            onReset={resetScore}
            onBack={() => navigate("/stories")}
          />
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <StoryCard
              title={story.title}
              description={story.description}
              fruit={story.fruit}
              image={story.image}
              mission={
                <p className="text-2xl font-bold text-fruit-apple">
                  {gameMode === "camera"
                    ? `Show a ${story.fruit} to your camera!`
                    : `Find the ${story.fruit} in the images!`}
                </p>
              }
            />

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-fruit-dark mb-4">Game Mode</h3>
              <GameModeSelector
                gameMode={gameMode}
                switchGameMode={switchGameMode}
              />

              <h3 className="text-xl font-semibold text-fruit-dark mb-4">Game Status</h3>
              <GameStatusCard
                gameStatus={gameStatus}
                gameMode={gameMode}
                timeRemaining={timeRemaining}
                userScore={userScore}
                currentStreak={currentStreak}
                fruit={story.fruit}
                onStart={startGame}
                onReset={resetGame}
                onBack={() => navigate("/stories")}
                isCameraEnabled={cameraEnabled}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            {gameMode === "camera" ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <CameraView
                  cameraEnabled={cameraEnabled}
                  videoRef={videoRef}
                  enableCamera={enableCamera}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-fruit-dark mb-4">Select the correct image</h3>
                <ImageOptions
                  imageOptions={imageOptions}
                  gameStatus={gameStatus}
                  selectedImage={selectedImage}
                  handleImageSelection={handleImageSelection}
                />
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-fruit-dark mb-4">Detection Results</h3>
              <DetectionResults
                detectionResults={detectionResults}
                gameStatus={gameStatus}
                gameMode={gameMode}
                fruit={story.fruit}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Game;
