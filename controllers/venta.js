 import Venta from '../models/venta.js';
 import {personaFacturaVenta} from '../helpers/cliente.js';
 import GeneralData from '../models/generalData.js'
 import {
    facturaDebito,
    facturaAbonoAbono,
    facturaAbono,
    facturaVenta,
    facturaVentaVenta,
    facturaVentaAbono 
} from '../helpers/venta.js'

//https://www.youtube.com/watch?v=UPOU_bjeTN8

 const ventaControllers={

    //agregar venta
    agregarFacturaPost : async (req,res)=>{
        //recibir datos
        const {usuario,numFactura,tipoFactura,guardarDatos,existeCliente,...resto} = req.body;

        //limpiar variables
        const numeroFacutra = Number(numFactura);
        const typeFactura = tipoFactura.toString().toLowerCase().trim();
        var venta={};
        var person='';
        
        //validar que exista la persona cliente
        if(resto.persona==undefined){return res.status(400).json({msg:`Persona faltante en la peticion`})}

        //optener id de persona si existe
        if(resto.persona._id){
            let other = resto.persona._id
            person = other.trim()
        }

        //si existeCliente es true no pasar por aca
        if(!existeCliente){

            //falso guardar datos de cliente
            if(guardarDatos===false){

                //validar que venga persona
                if(!resto.persona){return res.status(400).json({msg:"Persona faltante"})}

                //agregar  si no existe si existe entonces no agregar
                const guardarPersona = await personaFacturaVenta(resto.persona);

                //si no es verdadero paso un error
                if (guardarPersona!==true) {
                    return res.status(400).json({msg:`${guardarPersona}`})
                }
            }
        }

        //crear el movimiento de acuerdo al tipo de factura
        if(typeFactura=="debito"){
            
            //validar variables de acuerdo a la factura debito
            let verificacion = await facturaDebito(resto);
            if(verificacion != true){
                return res.status(400).json({msg:`${verificacion}`});
            }

            //limpiar las variables
            var saldoAnterior = Number(resto.saldoAnterior);
            var efectivo = Number(resto.efectivo);
            var nequi = Number(resto.nequi);
            var tarjeta = Number(resto.tarjeta);
            var comentario = resto.comentario;

            let fechita = new Date(new Date(Date.now()).getTime() - 1000 * 60 * 60 * 5)
            //crear el objeto movimiento
            venta = Venta({
                usuario,
                numFactura:numeroFacutra,
                tipoFactura:typeFactura,
                guardarDatos,
                existeCliente,
                persona:person,
                saldoAnterior,
                efectivo,
                nequi,
                tarjeta,
                comentario,
                createdAt:fechita
            })

        //abonoAbono
        }else if(typeFactura=="abonoabono"){

            //validar variables de acuedo a la factura abonoabono
            const validacion = await facturaAbonoAbono(resto);
            if(validacion!=true){
                return res.status(400).json({msg:`${validacion}`});
            }

            //limpiar variables
            var saldoAnterior = Number(resto.saldoAnterior);
            var efectivo = Number(resto.efectivo);
            var nequi = Number(resto.nequi);
            var tarjeta = Number(resto.tarjeta);
            var credito = Number(resto.credito);
            var articulos = [];
            var comentario = resto.comentario.trim();
            var articulosLimpios = [];
            //si el saldo es cero enonces hay articulos
            var existeArticulo = saldoAnterior - efectivo - nequi - tarjeta - credito;

            //si no es cerco articulos vacions
            if(existeArticulo!=0){
                articulos=[]
            }else{
                //de lo contrario si debe haber articulos
                if(resto.articulos==undefined){return res.status(400).json({msg:"Articulos faltantes en la peticion"});}
                articulos = resto.articulos
                if(articulos.length==0){return res.status(400).json({msg:"Articulos faltantes"});}
                articulos.map((articulo)=>facturaAbono(articulo._id , articulo.cantidad))
                
                for(var element of articulos){
                    let codigoUnidco = element.categoriaName + '-' + element.marcaName + '-' + element.referencia;
                    articulosLimpios.push({
                        _id:element._id,
                        categoria:element.categoria,
                        marca : element.marca,
                        sku: codigoUnidco,
                        cantidad : element.cantidad,
                    })
                };
            } 
            let fechita = new Date(new Date(Date.now()).getTime() - 1000 * 60 * 60 * 5)
            //crear objeto articulos
            venta = Venta({
                usuario,
                numFactura:numeroFacutra,
                tipoFactura:typeFactura,
                guardarDatos,
                existeCliente,
                persona:person,
                saldoAnterior,
                efectivo,
                nequi,
                tarjeta,
                credito,
                articulos:articulosLimpios,
                comentario,
                createdAt:fechita
            })


        }else if(typeFactura=="venta"){
            
            ///validar variables
            const verificacion = await facturaVenta(resto);
            if(verificacion!==true){
                return res.status(400).json({msg:`${verificacion}`});
            }

            //limpiar variables
            var subTipoFactura = resto.subTipoFactura.toString().toLowerCase().trim();
            var totalPrecio = Number(resto.totalPrecio);
            var totalCosto = Number(resto.totalCosto);
            var descuento = Number(resto.descuento);
            var efectivo = Number(resto.efectivo);
            var nequi = Number(resto.nequi);
            var tarjeta = Number(resto.tarjeta);
            var credito = Number(resto.credito);
            var articulos = resto.articulos;
            var comentario = resto.comentario;

            //segun subtipo de factura
            if(subTipoFactura == 'venta'){
                //venta aumenta, disminuye disponibles
                articulos.map((articulo)=>facturaVentaVenta(articulo._id, articulo.cantidad))
            }else{
                //separadas aumentan, disminuye disponibles
                articulos.map((articulo)=>facturaVentaAbono(articulo._id, articulo.cantidad))
            }

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
            //crear objeto movimiento
            venta = Venta({
                usuario,
                numFactura:numeroFacutra,
                tipoFactura:typeFactura,
                subTipoFactura,
                guardarDatos,
                existeCliente,
                persona:person,
                totalPrecio,
                totalCosto,
                descuento,
                efectivo,
                nequi,
                tarjeta,
                credito,
                articulos:articulosLimpios,
                comentario,
                createdAt:fechita
            })
        }else{
            return res.status(400).json({msg:"algun error en tipo de factura"})
        }
        
        await venta.save();
        await GeneralData.findOneAndUpdate({_id:1},{numFactura:numeroFacutra});
        res.json({msg:"Factura realizada"})
    },

    traerVentaByIdGet : async (req,res)=>{
        const {id} = req.params;
        const venta = await Venta.findOne({_id:id})
                                .populate('usuario','nombreUser')
        res.json({venta})
    },

    //traer los debitos por fecha
    traerDebidosGet : async(req,res)=>{
        //reciber fechas formato = yyyy-mm-dd
        const { fechaInicial,fechaFinal } = req.query;

        //verificar que existan la variables en la peticion
        if(fechaInicial==undefined || fechaFinal==undefined){
            return res.status(400).json({msg:"Fecha inicial o final no estan en la peticion"})
        }

        //funcion para agregar un dia a la fecha final
        let addDays = function(str,days){
            var myDate = new Date(str);
            myDate.setDate(myDate.getDate()+parseInt(days));
            return myDate
        }

        //obtener la fecha final  + 1 dia
        let FechaFinalModi = addDays( new Date(fechaFinal),1);

        //buacar por filtros en la bd
        const venta = await Venta.find({
                                            tipoFactura:"debito",
                                            "createdAt":{$gte:new Date(fechaInicial),$lt:new Date(FechaFinalModi)}
                                        },{guardarDatos:0,existeCliente:0,articulos:0,tipoFactura:0,updatedAt:0,__v:0})
                                .populate('usuario','nombreUser')
                                
        res.json({venta})
    },

    //traer los debitos por fecha
    traerAbonosGet : async(req,res)=>{
        //reciber fechas formato = yyyy-mm-dd
        const { fechaInicial,fechaFinal } = req.query;

        //verificar que existan la variables en la peticion
        if(fechaInicial==undefined || fechaFinal==undefined){
            return res.status(400).json({msg:"Fecha inicial o final no estan en la peticion"})
        }

        //funcion para agregar un dia a la fecha final
        let addDays = function(str,days){
            var myDate = new Date(str);
            myDate.setDate(myDate.getDate()+parseInt(days));
            return myDate
        }

        //obtener la fecha final  + 1 dia
        let FechaFinalModi = addDays( new Date(fechaFinal),1);

        //buacar por filtros en la bd
        const venta = await Venta.find({
                                            tipoFactura:"abonoabono",
                                            "createdAt":{$gte:new Date(fechaInicial),$lt:new Date(FechaFinalModi)}
                                        },{existeCliente:0,guardarDatos:0,articulos:0,tipoFactura:0,updatedAt:0,__v:0})
                                .populate('usuario','nombreUser')
                                
        res.json({venta})
    },

    //traer los ventas por fecha
    traerVentasGet : async(req,res)=>{

        //reciber fechas formato = yyyy-mm-dd
        const { fechaInicial,fechaFinal,tipoVenta } = req.query;

        //verificar que existan la variables en la peticion
        if(fechaInicial==undefined || fechaFinal==undefined){
            return res.status(400).json({msg:"Fecha inicial o final no estan en la peticion"})
        }

        if(tipoVenta==undefined){
            return res.status(400).json({msg:"Subtipo de venta no esta en la peticion"})
        }

        let typeSell = tipoVenta.toLowerCase().trim();

        //funcion para agregar un dia a la fecha final
        let addDays = function(str,days){
            var myDate = new Date(str);
            myDate.setDate(myDate.getDate()+parseInt(days));
            return myDate
        }

        //obtener la fecha final  + 1 dia
        let FechaFinalModi = addDays( new Date(fechaFinal),1);
        
        //buacar por filtros en la bd
        if(typeSell==""){
            
            const venta = await Venta.find({
                                                tipoFactura:"venta",
                                                "createdAt":{$gte:new Date(fechaInicial),$lt:new Date(FechaFinalModi)}
                                            },{
                                                existeCliente:0,
                                                guardarDatos:0,
                                                articulos:0,
                                                tipoFactura:0,
                                                updatedAt:0,
                                                __v:0
                                            })
                                    .populate('usuario','nombreUser')
                
            return res.json({venta})

        }else if(typeSell=="venta"){
            
            const venta = await Venta.find({
                                            tipoFactura:"venta",
                                            subTipoFactura:"venta",
                                            "createdAt":{$gte:new Date(fechaInicial),$lt:new Date(FechaFinalModi)}
                                        },{
                                            existeCliente:0,
                                            guardarDatos:0,
                                            articulos:0,
                                            tipoFactura:0,
                                            updatedAt:0,
                                            __v:0
                                        })
                                    .populate('usuario','nombreUser')

            return res.json({venta})

        }else if(typeSell=="abono"){
            
            const venta = await Venta.find({
                                                tipoFactura:"venta",
                                                subTipoFactura:"abono",
                                                "createdAt":{$gte:new Date(fechaInicial),$lt:new Date(FechaFinalModi)}
                                            },{
                                                existeCliente:0,
                                                guardarDatos:0,
                                                articulos:0,
                                                tipoFactura:0,
                                                updatedAt:0,
                                                __v:0
                                            })
                                        .populate('usuario','nombreUser')

            return res.json({venta})

        }else{
            return res.status(400).json({msg:"Error en sub tipo de factura venta"})
        }
        
        
    },

    // traer factura por numFactura o persona
    traerFacturaByNumber : async(req,res)=>{
        //reciber fechas formato = yyyy-mm-dd
        const { buscar, buscarDato } = req.query;

        //limpiar datos
        let search = buscar.toString().toLowerCase().trim();
        let dato = null;

        if(search=="cliente"){
            dato = buscarDato.toString().trim();
        }else{
            dato = Number(buscarDato);
            if(Number.isNaN(dato)){
                return res.status(400).json({msg:"Dato tipo numero para buscar por factura"})
            }
        }

        //buscar de acuerdo a los criterios
        if(search=='cliente'){
            const venta = await Venta.find({
                                                persona:dato,
                                            },{
                                                existeCliente:0,
                                                guardarDatos:0,
                                                updatedAt:0,
                                                __v:0
                                            })
                                        .populate('usuario','nombreUser')
                                        .sort({createdAt:-1})
            return res.json({venta})
        }else{
            const venta = await Venta.findOne({
                                                numFactura:dato,
                                            },{
                                                existeCliente:0,
                                                guardarDatos:0,
                                                updatedAt:0,
                                                __v:0
                                            })
                                        .populate('usuario','nombreUser')

            return res.json({venta})

        }

    }
}

export default ventaControllers
