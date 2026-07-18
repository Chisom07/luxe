const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const USERS_FILE = path.join(__dirname, "../../data/users.json");
const JWT_SECRET = process.env.JWT_SECRET || "luxe-dev-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const ensureStore = () => {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]", "utf8");
};

const readUsers = () => {
  ensureStore();
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  } catch {
    return [];
  }
};

const writeUsers = (users) => {
  ensureStore();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
};

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

exports.registerUser = async ({ name, email, password }) => {
  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((user) => user.email === normalizedEmail)) {
    const error = new Error("An account with this email already exists.");
    error.status = 409;
    throw error;
  }

  const user = {
    id: uuidv4(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(password, 10),
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  writeUsers(users);

  return {
    user: publicUser(user),
    token: signToken(user),
  };
};

exports.loginUser = async ({ email, password }) => {
  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((entry) => entry.email === normalizedEmail);

  if (!user) {
    const error = new Error("Invalid email or password.");
    error.status = 401;
    throw error;
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    const error = new Error("Invalid email or password.");
    error.status = 401;
    throw error;
  }

  return {
    user: publicUser(user),
    token: signToken(user),
  };
};

exports.verifyToken = (token) => jwt.verify(token, JWT_SECRET);

exports.getUserById = (id) => {
  const user = readUsers().find((entry) => entry.id === id);
  return user ? publicUser(user) : null;
};
