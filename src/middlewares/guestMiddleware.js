guestMiddleware = (req, res, next) => {
    if (req.session.usuario) {
        if(req.session.usuario.role_id == 1){
            res.render(path.join(__dirname, "../views/users/register"))
        }else{
        return res.redirect("/users/profile");
        }
    }
    next();
    }

    module.exports = guestMiddleware;
