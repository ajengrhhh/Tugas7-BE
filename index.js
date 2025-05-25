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
app.use(cors({ credentials:true, origin:true }));
app.use(express.json());
app.get("/", (req, res) => res.render("index"));
app.use(Loginroute); // <- ini penting
app.use("/notes", NoteRoute);  // <- pastikan huruf kecil sesuai import

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server connected on port ${PORT}`));