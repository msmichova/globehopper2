import { useState } from "react";
import { Tour, User } from "../types/types";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Collapse,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import BookTourModal from "./BookTourModal";
import ReviewTourModal from "./ReviewTourModal";

interface TourListProps {
  tours: Tour[];
  mockUser: User;
  onEditClick: (tour: Tour) => void;
  onDeleteClick: (tour: Tour) => void;
}

const TourList = ({
  tours,
  mockUser,
  onEditClick,
  onDeleteClick,
}: TourListProps) => {
  const [expandedTour, setExpandedTour] = useState<string | null>(null);
  const [openBookModal, setOpenBookModal] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  const handleOpenBookModal = (tour: Tour) => {
    setSelectedTour(tour);
    setOpenBookModal(true);
  };

  const handleCloseBookModal = () => {
    setOpenBookModal(false);
    setSelectedTour(null);
  };

  const handleOpenReviewModal = (tour: Tour) => {
    setSelectedTour(tour);
    setOpenReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setOpenReviewModal(false);
    setSelectedTour(null);
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDrWfZPCPN1PSLp37NX3vzaDlTorWbQD6s",
  });

  // const addToWishlist = async (tourId: string, userId: string) => {
  //   const userRef = doc(db, "users", userId);
  //   await updateDoc(userRef, {
  //     wishlist: arrayUnion(tourId),
  //   });
  // };

  const toggleExpand = (tourId: string) => {
    setExpandedTour(expandedTour === tourId ? null : tourId);
  };

  return (
    <Grid container spacing={2}>
      {tours.map((tour) => {
        const { name, bookedSpaces } = tour;
        const spacesLeft = 15 - bookedSpaces;

        const chipText =
          spacesLeft < 5
            ? `Only ${spacesLeft} spaces left, book now!`
            : `${spacesLeft} spaces left`;

        return (
          <Grid item xs={12} sm={6} md={4} key={tour.id}>
            <Card sx={{ padding: 2, position: "relative" }}>
              <CardContent>
                {mockUser && mockUser.id === tour.createdBy && (
                  <Chip
                    label="My Tour"
                    color="primary"
                    size="small"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  />
                )}

                {mockUser && mockUser.role === "tourist" && (
                  <Chip
                    label={chipText}
                    color={spacesLeft < 5 ? "error" : "primary"}
                  />
                )}

                <Typography variant="h6">{tour.name}</Typography>
                <Typography color="textSecondary">
                  {tour.type} with {tour.guideName} - {tour.location}
                </Typography>
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  {tour.description}
                </Typography>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => toggleExpand(tour.id)}
                  sx={{ marginTop: 1 }}
                  endIcon={
                    expandedTour === tour.id ? <ExpandLess /> : <ExpandMore />
                  }
                >
                  {expandedTour === tour.id ? "Hide Info" : "More Info"}
                </Button>

                <Collapse
                  in={expandedTour === tour.id}
                  timeout="auto"
                  unmountOnExit
                >
                  <Card sx={{ marginTop: 2, padding: 1 }}>
                    <Typography variant="subtitle1">
                      <strong>Meeting Point:</strong>{" "}
                      {tour.meetingPoint?.address}
                    </Typography>

                    {isLoaded && tour.meetingPoint && (
                      <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "200px" }}
                        center={{
                          lat: tour.meetingPoint.latitude,
                          lng: tour.meetingPoint.longitude,
                        }}
                        zoom={15}
                      >
                        <Marker
                          position={{
                            lat: tour.meetingPoint.latitude,
                            lng: tour.meetingPoint.longitude,
                          }}
                        />
                      </GoogleMap>
                    )}
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                      <strong>Reviews:</strong>
                      {tour.reviews && tour.reviews?.length > 0 ? (
                        <ul>
                          {tour.reviews?.map((review, index) => (
                            <li key={index}>
                              {review.comment} - Rating: {review.rating}/5
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span>No reviews yet.</span>
                      )}
                    </Typography>
                  </Card>
                </Collapse>

                {(mockUser.id === tour.createdBy ||
                  mockUser.role === "admin") && (
                  <>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => onEditClick(tour)}
                      sx={{ marginTop: 1, marginRight: 1 }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => onDeleteClick(tour)}
                      sx={{ marginTop: 1 }}
                    >
                      Delete
                    </Button>
                  </>
                )}

                {mockUser && mockUser.role === "tourist" && (
                  <>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpenBookModal(tour)}
                      sx={{ marginTop: 1, marginRight: 1 }}
                    >
                      Book Tour
                    </Button>

                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleOpenReviewModal(tour)}
                      sx={{ marginTop: 1 }}
                    >
                      Leave a Review
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <BookTourModal
              open={openBookModal}
              onClose={handleCloseBookModal}
              tour={selectedTour}
              userId={mockUser.id}
            />

            <ReviewTourModal
              open={openReviewModal}
              onClose={handleCloseReviewModal}
              tour={selectedTour}
              userId={mockUser.id}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default TourList;
