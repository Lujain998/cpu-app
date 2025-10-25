import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

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
          onChange={(e) => onChange("brand", e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Model"
          value={cpu?.model || ""}
          onChange={(e) => onChange("model", e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Clock Speed"
          type="number"
          value={cpu?.clockspeed || ""}
          onChange={(e) => onChange("clockspeed", Number(e.target.value))}
          fullWidth
          margin="normal"
          slotProps={{htmlInput: { min: 0, step: 0.1 } }}
        />

        <TextField
          label="Cores"
          type="number"
          value={cpu?.cores || ""}
          onChange={(e) => onChange("cores", Number(e.target.value))}
          fullWidth
          margin="normal"
          slotProps={{htmlInput: { min: 0, step: 0.1 } }}
        />

        <TextField
          label="Threads"
          type="number"
          value={cpu?.threads || ""}
          onChange={(e) => onChange("threads", Number(e.target.value))}
          fullWidth
          margin="normal"
          slotProps={{htmlInput: { min: 0, step: 0.1 } }}
        />

        <TextField
          label="TDP"
          type="number"
          value={cpu?.tdp || ""}
          onChange={(e) => onChange("tdp", Number(e.target.value))}
          fullWidth
          margin="normal"
          slotProps={{htmlInput: { min: 0, step: 0.1 } }}
        />

        <TextField
          label="Price €"
          type="number"
          value={cpu?.price_eur || ""}
          onChange={(e) => onChange("price_eur", Number(e.target.value))}
          fullWidth
          margin="normal"
          slotProps={{htmlInput: { min: 0, step: 0.1 } }}
        />

        <TextField
          select
          label="Socket"
          value={cpu?.socket_id || ""}
          onChange={(e) => onChange("socket_id", Number(e.target.value))}
          fullWidth
          margin="normal"
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
              <Button variant="contained" color="primary" onClick={onSave}>
                Save
              </Button>
              <Button variant="outlined" sx={{ ml: 1 }} onClick={onClose}>
                Cancel
              </Button>
            </>
          )}

          {isAdd && (
            <>
            <Button variant="contained" color="primary" onClick={onAdd}>
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
