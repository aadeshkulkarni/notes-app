const router = require("express").Router();
const { Note } = require("../db");
const { authorize } = require("../middlewares/auth");
const { validateNote } = require("../middlewares/note");

router.use(authorize)

router.post("/", validateNote, async (req, res) => {
  const note = new Note({
    title: req.body.title,
    createdOn: new Date(),
    isCompleted: req.body.isCompleted,
  });
  try {
    const newNote = await note.save();
    res.status(201).json({
      message: "Note created successfully",
      payload: newNote,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id", validateNote, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (req.body.title) {
      note.title = req.body.title;
    }
    if (req.body.isCompleted !== undefined) {
      note.isCompleted = req.body.isCompleted;
    }

    const updatedNote = await note.save();
    res.json({
      message: "Note has been updated successfully",
      payload: updatedNote,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json({
      payload: notes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    await note.deleteOne();
    res.status(200).json({ message: 'Note has been deleted successfully' });
  } catch (err) {
    res.status(404).json({ message: 'Note not found' });
  }
});

module.exports = router;
