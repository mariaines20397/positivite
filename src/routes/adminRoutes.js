const express = require("express");
const router = express.Router();
const path = require("path");
const adminControllers = require("../controllers/adminControllers");
const multer = require('multer');
const {check} = require('express-validator')
adminusuariosMiddleware = require("../middlewares/adminusuariosMiddleware");
adminproductosMiddleware = require("../middlewares/adminproductosMiddleware");
guestMiddleware = require('../middlewares/guestMiddleware');
authMiddleware = require('../middlewares/authMiddleware');

//Seteo de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, path.join(__dirname, "../../public/img/avatars"))
    },

    filename: (req, file, cb) =>{
        const newFileName = 'usuario_' + Date.now() + path.extname(file.originalname);
        cb(null, newFileName)
    }
})

const upload = multer({ storage })

//Defino validaciones del formulario de Productos
let validateProduct = [
    check('name').notEmpty().withMessage("El nombre del producto es obligatorio"), 
    check('price').notEmpty().withMessage("El precio del producto es un campo obligatorio"),
    check('category').notEmpty().withMessage("Debe seleccionar una categoría"),
    check('description').notEmpty().withMessage("La descripción del producto es obligatoria"),
    check('image').custom((value, { req }) => {
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
    check('stock').notEmpty().withMessage("El stock del producto es obligatorio")
]

let validateUser = [
    check('name').notEmpty().withMessage("El nombre del usuario es obligatorio"),
    check('email').notEmpty().withMessage("El email del usuario es obligatorio"),
    check('password').notEmpty().withMessage("Debe ingresar una password de al menos 6 caracteres").bail().isLength({min:6}).withMessage('El password debe tener al menos 6 caracteres').bail(),
    check('password2').custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Las contraseñas no coinciden');
        } else {
            return value;
        }
    }),
    check('avatar').custom((value, { req }) => {
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
    check('rol').notEmpty().withMessage("El rol del usuario es obligatorio")
]


//Rutas
router.get("/adminproductos", adminproductosMiddleware, authMiddleware, adminControllers.products);
router.get("/adminusuarios", adminusuariosMiddleware, authMiddleware, adminControllers.users);
router.get("/adminusuariosCreate", adminusuariosMiddleware, authMiddleware, adminControllers.usersCreate);
router.post("/adminusuariosSave", adminusuariosMiddleware, authMiddleware, upload.single('avatar'), validateUser, adminControllers.usersSave);
router.get("/adminusuariosEdit/:id", adminusuariosMiddleware, authMiddleware, adminControllers.usersEdit);
router.post("/adminusuariosEdit/:id", adminusuariosMiddleware, authMiddleware, adminControllers.usersUpdate);
router.get("/adminusuariosDelete/:id", adminusuariosMiddleware, authMiddleware, adminControllers.usersDelete);
/* router.get("/detail/:id", productsControllers.productDetail);
router.get("/edit/:id", productsControllers.productEdit);
router.post("/edit/:id", upload.single('image'), validateProduct, productsControllers.productUpdate);
router.get("/create", productsControllers.productCreate);
router.post("/save", upload.single('image'), validateProduct , productsControllers.productSave);
router.get("/delete/:id", productsControllers.productDelete);
router.post('/search', productsControllers.productSearch);
router.get("/shoppingCart", productsControllers.shoppingCart); */

module.exports = router;