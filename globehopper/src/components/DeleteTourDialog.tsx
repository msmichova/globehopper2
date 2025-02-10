import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { Tour } from "../types/types";

interface DeleteTourDialogProps {
  open: boolean;
  onClose: () => void;
  handleConfirmDelete: () => void;
  tour: Tour | null;
}

const DeleteTourDialog = ({ open, onClose, handleConfirmDelete, tour }: DeleteTourDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>Are you sure you want to delete "{tour?.name}"?</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirmDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTourDialog;
