const express = require("express");
const adminController = require("../controllers/admin");
const jwtAuth = require("../middleware/jwtAuth");
const router = express.Router();

// POST Admin signUp
router.post("/signup", adminController.postAdminSignUp);

// POST Admin SignIn
router.post("/signin", adminController.postAdminSignIn);

// GET All Products
router.get("/products", jwtAuth, adminController.adminGetProducts);

// GET Search Product
router.post("/search", jwtAuth, adminController.adminSearchProduct);

// GET Fetch Client
router.get("/clients", jwtAuth, adminController.fetchClients);

// GET Fetch Orders
router.get("/orders", jwtAuth, adminController.fetchOrders);

// POST Add New Product
router.post("/new-product", jwtAuth, adminController.addNewProduct);

// POST Post Image
router.post("/post-images", jwtAuth, adminController.postImages);

// GET Edit Product
router.get("/edit-product/:prodId", jwtAuth, adminController.fetchEditProduct);

// POST Edit Product
router.post("/edit-product/:prodID", jwtAuth, adminController.postEditProduct);

// POST Delete Product
router.delete(
  "/delete-product/:prodId",
  jwtAuth,
  adminController.postDeleteProduct
);

module.exports = router;
