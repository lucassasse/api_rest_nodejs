const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).send({
		message: 'Using GET into route /orders'
	});
});

router.post('/', (req, res, next) => {
	const order = {
		id_product: req.body.id_product,
		quantity_products: req.body.quantity
	};

	res.status(201).send({
		message: 'Using POST into route /orders',
		orderCreate: order
	});
});

router.get('/:id_order', (req, res, next) => {
	const id = req.params.id_order;

	if(id === 'especial'){
		res.status(200).send({
			message: 'Using GET into route /orders/:id_order - special order',
			id: id
		});
	} else{
		res.status(200).send({
			message: 'Using GET into route /orders/:id_order - normal order',
			id: id
		});
	}
});

router.delete('/', (req, res, next) => {
	res.status(200).send({
		message: 'Using DELETE into route /orders'
	});
});

module.exports = router;