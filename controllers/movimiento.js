import Movimiento from "../models/movimiento.js";
import {validarExistenciaCategoria} from "../helpers/categoria.js"
import {validarExistenciaMarca} from "../helpers/marca.js"
import {articulosSalida,replazarNombrePorId} from "../helpers/movimiento.js"
import {registrarArticulosCompra} from "../helpers/artiuculo.js"


const  movimientoControllers = {
    agregarSalidaPost : async (req,res)=>{

        //recibir variables de la peticion
        const {usuario,totalPrecio,totalCosto,articulos,...resto}=req.body;
        
        //limpiar variables y crear las no obligatorias
        var totalIngreso = Number(totalPrecio);
        var totalGasto = Number(totalCosto);
        var comment = "";

        //validar comentario si viene
        if(resto.comentario!==undefined){
            comment = resto.comentario;
            comment = comment.toString().trim();
            if(comment>250) return res.status(400).json({msg:"Comentario mayor a 250 caracteres"});
        }

        //auentar cantidades que salieron de un articulo y disminuir las disponibles
        articulos.map((articulo)=>articulosSalida(articulo._id, articulo.cantidad))
        
        var articulosLimpios = [];
        
        for(var element of articulos){
            let codigoUnidco = element.categoriaName + '-' + element.marcaName + '-' + element.referencia;
            articulosLimpios.push({
                _id:element._id,
                categoria:element.categoria,
                marca : element.marca,
                sku: codigoUnidco,
                cantidad : element.cantidad,
                costo : element.costo,
                precio : element.precio
            })
        };

        let fechita = new Date(new Date(Date.now()).getTime() - 1000 * 60 * 60 * 5)

        //crear objeto de movimiento
        const movimiento = Movimiento({
            tipoMovimiento:'salida',
            usuario,
            totalPrecio:totalIngreso,
            totalCosto:totalGasto,
            articulos:articulosLimpios,
            comentario:comment,
            createdAt:fechita
        })

        //guardar movimiento en la bd y responder a cliente
        await movimiento.save();
        res.json({msg:"Salida registrada"})
    },
    
    agregarCompra: async (req,res)=>{

        //recibir variables de la peticion
        const {usuario,proveedor,articulos,totalPrecio,totalCosto,...resto} = req.body;
        var numberFactura='';
        var comment = "";
        var totalIngreso = Number(totalPrecio);
        var totalGasto = Number(totalCosto);

        //validar comentario
        if(resto.comentario!==undefined){
            comment = resto.comentario;
            comment = comment.trim();
            if(comment.length>250) return res.status(400).json({msg:"Comentario mayor a 250 caracteres"});
        }

        //validar numero de factura
        if(resto.numFactura!==undefined){
            numberFactura = resto.numFactura;
            numberFactura = numberFactura.toString().trim();
            if(numberFactura.length>20) return res.status(400).json({msg:"Numero de factura mayor a 20 caracteres"});
        }

        //articulos.map((articulo)=>categoriasExistentes(articulo.categoria))

        //array con elementos unicos para guardar en la bd
        var categoriasUnicas = [];
        var marcasUnicas=[];
        var errorValidando = "";

        //optener todas categorias sin repetir
        for(var element of articulos){
            if(element.categoria.length>50){
                errorValidando = "categoria mayor a 50 caracteres"
                break;
            }
            if(!categoriasUnicas.includes(element.categoria)){
                categoriasUnicas.push(element.categoria)
            }
        };
        
        //optener marcas sin repetir
        for(var element of articulos){
            if(element.marca.length>50){
                errorValidando = "marca mayor a 50 caracteres"
                break;
            }
            if(!marcasUnicas.includes(element.marca)){
                marcasUnicas.push(element.marca)
            }
        };

        //validar referencia
        for(var element of articulos){
            if(element.referencia.length>50){
                errorValidando = "referencia mayor a 50 caracteres"
                break;
            }
        };
        
        //si existe error enviar antes de guardar en la bd
        if(errorValidando!=""){
            return res.status(400).json({msg:errorValidando})
        }

        //guardar categorias en la bd si no existen
        await categoriasUnicas.map((categoria)=>validarExistenciaCategoria(categoria))

        //guardar marcas en la bd si no existen
        await marcasUnicas.map((marca)=>validarExistenciaMarca(marca))
        
        //purificar los articulos
        const articulosBD = await replazarNombrePorId(articulos);

        //crear articulo si no existe, aumenar unidades si existe
        articulosBD.map((articulo)=>registrarArticulosCompra(articulo))

        let fechita = new Date(new Date(Date.now()).getTime() - 1000 * 60 * 60 * 5)
        
        const movimiento = Movimiento({
            tipoMovimiento:"compra",
            usuario,
            totalPrecio:totalIngreso,
            totalCosto:totalGasto,
            articulos,
            comentario:comment,
            proveedor,
            numFactura:numberFactura,
            createdAt:fechita
        })

        await movimiento.save();

        //res.json({msg:"Compra realizada"})
        res.json({msg:"Compra registrada"})
    },

    traerSalidasGet : async(req,res)=>{
        //reciber fechas formato = yyyy-mm-dd
        const { fechaInicial,fechaFinal } = req.query;

        //verificar fechas
        if(fechaInicial==undefined || fechaFinal==undefined){return res.status(400).json({msg:"Fecha inicial o final no estan en la peticion"})}

        //funcion para agregar un dia a la fecha final
        let addDays = function(str,days){
            var myDate = new Date(str);
            myDate.setDate(myDate.getDate()+parseInt(days));
            return myDate
        }
        //obtener la fecha final  + 1 dia
        let FechaFinalModi = addDays( new Date(fechaFinal),1);

        // let newFechaInicial = new Date(new Date(fechaInicial).getTime() + 1000 * 60 * 60 * 24)
        // let newFechaFuturo = new Date(new Date(FechaFinalModi).getTime() + 1000 * 60 * 60 * 48)

        //buacar por filtros en la bd
        const salida = await Movimiento.find({
                                            tipoMovimiento:"salida",
                                            createdAt:{$gte:new Date(fechaInicial),$lt:new Date(FechaFinalModi)}
                                        },{articulos:0,tipoMovimiento:0,updatedAt:0})
                                .populate('usuario','nombreUser')
        //mandar al cliente los debitos entre las fechas
        res.json({salida})
    },

    traerCompraGet : async(req,res)=>{
        //reciber fechas formato = yyyy-mm-dd
        const { fechaInicial,fechaFinal } = req.query;

        //verificar fechas
        if(fechaInicial==undefined || fechaFinal==undefined){return res.status(400).json({msg:"Fecha inicial o final no estan en la peticion"})}

        //funcion para agregar un dia a la fecha final
        let addDays = function(str,days){
            var myDate = new Date(str);
            myDate.setDate(myDate.getDate()+parseInt(days));
            return myDate
        }
        //obtener la fecha final  + 1 dia
        let FechaFinalModi = addDays( new Date(fechaFinal),1);

        // let newFechaInicial = new Date(new Date(fechaInicial).getTime() + 1000 * 60 * 60 * 24)
        // let newFechaFuturo = new Date(new Date(FechaFinalModi).getTime() + 1000 * 60 * 60 * 48)

        //buacar por filtros en la bd
        const compra = await Movimiento.find({
                                            tipoMovimiento:"compra",
                                            createdAt:{$gte:new Date(fechaInicial),$lt:new Date(FechaFinalModi)}
                                        },{articulos:0,tipoMovimiento:0,updatedAt:0})
                                .populate('usuario','nombreUser')
                                .populate('proveedor','nombre')
        //mandar al cliente los debitos entre las fechas
        res.json({compra})
    },

    traerSalidaByIdGet : async(req,res)=>{
        const {id}=req.params;
        const salida = await Movimiento.findOne({_id:id})
                                        .populate('usuario','nombreUser')
        res.json({salida})  
        
    },


    traerCompraByIdGet : async(req,res)=>{
        const {id}=req.params;
        const compra = await Movimiento.findOne({_id:id})
                                        .populate('usuario','nombreUser')
                                        .populate('proveedor','nombre')
        res.json({compra})
    },
    
    eliminarMovimientoByIdGet : async(req,res)=>{
        const {id}=req.params;
        const compra = await Movimiento.findByIdAndDelete(id);
        res.json({compra:"Compra eliminada"})
    }
}

export default movimientoControllers