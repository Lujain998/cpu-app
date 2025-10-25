-- CreateTable
CREATE TABLE "cpus" (
    "id" SERIAL NOT NULL,
    "brand" VARCHAR(250) NOT NULL,
    "model" VARCHAR(250) NOT NULL,
    "clockspeed" DECIMAL(5,2),
    "cores" INTEGER,
    "threads" INTEGER,
    "tdp" INTEGER,
    "price_eur" DECIMAL(10,2),
    "socket_id" INTEGER,

    CONSTRAINT "cpus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sockets" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "sockets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fki_fk_socket" ON "cpus"("socket_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_code" ON "sockets"("code");

-- AddForeignKey
ALTER TABLE "cpus" ADD CONSTRAINT "fk_socket" FOREIGN KEY ("socket_id") REFERENCES "sockets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
