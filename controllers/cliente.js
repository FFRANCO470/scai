import Cliente from '../models/cliente.js';
import {
    existeDireccion,
    existeCiudad,
    existeTelefono,
    existeEmail,
    guardarClientesImportados
} from '../helpers/cliente.js';

const clienteControllers={

    //agregar cliente desde formulario
    clienteFormularioPost : async (req,res)=>{
        //resivir variables de la peticion
        const {tipoDocumento, _id, nombre, ...resto}=req.body;

        //limpiar variables
        const typeDocument = tipoDocumento.toString().toLowerCase().trim();
        const numDocument = _id.toString().trim();
        const name = nombre.toString().toLowerCase().trim();
        
        //variables no obligatorias en la ruta
        var address='';
        var city='';
        var phone='';
        var correo ='';

        //validar direccion
        if(resto.direccion){
            address = resto.direccion.toString().trim();
            let existe = await existeDireccion(address);
            if(existe!=true){return res.status(400).json({msg:`${existe}`})}
        }

        //validar ciudad
        if(resto.ciudad){
            city = resto.ciudad.toString().toLowerCase().trim();
            let existe = await existeCiudad(city);
            if(existe!=true){return res.status(400).json({msg:`${existe}`})}
        }
        
        //validar telefono
        if(resto.telefono){
            phone = resto.telefono.toString().trim();
            let existe = await existeTelefono(phone);
            if(existe!=true){return res.status(400).json({msg:`${existe}`})}
        }
        
        //validar email
        if(resto.email){
            correo = resto.email.toString().trim();
            let existe = await existeEmail(correo);
            if(existe!=true){return res.status(400).json({msg:`${existe}`})}
        }
        let fechita = new Date(new Date(Date.now()).getTime() - 1000 * 60 * 60 * 5)
        //crear objeto cliente
        const cliente = Cliente({
            tipoDocumento:typeDocument, 
            _id:numDocument,
            nombre:name,
            direccion:address,
            ciudad:city, 
            telefono:phone, 
            email:correo,
            createdAt:fechita
        });

        //guardar cliente en bd y responder a cliente
        await cliente.save();
        res.json({msg:"Cliente agregado"})   
    },

    clientePostImportacion : async (req,res)=>{
        console.log("entre");
        const { clientes } = req.body;
        await clientes.map((cliente)=>guardarClientesImportados(cliente));
        res.json({msg:"Clientes registrados"})
    },

    
    //traer todos lo clientes que contengan un caracter en especial
    clientesGet : async (req,res)=>{
        //recibir valores de peticion
        const value = req.query.value;

        //buscar y traer los clientes
        const persona = await Cliente
            .find(
                {
                    $or:[
                        {tipoDocumento:new RegExp(value,'i')},
                        {numDocumento:new RegExp(value,'i')},
                        {nombre:new RegExp(value,'i')},
                        {direccion:new RegExp(value,'i')},
                        {ciudad:new RegExp(value,'i')},
                        {telefono:new RegExp(value,'i')},
                        {email:new RegExp(value,'i')},
                    ]
                }     
            )
        res.json({persona})
    },

    //Buscar persona por # documento, si no devolver false
    buscarClienteGet : async (req,res)=>{
        const numDocumento=req.query.numDocumento;
        const documento = numDocumento.toString().trim();
        if(documento===""){return res.status(400).json({msg:'Numero de documento obligatorio'})}
        const persona = await Cliente.findOne({_id:documento})
        if (!persona) {return res.json({persona:false})}
        res.json({persona})
    },    

    //actualizar tipo de documento
    clientePutTipoDoc : async (req,res)=>{
        //recibir valores de la peticion
        const {id} = req.params;
        const {tipoDocumento}=req.body;

        //limpiar variables
        const _id = id.toString().trim();
        const tipoDocu = tipoDocumento.toString().toLowerCase().trim();
        
        //buscar, actualizar y responder
        const persona = await Cliente.findByIdAndUpdate(_id,{tipoDocumento:tipoDocu});
        res.json({msg:"Tipo de documento actualizado"})
    },
    
    //actualiza nombre de cliente
    clientePutNombre : async (req,res)=>{
        //recibir variables de peticion
        const {id} = req.params;
        const {nombre}=req.body;
        
        //limpiar varialbes
        const _id = id.toString().trim();
        const name = nombre.toString().toLowerCase().trim();
        
        //buscar, actualizar y responder
        const persona = await Cliente.findByIdAndUpdate(_id,{nombre:name});
        res.json({msg:"Nombre actualizado"})
    },

    //actualizar direccion de persona
    clientePutDireccion : async (req,res)=>{
        //resibir variables de la peticion
        const {id} = req.params;
        const { direccion}=req.body;

        //limpiar variables
        const _id = id.toString().trim();
        const address = direccion.toString().trim();
        
        //buscar, actualizar y responder
        const persona = await Cliente.findByIdAndUpdate(_id,{direccion:address});
        res.json({msg:"Direccion actualizada"})
    },

    //ruta 8 : actualizar direccion de persona
    clientePutCiudad : async (req,res)=>{
        //resibir variables de peticion
        const {id} = req.params;
        const {ciudad}=req.body;
        
        //limpiar variables
        const _id = id.toString().trim();
        const city = ciudad.toString().toLowerCase().trim();
        //buscar, actualizar y resonder
        const persona = await Cliente.findByIdAndUpdate(_id,{ciudad:city});
        res.json({msg:"Ciudad actualizada"})
    },

    //ruta 9: actualizar telefono
    clientePutTelefono : async (req,res)=>{
        
        //recibir variables de peticion
        const {id} = req.params;
        const {telefono}=req.body;
        
        //limpiar variables
        const _id = id.toString().trim();
        const phone = telefono.toString().trim();
        
        //buscar, actualizar y responder
        const persona = await Cliente.findByIdAndUpdate(_id,{telefono:phone});
        res.json({msg:"Telefono actualizado"})
    },

    //ruta 10: actualizar email
    clientePutEmail : async (req,res)=>{
        //recibir variables de peticion
        const {id} = req.params;
        const {email}=req.body;
        
        //limpiar variables
        const _id = id.toString().trim();
        const correo = email.trim();

        //buscar, actualizar y responder
        const persona = await Cliente.findByIdAndUpdate(_id,{email:correo});
        res.json({msg:"Email actualizado"})
    },

    clienteDelete : async(req,res)=>{
        //recibir variables de peticion
        const {id} = req.params;
        
        //limpiar variables
        const _id = id.toString().trim();

        //Eliminar cliente por id
        const persona = await Cliente.findByIdAndDelete(_id);
        res.json({msg:"Persona eliminada"})
    },

    
}
export default clienteControllers