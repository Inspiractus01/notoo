export function getAllUsers(req, res) {
  res.json({ message: "Return all users" });
}

export function getUserById(req, res) {
  const { id } = req.params;
  res.json({ message: `Return user with id ${id}` });
}

export function createUser(req, res) {
  const user = req.body;
  res.status(201).json({ message: "User created", user });
}

export function updateUser(req, res) {
  const { id } = req.params;
  const updated = req.body;
  res.json({ message: `User ${id} updated`, updated });
}

export function deleteUser(req, res) {
  const { id } = req.params;
  res.json({ message: `User ${id} deleted` });
}
