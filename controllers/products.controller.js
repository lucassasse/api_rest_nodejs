const mysql = require('../mysql').pool;

exports.getProducts = (req, res, next) => {
	mysql.getConnection((error, conn) => {
		if(error){ return res.status(500).send({error: error}) }
		conn.query(
			'SELECT * FROM products;',
			(error, result, field) => {
				if(error){ return res.status(500).send({error: error}) }
				const response = {
					quantity: result.length,
					product: result.map(prod => {
						return {
							id_products: prod.id_products,
							name: prod.name,
							price: prod.price,
							img_product: prod.img_product,
							request: {
								type: 'GET',
								description: 'Return a products details',
								url: 'http://localhost:3000/products/' + prod.id_products
							}
						}
					})
				}
				return res.status(200).send({response});
			}
		)
	});
};

exports.getOneProduct = (req, res, next) => {
	mysql.getConnection((error, conn) => {
		if(error){ return res.status(500).send({error: error}) }
		conn.query(
			'SELECT * FROM products WHERE id_products = ?;',
			[req.params.id_product],
			(error, result, field) => {
				if(error){ return res.status(500).send({error: error}) }

				if(result.length == 0){
					return res.status(404).send({
						message: 'Not Found Product with this ID'
					})
				}

				const response = {
					product: {
						id_products: result[0].id_products,
						name: result[0].name,
						price: result[0].price,
						img_product: result[0].img_product,
						request: {
							type: 'GET',
							description: 'Return a product by id',
							url: 'http://localhost:3000/products/'
						}
					}
				}
				return res.status(200).send(response);
			}
		)
	});
};

exports.postProduct = (req, res, next) => {
	mysql.getConnection((error, conn) => {
		if(error){ return res.status(500).send({error: error}) }
		conn.query(
			'INSERT INTO products (name, price, img_product) VALUES (?,?,?)',
			[
				req.body.name,
				req.body.price,
				req.file.path
			],
			(error, result, field) => {
				conn.release(); //liberar rotas para não travar o servidor
				if(error){ return res.status(500).send({error: error}) }
				const response = {
					message: 'Produto Inserido com Sucesso!',
					productCreate: {
						id_products: result.id_products,
						name: req.body.name,
						price: req.body.price,
						img_product: req.file.path,
						request: {
							type: 'POST',
							description: 'Insert a product',
							url: 'http://localhost:3000/products/'
						}
					}
				}
				return res.status(201).send(response);
			}
		)
	});
};

exports.updateProduct = (req, res, next) => {
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

				const response = {
					message: 'Produto Alterado com Sucesso!',
					productUpdated: {
						id_products: req.body.id_products,
						name: req.body.name,
						price: req.body.price,
						request: {
							type: 'PATCH',
							description: 'Update a product_id: ' + req.body.id_products,
							url: 'http://localhost:3000/products/' + req.body.id_products
						}
					}
				}

				return res.status(202).send(response);
			}
		)
	});
};

exports.deleteProduct = (req, res, next) => {
	mysql.getConnection((error, conn) => {
		if(error){ return res.status(500).send({error: error}) }
		conn.query(
			`DELETE FROM products WHERE id_products = ?`,
			[req.body.id_products],
			(error, result, field) => {
				conn.release(); //liberar rotas para não travar o servidor
				if(error){ return res.status(500).send({error: error}) }

				const response = {
					message: 'Produto Excluído com Sucesso!',
					request: {
						type: 'POST',
						description: 'Delete/Insert a product',
						url: 'http://localhost:3000/products/',
						body: {
							name: 'String',
							price: 'Number'
						}
					}
				}

				return res.status(202).send(response);
			}
		)
	});
};