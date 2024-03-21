const User = require('../models/Users');
const validator = require('validator');

const nameRegex = /^[a-zA-Z\s]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


exports.createUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate input
    if (!fullName || !email || !password) {
        return res.status(400).send({ message: 'Please provide all required fields' });
    }

    // Email validation
    if (!emailRegex.test(email)) {
        return res.status(400).send({ message: 'Invalid email format' });
    }

    // Full name validation
    if (!nameRegex.test(fullName)) {
        return res.status(400).send({ message: 'Invalid full name' });
    }

    // Password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
    if (!passwordRegex.test(password)) {
        return res.status(400).send({ message: 'Password must be at least 8 characters long and include uppercase letters, lowercase letters, and numbers' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ fullName, email, password });
    await user.save();

    res.status(201).send({ message: 'User created successfully', user });
} catch (error) {
    res.status(500).send({ message: 'Error creating user', error: error.message });
}

};

exports.updateUser = async (req, res) => {
  try {
    const { email, fullName, newPassword } = req.body;

    // Validate input
    if (!email || (!fullName && !newPassword)) {
        return res.status(400).send({ message: 'Please provide the email and the field(s) to update' });
    }

    // Full name validation
    if (fullName && !nameRegex.test(fullName)) {
        return res.status(400).send({ message: 'Invalid full name' });
    }

    // Password validation
    if (newPassword && !passwordRegex.test(newPassword)) {
        return res.status(400).send({ message: 'Invalid password format' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    // Update user details
    if (fullName) {
        user.fullName = fullName;
    }
    if (newPassword) {
        user.password = await bcrypt.hash(newPassword, 10);
    }
    await user.save();

    res.status(200).send({ message: 'User updated successfully', user });
} catch (error) {
    res.status(500).send({ message: 'Error updating user', error: error.message });
}
};


exports.deleteUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
        return res.status(400).send({ message: 'Please provide the email of the user to delete' });
    }

    // Find and delete user
    const user = await User.findOneAndDelete({ email });
    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
      res.status(500).send({ message: 'Error deleting user', error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
        const users = await User.find({}, 'fullName email password');
        res.status(200).send({ message: 'Users retrieved successfully', users });
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving users', error: error.message });
    }
};


exports.uploadImage = async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).send({ message: 'No image file provided' });
      }

      const imagePath = req.file.path;

      res.status(201).send({ message: 'Image uploaded successfully', imagePath });
  } catch (error) {
      res.status(500).send({ message: 'Error uploading image', error: error.message });
  }
}