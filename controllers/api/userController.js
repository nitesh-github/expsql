const { User } = require("../../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');


const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ status: false, message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ status: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: 'Error registering user' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ status: false, message: 'Invalid credentials' });

    if (user?.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ status: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user?._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    let userinfo = {
      _id: user?._id,
      name: user?.name,
      email: user?.email
    }
    return res.status(200).json({ status: true, token, data: userinfo, message: 'User logged in successfully.' });
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

const uploadUserCsv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    const imageName = req.file.filename;
    const filePath = req.file.path;
    // Start a worker thread to process the CSV file
    const worker = new Worker(path.join(__dirname, 'worker.js'), {
      workerData: { filePath, imageName }
    });

    // Listen for messages from the worker thread
    worker.on('message', (result) => {
      if (result.status === 'success') {
        // Handle the successful file processing
        console.log(result.testmsg)
        return res.status(200).json({
          message: "CSV file uploaded and processed successfully!",
          data: result.data,
          test:result.testmsg
        });
      } else {
        return res.status(500).json({
          status: false,
          message: "Error processing file in worker thread.",
        });
      }
    });

    worker.on('error', (err) => {
      console.error('Worker thread error:', err);
      return res.status(500).json({
        status: false,
        message: "Error in worker thread.",
      });
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker thread exited with code ${code}`);
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Error in uploading csv data.' });
  }
};


const uploadUserCsvWithoutWorker = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", async (data) => {
        let newdata = { name: data.Name, email: data.Email };
        await User.upsert(newdata);
        results.push(data)
      })
      .on("end", () => {
        const imageName = req.file?.filename;
        const oldImagePath = path.join(process.cwd(), 'public/uploads/', imageName);
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error('Error deleting old file:', err);
            } else {
              console.log('Old file deleted successfully');
            }
          });
        }
        return res.status(200).json({ message: "CSV file uploaded successfully!", data: results});
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Error in uploading csv data.' });
  }
};

module.exports = {
  register,
  login,
  getUser,
  getUserList,
  uploadUserCsv
};
