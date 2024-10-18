const bcrypt = require("bcryptjs");
const User = require("../model/user");
const { Category, subCategory, product } = require("../model/Products-db");

module.exports = controllers = {
  getindex: async (req, res) => {
    try {
      const Products = await product
        .find()
        .populate("category")
        .populate("subcategory");

      res.render("index", {
        isAuth: req.session.isAuth,
        message: req.session.message,
        Products,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("server error in index");
    }
  },
  getsignup: (req, res) => {
    const error = req.session.error1;
    req.session.error1 = null;
    res.render("admin/admin-signup", { error: error || {} });
  },
  getlogin: (req, res) => {
    if (req.session.isAuth) {
      return res.render("admin", {
        isAuth: req.session.isAuth,
        message: req.session.message,
      });
    }
    const error = req.session.error1;
    req.session.error1 = null;
    res.render("login", { error: error || {} });
  },
  getcontact: (req, res) => {
    res.render("contact", { isAuth: req.session.isAuth });
  },

  getcategories: async (req, res) => {
    try {

      const categoryId = req.params.categoryId;
      const categories = await Category.find()
      const Products = await product
        .find({ category: categoryId })
        .populate("subcategory");

        // console.log("products",Products);
          
        res.render('categories', {isAuth: req.session.isAuth, Products, categories});
    } catch (error) {
      console.error("Error fetching products by category:", error);
      res.status(500).send("Server error");
    }
  },
  getsingle: async (req, res) => {
    try {
      const productId = req.params.productId;
      const Product = await product.findById(productId);
      console.log("p id: " , productId);
      
      if(!Product){
        res.status(404).send('product not found')
      }
    res.render("single", { isAuth: req.session.isAuth, Product });
    
    } catch (error) {
      
    }
  },

  postsignup: async (req, res) => {
    console.log("signup");
    const { name, email, password, password2 } = req.body;
    console.log(req.body);

    const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passFormat =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    req.session.error1 = {};

    if (name === "") {
      req.session.error1.nameError = "Name cannot be empty";
    }

    if (email === "") {
      req.session.error1.emailError = "Email cannot be empty";
    } else if (!emailFormat.test(email)) {
      req.session.error1.emailError = "Type a valid email";
    }

    if (password === "") {
      req.session.error1.passwordError = "Password cannot be empty";
    } else if (!passFormat.test(password)) {
      req.session.error1.passwordError = "Password format is incorrect";
    }

    if (password2 !== password) {
      req.session.error1.password2Error = "Passwords do not match";
    }

    if (Object.keys(req.session.error1).length > 0) {
      return res.redirect("/index/signup");
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ name, email, password: hashedPassword });
      res.redirect("/index/login");
    } catch (err) {
      console.error("Error during signup:", err);
      if (err.code === 11000) {
        req.session.error1.emailError = "Email is already in use";
      } else {
        req.session.error1.generalError = "An error occurred during signup";
      }
      res.redirect("/index/signup");
    }
  },

  postlogin: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        req.session.error1 = {
          type: "email",
          message: "Email is not registered",
        };
        return res.redirect("/index/login");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        req.session.error1 = {
          type: "password",
          message: "Password is incorrect",
        };
        return res.redirect("/index/login");
      }

      req.session.isAuth = true;
      req.session.userId = user._id;
      req.session.message = `Welcome ${user.name}`;
      res.redirect("/index");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect("/");
      }
      res.clearCookie("connect.sid");
      res.redirect("/index/login");
    });
  },
};
