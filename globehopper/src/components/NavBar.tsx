import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Page Title */}
        <Typography variant="h6">GlobeHopper</Typography>

        {/* Navigation Links */}
        <div>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/locations">Locations</Button>
          <Button color="inherit" component={Link} to="/tours">Tours</Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
