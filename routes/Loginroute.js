import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  loginHandler,
  logout,
} from "../controllers/logincontroller.js";
import { refreshToken } from "../controllers/Refreshtoken.js";
import { verifyToken } from "../middleware/Verifytoken.js";

const router = express.Router();

//endpoint akses token
router.get("/token", refreshToken);
//endpoin auth
router.post("/login", loginHandler);
router.delete("/logout", logout);

//endpoint data biasa
router.post("/register", createUser); //tambah user
router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUserById);
router.put("/edit-user/:id", verifyToken, updateUser);
router.delete("/delete-user/:id", deleteUser);

export default router;
