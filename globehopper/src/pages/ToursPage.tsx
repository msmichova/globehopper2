import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Button, Grid, Drawer, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import TourForm from "../components/TourForm";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

interface Tour {
  id: string;
  name: string;
  type: string;
  description: string;
  createdBy: string;
  location: string;
  guideName: string;
}

// Mock User (TODO: Replace with real authentication)
// const mockUser = { id: "Y2a24jVPqW3UZVKBrxSo", name: "Chris", role: "guide", specialties: ["Boat Tour", "History Tour"] };
const mockUser = { id: "m8vRPA2R7sXbXYttk0i1", name: "ADMIN", role: "admin", specialties: ["Boat Tour", "History Tour", "Private Car Tour", "Foodie Tour", "Drink Tour", "Art Tour"] };
// const mockUser = { id: "iyIE8AxFzjk7OTNjIo7Z", name: "Jonny", role: "guide", specialties: ["Private Car Tour"] };
// const mockUser = { id: "n36seRhNjZrgXXi04Qwq", name: "Martina", role: "guide", specialties: ["Foodie Tour", "Drink Tour"] };
// const mockUser = { id: "hmWBOyJooVWZ26mHDiZk", name: "Vic", role: "guide", specialties: ["Art Tour"] };

const ToursPage = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [tourToDelete, setTourToDelete] = useState<Tour | null>(null);
 
  const handleTourAdded = (newTour: Tour) => {
    setTours((prevTours) => [...prevTours, newTour]); // Add the new tour to the state
  };
  
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tours"));
        const toursData = querySnapshot.docs.map(doc => ({
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

  // Handle Edit Click
  const handleEditClick = (tour: Tour) => {
    setEditingTour(tour);
    setOpenEditDialog(true);
  };

  // Handle Delete Click
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

      setTours(tours.map(t => (t.id === editingTour.id ? editingTour : t)));
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
      
      setTours(tours.filter(t => t.id !== tourToDelete.id));
      setOpenDeleteDialog(false);
      setTourToDelete(null);
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Tour List */}
      <Box sx={{ flex: 1, padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Available Tours
        </Typography>

        <Grid container spacing={2}>
          {tours.map((tour) => (
            <Grid item xs={12} sm={6} md={4} key={tour.id}>
              <Card sx={{ padding: 2, position: "relative" }}>
                <CardContent>
                    {/* @ts-ignore */}
                    {mockUser && mockUser?.id === tour.createdBy && (
                    <Chip 
                      label="My Tour" 
                      color="primary" 
                      size="small" 
                      sx={{ position: "absolute", top: 8, right: 8 }} 
                    />
                     )}

                  <Typography variant="h6">{tour.name}</Typography>
                  <Typography color="textSecondary">{tour.type} with {tour.guideName} - {tour.location}</Typography>
                  <Typography variant="body2" sx={{ marginTop: 1 }}>
                    {tour.description}
                  </Typography>
                  {/* @ts-ignore */}
                  {(mockUser?.id === tour.createdBy || mockUser.role === "admin") && (
                    <>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        onClick={() => handleEditClick(tour)} 
                        sx={{ marginTop: 1, marginRight: 1 }}
                      >
                        Edit
                      </Button>

                      <Button 
                        variant="outlined" 
                        color="error" 
                        onClick={() => handleDeleteClick(tour)} 
                        sx={{ marginTop: 1 }}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Tour Form */}
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
        }}>
        {mockUser && (mockUser?.role === "guide" || mockUser?.role === "admin") ? (
            <>
            <Typography variant="h6">Add a Tour</Typography>
            {/* @ts-ignore */}
            <Typography variant="body2">Logged in: {mockUser?.name}</Typography>
            <TourForm loggedInUser={mockUser} onTourAdded={handleTourAdded} />
            </>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Log in as a guide or admin to add a tour.
          </Typography>
        )}
      </Drawer>

      {/* Edit Tour Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Tour</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="dense" value={editingTour?.name || ""} onChange={(e) => setEditingTour({ ...editingTour!, name: e.target.value })} />
          <TextField label="Location" fullWidth margin="dense" value={editingTour?.location || ""} onChange={(e) => setEditingTour({ ...editingTour!, location: e.target.value })} />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Tour Type</InputLabel>
            <Select label="Type" name="type" value={editingTour?.type || ""} onChange={(e) => setEditingTour({ ...editingTour!, type: e.target.value })}>
                {/* @ts-ignore */}
                {mockUser && mockUser?.specialties?.map((type) => (
                    <MenuItem key={type} value={type}>
                    {type}
                    </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField label="Description" fullWidth margin="dense" multiline value={editingTour?.description || ""} onChange={(e) => setEditingTour({ ...editingTour!, description: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{tourToDelete?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ToursPage;
