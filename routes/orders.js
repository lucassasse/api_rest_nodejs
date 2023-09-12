const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
	mysql.getConnection((error, conn) => {
		if(error){ return res.status(500).send({error: error}) }
		conn.query(
			`SELECT orders.id_order, orders.quantity, products.id_products, products.name, products.price
			FROM orders
				INNER JOIN products
					ON products.id_products = orders.id_product;`,
			(error, result, field) => {
				if(error){ return res.status(500).send({error: error}) }
				const response = {
					orders: result.map(order => {
						return {
							id_order: order.id_order,
							id_product: order.id_product,
							product: {
								name: order.name,
								price: order.price
							},
							quantity: order.quantity,
							request: {
								type: 'GET',
								description: 'Return a order details',
								url: 'http://localhost:3000/orders/' + order.id_order
							}
						}
					})
				}
				return res.status(200).send(response);
			}
		)
	});
});

router.post('/', (req, res, next) => {
	mysql.getConnection((error, conn) => {
		if(error){ return res.status(500).send({error: error}) }
		conn.query('SELECT * FROM products WHERE id_products = ?',
		[req.body.id_product],
		(error, result, field) => {
			if(error){ return res.status(500).send({error: error}) }
			if(result.length == 0){
				return res.status(404).send({
					message: 'Not Found Product with this ID. ID: ' + req.body.id_product
				})
			}
			conn.query(
				'INSERT INTO orders (id_product, quantity) VALUES (?, ?)',
				[req.body.id_product, req.body.quantity],
				(error, result, field) => {
					conn.release(); //liberar rotas para não travar o servidor
					if(error){ return res.status(500).send({error: error}) }
					const response = {
						message: 'Pedido Inserido com Sucesso!',
						productCreate: {
							id_order: result.id_order,
							id_product: result.id_product,
							quantity: req.body.quantity,
							request: {
								type: 'GET',
								description: 'Insert a order',
								url: 'http://localhost:3000/orders/'
							}
						}
					}
					return res.status(201).send(response);
				}
			)
		})
	});
});

router.get('/:id_order', (req, res, next) => {
	mysql.getConnection((error, conn) => {
		if(error){ return res.status(500).send({error: error}) }
		conn.query(
			'SELECT * FROM orders WHERE id_order = ?;',
			[req.params.id_order],
			(error, result, field) => {
				if(error){ return res.status(500).send({error: error}) }

				if(result.length == 0){
					return res.status(404).send({
						message: 'Not Found Order with this ID ' + req.params.id_order
					})
				}

				const response = {
					order: {
						id_order: result[0].id_order,
						id_products: result[0].id_products,
						quantity: result[0].quantity,
						request: {
							type: 'GET',
							description: 'Return a order by id',
							url: 'http://localhost:3000/products/'
						}
					}
				}
				return res.status(200).send(response);
			}
		)
	});
});

router.delete('/', (req, res, next) => {
	mysql.getConnection((error, conn) => {
		if(error){ return res.status(500).send({error: error}) }
		conn.query(
			`DELETE FROM orders WHERE id_order = ?`,
			[req.body.id_order],
			(error, result, field) => {
				conn.release(); //liberar rotas para não travar o servidor
				if(error){ return res.status(500).send({error: error}) }

				const response = {
					message: 'Pedido Excluído com Sucesso!',
					request: {
						type: 'POST',
						description: 'Delete/Insert a order',
						url: 'http://localhost:3000/products/',
						body: {
							id_product: 'Number',
							quantity: 'Number'
						}
					}
				}

				return res.status(202).send(response);
			}
		)
	});
});

module.exports = router;