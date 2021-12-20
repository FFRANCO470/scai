import jwt from 'jsonwebtoken';
import { existeUsuarioById } from '../helpers/usuario.js';
import Usuario from '../models/usuario.js';

const generarJWT = (uid='')=>{
    return new Promise((resolve,reject)=>{
        const payload = {uid}
        jwt.sign(payload,process.env.SECREPRIVATEKEY,{
            expiresIn:'7d'
        },(err,token)=>{
            if (err) {
                reject('No se pudo generar token')
            }else{
                resolve(token)
            }
        })
    })
}

const validarJWR = async (req,res,next)=>{
    const token = req.header('token')
    if(! token){return res.status(400).json({msg:"No hay token en la peticion"})}
    try{
        const {uid} = jwt.verify(token,process.env.SECREPRIVATEKEY);
        const usuario = await Usuario.findById(uid)
        if (!usuario) {return res.status(400).json({msg:"No hay usuario para ese token"})}
        if (usuario.estado==0) {return res.status(401).json({msg:"Usuario con ese token esta desactivado"}) }
        req.usuario = usuario
        next()
    }catch(error){
        return res.status(401).json({msg:"Token no valido"})
    }
}

async function checkToken(token){
    let __id=null;
    try {
        //validar si token es correcto
        const {_id} = await jwt.decode(token);
        //si es correcto almacenarlo
        __id = _id 
    } catch (error) {
        return false;
    }
    //verificar si existe el usuario con el id decodificado
    const existeUsuario = existeUsuarioById(__id)
}

export {generarJWT,validarJWR}