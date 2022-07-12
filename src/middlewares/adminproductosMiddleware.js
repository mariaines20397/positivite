adminproductosMiddleware = (req, res, next) => {
    if (req.session.usuario) {
        if (req.session.usuario.role_id == 1 || req.session.usuario.role_id == 2) {
            return next();
        } else {
            return res.redirect("/");
        }
        //return res.redirect("/users/login");
    }
    next();
    }

module.exports = adminproductosMiddleware;