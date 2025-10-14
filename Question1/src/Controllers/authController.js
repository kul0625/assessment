const User = require('../Models/User');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
try {
const { name, email, password } = req.body;
const existing = await User.findOne({ email });
if (existing) return res.status(400).json({ message: 'Email already exists' });


const user = new User({ name, email, password });
await user.save();


const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token, user });
} catch (err) {
res.status(500).json({ message: 'Server error' });
}
};


exports.login = async (req, res) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user || !(await user.comparePassword(password)))
return res.status(401).json({ message: 'Invalid credentials' });


const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token, user });
} catch (err) {
res.status(500).json({ message: 'Server error' });
}
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email');
    res.render('users', { users, user: req.user });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};
