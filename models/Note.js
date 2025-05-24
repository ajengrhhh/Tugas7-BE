import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Note = db.define("Note", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default Note;
