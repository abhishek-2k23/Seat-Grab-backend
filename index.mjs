//  CREATE TABLE seats (
//      id SERIAL PRIMARY KEY,
//      name VARCHAR(255),
//      isbooked INT DEFAULT 0
//  );
// INSERT INTO seats (isbooked)
// SELECT 0 FROM generate_series(1, 20);

import express from "express";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.mjs";
import router from "./auth/auth.routes.mjs";
import bookingController from "./booking/booking.controller.mjs";
import fs from "fs";
import { query } from "./config/db.mjs";
import { authenticate } from "./auth/auth.middleware.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 8080;

const app = new express();
app.use(express.json());
app.use(cors());

//connect DB
await connectDB();

//run migration
const runMigration = async () =>{
  const sql = fs.readFileSync("./migration/init.sql").toString();
  await query(sql);
  console.log("migration completed")
}
  
await runMigration();

app.use("/auth", router);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//get all seats
app.get("/seats", bookingController.getSeats);

//book a seat give the seatId and your name
app.put("/:id/:name", authenticate, bookingController.bookSeats);

//reset seats
app.put("/reset-seats", bookingController.resetSeats);

app.listen(port, () => console.log("Server starting on port: " + port));
