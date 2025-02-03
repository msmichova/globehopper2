import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: "center", py: 5 }}>
      <Typography variant="h2" gutterBottom>
        Welcome to GlobeHopper
      </Typography>
      <Typography variant="h5" color="textSecondary" gutterBottom>
        Your gateway to exploring new destinations, finding travel inspiration,
        and connecting with fellow travelers.
      </Typography>
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/locations"
          sx={{ mr: 2 }}
        >
          Explore Locations
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          component={Link}
          to="/tours"
        >
          Explore Tours
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
