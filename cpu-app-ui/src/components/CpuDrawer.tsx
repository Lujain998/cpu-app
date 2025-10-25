import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, useEffect } from "react";



type Cpu = {
  id: number;
  brand: string;
  model: string;
  clockspeed: number;
  cores: number;
  threads: number;
  tdp: number;
  price_eur: number;
  socket_id: number;
};

type Socket = {
  id: number;
  code: string;
  name: string;
};

interface CpuDrawerProps {
  open: boolean;
  mode:  "edit" | "add";
  cpu: Cpu | null;
  sockets: Socket[];
  onClose: () => void;
  onSave: () => void;
  onAdd: () => void;
  onChange: (field: keyof Cpu, value: string | number) => void;
}

const CpuDrawer = ({
  open,
  mode,
  cpu,
  sockets,
  onClose,
  onSave,
  onAdd,
  onChange,
}: CpuDrawerProps) => {
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

useEffect(() => {
  setErrors({});
}, [open, mode, cpu?.id]);


  const handleValidateAndSubmit = () => {
  const newErrors: { [key: string]: string } = {};

  if (!cpu?.brand?.trim()) newErrors.brand = "Brand is required";
  if (!cpu?.model?.trim()) newErrors.model = "Model is required";
  if (!cpu?.clockspeed || cpu.clockspeed <= 0)
    newErrors.clockspeed = "Clock speed must be greater than 0";
  if (!cpu?.cores || cpu.cores < 1)
    newErrors.cores = "Cores must be at least 1";
  if (!cpu?.threads || cpu.threads < 1)
    newErrors.threads = "Threads must be at least 1";
  if (!cpu?.tdp || cpu.tdp < 1)
    newErrors.tdp = "TDP must be at least 1";
  if (cpu?.price_eur == null || cpu.price_eur < 0)
    newErrors.price_eur = "Price must be ≥ 0";
  if (!cpu?.socket_id || cpu.socket_id === 0)
    newErrors.socket_id = "Please select a socket";

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    if (isAdd) onAdd();
    else if (isEdit) onSave();
  }
};


const handleFieldChange = (field: keyof Cpu, value: string | number) => {
  setErrors(prev => {
    if (!prev[field as string]) return prev;
    const next = { ...prev };
    delete next[field as string];
    return next;
  });
  onChange(field, value);
};



  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant={isSm ? "temporary" : "persistent"}
      ModalProps={{ keepMounted: true }}
      slotProps={{ paper: { sx: { width: { xs: '100vw', sm: 450 } } } }}
    >
      <Box sx={{ width: { xs: '100%', sm: 400 }, p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" gutterBottom>
          {isAdd ? "Add New CPU" : isEdit ? "Edit CPU" : "CPU Details"}
        </Typography>

        <TextField
          label="Brand"
          value={cpu?.brand || ""}
          onChange={(e) => handleFieldChange("brand", e.target.value)}
          fullWidth
          margin="normal"
          required
          error={Boolean(errors.brand)}
          helperText={errors.brand}

        />

        <TextField
          label="Model"
          value={cpu?.model || ""}
          onChange={(e) => handleFieldChange("model", e.target.value)}
          fullWidth
          margin="normal"
          required
          error={Boolean(errors.model)}
          helperText={errors.model}

        />

        <TextField
          label="Clock Speed"
          type="number"
          value={cpu?.clockspeed || ""}
          onChange={(e) => handleFieldChange("clockspeed", e.target.value)}
          fullWidth
          margin="normal"
          slotProps={{htmlInput: { min: 0.1, step: 0.1 } }}
          required
          error={Boolean(errors.clockspeed)}
          helperText={errors.clockspeed}
        />

        <TextField
          label="Cores"
          type="number"
          value={cpu?.cores || ""}
          onChange={(e) => handleFieldChange("cores", e.target.value)}
          fullWidth
          margin="normal"
          slotProps={{htmlInput: { min: 1, step: 1 } }}
          required
          error={Boolean(errors.cores)}
          helperText={errors.cores}
        />

        <TextField
          label="Threads"
          type="number"
          value={cpu?.threads || ""}
          onChange={(e) => handleFieldChange("threads", e.target.value)}
          fullWidth
          margin="normal"
          slotProps={{htmlInput: { min: 1, step: 1 } }}
          required
          error={Boolean(errors.threads)}
          helperText={errors.threads}
        />

        <TextField
          label="TDP"
          type="number"
          value={cpu?.tdp || ""}
          onChange={(e) => handleFieldChange("tdp", e.target.value)}
          fullWidth
          margin="normal"
          slotProps={{htmlInput: { min: 1, step: 1 } }}
          required
          error={Boolean(errors.tdp)}
          helperText={errors.tdp}
        />

        <TextField
          label="Price €"
          type="number"
          value={cpu?.price_eur || ""}
          onChange={(e) => handleFieldChange("price_eur", e.target.value)}
          fullWidth
          margin="normal"
          slotProps={{htmlInput: { min: 0, step: 0.01 } }}
          required
          error={Boolean(errors.price_eur)}
          helperText={errors.price_eur}
        />

        <TextField
          select
          label="Socket"
          value={cpu?.socket_id || ""}
          onChange={(e) => handleFieldChange("socket_id", e.target.value)}
          fullWidth
          margin="normal"
          required
          error={Boolean(errors.socket_id)}
          helperText={errors.socket_id}
        >
          {sockets.map((socket) => (
            <MenuItem key={socket.id} value={socket.id}>
              {socket.code}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          

          {isEdit && (
            <>
              <Button variant="contained" color="primary" onClick={handleValidateAndSubmit}>
                Save
              </Button>
              <Button variant="outlined" sx={{ ml: 1 }} onClick={onClose}>
                Cancel
              </Button>
            </>
          )}

          {isAdd && (
            <>
            <Button variant="contained" color="primary"onClick={handleValidateAndSubmit}>
              Add CPU
            </Button>
            <Button variant="outlined" sx={{ ml: 1 }} onClick={onClose}>
                Cancel
              </Button>
        
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default CpuDrawer;
