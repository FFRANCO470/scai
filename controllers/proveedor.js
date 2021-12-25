import Proveedor from "../models/proveedor.js";

const proveedorControllers = {

    //agregar proveedor por formulario
    proveedorFormularioPost : async (req,res)=>{
        //revisar variables de peticion
        const {nombre,...resto} = req.body;

        //limpiar variables
        var name = nombre.toString().toLowerCase().trim();
        var phone = "";
        var address = "";

        //validar telefono
        if(resto.telefono){
            phone = resto.telefono.toString().toLowerCase().trim();
            if(phone.length>150){return res.status(400).json({msg:"Telefono mayor a 150 caracteres"})}
        }

        //validar direccion
        if(resto.direccion){
            address = resto.direccion.toString().toLowerCase().trim();
            if(address.length>150){return res.status(400).json({msg:"Dirección mayor a 150 caracteres"})}
        }
        let fechita = new Date(new Date(Date.now()).getTime() - 1000 * 60 * 60 * 5)
        //crear objeto proveedor
        const proveedor = Proveedor({
            nombre:name,
            telefono:phone,
            direccion:address,
            createdAt:fechita
        });

        //guardar proveedor en la bd y responder al cliente 
        await proveedor.save();
        res.json({msg:"Proveedor agregado"})
    },

    //traer de la bd losproveedores por un caracter y enviarlos
    proveedoresGet : async(req,res)=>{

        //recibir variables de la peticion
        const value = req.query.value;

        //traer los proveedores que contengan en cualquiere propiedad el caracter enviado
        const proveedor = await Proveedor.find({
            $or:[
                {nombre:new RegExp(value,'i')},
                {telefono:new RegExp(value,'i')},
                {direccion:new RegExp(value,'i')}
            ]
        },{createdAt:0,updatedAt:0})

        //responder al usuario
        res.json({proveedor})
    },

    //traer del a bd al proveedor por id y enviarlo
    proveedorByIdGet : async (req,res)=>{
        const {id} = req.params;
        const persona = await Proveedor.findOne({_id:id});
        res.json({persona})
    },

    //traer de la bd los proveedores activos y enviarlo
    proveedorerActivosGet : async (req,res)=>{
        const proveedor = await Proveedor.find({estado:1},{_id:1,nombre:1});
        res.json({proveedor})
    },

    //activar proveedor
    proveedorPutActivar : async (req,res)=>{
        const {id} = req.params;
        const proveedor = await Proveedor.findByIdAndUpdate(id,{estado:1});
        res.json({msg:"Proveedor activada"})
    },

    //desactivar proveedor
    proveedorPutDesactivar : async (req,res)=>{
        const {id} = req.params;
        const proveedor = await Proveedor.findByIdAndUpdate(id,{estado:0});
        res.json({msg:"Proveedor desactivada"})
    },

    // actualizar nombre proveedor
    proveedorNombrePut : async (req,res) =>{
        //recibir varialbes de la peticion
        const {id} = req.params;
        const {nombre} = req.body;

        //limpiar varialbe
        const name = nombre.toString().toLowerCase().trim();

        //actualizar proveedor
        const persona = await Proveedor.findByIdAndUpdate(id,{nombre:name})
        res.json({msg:"Nombre actualizado"})
    },

    //actualizar telefono proveedor
    proveedorTelefonoPut : async (req,res) =>{
        //recibir valores de la peticon
        const {id} = req.params;
        const {telefono} = req.body;

        //limpiar variable
        const phone = telefono.toString().toLowerCase().trim();

        //actualizar proveedor
        const persona = await Proveedor.findByIdAndUpdate(id,{telefono:phone})
        res.json({msg:"Telefono actualizado"})
    },

    //actualizar dirccion proveedor
    proveedorDireccionPut : async (req,res) =>{
        //recibir variables de la peticion
        const {id} = req.params;
        const {direccion} = req.body;

        //limpiar variable
        const address = direccion.toString().toLowerCase().trim();

        //actualizar proveedor
        const persona = await Proveedor.findByIdAndUpdate(id,{direccion:address})
        res.json({msg:"Direccion actualizado"})
    }
}


export default proveedorControllers