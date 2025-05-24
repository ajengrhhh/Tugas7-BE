import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import Loginroute from "./routes/Loginroute.js";
import NoteRoute from "./routes/NoteRoute.js";


const app = express();
app.set("view engine", "ejs");

dotenv.config();

app.use(cookieParser());
app.use(cors({ credentials:true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.get("/", (req, res) => res.render("index"));
app.use(Loginroute); // <- ini penting
app.use(NoteRoute);  // <- pastikan huruf kecil sesuai import

app.listen(5001, () => console.log("Server connected"));