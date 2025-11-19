import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import HomePage from "./Pages/HomePage";
import ExercisesPage from "./Pages/Exercises";
import Navbar from "./Components/Navbar";
import Wordle from "./Pages/Wordle";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/wordle" element={<Wordle />} />
      </Routes>
    </Router>
  );
}

export default App;
