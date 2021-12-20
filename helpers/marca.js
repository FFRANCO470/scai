import Marca from "../models/marca.js";

//valdiar nombre de marca
const existeMarcaNombre = async (nombre)=>{
    //limpiar variable
    nombre = nombre.toString().toLowerCase().trim();

    //validar
    if(nombre=="")throw new Error("Nomber de marca obligatorio") 
    if(nombre.length>50) throw new Error("Nomber de marca mayor a 50 caracteres") 

    //buscar marca en la bd
    const existe = await Marca.findOne({nombre:nombre})
    if(existe) throw new Error('Nombre de marca ya existente')
}

// validar id de marca
const existeMarcaById = async (id)=>{
    const existe = await Marca.findById(id)
    if(!existe) throw new Error(`No existe marca con ese ID`)
}


const validarExistenciaMarca = async(marca)=>{
    const existe = await Marca.findOne({nombre:marca});
    if(!existe){
        let marcaNew = Marca({nombre:marca});
        await marcaNew.save()
    }
}

export {existeMarcaNombre,existeMarcaById,validarExistenciaMarca}