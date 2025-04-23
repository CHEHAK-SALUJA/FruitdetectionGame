
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "recharts";
import { Progress } from "@/components/ui/progress";

type User = {
  name: string;
  email: string;
  isLoggedIn: boolean;
};

type GameHistory = {
  date: string;
  score: number;
  fruit: string;
  storyId: number;
  timeSpent: number;
  success: boolean;
};

type PerformanceData = {
  gamesPlayed: number;
  highestScore: number;
  averageScore: number;
  recentGames: { date: string; score: number; fruit: string }[];
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    gamesPlayed: 0,
    highestScore: 0,
    averageScore: 0,
    recentGames: [],
  });

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(userData));

    // Get game history from localStorage
    const gameHistory = JSON.parse(localStorage.getItem("gameHistory") || "[]") as GameHistory[];
    
    // If user has no game history, show default values
    if (gameHistory.length === 0) {
      setPerformanceData({
        gamesPlayed: 0,
        highestScore: 0,
        averageScore: 0,
        recentGames: [],
      });
      return;
    }
    
    // Calculate performance metrics
    const totalGames = gameHistory.length;
    const scores = gameHistory.map(game => game.score);
    const highestScore = Math.max(...scores, 0);
    const averageScore = scores.length > 0 
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) 
      : 0;
    
    // Get recent games (up to 5)
    const recentGames = gameHistory
      .slice(0, 5)
      .map(game => ({
        date: game.date,
        score: game.score,
        fruit: game.fruit
      }));
    
    setPerformanceData({
      gamesPlayed: totalGames,
      highestScore,
      averageScore,
      recentGames,
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-fruit-mint">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-fruit-dark">FruitQuest</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-fruit-dark">Welcome, {user.name}</span>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-fruit-teal text-fruit-teal hover:bg-fruit-teal hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-fruit-dark">Games Played</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-fruit-apple">{performanceData.gamesPlayed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-fruit-dark">Highest Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-fruit-apple">{performanceData.highestScore}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-fruit-dark">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-fruit-apple">{performanceData.averageScore}%</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-fruit-dark">Recent Games</CardTitle>
              <CardDescription>Your last 5 games</CardDescription>
            </CardHeader>
            <CardContent>
              {performanceData.recentGames.length > 0 ? (
                <div className="space-y-4">
                  {performanceData.recentGames.map((game, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{game.date} - {game.fruit}</span>
                        <span className="text-sm font-medium">{game.score}%</span>
                      </div>
                      <Progress value={game.score} className="h-2 bg-gray-200" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No games played yet.</p>
                  <p className="mt-2">Start playing to see your performance!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-fruit-dark">Play FruitQuest</CardTitle>
              <CardDescription>Choose a story and start playing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Put your fruit recognition skills to the test! Start a new game and show the correct fruit to your camera.
                </p>
                <Button
                  className="w-full bg-fruit-apple hover:bg-opacity-90 text-white"
                  onClick={() => navigate("/stories")}
                >
                  Play Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
