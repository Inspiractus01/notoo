export function getCommentsByPlantId(req, res) {
  const { plantId } = req.query;
  res.json({ message: `All comments for plant ${plantId}` });
}

export function getCommentById(req, res) {
  const { id } = req.params;
  res.json({ message: `Return comment with id ${id}` });
}

export function createComment(req, res) {
  const comment = req.body;
  res.status(201).json({ message: "Comment created", comment });
}

export function updateComment(req, res) {
  const { id } = req.params;
  const updated = req.body;
  res.json({ message: `Comment ${id} updated`, updated });
}

export function deleteComment(req, res) {
  const { id } = req.params;
  res.json({ message: `Comment ${id} deleted` });
}
