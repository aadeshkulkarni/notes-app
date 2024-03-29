const { z } = require("zod");

const noteSchema = z.object({
  title: z.string().nonempty("Title is required"),
  isCompleted: z.boolean().default(false),
});

const validateNote = (req, res, next) => {
  try {
    noteSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ message: error.errors });
  }
};

module.exports = { validateNote }