import Usuario from '../models/usuario.js';

//validar usuario por id
const existeUsuarioById = async (id)=>{
    const existe = await Usuario.findById(id)
    if (!existe) {throw new Error(`No existe usuario con ese ID`)}
}

//validar usuario por nombre error si existe
const existeUsuarioByName = async(nombreUser)=>{
    //limpiar variable
    nombreUser = nombreUser.toLowerCase().trim();

    //validar
    if(nombreUser=="")throw new Error("Usuario obligatorio") 
    if(nombreUser.length>50) throw new Error("Usuario mayor a 50 caracteres") 

    //buscar en bd si encuentra enviar erro
    const existe = await Usuario.findOne({nombreUser:nombreUser})
    if(existe) throw new Error('Usuario ya existente')
}


//validar rol
const existeUsuarioByRol = async (rol) =>{
    //limpiar varialbe
    rol=rol.toString().toLowerCase().trim();

    //validar
    if (rol != "administrador") {
        if (rol != "vendedor") {
            throw new Error(`No existe el rol ${rol}`)
        }
    }
}

//vaidar tamano de passwored
const validarPass = async (password)=>{
    //limpiar variable
    password = password.toString().trim();

    //validar
    if(password=="")throw new Error("Contraseña obligatorio") 
    if(password.length>10) throw new Error("Contraseña mayor a 10 caracteres") 
}

//validar nombre
const validarNombre = async(nombre)=>{
    nombre = nombre.toLowerCase().trim();
    if(nombre=="")throw new Error("Nombre de usuario obligatorio") 
    if(nombre.length>100) throw new Error("Nombre de usuario mayor a 100 caracteres") 
}

//validar cedula
const validarCedula = async(cedula)=>{
    cedula = cedula.trim();
    if(cedula=="")throw new Error("Cedula de usuario obligatorio") 
    if(cedula.length>100) throw new Error("Cedula de usuario mayor a 100 caracteres") 
}

//validar variables de inicio de sesion
const existeUsuarioByNameLogin = async (nombreUser)=>{
    nombreUser = nombreUser.toString().toLowerCase().trim();
    if(nombreUser=="")throw new Error("Usuario obligatorio") 
    if(nombreUser.length>50) throw new Error("Usuario mayor a 50 caracteres") 
    const existe = await Usuario.findOne({nombreUser:nombreUser})
    if(!existe) throw new Error('usuario/constraseña')
    if (existe.estado === 0)throw new Error('usuario/contraseña') 
}

const existeTelefonoUser = async(telefono)=>{
    telefono = telefono.trim();
    var mensaje = '';
    if(telefono.length>100){
        mensaje="Telefono mayor a 100 caracteres";
        return mensaje;
    }else{
        return true
    }
}

const existeDireccionUser = async(direccion)=>{
    direccion = direccion.trim();
    var mensaje = '';
    if(direccion.length>100){
        mensaje = "Direccion mayor a 10 caracteres";
        return mensaje
    }else{
        return true
    }
}

const existeNumeroCuentaUser = async(numCuenta)=>{
    numCuenta = numCuenta.trim();
    var mensaje = '';
    if(numCuenta.length>100){
        mensaje = 'Numero de cuenta mayor a 100 caracteres';
        return mensaje
    }else{
        return true
    }
}

const existeTipoCuentaUser = async (tipoCuenta)=>{
    tipoCuenta = tipoCuenta.toLowerCase().trim();
    var mensaje = '';
    if(tipoCuenta>100){
        mensaje = 'Tipo de cuenta mayor a 100 caracteres';
        return mensaje
    }else{
        return true
    }
}

const existeBancoUser = async (banco)=>{
    banco = banco.toLowerCase().trim()
    var mensaje = '';
    if(banco.length>100){
        mensaje = "Banco mayor a 100 caracteres"
        return mensaje
    }else{
        true
    }
}

const existeNumContratoUser = async (numContrato)=>{
    numContrato = numContrato.trim();
    var mensaje = "";
    if(numContrato>100){
        mensaje = "Numero de contrato mayor a 100 caracteres";
        return mensaje;
    }else{
        return true
    }
}

export {
    existeUsuarioById,
    existeUsuarioByName,
    existeUsuarioByRol,
    validarPass,
    existeUsuarioByNameLogin,
    existeTelefonoUser,
    existeDireccionUser,
    existeNumeroCuentaUser,
    existeTipoCuentaUser,
    existeBancoUser,
    existeNumContratoUser,
    validarNombre,
    validarCedula
 }