import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Tour, User } from "../types/types";

interface EditTourDialogProps {
  editingTour: Tour | null;
  setEditingTour: (tour: Tour | null) => void;
  open: boolean;
  onClose: () => void;
  handleSaveEdit: () => void;
  mockUser: User;
}

const EditTourDialog = ({
  editingTour,
  setEditingTour,
  open,
  onClose,
  handleSaveEdit,
  mockUser,
}: EditTourDialogProps) => {
  if (!editingTour) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Tour</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          margin="dense"
          value={editingTour.name}
          onChange={(e) =>
            setEditingTour({ ...editingTour, name: e.target.value })
          }
        />
        <TextField
          label="Location"
          fullWidth
          margin="dense"
          value={editingTour.location}
          onChange={(e) =>
            setEditingTour({ ...editingTour, location: e.target.value })
          }
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Tour Type</InputLabel>
          <Select
            label="Type"
            name="type"
            value={editingTour.type}
            onChange={(e) =>
              setEditingTour({ ...editingTour, type: e.target.value })
            }
          >
            {mockUser.specialties?.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Description"
          fullWidth
          margin="dense"
          multiline
          value={editingTour.description}
          onChange={(e) =>
            setEditingTour({ ...editingTour, description: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSaveEdit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTourDialog;
