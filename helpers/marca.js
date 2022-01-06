import Marca from "../models/marca.js";
import Articulo from '../models/articulo.js';

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

const actualizarArticulos = async(marca)=>{
    let articulos = await Articulo.find(
                                            {marca:marca._id},
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
        let skuCompleto = skuModify[0] +"-"+ marca.nombre +"-"+ skuModify[2];
        articulo.sku = skuCompleto;
        articulosModify.push(articulo)
    });

    await articulosModify.map(async(articulo)=>{
        await articulo.save();
    });
}

export {
    existeMarcaNombre,
    existeMarcaById,
    validarExistenciaMarca,
    actualizarArticulos
}