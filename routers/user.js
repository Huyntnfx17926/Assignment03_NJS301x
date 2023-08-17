const express = require("express");
const userController = require("../controllers/user");
const jwtAuth = require("../middleware/jwtAuth");
const router = express.Router();

// GET Response
router.get("/", userController.getResponse);

// GET All Product
router.get("/products", userController.getAllProducts);

// GET Product details
router.get("/products/:prodId", userController.getProductDetails);

// POST Add Product to cart
router.post("/add-to-cart", jwtAuth, userController.addProductToCart);

// GET get items from user's cart
router.get("/carts", jwtAuth, userController.getCart);

// DELETE Delete Cart
router.delete("/carts/delete", jwtAuth, userController.deleteCart);

// PUT edit cart
router.put("/carts/update", jwtAuth, userController.editCart);

// POST Order
router.post("/email", jwtAuth, userController.postEmail);

// GET user's Order History
router.get("/histories", jwtAuth, userController.getHistory);

// GET Products for shop Page
router.get("/products/pagination", userController.getPagination);

// POST Create new chat room
router.post(
  "/chatrooms/createNewRoom",
  jwtAuth,
  userController.createNewChatRoom
);

// GET Chat Room id
router.get("/chatrooms/getById", jwtAuth, userController.getChatRoomId);

// PUT Add Message to chat room
router.put("/chatrooms/addMessage", jwtAuth, userController.addMessage);

module.exports = router;
