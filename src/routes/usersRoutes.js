const express = require("express");
const router = express.Router();
const path = require("path");
const usersControllers = require("../controllers/usersControllers");
const multer = require('multer');
const {check, body} = require('express-validator')
const db = require('../../database/models');
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

//Validaciones para el login
const validationsLogin = [
    check('email')
        .notEmpty().withMessage('Debe ingresar su email').bail()
        .isEmail().withMessage('El email no es válido'),
    check('password').isLength({min:6}).withMessage('El password debe tener al menos 6 caracteres') 
];

//Validaciones para el registro
const validationsRegister = [ 
    check('name').notEmpty().withMessage('Debe ingresar su nombre').bail(),
    check('email').notEmpty().withMessage("Debe ingresar su email").bail().isEmail().withMessage('El email no es válido').bail(),
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
];

router.get("/login", guestMiddleware, usersControllers.login);
router.post("/login", validationsLogin, usersControllers.loginProcess);
router.get("/register", guestMiddleware, usersControllers.register);
router.post("/register", upload.single('avatar'), validationsRegister, usersControllers.registerProcess);
router.get("/profile", authMiddleware, usersControllers.profile);
router.get("/logout", usersControllers.logout);

module.exports = router;