const {Category , subCategory , product} = require('../model/Products-db');
const adminUser = require('../model/admin-users');
const User = require('../model/user');
const customer = require('../model/user')
const bcrypt = require('bcryptjs');

const adminController = {

  getadmin:async (req, res) => {
    const admin = await adminUser.findById(req.session.userId)
      res.render('admin/admin', {
        isAuth: req.session.isAuth,
        admin: admin
      });
  },

  getadminlogin: async(req, res)=>{
    try {

      if (req.session.isAuth) {
        return res.render('admin/admin', { isAuth: req.session.isAuth, message: req.session.message });
        }
        const error = req.session.error1;
        req.session.error1 = null;
        res.render("admin/admin-login", { error: error || {} });
      } catch (error) {
        console.error(error);
        res.status(500).send('error fetching admin login');
    }
  },
  
  getadminsignup: async(req, res)=>{
    try {
      const error = req.session.error1;
      req.session.error1 = null;
      res.render("admin/admin-signup", { error: error || {} });
    } catch (error) {
      console.error(error);
      res.status(500).send('error fetching admin login');
    }
  },

  getadminProducts: async (req, res) => {
    try {
      const admin = await adminUser.findById(req.session.userId);
      const products = await product.find()
      .populate('category')
      .populate('subcategory')
      .exec();
      // console.log("products: ",products);
     
      res.render('admin/admin-products', { 
        isAuth: req.session.isAuth,
        admin: admin,
        product: products,
      });
      // console.log("product:  ",Product);
    } catch (error) {
      console.error(error);
      res.status(500).send('error fetching products');
    }
  },

  getadminCategories: async (req, res) => {
    try {
      const admin = await adminUser.findById(req.session.userId)
      const categoriesWithSubcategories = await Category.aggregate([
        {
          $lookup: {
            from: 'subcategories', // The name of the Subcategory collection
            localField: '_id', // Field from the Category collection
            foreignField: 'parentCategory', // Field from the Subcategory collection
            as: 'subcategories' // Field to add to the Category documents
          }
        },
       {
          $project:{
            name:1,
            subcategories:1
          }
        }
      ]);
      // console.log(subcategories);
      const cat = await Category.find()
      const subcat = await subCategory.find()
      // console.log(cat);
      
      res.render('admin/admin-categories', { isAuth: req.session.isAuth,
        isAuth: req.session.isAuth,
      categoriesWithSubcategories,
      admin,
      cat,
      subcat
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('error fetching categories');
    }
  },

  getadminUsers: async (req, res) => {
    try {
      const users = await adminUser.find();
      const customers = await customer.find();
      const custlength = customers.length;
      const adminlength = users.length;
      const admin = await adminUser.findById(req.session.userId)
      // console.log(admin.name);
      res.render('admin/admin-users', { 
        isAuth: req.session.isAuth,
        users: users,
        customers: customers,
        custlength: custlength,
        adminlength: adminlength,
        admin: admin
      });
      // console.log("customers  : ",customers);
      // console.log("admins : ", users);

    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching users');
    }
  },

  getadminOrders: async (req, res) =>{
    try {
      const admin = await adminUser.findById(req.session.userId)
      res.render('admin/adminOrders', { 
        isAuth: req.session.isAuth,
        admin: admin
      })
    } catch (error) {
      console.log(error);
      res.status(500).send('error fetching orders');
    }
  },

  getaddproduct: async (req,res)=>{
    try {
      const admin = await adminUser.findById(req.session.userId)
      const categories = await Category.find();
      const subcategories = await subCategory.find();
      const Product = await product.find();

      
      res.render('admin/add-product',{
        isAuth: req.session.isAuth,
        admin: admin,
        categories: categories,
        subcategories: subcategories,
        product: Product
      })
    } catch (error) {
      console.log(error);
      res.status(500).send('error in111 addproduct');
    }
  },


  addProduct: async(req,res)=>{
    try {
      const {productName, productDescription, category, subcategory, price} = req.body;
      const productImage = req.file.filename;

      const newProduct = new product({
        name: productName,
        description: productDescription,
        category: category,
        subcategory: subcategory,
        price: price,
        image: productImage
      })
      await newProduct.save();

      res.redirect('/admin/admin-products');
    } catch (error) {
      console.log('error in add product',error);
      res.status(500).send('error in addProduct function');
    }
  },
  
  getSubCategories: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const subcategories = await subCategory.find({ parentCategory: categoryId });
      res.json({ success: true, subcategories });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: 'Error fetching subcategories' });
    }
  },

  getCategoriesWithSubcategories: async (req, res) => {
    try {
      const categories = await Category.find().populate('subcategories');
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).send('error fetching categories with subcategories');
    }
  },



  postadminsignup: async (req, res) => {
    const { name, email, password, password2 } = req.body;
    req.session.error1 = {};
    // Validate name
    if (!name) {
        req.session.error1.nameError = "Name cannot be empty";
    }
    // Validate email
    if (!email) {
        req.session.error1.emailError = "Email cannot be empty";
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        req.session.error1.emailError = "Type a valid email";
    }
    // Validate password
    if (!password) {
        req.session.error1.passwordError = "Password cannot be empty";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        req.session.error1.passwordError = "Password format is incorrect";
    }
    // Validate password confirmation
    if (password2 !== password) {
        req.session.error1.password2Error = "Passwords do not match";
    }
    // If there are errors, redirect back to the signup page
    if (Object.keys(req.session.error1).length > 0) {
        return res.redirect('/admin/admin-signup');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await adminUser.create({ name, email, password: hashedPassword });
        res.redirect('/admin/admin-login');
    } catch (err) {
        console.error("Error during signup:", err);
        if (err.code === 11000) {
            req.session.error1.emailError = 'Email is already in use';
        } else {
            req.session.error1.generalError = 'An error occurred during signup';
        }
        res.redirect('/admin/admin-signup');
    }
  },

  postadminlogin: async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await adminUser.findOne({ email });

        if (!user) {
            req.session.error1 = { type: 'email', message: 'Email is not registered' };
            return res.redirect('/admin/admin-login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.session.error1 = { type: 'password', message: 'Password is incorrect' };
            return res.redirect('/admin/admin-login');
        }

        req.session.isAuth = true;
        req.session.userId = user._id;
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('server error in postlogin');
    }
  },

  adminlogout: (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/admin/admin-login');
    });
  },

  addCategory : async (req , res) => {
    // console.log(req.body)
    const duplicate = await Category.findOne({name : req.body?.catName})
    if(!duplicate){
      const newCat = new Category({name : req.body?.catName})
      await newCat.save()
    //  const updatedCategory=await Category.find()
    //  console.log(updatedCategory);
      res.json({success : true , newCat})
    }else {
      res.json({success : false , message : 'name already exists'})
    }
},

addsubcategory: async (req, res) => {
  try {
    const duplicate = await subCategory.findOne({ name: req.body.subcatName, parentCategory: req.body.parentCategory });
    if (!duplicate) {
      const newSubCat = new subCategory({ name: req.body.subcatName, parentCategory: req.body.parentCategory });
      await newSubCat.save();
      // const updatedSubcategories = await subCategory.find({ parentCategory: req.body.parentCategory });
      res.json({ success: true, newSubCat });
    } else {
      res.json({ success: false, message: 'Subcategory name already exists' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding subcategory');
  }
},

editCategory: async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    // Ensure the operation is awaited
    const updatedCat = await Category.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedCat) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, updatedCat });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in editCategory");
  }
},

editsubCategory: async (req,res)=>{
  try {
    const { id } = req.params;
    // console.log("subcat id : ",id);

    const updatedsubCat = await subCategory.findByIdAndUpdate(id, req.body, { new: true});

    if(!updatedsubCat){
      return res.status(404).json({ success: false, message: "subcategory not found"})
    }
    res.json({ success:true, updatedsubCat});
    
  } catch (error) {
    console.status(500).send("error in editsubcategory ");
  }
},
deletesubCategory: async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("id :",id);

    const deletedSubCat = await subCategory.findByIdAndDelete(id);

    if (!deletedSubCat) {
      return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    res.json({ success: true, deletedSubCat });
  } catch (err) {
    console.error("Error in deleting subcategory:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
},

deleteProduct: async (req,res)=>{
  try {
    const id = req.params.id;

  const deletedProduct = await product.findByIdAndDelete(id);

  if(!deletedProduct){
    return res.status(404).json({success: false, message: 'Product not found'});
  }
  res.json({success: true, deletedProduct})
  } catch (error) {
    res.status(404).send("error in deleting product",error);
  }
  
},

  blockOrUnblockCustomer: async (req, res) => {
    try {
      const { userId, blockStatus } = req.body;

      const customer = await User.findByIdAndUpdate(userId, { blocked: blockStatus }, { new: true });

      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }

      res.json({ success: true, customer });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },


};

module.exports = adminController;
