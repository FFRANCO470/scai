import Categoria from "../models/categoria.js";

//validar categoria por nombre
const existeCategoriaNombre = async (nombre)=>{

    //limpiar variable
    nombre = nombre.toString().toLowerCase().trim();

    //validar por caracteres
    if(nombre==="")throw new Error("Nomber de categoria obligatorio") 
    if(nombre.length>50) throw new Error("Nomber de categoria mayor a 50 caracteres") 

    //buscar categoria en la bd
    const existe = await Categoria.findOne({nombre:nombre})
    if(existe) throw new Error('Nombre de categoria ya existente')
}

//validar categoria por id
const existeCategoriaById = async (id)=>{
    const existe = await Categoria.findById(id)
    if(!existe) throw new Error(`No existe categoria con ese ID`)
}

const validarExistenciaCategoria = async(categoria)=>{
    const existe = await Categoria.findOne({nombre:categoria});
    if(!existe){
        let categoriaNew = Categoria({nombre:categoria});
        await categoriaNew.save()
    }
}



export {
    existeCategoriaNombre,
    existeCategoriaById,
    validarExistenciaCategoria
}