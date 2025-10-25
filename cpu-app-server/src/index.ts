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
  const { brand, model, clockspeed, cores, threads, tdp, price_eur, socket_id } = req.body;

  if (!brand || !model || !clockspeed || !cores || !threads || !tdp || !price_eur || !socket_id) {
    return res.status(400).send("fields required");
  }

  try {
    const cpu = await prisma.cpus.create({
      data: { brand, model, clockspeed, cores, threads, tdp, price_eur, socket_id },
    });
    res.json(cpu);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

app.patch("/cpus/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid number");
  }

  const { brand, model, clockspeed, cores, threads, tdp, price_eur, socket_id } = req.body;

  const data: any = {};
  if (brand !== undefined) data.brand = brand;
  if (model !== undefined) data.model = model;
  if (clockspeed !== undefined) data.clockspeed = Number(clockspeed);
  if (cores !== undefined) data.cores = Number(cores);
  if (threads !== undefined) data.threads = Number(threads);
  if (tdp !== undefined) data.tdp = Number(tdp);
  if (price_eur !== undefined) data.price_eur = Number(price_eur);
  if (socket_id !== undefined) data.socket_id = Number(socket_id);

  if (Object.keys(data).length === 0) {
    return res.status(400).send("No fields provided to update");
  }

  try {
    const { count } = await prisma.cpus.updateMany({ where: { id }, data });
    if (count === 0) {
      return res.status(404).send("CPU not found");
    }
    const updatedCpu = await prisma.cpus.findUnique({ where: { id } });
    return res.json(updatedCpu);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Oops, something went wrong");
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
