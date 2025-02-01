const { User } = require("../../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({where : { email }});
    if (existingUser) return res.status(400).json({ status: false, message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ status: true,token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: 'Error registering user' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ status: false,message: 'Invalid credentials' });

    if(user?.password){
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ status: false, message: 'Invalid credentials' });
    }    

    const token = jwt.sign({ userId: user?._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    let userinfo = {
      _id:user?._id,
      name:user?.name,
      email:user?.email
    }
    return res.status(200).json({ status: true, token, data : userinfo, message: 'User logged in successfully.' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error logging in' });
  }
};

const getUser = async (req, res) => {
  try {
    return res.status(200).json({ status: true, user: req.user });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Error fetching user profile' });
  }
};

const getUserList = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json({ status: true, data: users });
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Error fetching user profile' });
  }
};

module.exports = {
    register,
    login,
    getUser,
    getUserList
  };
