import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const sockets = [
    { code: "LGA1700", name: "Intel LGA 1700" },
    { code: "LGA1200", name: "Intel LGA 1200" },
    { code: "AM4", name: "AMD AM4" },
    { code: "AM5", name: "AMD AM5" },
    { code: "TR4", name: "AMD TR4 Threadripper" },
  ];

  for (const s of sockets) {
    await prisma.sockets.upsert({
      where: { code: s.code },
      update: {},
      create: s,
    });
  }

  console.log("Seeded sockets successfully!");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
