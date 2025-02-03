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
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";

interface TourFormProps {
  loggedInUser: { id: string; name: string; role: string; specialties: string[] };
  onTourAdded: (newTour: any) => void;
}

const TourForm = ({ loggedInUser, onTourAdded }: TourFormProps) => {
  const [tour, setTour] = useState({
    name: "",
    type: "",
    description: "",
    location: "",
    guideName: loggedInUser.name,
    createdBy: loggedInUser.id,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTour((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setTour((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "tours"), tour);
      onTourAdded({ ...tour, id: docRef.id }); // Update UI instantly
      setTour({ name: "", type: "", description: "", location: "", guideName: loggedInUser.name, createdBy: loggedInUser.id });
    } catch (error) {
      console.error("Error adding tour:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField name="name" label="Tour Name" value={tour.name} onChange={handleChange} required fullWidth margin="normal" />
      <TextField name="location" label="Location" value={tour.location} onChange={handleChange} required fullWidth margin="normal" />
      
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Tour Type</InputLabel>
        <Select name="type" value={tour.type} onChange={handleSelectChange}>
          {loggedInUser.specialties.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField name="description" label="Description" value={tour.description} onChange={handleChange} required fullWidth margin="normal" />
      <Button type="submit" variant="contained" color="primary">Add Tour</Button>
    </form>
  );
};

export default TourForm;
