const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
	mysql.getConnection((error, conn) => {
		if(error){ return res.status(500).send({error: error}) }
		conn.query(
			'SELECT * FROM products;',
			(error, result, field) => {
				if(error){ return res.status(500).send({error: error}) }
				return res.status(200).send({response: result});
			}
		)
	});
});

router.post('/', (req, res, next) => {
	mysql.getConnection((error, conn) => {
		if(error){ return res.status(500).send({error: error}) }
		conn.query(
			'INSERT INTO products (name, price) VALUES (?, ?)',
			[req.body.name, req.body.price],
			(error, result, field) => {
				conn.release(); //liberar rotas para não travar o servidor
				if(error){ return res.status(500).send({error: error}) }

				res.status(201).send({
					message: 'Produto Inserido com Sucesso!',
					productCreate: result
				});
			}
		)
	});
});

router.get('/:id_product', (req, res, next) => {
	mysql.getConnection((error, conn) => {
		if(error){ return res.status(500).send({error: error}) }
		conn.query(
			'SELECT * FROM products WHERE id_products = ?;',
			[req.params.id_product],
			(error, result, field) => {
				if(error){ return res.status(500).send({error: error}) }
				return res.status(200).send({response: result});
			}
		)
	});
});

router.patch('/', (req, res, next) => {
	mysql.getConnection((error, conn) => {
		if(error){ return res.status(500).send({error: error}) }
		conn.query(
			`UPDATE products
				SET name = ?,
					price = ?
				WHERE id_products = ?`,
			[
				req.body.name,
				req.body.price,
				req.body.id_products
			],
			(error, result, field) => {
				conn.release(); //liberar rotas para não travar o servidor
				if(error){ return res.status(500).send({error: error}) }

				res.status(202).send({
					message: 'Produto Alterado com Sucesso!',
				});
			}
		)
	});
});

router.delete('/', (req, res, next) => {
	mysql.getConnection((error, conn) => {
		if(error){ return res.status(500).send({error: error}) }
		conn.query(
			`DELETE FROM products WHERE id_products = ?`,
			[req.body.id_products],
			(error, result, field) => {
				conn.release(); //liberar rotas para não travar o servidor
				if(error){ return res.status(500).send({error: error}) }

				res.status(202).send({
					message: 'Produto Excluído com Sucesso!',
				});
			}
		)
	});
});

module.exports = router;