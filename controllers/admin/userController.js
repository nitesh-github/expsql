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
    if (existingUser) {
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
    message: "",
    type: "",
  };
  res.render("admin/auth/login", data);
};

const loginPost = async (req, res) => {
  const { email, password } = req.body;

  let data = {
    title: "Admin login page",
    message: "",
    type: "",
  };

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.render("admin/auth/login", data);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      data = {...data, message:"Invalid password"};
      return res.render("admin/auth/login", data);
    }
    req.session.user = { id: user.id, name: user.name, email:user.email};
    res.redirect("/admin");
  } catch (err) {
    let data = {
      title: "Admin login page",
      message: "Something went wrong. Try again.",
      type: "danger",
    };
    res.render("admin/auth/login", data);
  }
};

const dashboard = async (req, res) => {
  try {
    if (!req.session?.user) {
      return res.redirect("/admin/login");
    }
    const data = {
      title: "Dashboard",
      message: "",
    };
    res.render("admin/home", data);
  } catch (err) {
    res.status(500).send("An error occurred");
  }
};

const logout = (req, res) => {
  const data = {
    title: "Admin login page",
    message: "Logout successfully",
    type: "success",
  };
  req.session.destroy(() => {
    res.render("admin/auth/login",data);
  });
};

const userlist = async (req, res) => {
  const userlist = await User.findAll();
  const data = {
    title: "Users list page",
    message: "",
    type: "",
    userlist : userlist,
  }; 
 res.render("admin/users/userlist",data);
};

const edit = async (req, res) => {
  let id = req.params.id;
  const user = await User.findOne({
    where: { id: id },
  });
  const data = {
    title: "User edit page",
    message: "",
    type: "",
    user : user,
  }; 
 res.render("admin/users/useredit",data);
};

const update = async (req, res) => {
  const userlist = await User.findAll();
  const data = {
    title: "Users list page",
    message: "",
    type: "",
    userlist : userlist,
  }; 
 res.render("admin/users/userlist",data);
};

module.exports = {
  register,
  registerPost,
  login,
  loginPost,
  dashboard,
  logout,
  userlist,
  edit,
  update,
};
