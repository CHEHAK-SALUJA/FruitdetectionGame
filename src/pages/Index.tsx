
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.isLoggedIn) {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-fruit-mint">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-fruit-dark">FruitQuest</h1>
          <div className="flex space-x-4">
            <Link to="/login">
              <Button variant="outline" className="border-fruit-teal text-fruit-teal hover:bg-fruit-teal hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-fruit-apple hover:bg-opacity-90 text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-fruit-dark leading-tight">
                Learn and Play with <span className="text-fruit-apple">Fruit</span> Recognition
              </h2>
              <p className="text-lg text-gray-600">
                FruitQuest is an interactive game that combines fun fruit stories with camera-based fruit recognition. Show the correct fruit to your camera and complete the quests!
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-fruit-apple flex items-center justify-center text-white font-bold">1</div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-fruit-dark">Choose a Fruit Story</h3>
                    <p className="mt-1 text-gray-600">Each story features a different fruit with interesting facts.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-fruit-apple flex items-center justify-center text-white font-bold">2</div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-fruit-dark">Show the Fruit to Your Camera</h3>
                    <p className="mt-1 text-gray-600">Find the featured fruit and show it to your device's camera.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-fruit-apple flex items-center justify-center text-white font-bold">3</div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-fruit-dark">Track Your Progress</h3>
                    <p className="mt-1 text-gray-600">See your scores and improve your fruit recognition skills over time.</p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Link to="/signup">
                  <Button className="bg-fruit-apple hover:bg-opacity-90 text-white text-lg px-8 py-3">
                    Start Playing Now
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-fruit-apple to-fruit-teal opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=640"
                alt="Fruit Collection"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-fruit-dark mb-12">Featured Fruits</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {["Apple", "Banana", "Orange", "Strawberry", "Pineapple", "Watermelon"].map((fruit, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-white p-2 shadow-md overflow-hidden mb-4 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                    <img
                      src={`https://source.unsplash.com/random/150x150/?${fruit.toLowerCase()}`}
                      alt={fruit}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-fruit-dark">{fruit}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-fruit-dark">FruitQuest</h3>
              <p className="text-gray-600">Learn about fruits through play</p>
            </div>
            <div>
              <p className="text-gray-600">&copy; 2025 FruitQuest. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
