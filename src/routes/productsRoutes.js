const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require("path");
const { body } = require("express-validator");
const productsControllers = require("../controllers/productsControllers");
const { route } = require("express/lib/application");

//Seteo de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, path.join(__dirname, "../../public/img"))
    },

    filename: (req, file, cb) =>{
        const newFileName = 'producto_' + Date.now() + path.extname(file.originalname);
        cb(null, newFileName)
    }
})

const upload = multer({ storage })

//Defino validaciones del formulario
let validateProduct = [
    body('name').notEmpty().withMessage("El nombre del producto es obligatorio"), 
    body('price').notEmpty().withMessage("El precio del producto es un campo obligatorio"),
    body('category').notEmpty().withMessage("Debe seleccionar una categoría"),
    body('description').notEmpty().withMessage("La descripción del producto es obligatoria"),
    body('image').custom((value, { req }) => {
        let file = req.file;
        let acceptedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        if(!file){
            throw new Error('Debe seleccionar una imagen');
        }else{
            let fileExtension = path.extname(file.originalname);
            if(!acceptedExtensions.includes(fileExtension)){
                throw new Error('Debe seleccionar una imagen con una extensión válida');
            }else{
                return true;
            }
        }
    }),
    body('stock').notEmpty().withMessage("El stock del producto es obligatorio")
]

//Rutas
router.get("/", productsControllers.products);
router.get("/detail/:id?", productsControllers.productDetail);
router.get("/edit/:id", productsControllers.productEdit);
router.post("/edit/:id", upload.single('image'), validateProduct, productsControllers.productUpdate);
router.get("/create", productsControllers.productCreate);
router.post("/save", upload.single('image'), validateProduct , productsControllers.productSave);
router.get("/delete/:id", productsControllers.productDelete);
router.post('/search', productsControllers.productSearch);
router.get("/shoppingCart", productsControllers.shoppingCart);

module.exports = router;