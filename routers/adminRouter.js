
const express = require('express');
const adminRouter = express.Router();
const upload = require('../utils/multer');
const adminController = require('../controllers/adminController');
const isAuth = require('../middleware/middleware');

 
adminRouter

  .get('/',isAuth, adminController.getadmin)
  .get('/admin-login', adminController.getadminlogin)
  .get('/admin-signup', adminController.getadminsignup)
  .get('/admin-products', isAuth, adminController.getadminProducts)
  .get('/admin-categories',isAuth, adminController.getadminCategories)
  .get('/admin-users',isAuth, adminController.getadminUsers)
  .get('/adminOrders',isAuth, adminController.getadminOrders)
  .get('/categories-subcategories', adminController.getCategoriesWithSubcategories)
  .get('/add-product', isAuth, adminController.getaddproduct)
  .get('/adminlogout', adminController.adminlogout)
  .get('/get-subcategories/:categoryId', adminController.getSubCategories)
  .get('/admin/get-subcategories/:categoryId',adminController.getSubCategories)

  .post('/admin-login', adminController.postadminlogin)
  .post('/admin-signup', adminController.postadminsignup)
  .post('/add-category', adminController.addCategory)
  .post('/add-subcategory' , adminController.addsubcategory)
  .post('/block-customer', adminController.blockOrUnblockCustomer)
  .post('/add-product', upload.single('productImage'),adminController.addProduct)

  .put('/edit-category/:id', adminController.editCategory)  
  .put('/edit-subcategory/:id', adminController.editsubCategory)

  .delete('/delete-subcategory/:id', adminController.deletesubCategory)
  .delete('/delete-product/:id', adminController.deleteProduct)


module.exports = adminRouter;
