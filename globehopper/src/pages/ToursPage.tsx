import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Drawer,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import TourForm from "../components/TourForm";
import TourList from "../components/TourList";
import EditTourDialog from "../components/EditTourDialog";
import DeleteTourDialog from "../components/DeleteTourDialog";
import { Tour } from "../types/types";
import { mockUser } from "../mocks/mockUser";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const ToursPage = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [tourToDelete, setTourToDelete] = useState<Tour | null>(null);
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    guideName: "",
  });

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tours"));
        const toursData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Tour[];

        setTours(toursData);
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchTours();
  }, []);

  const handleTourAdded = (newTour: Tour) => {
    setTours((prevTours) => [...prevTours, newTour]);
  };

  const handleEditClick = (tour: Tour) => {
    setEditingTour(tour);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (tour: Tour) => {
    setTourToDelete(tour);
    setOpenDeleteDialog(true);
  };

  // Handle Tour Update
  const handleSaveEdit = async () => {
    if (!editingTour) return;

    try {
      const tourRef = doc(db, "tours", editingTour.id);
      await updateDoc(tourRef, {
        name: editingTour.name,
        type: editingTour.type,
        description: editingTour.description,
        location: editingTour.location,
        guideName: editingTour.guideName,
      });

      setTours(tours.map((t) => (t.id === editingTour.id ? editingTour : t)));
      setOpenEditDialog(false);
      setEditingTour(null);
    } catch (error) {
      console.error("Error updating tour:", error);
    }
  };

  // Handle Tour Deletion
  const handleConfirmDelete = async () => {
    if (!tourToDelete) return;

    try {
      const tourRef = doc(db, "tours", tourToDelete.id);
      await deleteDoc(tourRef);

      setTours(tours.filter((t) => t.id !== tourToDelete.id));
      setOpenDeleteDialog(false);
      setTourToDelete(null);
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
  };

  const handleFilterChange = (
    event: SelectChangeEvent<string> | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredTours = tours.filter((tour) => {
    return (
      (filters.location === "" ||
        tour.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.type === "" || tour.type === filters.type) &&
      (filters.guideName === "" ||
        tour.guideName.toLowerCase().includes(filters.guideName.toLowerCase()))
    );
  });

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box sx={{ flex: 1, padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Available Tours
        </Typography>
        <Box sx={{ display: "flex", gap: 2, marginBottom: 4 }}>
          <TextField
            label="Location"
            name="location"
            value={filters.location}
            onChange={(e) =>
              handleFilterChange(e as React.ChangeEvent<HTMLInputElement>)
            }
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Tour Type</InputLabel>
            <Select
              name="type"
              value={filters.type}
              onChange={(e) =>
                handleFilterChange(e as SelectChangeEvent<string>)
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Boat Tour">Boat Tour</MenuItem>
              <MenuItem value="History Tour">History Tour</MenuItem>
              <MenuItem value="Private Car Tour">Private Car Tour</MenuItem>
              <MenuItem value="Foodie Tour">Foodie Tour</MenuItem>
              <MenuItem value="Drink Tour">Drink Tour</MenuItem>
              <MenuItem value="Art Tour">Art Tour</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Guide Name"
            name="guideName"
            value={filters.guideName}
            onChange={(e) =>
              handleFilterChange(e as React.ChangeEvent<HTMLInputElement>)
            }
            fullWidth
          />
        </Box>

        <Grid container spacing={2}>
          <TourList
            tours={filteredTours}
            mockUser={mockUser}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        </Grid>
      </Box>

      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: 300,
          flexShrink: 0,
          top: 64,
          "& .MuiDrawer-paper": {
            width: 300,
            padding: 2,
            top: 64,
            height: "calc(100% - 64px)",
          },
        }}
      >
        {mockUser &&
        (mockUser.role === "guide" || mockUser.role === "admin") ? (
          <>
            <Typography variant="h6">Add a Tour</Typography>
            <Typography variant="body2">Logged in: {mockUser.name}</Typography>
            <TourForm loggedInUser={mockUser} onTourAdded={handleTourAdded} />
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Log in as a guide or admin to add a tour.
          </Typography>
        )}
      </Drawer>

      <EditTourDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        editingTour={editingTour}
        setEditingTour={setEditingTour}
        mockUser={mockUser}
        handleSaveEdit={handleSaveEdit}
      />

      <DeleteTourDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        tour={tourToDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </Box>
  );
};

export default ToursPage;
