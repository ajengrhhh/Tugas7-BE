import express from "express";
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} from "../controllers/Notecontroller.js";

const router = express.Router();

// Rute ini sudah berada di bawah "/notes" otomatis
router.get("/", getNotes);           
router.get("/:id", getNoteById);     
router.post("/", createNote);        
router.put("/:id", updateNote);      
router.delete("/:id", deleteNote);   

export default router;
