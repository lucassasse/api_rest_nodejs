const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/orders.controller');

router.get('/', OrdersController.getOrders);
router.get('/:id_order', OrdersController.getOneOrder);
router.post('/', OrdersController.postOrder);
router.delete('/', OrdersController.deleteOrder);

module.exports = router;