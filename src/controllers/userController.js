const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const {
    email,
    password,
    name,
    phone,
    gender,
    birthdate,
    address: { address1, address2, district, province, postcode },
  } = req.body;

  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ error: 'Email, password, and name are required fields' });
  }

  // Check if email or name already exists in the database
  const targetEmail = await User.checkDuplicateField('email', email);
  const targetName = await User.checkDuplicateField('name', name);

  if (targetEmail || targetName) {
    // Email or name already exists
    return res.status(400).json({ error: 'Email or name is already taken' });
  } else {
    try {
      const salt = bcryptjs.genSaltSync(12);
      const hashedPassword = bcryptjs.hashSync(password, salt);
      // Create a new user instance
      const newUser = await User.createUser({
        email: email,
        password: hashedPassword,
        name: name,
        phone: phone || '',
        gender: gender || '',
        birthdate: birthdate || null,
        address: {
          address1: address1 || '',
          address2: address2 || '',
          district: district || '',
          province: province || '',
          postcode: postcode || '',
        },
        create_date: new Date(), // Add the current timestamp
      });

      // Registration successful
      return res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
      // Error occurred while saving the user to the database
      console.error('Error occurred during user registration:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const targetUser = await User.getUserByEmail(email);
  if (!targetUser) {
    res.status(400).json({ message: "Email or Password didn't exist" });
  } else {
    const isCorrectPassword = bcryptjs.compareSynce(
      password,
      targetUser.password
    );
    if (isCorrectPassword) {
      const payload = {
        name: targetUser.name,
        id: targetUser._id,
      };
      const token = jwt.sign(payload, 'bbad', { expiresIn: 3600 });

      res.status(200).send({
        token: token,
        message: 'Login successful.',
      });
    } else {
      res.status(400).json({ message: "Email or Password didn't exist" });
    }
  }
};
