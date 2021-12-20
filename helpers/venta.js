 import Venta from '../models/venta.js'
 import Articulo from '../models/articulo.js';

//numero de factura de venta : ruta 1
const validarNumeroFactura = async  (numFacturaVenta)=>{
    numFacturaVenta = Number(numFacturaVenta);
    if(numFacturaVenta==="")throw new Error("Numero de factura vacio")
    if ( Number.isNaN(numFacturaVenta)) throw new Error("Numero de factura tipo numero NAN")
    if ( Number(numFacturaVenta)<0) throw new Error("Numero de factura negativa")
    const existe = await Venta.findOne({numFactura:numFacturaVenta})
    if(existe) throw new Error("Numero de factura ya existe")
}

//tipo de factura : ruta 1
const validarTipoFactura = async(tipoFactura)=>{
    tipoFactura = tipoFactura.toString().toLowerCase().trim();
    if(tipoFactura!="debito" && tipoFactura!="abonoabono" && tipoFactura!="venta"){
        throw new Error("Tipos de factura validos: debito,abonoAbono,venta")
    }
}

//guardarDtos : ruta 1
const validarGuardarDatos = async(guardarDatos)=>{
    if(guardarDatos!==true && guardarDatos!==false){
        throw new Error("Condicion de guardar datdos no es booleana")
    }
}


//validar tipo de factura debito
const facturaDebito = async(resto)=>{
    //validar que los valores existan y no vengan bacios
    if(resto.saldoAnterior==undefined ){return "falta saldo anterior"}  
    if(resto.efectivo==undefined ){return "falta efectivo en la peticion"}  
    if(resto.nequi==undefined){return "falta nequi en la peticion"}
    if(resto.tarjeta==undefined){return "faltan tarjeta en la peticion"}   

    // validar que los saldos sean numeros
    if(Number.isNaN(resto.saldoAnterior)){return "Saldo anterior no es numero"}
    if(Number.isNaN(resto.efectivo)){return "Efectivo no es numero"}
    if(Number.isNaN(resto.nequi)){return "Nequi no es numero"}
    if(Number.isNaN(resto.tarjeta)){return "Tarjeta no es numero"}

    //validar comentario
    if(resto.comentario==undefined ){return "falta comentario "}
    if(resto.comentario.length>250){return "Comentario mayor a 250 caracteres"}

    return true
}

//validar tipo factura abonoabono
const facturaAbonoAbono = async(resto)=>{
    //validar que los valores existan y no vengan bacios
    if(resto.saldoAnterior==undefined ){return "falta saldo anterior"}  
    if(resto.efectivo==undefined ){return "falta efectivo en la peticion"}  
    
    if(resto.nequi==undefined){return "falta nequi en la peticion"}
    if(resto.tarjeta==undefined){return "faltan tarjeta en la peticion"}   
    if(resto.credito==undefined){return "faltan credito en la peticion"}   

    // validar que los saldos sean numeros
    if(Number.isNaN(resto.saldoAnterior)){return "Saldo anterior no es numero"}
    if(Number.isNaN(resto.efectivo)){return "Efectivo no es numero"}
    if(Number.isNaN(resto.nequi)){return "Nequi no es numero"}
    if(Number.isNaN(resto.tarjeta)){return "Tarjeta no es numero"}
    if(Number.isNaN(resto.credito)){return "Credito no es numero"}

    //validar comentario
    if(resto.comentario==undefined ){return "falta comentario "}
    if(resto.comentario.length>250){return "Comentario mayor a 250 caracteres"}

    return true
}

//disminuir separadas aumentar vendidas
const facturaAbono = async(_id,cantidad)=>{
    let {cantSeparadas,cantVendieron} = await Articulo.findOne({_id});
    cantSeparadas = parseInt(cantSeparadas) - parseInt(cantidad);
    cantVendieron = parseInt(cantVendieron) + parseInt(cantidad);
    await Articulo.findByIdAndUpdate({_id},{cantSeparadas,cantVendieron})
}

const facturaVenta = async(resto)=>{
    if(resto.subTipoFactura==undefined ){return "falta subTipoFactura "}
    if(resto.subTipoFactura!=='abono' && resto.subTipoFactura!=='venta'){return "subtipo de factura es abono o venta"}
    if(resto.totalPrecio==undefined ){return "Falta precio total en la peticion"}
    if(resto.totalCosto==undefined ){return "Falta costo total en la peticion"}
    if(resto.descuento==undefined ){return "Falta descuento en la peticion"}
    if(resto.articulos==undefined ){return "Faltan articulos en la peticion"}
    if(resto.articulos.length==0){return "No hay articulos"}
    if(resto.efectivo==undefined ){return "Falta efectivo en la peticion"}
    if(resto.nequi==undefined ){return "Falta nequi en la peticion"}
    if(resto.tarjeta==undefined ){return "Falta tarjeta en la peticion"}
    if(resto.credito==undefined ){return "Falta credito en la peticion"}
    if(resto.comentario==undefined ){return "falta comentario en la peticion"}
    if(resto.comentario.length>250){return "Comentario mayor a 250 caracteres"}
    
    if(Number.isNaN(resto.totalPrecio)){return "Total precio no es numero"}
    if(Number.isNaN(resto.totalCosto)){return "Total costo no es numero"}
    if(Number.isNaN(resto.descuento)){return "Descuento no es numero"}
    if(Number.isNaN(resto.efectivo)){return "Efectivo no es numero"}
    if(Number.isNaN(resto.nequi)){return "Nequi no es numero"}
    if(Number.isNaN(resto.tarjeta)){return "Tarjeta no es numero"}
    if(Number.isNaN(resto.credito)){return "Credito no es numero"}
    return true
}

const facturaVentaVenta = async(_id,cantidad)=>{
    let {cantVendieron,cantDisponibles} = await Articulo.findOne({_id});
    cantVendieron = parseInt(cantVendieron) + parseInt(cantidad)
    cantDisponibles = parseInt(cantDisponibles) - parseInt(cantidad)
    await Articulo.findByIdAndUpdate({_id},{cantVendieron,cantDisponibles})   
}

const facturaVentaAbono = async(_id,cantidad)=>{
    let {cantSeparadas,cantDisponibles} = await Articulo.findOne({_id});
    cantSeparadas = parseInt(cantSeparadas) + parseInt(cantidad);
    cantDisponibles = parseInt(cantDisponibles) - parseInt(cantidad)
    await Articulo.findByIdAndUpdate({_id},{cantDisponibles,cantSeparadas})   
}


const existeVentaId = async(id)=>{
    const existe = await Venta.findById(id)
    if(!existe) throw new Error(`No existe venta con ese ID`)
}

export {
    validarNumeroFactura,
    validarTipoFactura,
    validarGuardarDatos,
    facturaDebito,
    facturaAbonoAbono,
    facturaAbono,
    facturaVenta,
    facturaVentaVenta,
    facturaVentaAbono,
    existeVentaId
}