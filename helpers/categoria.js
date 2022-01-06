import Categoria from "../models/categoria.js";
import Articulo from '../models/articulo.js';

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

const actualizarArticulos = async(categoria)=>{
    let articulos = await Articulo.find(
                                            {categoria:categoria._id},
                                            {
                                                _id:1,
                                                categoria:1,
                                                marca:1,
                                                referencia:1,
                                                sku:1
                                            }
                                        );
    

    let articulosModify = [];

    await articulos.map((articulo)=>{
        let sku = articulo.sku;
        let skuModify = sku.split("-");
        let skuCompleto = categoria.nombre +"-"+ skuModify[1] +"-"+ skuModify[2];
        articulo.sku = skuCompleto;
        articulosModify.push(articulo)
    });

    await articulosModify.map(async(articulo)=>{
        await articulo.save();
    });
}


export {
    existeCategoriaNombre,
    existeCategoriaById,
    validarExistenciaCategoria,
    actualizarArticulos
}