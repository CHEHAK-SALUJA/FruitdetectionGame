
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Story = {
  id: number;
  title: string;
  description: string;
  fruit: string;
  difficulty: "easy" | "medium" | "hard";
  image: string;
};

const StoryList = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    
    // Mock stories data (in a real app, this would come from an API)
    const mockStories: Story[] = [
      {
        id: 1,
        title: "An apple a day keeps the doctor away",
        description: "Learn about this famous saying and why apples are so healthy.",
        fruit: "Apple",
        difficulty: "easy",
        image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=240",
      },
      {
        id: 2,
        title: "Going bananas!",
        description: "Discover why monkeys love bananas so much and the nutritional benefits.",
        fruit: "Banana",
        difficulty: "easy",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=240",
      },
      {
        id: 3,
        title: "Orange you glad?",
        description: "Explore the vibrant world of citrus fruits and their vitamin C content.",
        fruit: "Orange",
        difficulty: "medium",
        image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=240",
      },
      {
        id: 4,
        title: "Berry delicious",
        description: "The sweet tale of strawberries and their journey from wild plants to desserts.",
        fruit: "Strawberry",
        difficulty: "medium",
        image: "https://images.unsplash.com/photo-1543528176-61b239494933?q=80&w=240",
      },
      {
        id: 5,
        title: "Pineapple paradise",
        description: "How this tropical fruit became a symbol of hospitality and exotic flavor.",
        fruit: "Pineapple",
        difficulty: "hard",
        image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=240",
      },
      {
        id: 6,
        title: "Watermelon wonder",
        description: "The refreshing summer treat that's mostly water but all fun.",
        fruit: "Watermelon",
        difficulty: "hard",
        image: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?q=80&w=240",
      },
      {
        id: 7,
        title: "Grape expectations",
        description: "From ancient vineyards to modern table grapes - discover the diverse world of grapes.",
        fruit: "Grape",
        difficulty: "medium",
        image: "https://images.unsplash.com/photo-1596363505729-4190a9506133?q=80&w=240",
      },
      {
        id: 8,
        title: "Mango mania",
        description: "Explore the king of fruits and why it's beloved across tropical countries worldwide.",
        fruit: "Mango",
        difficulty: "medium", 
        image: "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=240",
      },
      {
        id: 9,
        title: "Kiwi discoveries",
        description: "The fuzzy fruit with a bright green interior and surprising health benefits.",
        fruit: "Kiwi",
        difficulty: "hard",
        image: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?q=80&w=240",
      },
      {
        id: 10,
        title: "Lemon squeeze",
        description: "When life gives you lemons - learn about this versatile citrus fruit.",
        fruit: "Lemon",
        difficulty: "easy",
        image: "https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=240",
      }
    ];
    
    setStories(mockStories);
  }, [navigate]);
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const startGame = (storyId: number) => {
    navigate(`/game/${storyId}`);
  };
  
  return (
    <div className="min-h-screen bg-fruit-mint">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-fruit-dark">FruitQuest</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
            className="border-fruit-teal text-fruit-teal hover:bg-fruit-teal hover:text-white"
          >
            Back to Dashboard
          </Button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-fruit-dark mb-2">Choose a Story</h2>
          <p className="text-gray-600">
            Select a fruit story below to start the game. You'll need to show the correct fruit to your camera within 60 seconds.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 hover-lift">
              <div className="w-full h-40 overflow-hidden">
                <img 
                  src={story.image} 
                  alt={story.fruit} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    console.log(`Error loading story image: ${story.image}`);
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loops
                    target.src = "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=240"; // Fallback image
                  }}
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold text-fruit-dark">{story.title}</CardTitle>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(story.difficulty)}`}>
                    {story.difficulty}
                  </span>
                </div>
                <CardDescription>Find a <strong className="text-fruit-apple">{story.fruit}</strong></CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{story.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-fruit-apple hover:bg-opacity-90 text-white"
                  onClick={() => startGame(story.id)}
                >
                  Start Quest
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StoryList;
