import GeneralData from '../models/generalData.js'

const generalDataControllers={

    //crear tabla con variables generales
    generalDataPost : async(req,res)=>{
        //verificar si hay un documento existente y retornar false si existe
        const buscar = await GeneralData.findOne({_id:1})
        if(buscar){return res.status(400).json({msg:false})}

        //crear objeto de variables globales, guardar y responder a cliente
        const datosGenrales = await GeneralData({_id:1});
        await datosGenrales.save();
        res.json({msg:'Creado'})
    },

    //traer numero de factura de venta
    numVentaGet : async(req,res)=>{
        //buscar si exsite documento con variables globales, si no retornar false
        const buscar = await GeneralData.findOne({_id:1})
        if(!buscar){return res.status(400).json({msg:false})}

        // obener numero de factura, sumar 1 y responder
        let numFactura = buscar.numFactura;
        numFactura = parseInt(numFactura)+1
        res.json({numFactura})
    },



}

export default generalDataControllers