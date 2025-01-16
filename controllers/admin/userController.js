const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { User } = require("../../models");

const register = async (req, res) => {
  const data = {
    title: "Admin register page",
    message: "",
    type: "",
  };
  res.render("admin/auth/register", data);
};

const registerPost = async (req, res) => {
    
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({
        where: { email: email }, 
      });
    if (existingUser){
        let data = {
            title: "Admin register page",
            message: "User already exists",
            type: "danger",
          };
          return res.render("admin/auth/register", data);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    let data = {
        title: "Admin register page",
      message: "User registered successfully.",
      type: "success",
    };
    res.render("admin/auth/register", data);
  } catch (error) {
    console.log(error);
    let data = {
        title: "Admin register page",
      message: "Error registering user. Try again.",
      type: "danger",
    };
    res.render("admin/auth/register", data);
  }
};

const login = async (req, res) => {
  const data = {
    title: "Admin login page",
  };
  res.render("admin/auth/login", data);
};

const loginPost = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.render("login", { error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.render("login", { error: "Invalid email or password" });
    }

    req.session.user = { id: user.id, username: user.username };
    res.redirect("/admin");
  } catch (err) {
    res.status(500).send("An error occurred");
  }
};

const dashboard = async (req, res) => {
  try {
    if (!req.session?.user) {
      return res.redirect("/admin/login");
    }
    const data = {
      title: "Dashboard",
      user: req.session?.user,
    };
    console.log("test3");
    res.render("admin/home", data);
  } catch (err) {
    console.log("test4", err);
    res.status(500).send("An error occurred");
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
};

module.exports = {
  register,
  registerPost,
  login,
  loginPost,
  dashboard,
  logout,
};
