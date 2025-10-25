import * as React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useMemo, useState } from 'react';


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

type Socket ={
  id: number,
  name: string,
  code: string,}

interface CpuTableProps {
  cpus: Cpu[];
  sockets: Socket[];
  onEditCpu: (cpu: Cpu) => void;
  onDeleteCpu: (event: React.MouseEvent, id: number) => void;
}

const CpuTable = ({ cpus, sockets, onDeleteCpu, onEditCpu }: CpuTableProps) => {
  const socketById = useMemo(() => {
    const map = new Map<number, Socket>();
    sockets.forEach((s) => map.set(s.id, s));
    return map;
  }, [sockets]);

  const [openRowId, setOpenRowId] = useState<number | null>(null);


    return (
         <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Table aria-label="collapsible table" sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: 'grey.100' }}>
                <TableRow>
                    <TableCell />
                    <TableCell >Cpu Brand</TableCell>
                    <TableCell align="left">Cpu Model&nbsp;</TableCell>
                    <TableCell align="left" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Cpu Socket&nbsp;</TableCell>
                    <TableCell align="left">Action&nbsp;</TableCell>
                </TableRow>
                </TableHead>

                <TableBody>
                  {cpus.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No CPUs found. Please add a new one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    cpus.map((cpu: Cpu) => {
                        const open = openRowId === cpu.id;
                        const socket = socketById.get(cpu.socket_id);
                        return (
                            <React.Fragment key={cpu.id}>
                            <TableRow sx={{ '& > *': { borderBottom: 'unset' }  }} hover>
                            <TableCell>

                                <IconButton
                                    aria-label="expand row"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenRowId(open ? null : cpu.id);
                                    }}                     >
                                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>

                                </TableCell>
                              
                                <TableCell component="th" scope="row" >{cpu.brand}</TableCell>
                                <TableCell align="left">{cpu.model}</TableCell>
                                <TableCell align="left" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{socket ? socket.code : ""}</TableCell>
                                <TableCell align="left" onClick={(e) => e.stopPropagation()}>
                                    <IconButton size="small" aria-label="edit" color="primary" onClick={() => onEditCpu(cpu)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" aria-label="delete"  color="error" onClick={(event) => onDeleteCpu(event, cpu.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                <Collapse in={open} timeout="auto" unmountOnExit>
                                    <Box sx={{ margin: 1 }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Cpu Details
                                    </Typography>
                                    
                                    <Table size="small" aria-label="purchases">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell>Clock speed</TableCell>
                                            <TableCell>Cores</TableCell>
                                            <TableCell>Threads</TableCell>
                                            <TableCell >TDP</TableCell>
                                            <TableCell >Socket Name</TableCell>
                                            <TableCell > price (€)</TableCell>
                                        </TableRow>
                                        </TableHead>

                                        <TableBody >

                                            <TableRow >
                                                <TableCell component="th" scope="row">{cpu.clockspeed}</TableCell>
                                                <TableCell>{cpu.cores}</TableCell>
                                                <TableCell>{cpu.threads}</TableCell>
                                                <TableCell>{cpu.tdp}</TableCell>
                                                <TableCell>{socket ? socket.name : ""}</TableCell>
                                                <TableCell >{cpu.price_eur}</TableCell>
                                            </TableRow>
                                        </TableBody>

                                    </Table>
                                    </Box>
                                </Collapse>
                                </TableCell>
                            </TableRow>
                        
    </React.Fragment>
);
                  })
                )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CpuTable;
