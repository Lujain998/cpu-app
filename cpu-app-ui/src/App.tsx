import "./App.css";
import { useState, useEffect } from "react";
import CpuTable from "./components/CpuTable";
import CpuDrawer from "./components/CpuDrawer";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


type Cpu ={
  id: number,
  brand: string,
  model: string,
  clockspeed: number,
  cores: number,
  threads: number,
  tdp: number,
  price_eur: number,
  socket_id: number,
}


const App = () => {

const [cpus, setCpus] = useState< Cpu[]>([]);
const [sockets, setSockets] = useState<{ id: number; code: string; name: string }[]>([]);


const [brand, setBrand] = useState("");
const [model, setModel] = useState("");
const [clockspeed, setClockSpeed] =useState<number | "">("");
const [cores, setCores] = useState<number | "">("");
const [threads, setThreads] = useState<number | "">("");
const [tdp, setTdp] = useState<number | "">("");
const [price_eur, setPrice] = useState<number | "">("");
const [socket_id, setSocket] = useState<number>(0);

const [isDrawerOpen, setIsDrawerOpen] = useState(false);
const [drawerMode, setDrawerMode] = useState<"edit"|"add">("add");
const theme = useTheme();
const isSm = useMediaQuery(theme.breakpoints.down('sm'));

const [selectedCpu, setSelectedCpu] =
  useState<Cpu | null>(null);

useEffect(() => {
 const fetchCpus = async () => {
  try {
  const response = await fetch("http://localhost:5000/cpus");

  const cpus: Cpu[] = await response.json();

  setCpus(cpus);
} catch (e) {
  console.log(e);
}
};
  const fetchSockets = async () => {
    try {
      const response = await fetch("http://localhost:5000/sockets");
      const socketsData = await response.json();
      setSockets(socketsData);
    } catch (e) {
      console.log(e);
    }
  };

fetchCpus();
fetchSockets();
}, []);

const handleCpuClick = (cpu:Cpu) => {
  setSelectedCpu(cpu);
  setBrand(cpu.brand);
  setModel(cpu.model);
  setClockSpeed(cpu.clockspeed);
  setCores(cpu.cores);
  setThreads(cpu.threads);
  setTdp(cpu.tdp);
  setPrice(cpu.price_eur);
  setSocket(cpu.socket_id);
  setIsDrawerOpen(true);
};

const handleEditCpu = (cpu: Cpu) => {
  handleCpuClick(cpu);
  setDrawerMode("edit");
  setIsDrawerOpen(true);
};


const handleAddCpu = async() => {

  try {
    const response = await fetch(
    "http://localhost:5000/cpus",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      brand, model, clockspeed, cores, threads, tdp, price_eur, socket_id,
    }),
  }
);
  const newCpu = await response.json();
  setCpus([newCpu, ...cpus]);

setIsDrawerOpen(false);
  setBrand("");
  setModel("");
  setClockSpeed("");
  setCores("");
  setThreads("");
  setTdp("");
  setPrice("");
  setSocket(0);
} catch (e) {
  console.log(e);
}

};

const handleUpdateCpu = async() => {
  if (!selectedCpu) {
    return;
  }

  try {
    const response = await fetch(
  `http://localhost:5000/cpus/${selectedCpu.id}`,
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      brand, model, clockspeed, cores, threads, tdp, price_eur, socket_id,
    }),
  }
);

    
    const updatedCpu = await response.json();
    const updatedCpusList = cpus.map((cpu) => 
    cpu.id === selectedCpu.id
      ? updatedCpu 
      : cpu);
  
  setCpus(updatedCpusList);
  setIsDrawerOpen(false);

  setBrand("");
  setModel("");
  setClockSpeed("");
  setCores("");
  setThreads("");
  setTdp("");
  setPrice("");
  setSocket(0);
  setSelectedCpu(null);

} catch (e) {
  console.log(e);
}
};

  const deleteCpu = async(event: React.MouseEvent, id: number) => {
  event.stopPropagation();
  try {
      await fetch(
        `http://localhost:5000/cpus/${id}`,
        {
          method: "DELETE",
        }
      );
      const updatedCpu = cpus.filter(
        (cpu) => cpu.id !== id
      );

      setCpus(updatedCpu);
    } catch (e) {
      console.log(e);
    }

};




  return (
    <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
      <div
        style={{
          marginLeft: isSm ? 0 : (isDrawerOpen ? 450 : 0),
          transition: 'margin-left 225ms ease',
        }}
      >
  


      <Stack sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 3, marginTop: 4}} direction="row" spacing={2}>
        <Button 
          variant="contained"
          color="primary"
          onClick={() => {
            setDrawerMode("add");
            setSelectedCpu({
              id: 0,
              brand: "",
              model: "",
              clockspeed: 0,
              cores: 0,
              threads: 0,
              tdp: 0,
              price_eur: 0,
              socket_id: 0,
            });
            setBrand("");
            setModel("");
            setClockSpeed("");
            setCores("");
            setThreads("");
            setTdp("");
            setPrice("");
            setSocket(0);
            setIsDrawerOpen(true);
          }}
        >
          + Add CPU
        </Button>
      </Stack>
        
     <CpuTable
         cpus={cpus}
         sockets={sockets}
         onEditCpu={handleEditCpu}
         onDeleteCpu={deleteCpu}
       />
      </div>

    <CpuDrawer
      key={`${drawerMode}-${selectedCpu?.id ?? 'new'}`}
      open={isDrawerOpen}
      mode={drawerMode}
      cpu={selectedCpu}
      sockets={sockets}
      onClose={() => setIsDrawerOpen(false)}
      onSave={handleUpdateCpu} 
      onAdd={handleAddCpu}     
      onChange={(field, value) => {
        if (field === "brand") setBrand(String(value));
        if (field === "model") setModel(String(value));
        if (field === "clockspeed") setClockSpeed(value === "" ? "" : Number(value));
        if (field === "cores") setCores(value === "" ? "" : Number(value));
        if (field === "threads") setThreads(value === "" ? "" : Number(value));
        if (field === "tdp") setTdp(value === "" ? "" : Number(value));
        if (field === "price_eur") setPrice(value === "" ? "" : Number(value));
        if (field === "socket_id") setSocket(value === "" ? 0 : Number(value));
        setSelectedCpu(prev => (prev ? { ...prev, [field]: value as any } : prev));
      }}
    />

    </Container>
  );
};

export default App;
