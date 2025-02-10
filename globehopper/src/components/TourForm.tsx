// const users = [
//   { id: "admin", name: "Admin", role: "admin", specialties: ["Private Car Tour", "Boat Tour", "History Tour", "Foodie Tour", "Drink Tour", "Art Tour"] },
//   { id: "jonny", name: "Jonny", role: "guide", specialties: ["Private Car Tour"] },
//   { id: "chris", name: "Chris", role: "guide", specialties: ["Boat Tour", "History Tour"] },
//   { id: "martina", name: "Martina", role: "guide", specialties: ["Foodie Tour", "Drink Tour"] },
//   { id: "vic", name: "Vic", role: "guide", specialties: ["Art Tour"] }
// ];
import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
  Box,
} from "@mui/material";

interface TourFormProps {
  loggedInUser: {
    id: string;
    name: string;
    role: string;
    specialties?: string[];
  };
  onTourAdded: (newTour: any) => void;
}

const TourForm = ({ loggedInUser, onTourAdded }: TourFormProps) => {
  const [tour, setTour] = useState({
    name: "",
    type: "",
    description: "",
    location: "",
    meetingPoint: {
      latitude: "",
      longitude: "",
      address: "",
    },
    guideName: loggedInUser.name,
    createdBy: loggedInUser.id,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (["latitude", "longitude"].includes(name)) {
      // Convert latitude & longitude to numbers
      setTour((prev) => ({
        ...prev,
        meetingPoint: {
          ...prev.meetingPoint,
          [name]: value === "" ? "" : parseFloat(value), // Convert to number
        },
      }));
    } else if (name === "address") {
      // Handle address update
      setTour((prev) => ({
        ...prev,
        meetingPoint: {
          ...prev.meetingPoint,
          [name]: value,
        },
      }));
    } else {
      // Handle other fields
      setTour((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setTour((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "tours"), tour);
      onTourAdded({ ...tour, id: docRef.id });
      setTour({
        name: "",
        type: "",
        description: "",
        location: "",
        meetingPoint: {
          latitude: "",
          longitude: "",
          address: "",
        },
        guideName: loggedInUser.name,
        createdBy: loggedInUser.id,
      });
    } catch (error) {
      console.error("Error adding tour:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="name"
        label="Tour Name"
        value={tour.name}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        name="location"
        label="Location"
        value={tour.location}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth margin="normal" required>
        <InputLabel>Tour Type</InputLabel>
        <Select name="type" value={tour.type} onChange={handleSelectChange}>
          {loggedInUser.specialties?.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        name="description"
        label="Description"
        value={tour.description}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />

      {/* Meeting Point Section */}
      <Box mt={2} mb={2}>
        <Typography variant="h6">Meeting Point</Typography>
        <TextField
          name="latitude"
          label="Latitude"
          type="number"
          value={tour.meetingPoint.latitude}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          name="longitude"
          label="Longitude"
          type="number"
          value={tour.meetingPoint.longitude}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          name="address"
          label="Address"
          value={tour.meetingPoint.address}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
      </Box>

      <Button type="submit" variant="contained" color="primary">
        Add Tour
      </Button>
    </form>
  );
};

export default TourForm;
