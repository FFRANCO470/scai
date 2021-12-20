import Configuraciones from "../models/setting.js"

//validar nombre
const validarNombre = async (nombre)=>{
    nombre = nombre.toString().trim();
    if(nombre==="")throw new Error("Nomber obligatorio");
    if(nombre.length>100) throw new Error("Nomber mayor a 100 caracteres") 
}

//validar nit
const validarNit = async(nit)=>{
    nit = nit.trim();
    if(nit==="")throw new Error("Nit obligatorio");
    if(nit.length>100) throw new Error("Nit mayor a 100 caracteres") 
}

//validar regimen
const validarRegimen = async(regimen)=>{
    regimen = regimen.toString().trim();
    if(regimen==="")throw new Error("Regimen obligatorio");
    if(regimen.length>100) throw new Error("Regimen mayor a 100 caracteres") 
}

//validar representance de camara de comercion
const validarRepresentante = async(representante)=>{
    representante = representante.toString().trim();
    if(representante==="")throw new Error("Representante obligatorio");
    if(representante.length>100) throw new Error("Representante mayor a 100 caracteres") 
}

//validar departamento
const validarDepartamento = async(departamento)=>{
    departamento = departamento.toString().trim();
    if(departamento==="")throw new Error("Departamento obligatorio");
    if(departamento.length>100) throw new Error("Departamento mayor a 100 caracteres") 
}

//validar ciudad
const validarCiudad = async(ciudad)=>{
    ciudad = ciudad.toString().trim();
    if(ciudad==="")throw new Error("Ciudad obligatorio");
    if(ciudad.length>100) throw new Error("Ciudad mayor a 100 caracteres") 
}

//validar direccion
const validarDireccion = async(direccion)=>{
    direccion = direccion.toString().trim();
    if(direccion==="")throw new Error("Direccion obligatorio");
    if(direccion.length>100) throw new Error("Direccion mayor a 100 caracteres") 
}

//validar celular
const validarCelular = async(celular)=>{
    celular = celular.toString().trim();
    if(celular==="")throw new Error("Celular obligatorio");
    if(celular.length>100) throw new Error("Celular mayor a 100 caracteres") 
}

//validar telefono
const validarTelefono = async(celular)=>{
    celular = celular.toString().trim();
    if(celular==="")throw new Error("Telefono obligatorio");
    if(celular.length>100) throw new Error("Telefono mayor a 100 caracteres") 
}
//validar email
const validarEmail = async(email)=>{
    email = email.toString().trim();
    if(email==="")throw new Error("Telefono obligatorio");
    if(email.length>100) throw new Error("Telefono mayor a 100 caracteres") 
}


export {
        validarNombre, 
        validarNit, 
        validarRegimen,
        validarRepresentante,
        validarDepartamento,
        validarCiudad,
        validarDireccion,
        validarCelular,
        validarTelefono,
        validarEmail,
    }