const validarRol = (...roles) =>{
        return (req,res,next)=>{
            if(!(roles.includes(req.usuario.rol) || req.usuario.rol==='administrador')){
                return res.status(401).json({msg:`El servicio requiere roles de ${roles}  administrador`})
            }
            next();
        }
    }
    export {validarRol}