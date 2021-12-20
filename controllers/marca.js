import Marca from '../models/marca.js';

const marcaControllers={

    //agregar marca por formulario
    marcaPost : async (req,res)=>{
        //recibir variable de peticion
        const {nombre} = req.body;

        //limpiar variable 
        const name = nombre.toLowerCase().trim();

        //crear objeto marca, guardar en la bd y responder a cliente
        const marca = Marca({nombre:name});
        await marca.save();
        res.json({msg:"Marca agregada"});
    },

    //traer todas las marcas por un caracter en especial de la bd
    marcaGet : async (req,res)=>{
        //recibir variables de peticion
        const value = req.query.value;

        //buscar marcas en la bd y responder al cliente con ellas
        const marca = await Marca.find({nombre:new RegExp(value,'i')}).sort({'createAt':1});
        res.json({marca})
    },

    //traer marcas activas de la bd
    marcasActivasGet : async (req,res)=>{
        const marca = await Marca.find({estado:1}).sort({'createAt':1});
        res.json({marca})
    },

    //traer marca si existe, si no retornar false
    buscarMarcaGet : async (req,res)=>{
        //recibir variables de peticion
        const nombre = req.query.nombre;

        //limpiar y validar variables
        const name = nombre.toLowerCase().trim();
        if(name==""){return res.status(400).json({msg:'Nombre obligatorio'})}

        //buscar marca por nombre
        const marca = await Marca.findOne({nombre:name})

        //si no existe marca por nombre retornar false
        if (!marca) {return res.json({marca:false})}

        //si existe marca retornarla
        res.json({marca:marca.nombre})
    },
    
    //desactivar marca por id
    marcaPutActivar : async (req,res)=>{
        const {id} = req.params;
        const marca = await Marca.findByIdAndUpdate(id,{estado:1});
        res.json({msg:"Marca activada"})
    },

    //activar marca por id
    marcaPutDesactivar : async (req,res)=>{
        const {id} = req.params;
        const marca = await Marca.findByIdAndUpdate(id,{estado:0});
        res.json({msg:"Marca desactivada"})
    },

    //actualizar marca
    marcaPut : async (req,res)=>{

        //recibir valores de la peticion
        const {id} = req.params;
        const {nombre}=req.body;

        //limpiar variables
        const name = nombre.toLowerCase().trim();

        //validar estado de la marca
        const marca = await Marca.findOne({_id:id})
        if(marca.estado === 0) {return res.status(400).json({msg:'Marca desactivada'})}

        //actualizar marca y responder al clietne
        const marca2 = await Marca.findByIdAndUpdate(id,{nombre:name});
        res.json({msg:"Marca actualizada"})
    },
    
}
export default marcaControllers