import Note from "../models/Note.js";

// ✅ Get all notes
export const getNotes = async (req, res) => {
    try {
        const notes = await Note.findAll();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Get note by ID
export const getNoteById = async (req, res) => {
    try {
        const note = await Note.findByPk(req.params.id);
        if (!note) return res.status(404).json({ error: "Note not found" });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Create a new note
export const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        const note = await Note.create({ title, content });
        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Update a note by ID
export const updateNote = async (req, res) => {
    try {
        const note = await Note.findByPk(req.params.id);
        if (!note) return res.status(404).json({ error: "Note not found" });

        await note.update(req.body);
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Delete a note by ID
export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findByPk(req.params.id);
        if (!note) return res.status(404).json({ error: "Note not found" });

        await note.destroy();
        res.json({ message: "Note deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
