import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LandingPage from "./Pages/LandingPage";
import HomePage from "./Pages/HomePage";
import ExercisesPage from "./Pages/Exercises";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
