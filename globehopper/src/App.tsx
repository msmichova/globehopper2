import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, Container } from "@mui/material";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import ToursPage from "./pages/ToursPage"
// import Locations from "./pages/Locations";
// import BelfastPage from "./pages/locations/BelfastPage";
// import LondonPage from "./pages/locations/LondonPage";
// import MarrakechPage from "./pages/locations/MarrakechPage";
// import IstanbulPage from "./pages/locations/IstanbulPage";

const App: React.FC = () => {
  return (
    <Router>
      {/* <CssBaseline /> */}
      <NavBar />
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<ToursPage />} />
          {/* <Route path="/locations" element={<Locations />} />
          <Route path="/locations/belfast" element={<BelfastPage />} /> */}
          {/* <Route path="/locations/london" element={<LondonPage />} />
          <Route path="/locations/marrakech" element={<MarrakechPage />} />
          <Route path="/locations/istanbul" element={<IstanbulPage />} /> */}
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
