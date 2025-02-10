import {
  Dialog,
  Box,
  Typography,
  Button,
  TextField,
  Rating,
} from "@mui/material";
import { useState } from "react";
import { Tour, User } from "../types/types";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";

interface ReviewTourModalProps {
  open: boolean;
  onClose: () => void;
  tour: Tour | null;
  userId: string;
}

const ReviewTourModal = ({
  open,
  onClose,
  tour,
  userId,
}: ReviewTourModalProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const handleReview = async () => {
    if (!tour || rating == null) return;
    await leaveReview(tour.id, userId, rating, comment);
    onClose();
  };

  const leaveReview = async (
    tourId: string,
    userId: string,
    rating: number,
    comment: string
  ) => {
    const tourRef = doc(db, "tours", tourId);

    await updateDoc(tourRef, {
      reviews: arrayUnion({ userId, rating, comment }),
    });
  };

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
          Leave a Review for {tour?.name}
        </Typography>

        <Rating
          name="tour-rating"
          value={rating}
          onChange={(_, newValue) => setRating(newValue)}
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Comment"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <Button
          onClick={handleReview}
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          Submit Review
        </Button>
      </Box>
    </Dialog>
  );
};

export default ReviewTourModal;
