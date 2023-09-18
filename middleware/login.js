const jwt = require('jsonwebtoken');

exports.mandatory = (req, res, next) => {
	try{
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.user = decoded;
		next();
	} catch(error){
		return res.status(401).send({message: 'Authentication Failed'});
	}
};

exports.optional = (req, res, next) => {
	try{
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.user = decoded;
		next();
	} catch(error){
		next();
	}
};