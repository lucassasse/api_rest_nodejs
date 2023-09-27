const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postSignup = (req, res, next) => {
	mysql.getConnection((error, conn) => {
		if(error){ return res.status(500).send({error: error}) }
		conn.query('SELECT * FROM users WHERE email = ?', [req.body.email], (error, result) => {
			if(error){ return res.status(500).send({error: error}) }
			if(result.length > 0){
				res.status(409).send({message: 'User Already Exists'});
			}else{
				bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
					if(errBcrypt){ return res.status(500).send({error: errBcrypt}) }
					conn.query(`INSERT INTO users (email, password) VALUES (?, ?)`,
						[req.body.email, hash],
						(error, result) => {
							conn.release();
							if(error){ return res.status(500).send({error: error}) }
							const response = {
								message: 'User Created Successfully',
								userCreated: {
									id_user: result.insertId,
									email: req.body.email
								}
							}
							return res.status(201).send(response);
						});
				});
			}
		});
	});
};

exports.postLogin = (req, res, next) => {
	mysql.getConnection((error, conn) => {
		if(error){ return res.status(500).send({error: error}) }
			const query = 'SELECT * FROM users WHERE email = ?';
			conn.query(query, [req.body.email], (error, result, field) => {
				conn.release();
				if(error){ return res.status(500).send({error: error}) }
				if(result.length < 1){
					return res.status(401).send({message: 'Authentication Failed'});
				}
				bcrypt.compare(req.body.password, result[0].password, (err, result) => {
					if(err){
						return res.status(401).send({message: 'Authentication Failed'})
					}
					if(result){
						const token = jwt.sign({
							id_user: result.id_user,
							email: result.email
						},
						process.env.JWT_KEY,
						{
							expiresIn: "24h"
						});
						return res.status(200).send({
							message: 'Authentication Successfully',
							token: token
						});
					}
					return res.status(401).send({message: 'Authentication Failed'});
				});
		});
	});
};