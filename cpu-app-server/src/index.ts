import express from "express";
import cors from "cors";
import { PrismaClient } from '@prisma/client';


const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get('/sockets', async (req, res) => {
  const sockets = await prisma.sockets.findMany({ orderBy: { name: "asc" } });
  res.json(sockets);
});

app.get('/cpus', async (req, res) => {
  const cpus = await prisma.cpus.findMany({ include: { sockets: true } });
  res.json(cpus);
});


app.post("/cpus", async (req, res) => {
  const {
    brand,
    model,
    clockspeed: rawClock,
    cores: rawCores,
    threads: rawThreads,
    tdp: rawTdp,
    price_eur: rawPrice,
    socket_id: rawSocket,
  } = req.body ?? {};

  const toNumber = (val: any) =>
    val === "" || val === null || val === undefined ? null : Number(val);


  const clockspeed = toNumber(rawClock);
  const cores = toNumber(rawCores);
  const threads = toNumber(rawThreads);
  const tdp = toNumber(rawTdp);
  const price_eur = toNumber(rawPrice);
  const socket_id = toNumber(rawSocket);

  if (
    !brand?.trim() ||
    !model?.trim() ||
    clockspeed == null || isNaN(clockspeed) || clockspeed <= 0 ||
    cores == null || isNaN(cores) || cores < 1 ||
    threads == null || isNaN(threads) || threads < 1 ||
    tdp == null || isNaN(tdp) || tdp < 1 ||
    price_eur == null || isNaN(price_eur) || price_eur < 0 ||
    socket_id == null || isNaN(socket_id) || socket_id < 1
  ) {
    return res.status(400).send("All fields are required and must be valid");
  }

  try {
    const cpu = await prisma.cpus.create({
      data: { brand, model, clockspeed, cores, threads, tdp, price_eur, socket_id },
    });
    res.json(cpu);
  } catch (error) {
    console.error(error);
    res.status(500).send("Oops, something went wrong while creating CPU");
  }
});


app.patch("/cpus/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid number");
  }

  const {
    brand,
    model,
    clockspeed: rawClock,
    cores: rawCores,
    threads: rawThreads,
    tdp: rawTdp,
    price_eur: rawPrice,
    socket_id: rawSocket, } = req.body;


  const toNumber = (val: any) =>
    val === "" || val === null || val === undefined ? null : Number(val);

  const clockspeed = toNumber(rawClock);
  const cores = toNumber(rawCores);
  const threads = toNumber(rawThreads);
  const tdp = toNumber(rawTdp);
  const price_eur = toNumber(rawPrice);
  const socket_id = toNumber(rawSocket);

  const data: any = {};

  if (brand !== undefined) data.brand = brand;
  if (model !== undefined) data.model = model;
  if (clockspeed !== null) data.clockspeed = clockspeed;
  if (cores !== null) data.cores = cores;
  if (threads !== null) data.threads = threads;
  if (tdp !== null) data.tdp = tdp;
  if (price_eur !== null) data.price_eur = price_eur;
  if (socket_id !== null) data.socket_id = socket_id;

  const invalid =
    !data.brand?.trim() ||
    !data.model?.trim() ||
    data.clockspeed == null || isNaN(data.clockspeed) || data.clockspeed <= 0 ||
    data.cores == null || isNaN(data.cores) || data.cores < 1 ||
    data.threads == null || isNaN(data.threads) || data.threads < 1 ||
    data.tdp == null || isNaN(data.tdp) || data.tdp < 1 ||
    data.price_eur == null || isNaN(data.price_eur) || data.price_eur < 0 ||
    data.socket_id == null || isNaN(data.socket_id) || data.socket_id < 1;

  if (invalid) {
    return res.status(400).send("All fields are required and must be valid");
  }

  try {
    const updated = await prisma.cpus.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Oops, something went wrong while updating CPU");
  }
});

app.delete("/cpus/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
    return res.status(400).send("ID field required");
  }

  try {
    await prisma.cpus.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});



app.listen(5000, () => {
  console.log("server running on localhost:5000");
});

