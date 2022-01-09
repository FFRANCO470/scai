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






const existeCompraById = async(_id)=>{
    let existe = await Movimiento.findOne({_id});
    if(!existe) throw new Error('No existe id para tal compra')
}

const limpiarTodosArticulos = async(articulos)=>{
    try {
        
        let articulosCategorias = await limpiarCategorias(articulos);
        
        let articulosMarca = await limpiarMarcas(articulosCategorias);

        return {error:null, articulosNew:articulosMarca}

    } catch (error) {
        return {error}
    }
}

let limpiarCategorias = async(articulos) =>{
    let articulosNew = [];
    for (const articulo of articulos) {
        if(articulo.categoria==undefined){throw `Articulo sin Categoria`}
        if(articulo.marca==undefined){throw `Articulo sin Marca`}
        if(articulo.referencia==undefined){throw `Articulo sin Referencia`}
        if(articulo.cantidad==undefined){throw `Articulo sin Cantidad`}
        if(articulo.costo==undefined){throw `Articulo sin Costo`}
        if(articulo.precio==undefined){throw `Articulo sin Marca`}
        
        if(articulo.categoria==""){throw `Articulo sin Categoria`}
        if(articulo.marca==""){throw `Articulo sin Marca`}
        if(articulo.referencia==""){throw `Articulo sin Referencia`}
        if(articulo.cantidad==""){throw `Articulo sin Cantidad`}
        if(articulo.costo==""){throw `Articulo sin Costo`}
        if(articulo.precio==""){throw `Articulo sin Marca`}
       
        if(articulo.categoria==null){throw `Articulo sin Categoria`}
        if(articulo.marca==null){throw `Articulo sin Marca`}
        if(articulo.referencia==null){throw `Articulo sin Referencia`}
        if(articulo.cantidad==null){throw `Articulo sin Cantidad`}
        if(articulo.costo==null){throw `Articulo sin Costo`}
        if(articulo.precio==null){throw `Articulo sin Marca`}

        if(articulo.categoria.length > 50){throw `${articulo.categoria} mayor a 50 caracteres`}
        if(articulo.referencia.length > 50){throw `${articulo.referencia} mayor a 50 caracteres`}

        articulo.sku=articulo.categoria;
        
        let categoriaBD = await Categoria.findOne({nombre:articulo.categoria});

        if(!categoriaBD){
            categoriaBD = Categoria({nombre:articulo.categoria});
            articulo.categoria = categoriaBD._id
            await categoriaBD.save();
        }else{
            articulo.categoria = categoriaBD._id
        }

        articulosNew.push(articulo)
        
    }

    return articulosNew;
    
}

let limpiarMarcas = async(articulos) =>{
    let articulosNew = [];
    for (const articulo of articulos) {

        if(articulo.marca.length > 50){throw `${articulo.marca} mayor a 50 caracteres`}

        articulo.sku= articulo.sku + "-" + articulo.marca + "-" + articulo.referencia;
        
        let marca = await Marca.findOne({nombre:articulo.marca});

        if(!marca){
            marca = Marca({nombre:articulo.marca});
            articulo.marca = marca._id
            await marca.save();
        }else{
            articulo.marca = marca._id
        }

        articulosNew.push(articulo)
        
    }

    return articulosNew;
    
}

const registrandoArticulos = async(articulos)=>{
    try {
        let agregarModificarArticulo = await addOrModify(articulos);
        return {error:null,agregarModificarArticulo}
    } catch (error) {
        return {error}
    }
    
}

let addOrModify = async(articulos)=>{
    for (const articulo of articulos) {
        let articuloBD = await Articulo.findOne({sku:articulo.sku});

        if(!articuloBD){
            articuloBD = Articulo({
                categoria:articulo.categoria,
                marca:articulo.marca,
                referencia:articulo.referencia,
                sku:articulo.sku,
                precio:articulo.precio,
                costo:articulo.costo,
                cantDisponibles:articulo.cantidad,
                cantCompradas:articulo.cantidad,
            });

            
            await articuloBD.save();
        }else{

            let cantDisponibles = articuloBD.cantDisponibles;
            let cantCompradas = articuloBD.cantCompradas;

            cantDisponibles = parseInt(cantDisponibles) + parseInt(articulo.cantidad);
            cantCompradas = parseInt(cantCompradas) + parseInt(articulo.cantidad);

            await Articulo.updateOne(
                {sku:articulo.sku},
                {
                    cantDisponibles,
                    cantCompradas,
                    costo:articulo.costo,
                    precio:articulo.precio,
                }
            );
        }

        
    }

    return true;
}








export {
    validarTotalPrecio,
    validarTotalCosto,
    articulosSalida,
    existeCompraById,
    limpiarTodosArticulos,
    registrandoArticulos
   
}