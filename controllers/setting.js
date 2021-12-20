import Configuracion from "../models/setting.js";


const configuracionesControllrs={

    //crear configuracion (datos del establecimiento comercial) si no existe, si ya existe mandar false
    configuracionesPost : async (req,res)=>{

        //busca documento de configuracion 
        const buscar = await Configuracion.findOne({_id:1})
        if(buscar){return res.status(400).json({msg:false})}

        //si no existe crear documento de configuracion 
        const configuraciones = await Configuracion({_id:1});
        await configuraciones.save();
        res.json({msg:'Creado'})
    },

    //trear configuracion de la bd y retornarla
    configuracionesGet : async (req,res)=>{
        //traer documento de configuracion
        var configuraciones = await Configuracion.findOne({_id:1});

        //si no existe cree la configuracion
        if(!configuraciones){
            configuraciones = await Configuracion({_id:1});
            await configuraciones.save();
            configuraciones = await Configuracion.findOne({_id:1});
        }

        res.json({configuraciones});
    },

    //actualizar name store
    nameStorePut: async(req,res)=>{
        //recibir variable de la peticion
        const { nameStore } = req.body;

        //limpiar variable
        const name = nameStore.toString().trim().toUpperCase()

        //si no existe la configuracion returnar false
        const configuraciones = await Configuracion.findOne({_id:1});
        if(!configuraciones){
            const configuraciones = await Configuracion({_id:1});
            await configuraciones.save();    
        }

        //actualizar configuracion
        const configuracionactualizar = await Configuracion.findByIdAndUpdate(1,{nameStore:name});
        res.json({msg:"Nombre actualizado"})
    },

    //actualizar nit
    nitPut : async (req,res) =>{
        //recibir datos de la peticion
        const { nit } = req.body;

        //limpiar datos de la peticion
        const nitNum = nit.toString().trim()

        //verificar que exista configuracion si no crearla
        const configuraciones = await Configuracion.findOne({_id:1});
        if(!configuraciones){
            const configuraciones = await Configuracion({_id:1});
            await configuraciones.save();    
        }   

        //actualizar la configuracion
        const configuracionactualizar = await Configuracion.findByIdAndUpdate(1,{nit:nitNum});
        res.json({msg:"Nit actualizado"})
    },

    //actualizar regimen
    regimenPut : async (req,res) =>{
        //recibir datos de la peticion
        const { regimen } = req.body;

        //limpiar variables
        const regimenLimpio = regimen.toString().trim()

        //validar que exista la configuracion, si no creela
        const configuraciones = await Configuracion.findOne({_id:1});
        if(!configuraciones){
            const configuraciones = await Configuracion({_id:1});
            await configuraciones.save();    
        }

        //actualizar la configuracion
        const configuracionactualizar = await Configuracion.findByIdAndUpdate(1,{regimen:regimenLimpio});
        res.json({msg:"Regimen actualizado"})
    },

    //actualizar representante
    representantePut : async (req,res) =>{
        //recibir valores de peticion
        const { representanteCC } = req.body;

        //limpiar variables
        const representanteCCLimpio = representanteCC.toString().trim().toUpperCase()

        //validar que exista configuracion si no creela
        const configuraciones = await Configuracion.findOne({_id:1});
        if(!configuraciones){
            const configuraciones = await Configuracion({_id:1});
            await configuraciones.save();    
        }
        
        //actualizar configuracion
        const configuracionactualizar = await Configuracion.findByIdAndUpdate(1,{representanteCC:representanteCCLimpio});
        res.json({msg:"Representante actualizado"})
    },

    //actualizar departamento
    departamentoPut : async (req,res) =>{
        //recibir varibales de la peticio
        const { departamento } = req.body;

        //limpiar variable
        const departamentoLimpio = departamento.toString().trim()

        //verificar que exista la configuracion si no creela
        const configuraciones = await Configuracion.findOne({_id:1});
        if(!configuraciones){
            const configuraciones = await Configuracion({_id:1});
            await configuraciones.save();    
        }

        //actualizar configuracion
        const configuracionactualizar = await Configuracion.findByIdAndUpdate(1,{departamento:departamentoLimpio});
        res.json({msg:"Departamento actualizado"})
    },

    //actualizar ciudad
    ciudadPut : async (req,res) =>{
        //recibir variables de la peticon
        const { ciudad } = req.body;

        //limpiar variable
        const ciudadLimpio = ciudad.toString().trim()

        //validar si existe la configuracion si no creela
        const configuraciones = await Configuracion.findOne({_id:1});
        if(!configuraciones){
            const configuraciones = await Configuracion({_id:1});
            await configuraciones.save();    
        }

        //actualizar configuracion
        const configuracionactualizar = await Configuracion.findByIdAndUpdate(1,{ciudad:ciudadLimpio});
        res.json({msg:"Ciudad actualizada"})
    },


    //actualizar direccion
    direccionPut : async (req,res) =>{
        //recibir variable de la peticion
        const { direccion } = req.body;

        //limpiar variable
        const direccionLimpio = direccion.trim().toUpperCase()

        //validar si existe la configutracion si no creela
        const configuraciones = await Configuracion.findOne({_id:1});
        if(!configuraciones){
            const configuraciones = await Configuracion({_id:1});
            await configuraciones.save();    
        }

        //actualizar configuracion
        const configuracionactualizar = await Configuracion.findByIdAndUpdate(1,{direccion:direccionLimpio});
        res.json({msg:"Direccion actualizada"})
    },


    //actualizar celular
    celularPut : async (req,res) =>{
        //recibir variables de la peticon
        const { celular } = req.body;

        //limpiar variables
        const celularLimpio = celular.toString().trim()

        //validar si existe configuracion, sino creela
        const configuraciones = await Configuracion.findOne({_id:1});
        if(!configuraciones){
            const configuraciones = await Configuracion({_id:1});
            await configuraciones.save();    
        }

        //actualizar configuracion
        const configuracionactualizar = await Configuracion.findByIdAndUpdate(1,{celular:celularLimpio});
        res.json({msg:"Celular actualizado"})
    },

    //actualizar telefono
    telefonoPut : async (req,res) =>{
        //recibir variables de la peticion
        const { telefono } = req.body;

        //limpiar variable
        const telefonoLimpio = telefono.toString().trim()

        //validar si existe configuracion, sino creela
        const configuraciones = await Configuracion.findOne({_id:1});
        if(!configuraciones){
            const configuraciones = await Configuracion({_id:1});
            await configuraciones.save();    
        }

        //actualizar configuracion
        const configuracionactualizar = await Configuracion.findByIdAndUpdate(1,{telefono:telefonoLimpio});
        res.json({msg:"Telefono actualizado"})
    },

    //actualizar email
    emailPut : async (req,res) =>{
        //recibir valores de peticion
        const { email } = req.body;

        //limpiar variable
        const emailLimpio = email.toString().trim()
        
        //validar si existe configuracion, sino creela
        const configuraciones = await Configuracion.findOne({_id:1});
        if(!configuraciones){
            const configuraciones = await Configuracion({_id:1});
            await configuraciones.save();    
        }

        //actualizar configuracion
        const configuracionactualizar = await Configuracion.findByIdAndUpdate(1,{email:emailLimpio});
        res.json({msg:"Email actualizado"})
    },

}

export default configuracionesControllrs