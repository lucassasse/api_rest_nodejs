const express = require('express');
const router = express.Router();
const multer = require('multer'); // para trabalhar com form-data
const login = require('../middleware/login');

const ProductsController = require('../controllers/products.controller');

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, './uploads/');
	},
	filename: function(req, file, cb){ //Pegar nome e extensão do arquivo
		cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
	}
});

const fileFilter = (req, file, cb) => { //Filtrar arquivos
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
		cb(null, true);
	} else{
		cb(null, false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5 // 5MB
	},
	fileFilter: fileFilter
});

router.get('/', ProductsController.getProducts);
router.get('/:id_product', ProductsController.getOneProduct);
router.post(
	'/',
	login.mandatory,
	upload.single('img_product'),
	ProductsController.postProduct
);
router.patch('/', login.mandatory, ProductsController.updateProduct);
router.delete('/', login.mandatory, ProductsController.deleteProduct);

module.exports = router;