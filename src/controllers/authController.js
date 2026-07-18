const { registerUser, loginUser, getUserById } = require("../services/authService");
const { signupSchema, loginSchema } = require("../validators/authValidator");

exports.signup = async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await registerUser(value);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message || "Unable to create account.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await loginUser(value);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message || "Unable to log in.",
    });
  }
};

exports.me = async (req, res) => {
  try {
    const user = getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Unable to load account." });
  }
};
