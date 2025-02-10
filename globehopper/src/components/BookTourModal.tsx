import { Dialog, Box, Typography, Button, TextField } from "@mui/material";
import { useState } from "react";
import { Tour, User } from "../types/types";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";

interface BookTourModalProps {
  open: boolean;
  onClose: () => void;
  tour: Tour | null;
  userId: string;
}

const BookTourModal = ({ open, onClose, tour, userId }: BookTourModalProps) => {
  const [loading, setLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const bookTour = async (tourId: string, userId: string) => {
    const tourRef = doc(db, "tours", tourId);
    const userRef = doc(db, "users", userId);

    // Check if spaces are available
    const tourSnapshot = await getDoc(tourRef);
    const tourData = tourSnapshot.data();

    // @ts-ignore
    if (tourData.bookedSpaces < 15) {
      // Book the tour
      await updateDoc(tourRef, {
        // @ts-ignore
        bookedSpaces: tourData.bookedSpaces + 1,
      });

      await updateDoc(userRef, {
        bookings: arrayUnion(tourId),
      });
    } else {
      alert("No spaces left for this tour.");
    }
  };

  const handleBooking = async () => {
    if (!tour || !userId) return;
    setLoading(true);
    await bookTour(tour.id, userId);
    setLoading(false);
    setConfirmationMessage("Booking successful!");
    onClose();
  };

  if (!tour) {
    return null; // If there's no tour selected, don't render the modal.
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <Box
        sx={{
          padding: 4,
          backgroundColor: "white",
          maxWidth: 400,
          margin: "auto",
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Book Tour: {tour?.name}
        </Typography>
        <Typography sx={{ marginBottom: 2 }}>
          {/* @ts-ignore */}
          Spaces available: {15 - tour?.bookedSpaces} spaces left
        </Typography>

        {confirmationMessage ? (
          <Typography color="success.main">{confirmationMessage}</Typography>
        ) : (
          <Button
            onClick={handleBooking}
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ marginTop: 2 }}
          >
            {loading ? "Booking..." : "Book Now"}
          </Button>
        )}
      </Box>
    </Dialog>
  );
};

export default BookTourModal;
