import { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { TextField } from "@mui/material";

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

interface GooglePlacesAutocompleteProps {
  onLocationSelect: (location: LocationData) => void;
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({ onLocationSelect }) => {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.formatted_address) {
        const locationData: LocationData = {
          address: place.formatted_address,
          latitude: place.geometry.location?.lat() ?? 0,
          longitude: place.geometry.location?.lng() ?? 0,
        };
        onLocationSelect(locationData);
      }
    }
  };

  return (
    <Autocomplete
      onLoad={(auto) => setAutocomplete(auto)}
      onPlaceChanged={handlePlaceSelect}
    >
      <TextField label="Meeting Point" fullWidth />
    </Autocomplete>
  );
};

export default GooglePlacesAutocomplete;
