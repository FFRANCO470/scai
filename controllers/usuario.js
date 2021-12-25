import Usuario from '../models/usuario.js';
import bcryptjs from 'bcryptjs';
import { generarJWT } from '../middlewares/validarJwt.js';
import {
    existeTelefonoUser,
    existeDireccionUser,
    existeNumeroCuentaUser,
    existeTipoCuentaUser,
    existeBancoUser,
    existeNumContratoUser
} from '../helpers/usuario.js'

const usuarioControllers={
    
    //agregar usuarios por formulario a la bd
    usuarioPost : async (req,res)=>{
        //recibir variables
        const {nombreUser,password,rol,nombre,cedula,...resto} = req.body;

        //limpiar variables
        const nameUser = nombreUser.toString().toLowerCase().trim();
        const pass = password.toString().trim();
        const role = rol.toString().toLowerCase().trim();
        const name = nombre.toString().toLowerCase().trim();
        const cc = cedula.toString().trim();

        //campos no obligatorios
        var phone='';
        var address='';
        var numCheck='';
        var typeCheck='';
        var bank='';
        var contract='';

        //validar telefono
        if(resto.telefono){
            phone = resto.telefono.trim();
            let existe = await existeTelefonoUser(phone);
            if(existe!=true){return res.status(400).json({msg:`${existe}`})}
        }

        //validar direccion 
        if(resto.direccion){
            address = resto.direccion.trim();
            let existe = await existeDireccionUser(address);
            if(existe!=true){return res.status(400).json({msg:`${existe}`})}
        }

        //validar #cuenta
        if(resto.numCuenta){
            numCheck = resto.numCuenta.trim()
            let existe = await existeNumeroCuentaUser(numCheck);
            if(existe!=true){return res.status(400).json({msg:`${existe}`})}
        }

        //validar tipo de cuenta
        if(resto.tipoCuenta){
            typeCheck = resto.tipoCuenta.toLowerCase().trim()
            let existe = await existeTipoCuentaUser(typeCheck);
            if(existe!=true){return res.status(400).json({msg:`${existe}`})}
        }

        //validar banco
        if(resto.banco){
            bank = banco.toLowerCase().trim()
            let existe = await existeBancoUser(banck);
            if(existe!=true){return res.status(400).json({msg:`${existe}`})}
        }

        //validar contrato
        if(resto.numContrato){
            contract = numContrato.trim();
            let existe = await existeNumContratoUser(banck);
            if(existe!=true){return res.status(400).json({msg:`${existe}`})}
        }
        let fechita = new Date(new Date(Date.now()).getTime() - 1000 * 60 * 60 * 5)
        //crear objeto usuario
        const usuario = Usuario(
                                {
                                    nombreUser:nameUser,
                                    password:pass,rol:role,
                                    nombre:name,cedula:cc, 
                                    telefono:phone, 
                                    direccion:address, 
                                    numCuenta:numCheck,
                                    tipoCuenta:typeCheck,
                                    banco:bank,
                                    numContrato:contract,
                                    createdAt:fechita
                                }
                                );
                                
        //numero de capas para encriptar la password
        const salt = bcryptjs.genSaltSync(1);

        //encriptar passwored
        usuario.password = bcryptjs.hashSync(password,salt);

        //guardar usuario
        await usuario.save();
        res.json({msg:"Usuario agregado"})      
    },

    //iniciar sesion
    login : async (req,res)=>{
        //recibir valores de la peticion
        const{nombreUser,password} = req.body;

        //limpiar variables
        const name = nombreUser.toLowerCase().trim();

        //buscar usaurio por nombre de usuario
        const usuario = await Usuario.findOne({nombreUser:name});

        //comparar la password del usuario con la que llego en la peticion
        const validarPassword = bcryptjs.compareSync(password,usuario.password);

        //si no coinciden retornar error
        if (!validarPassword) {return res.status(400).json({msg:'usuario/contraseña'})}

        //si coinciden crear token
        const token = await generarJWT(usuario.id);

        //responder al cliente
        res.json({
                    nombreUser:usuario.nombreUser,
                    rol:usuario.rol,    
                    id:usuario._id,
                    token
                })
    },

    //traer todos los usuarios
    usuarioGet : async (req,res)=>{
        //recibir variables de la peticion
        const value = req.query.value;

        //traer los proveedores que contengan en cualquiere propiedad el caracter enviado
        const usuario = await Usuario.find({
                                                $or:[
                                                    {_id:new RegExp(value,'i')},
                                                    {nombreUser:new RegExp(value,'i')},
                                                    {rol:new RegExp(value,'i')},
                                                    {nombre:new RegExp(value,'i')},
                                                    {cedula:new RegExp(value,'i')},
                                                    {numContrato:new RegExp(value,'i')},
                                                ]
                                            },{createdAt:0,
                                                updatedAt:0,
                                                telefono:0,
                                                direccion:0,
                                                numCuenta:0,
                                                tipoCuenta:0,
                                                banco:0,
                                                numContrato:0,
                                                __v:0
                                            })

        res.json({usuario})
    },

    //traer un usuario por el id
    usuarioGetById : async (req,res)=>{
        const {id} = req.params;
        const usuario = await Usuario.findOne({_id:id});
        res.json({usuario})
    },

    //activar usuario
    usuarioPutActivar : async (req,res)=>{
        const {id} = req.params;
        const usuario = await Usuario.findByIdAndUpdate(id,{estado:1});
        res.json({msg:"Usuario activado"})
    },

    //desactivar usuario
    usuarioPutDesactivar : async (req,res)=>{
        const {id} = req.params;
        const usuario = await Usuario.findByIdAndUpdate(id,{estado:0});
        res.json({msg:"Usuario desactivado"})
    },

    //actualizar  usuario
    usuarioPutNombre : async (req,res)=>{
        //recibir varialbes
        const {id} = req.params;
        const{ nombreUser } = req.body;

        //limpiar variables
        const name = nombreUser.toLowerCase().trim();

        //validar estado de usuario
        const user = await Usuario.findOne({_id:id})
        if (user.estado === 0) {return res.status(400).json({msg:'Usuario desactivado'})}

        //actualizar usuario
        const usuario = await Usuario.findByIdAndUpdate(id,{nombreUser:name});
        res.json({msg:"Nombre actualizado"})
    },

    //actualizar contraseña de usuario
    usuarioPutPassword : async (req,res)=>{
        //recibir variables
        const {id} = req.params;
        const{ password } = req.body;

        //validar estado
        const user = await Usuario.findOne({_id:id})
        if (user.estado === 0) {return res.status(400).json({msg:'Usuario desactivado'})}

        //capas de encriptacion
        const salt = bcryptjs.genSaltSync(1);

        //encriptar
        const passworde = bcryptjs.hashSync(password,salt);

        //actualizar 
        const usuario = await Usuario.findByIdAndUpdate(id,{password:passworde});
        res.json({msg:"Constraseña actualizada"}) 
    },

    //actualizar nombre
    usuarioPutNombrePila : async (req,res)=>{
        //recibir variables de la peticion
        const {id} = req.params;
        const{ nombre } = req.body;

        //limpiar variable
        const name = nombre.toLowerCase().trim();

        //validar estado de usuario
        const user = await Usuario.findOne({_id:id})
        if (user.estado === 0) {return res.status(400).json({msg:'Usuario desactivado'})}

        //actualizar
        const usuario = await Usuario.findByIdAndUpdate(id,{nombre:name});
        res.json({msg:"Nombre actualizado"})
    },

    //actualizar cedula
    usuarioPutCedula : async (req,res)=>{
        //recibiir volaores de la peticion
        const {id} = req.params;
        const{ cedula } = req.body;

        //limpiar varialbes
        const cc = cedula.toString().trim();

        //validar estado
        const user = await Usuario.findOne({_id:id})
        if (user.estado === 0) {return res.status(400).json({msg:'Usuario desactivado'})}

        //actualizar
        const usuario = await Usuario.findByIdAndUpdate(id,{cedula:cc});
        res.json({msg:"Cedula actualizada"})
    },

    //actualizar telefono
    usuarioPutTelefono : async (req,res)=>{
        //recibir valores de la peticion
        const {id} = req.params;
        const{ telefono } = req.body;

        //limpiar variables
        const phone = telefono.toString().trim();
        
        //validar estado
        const user = await Usuario.findOne({_id:id})
        if (user.estado === 0) {return res.status(400).json({msg:'Usuario desactivado'})}

        //actualizar
        const usuario = await Usuario.findByIdAndUpdate(id,{telefono:phone});
        res.json({msg:"Telefono actualizado"})
    },

    //actualizar direccion
    usuarioPutDireccion : async (req,res)=>{
        //recibir valores de la peticion
        const {id} = req.params;
        const{ direccion } = req.body;

        //limpiar valores
        const addres = direccion.trim();

        //validar estado
        const user = await Usuario.findOne({_id:id})
        if (user.estado === 0) {return res.status(400).json({msg:'Usuario desactivado'})}

        //actualizar
        const usuario = await Usuario.findByIdAndUpdate(id,{direccion:addres});
        res.json({msg:"Direccion actualizada"})
    },


    //actualizar #cuenta
    usuarioPutNumCheck : async (req,res)=>{
        //recibir valores de la peticion
        const {id} = req.params;
        const{ numCuenta } = req.body;

        //limpiar variable
        const numCheck = numCuenta.toString().trim();
        
        //validar estado
        const user = await Usuario.findOne({_id:id})
        if (user.estado === 0) {return res.status(400).json({msg:'Usuario desactivado'})}

        //actualizar
        const usuario = await Usuario.findByIdAndUpdate(id,{numCuenta:numCheck});
        res.json({msg:"Numero de cuenta actualizado"})
    },

    //actualizar type cuenta
    usuarioPutTypeCheck : async (req,res)=>{
        //recibir varialbes
        const {id} = req.params;
        const{ tipoCuenta } = req.body;

        //limpiar variables
        const typecheck = tipoCuenta.trim();
        
        //validar estado
        const user = await Usuario.findOne({_id:id})
        if (user.estado === 0) {return res.status(400).json({msg:'Usuario desactivado'})}

        //actualizar
        const usuario = await Usuario.findByIdAndUpdate(id,{tipoCuenta:typecheck});
        res.json({msg:"Tipo de cuenta actualizado"})
    },

    //actualizar banco
    usuarioPutBanco : async (req,res)=>{
        //recibir variables de la peticion
        const {id} = req.params;
        const{ banco } = req.body;

        //limpiar variable
        const bank = banco.toString().toLowerCase().trim();
        
        //validar estado
        const user = await Usuario.findOne({_id:id})
        if (user.estado === 0) {return res.status(400).json({msg:'Usuario desactivado'})}

        //actualizar
        const usuario = await Usuario.findByIdAndUpdate(id,{banco:bank});
        res.json({msg:"Banco actualizado"})
    },

    //actualizar banco
    usuarioPutNumContrato : async (req,res)=>{
        //recibir  variables
        const {id} = req.params;
        const{ numContrato } = req.body;

        //limpiar variables
        const contract = numContrato.toString().trim();
        
        //validar estado
        const user = await Usuario.findOne({_id:id})
        if (user.estado === 0) {return res.status(400).json({msg:'Usuario desactivado'})}

        //actualizar
        const usuario = await Usuario.findByIdAndUpdate(id,{numContrato:contract});
        res.json({msg:"Numero de contrato actualizado"})
    },
}
export default usuarioControllers