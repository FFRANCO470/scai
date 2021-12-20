import Proveedor from "../models/proveedor.js";

// validar nombre de proveedor unico
const validarNombre = async(nombre)=>{
    //limpiar varialbe
    nombre = nombre.toString().toLowerCase().trim()

    //validar
    if(nombre===""){throw new Error('Nombre obligatorio')}
    if(nombre.length>200){throw new Error('Nombre mayor a 200 caracteres')}

    //buscar en la bd si existe crear error
    const existe = await Proveedor.findOne({nombre:nombre})
    if(existe){throw new Error("Proveedor ya existente")}
}

//validar proveedor por id
const existeProveedorById = async(_id)=>{
    const existe = Proveedor.findById(_id);
    if(!existe){throw new Error("No existe proveedor para ese id")}
}

//validar telefono
const validarTelefonoProveedor = async (telefono)=>{
    //limpiar variable
    telefono = telefono.toString().toLowerCase().trim();

    //validar
    if(telefono===""){throw new Error("Telefono vacio")}
    if(telefono.length>150){throw new Error("Telefono mayor a 250 caracteres")}
}

//validar direccion
const validarDireccionProveedor = async (direccion)=>{
    //limpiar variable
    direccion = direccion.toString().toLowerCase().trim();

    //validar
    if(direccion===""){throw new Error("Direccion vacio")}
    if(direccion.length>150){throw new Error("Direccion mayor a 250 caracteres")}
}

//crear proveedor si ni existe creelo
const personaMovimiento = async(proveedor)=>{
    //si es mayor a 200 caracteres retornar error
    if(proveedor.length>200){return true}

    //buscar en la bd
    const existe = await Proveedor.findOne({nombre:proveedor})

    //si exsite retornar id
    if(existe){
        const {_id} = existe;
        return _id

    //si no existe crear y retornar id
    }else{
        const persona = Proveedor({nombre:proveedor})
        await persona.save();
        const {_id} = await Proveedor.findOne({nombre:proveedor})
        return _id
    }
}


export {
    validarNombre,
    existeProveedorById,
    validarTelefonoProveedor,
    validarDireccionProveedor,
    personaMovimiento
}