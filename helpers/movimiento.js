//import Movimiento from "../models/movimiento";
import Articulo from '../models/articulo.js';
import Categoria from '../models/categoria.js';
import Marca from '../models/marca.js';
import Movimiento from '../models/movimiento.js';



const validarTotalPrecio = async(totalPrecio)=>{
    totalPrecio = Number(totalPrecio);
    if(totalPrecio==="")throw new Error("Total precio vacio")
    if ( Number.isNaN(totalPrecio)) throw new Error("Total precio tipo numero NAN")
    if ( Number(totalPrecio)<0) throw new Error("Total precio negativa")
}

const validarTotalCosto = async(totalCosto)=>{
    totalCosto = Number(totalCosto);
    if(totalCosto==="")throw new Error("Total costo vacio")
    if ( Number.isNaN(totalCosto)) throw new Error("total costo tipo numero NAN")
    if ( Number(totalCosto)<0) throw new Error("total costo negativa")
}

const articulosSalida = async(_id,cantidad)=>{
    let {cantDisponibles,cantSalieron} = await Articulo.findOne({_id});
    cantDisponibles = parseInt(cantDisponibles) - parseInt(cantidad);
    cantSalieron = parseInt(cantSalieron) + parseInt(cantidad);
    await Articulo.findByIdAndUpdate({_id},{cantDisponibles,cantSalieron})
}




const replazarNombrePorId = async(articulos)=>{

    //crear codigo unico de inventario
    for(var element of articulos){
        let sku = element.categoria + '-' + element.marca + '-' + element.referencia;
        element.sku = sku
    };
    
    //quitar nombre de categoria y colocar el id
    for(var element of articulos){
        let {_id} = await Categoria.findOne({nombre:element.categoria});
        element.categoria = _id
    };
    
    //quitar nombre de marca y coloca id
    for(var element of articulos){
        let {_id} = await Marca.findOne({nombre:element.marca});
        element.marca = _id
    };

    

    //returnar los artiuclos listos para guardar
    return articulos;
}

const existeCompraById = async(_id)=>{
    let existe = await Movimiento.findOne({_id});
    if(!existe) throw new Error('No existe id para tal compra')
}

export {
    validarTotalPrecio,
    validarTotalCosto,
    articulosSalida,
    replazarNombrePorId,
    existeCompraById
   
}