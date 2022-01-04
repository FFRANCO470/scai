import Articulo from '../models/articulo.js';
import {existeArticuloByDescription,crearSku} from '../helpers/artiuculo.js'
import mongoose from 'mongoose'

const articuloControllers={
    
    //agregar articulo atravez de formulario
    articuloPost : async (req,res)=>{
        //recibir datos de la peticion
        const {categoria,marca,referencia,costo,precio,cantDisponibles} = req.body;

        //limpiar datos de la peticion
        const ref = referencia.trim();
        const cant = Number(cantDisponibles);
        const cost = Number(costo);
        const price = Number(precio);

        //verificar que no exista el articulo
        const existe = await existeArticuloByDescription(categoria,marca,ref)
        if(existe){return res.status(400).json({msg:`Articulo ya existente`})}

        //crear sku = codigo unico de inventario
        const sku  = await crearSku(categoria,marca,ref);
        
        //fecha colombiana
        let fechita = new Date(new Date(Date.now()).getTime() - 1000 * 60 * 60 * 5)

        //crear objeto articulo
        const articulo =   Articulo({
            categoria,
            marca,
            referencia:ref,
            sku:sku,
            cantDisponibles:cant,
            costo:cost,
            precio:price,
            createdAt:fechita
        });
        
        //guardar en la bd
        await articulo.save();
        
        //responder al cliente
        res.json({msg:"Articulo agregado"});
    },

    //enviar todos los articulos
    articuloGet : async (req,res)=>{
        const articulo = await Articulo.find()
                                        .populate('categoria','nombre')
                                        .populate('marca','nombre')
        res.json({articulo})
    },

    //enviar articulos por cateogoria y/o marca, o todos
    articuloPostMarcaAndCategoria : async (req,res)=>{
        
        //recibir los datos de la peticon
        const {...resto} = req.body;

        //array con articulos buscados
        var articulo=[]

        //verificar que la peticion no este vacia
        if(Object.entries(resto).length!=0){

            //verificar las variables en la peticion
            if(resto.categoria==undefined){return res.status(400).json({msg:"Categoria obligatoria en peticion"})}
            if(resto.marca==undefined){ return res.status(400).json({msg:"Marca obligatoria en peticion"}) }
            
            //limpiar datos de llegada
            var categoria = resto.categoria.trim();
            var marca = resto.marca.trim();
            
            //si ambas estan vacio enviar todos los articulos
            if(categoria=="" && marca==""){
                //return res.status(400).json({msg:"Completar almenos un campo"})
                const articulo = await Articulo.find()
                                        .populate('categoria','nombre')
                                        .populate('marca','nombre')
                return res.json({articulo})
            }else{
                //verificar que sea id
                if(categoria != ""){
                    let veri =  mongoose.Types.ObjectId.isValid(categoria) 
                    if(veri==false){ return res.status(400).json({msg:"ID de categoria no valida"}) }
                }
                //verificar que sea id
                if(marca != ""  ){
                    let very = mongoose.Types.ObjectId.isValid(marca)
                    if(very==false){  return res.status(400).json({msg:"ID de marca no valida"})  }
                }
    
                //enviar los articulos con la categoria y marca de la peticion
                if( categoria != "" && marca !="" ){
                    articulo = await Articulo.find({$and:[{categoria:categoria},{marca:marca}]})
                                                .populate('categoria','nombre')
                                                .populate('marca','nombre')
                    return res.json({articulo})

                //enviar los articulos con la categoria de la peticion
                }else if(categoria != "" && marca ==""){
                    articulo = await Articulo.find({categoria:categoria})
                                                .populate('categoria','nombre')
                                                .populate('marca','nombre')
                    return res.json({articulo})

                //enviar los articulos con la marca de la peticion
                }else if(categoria == ""&& marca != ""){
                    articulo = await Articulo.find({marca:marca})
                                                .populate('categoria','nombre')
                                                .populate('marca','nombre')
                    return res.json({articulo})
                }else{
                    //algo no previsto
                    return res.status(400).json({msg:"Evento inesperado"})
                }
            }
        }else{
            //petición vacia
            return res.status(400).json({msg:"Peticion vacia"})
        }
    },

    //enviar articulos activos
    articulosActivosGet : async(req,res)=>{
        const articulo = await Articulo.find({estado:1},{_id:1,costo:1,precio:1,categoria:1,marca:1,referencia:1})
                                        .populate('categoria','nombre')
                                        .populate('marca','nombre')
        res.json({articulo})
    },
    
    //enviar articulos separados y activos
    articulosSeparadasGet : async(req,res)=>{
        const articulo = await Articulo.find({estado:1,cantSeparadas:{$gt:0}}).populate('categoria','nombre').populate('marca','nombre')
        res.json({articulo})
    },

    //enviar articulo por id
    articuloGetId : async (req,res)=>{
        const {id}=req.params;
        const articulo = await Articulo.findOne({_id:id}).populate('categoria','nombre').populate('marca','nombre')
        res.json({articulo})
    },
    
    //activar articulo
    articuloPutActivar : async (req,res)=>{
        const {id} = req.params;
        const articulo = await Articulo.findByIdAndUpdate(id,{estado:1});
        res.json({msg:"Articulo activado"})
    },

    //desactivar articulo
    articuloPutDesactivar : async (req,res)=>{
        const {id} = req.params;
        const articulo = await Articulo.findByIdAndUpdate(id,{estado:0});
        res.json({msg:"Articulo desactivado"})
    },

    //eliminar articulo
    articuloDelete : async(req,res)=>{
        //recibir variables de peticion
        const {id} = req.params;
        
        //limpiar variables
        const _id = id.toString().trim();

        //Eliminar cliente por id
        const articulo = await Articulo.findByIdAndDelete(_id);
        res.json({msg:"Articulo eliminado"})
    },

    //actualizar categoria
    articuloPutCategoria : async (req,res)=>{
        //recibir datos de la peticion
        const {id} = req.params;
        const {categoria} = req.body;

        //buscar articulo y verificar estado
        const arti = await Articulo.findOne({_id:id});
        if(arti.estado==0){return res.status(400).json({msg:'Articulo descativado'})};

        //verificar que no exista un articulo en la bd igual al que se acaba de actualizar
        var marc = arti.marca;
        var ref = arti.referencia;
        const existe = await existeArticuloByDescription(categoria,marc,ref)
        if(existe){return res.status(400).json({msg:`Articulo ya existente`})}

        //crear codigo unico de inventario sku
        const sku  = await crearSku(categoria,marc,ref); 

        //asignar nuevos valores, guardar y enviar respuesta al cliente 
        arti.categoria=categoria;
        arti.sku=sku;
        await arti.save()
        res.json({msg:"Categoria actualizada"})
    },
    
    //actualizar marca
    articuloPutMarca : async (req,res)=>{
        //recibir datos de la peticion
        const {id} = req.params;
        const { marca } = req.body;
        
        //verificar que este activo el articulo
        const arti = await Articulo.findOne({_id:id});
        if(arti.estado==0){return res.status(400).json({msg:'Articulo descativado'})};
        
        //verificar que no exista un articulo en la bd igual al que se acaba de actualizar
        var cate = arti.categoria;
        var ref = arti.referencia;
        const existe = await existeArticuloByDescription(cate,marca,ref)
        if(existe){return res.status(400).json({msg:`Articulo ya existente`})}
        
        //crear codigo unico de inventario sku
        const sku  = await crearSku(cate,marca,ref);  

        //agregar nuevos valores, guardar y enviar respuesta al cliente
        arti.marca=marca;
        arti.sku=sku;
        await arti.save()
        res.json({msg:"Marca actualizada"})
    },

    //actualizar referencia
    articuloPutReferencia : async (req,res)=>{
        //recibir parametros de la peticion
        const {id} = req.params;
        const { referencia} = req.body;

        //validar que el articulo este activo
        const arti = await Articulo.findOne({_id:id});
        if(arti.estado==0){return res.status(400).json({msg:'Articulo descativado'})};

        //verificar que en la bd no exist un articulo igual
        var cate = arti.categoria;
        var marc = arti.marca;
        const existe = await existeArticuloByDescription(cate,marc,referencia)
        if(existe){return res.status(400).json({msg:`Articulo ya existente`})}

        //crear coidgo unico de inventario sku
        const sku  = await crearSku(cate,marc,referencia);  

        //asignar nuevos valoes, guardar y enviar respuesta al cliente
        arti.referencia=referencia;
        arti.sku=sku;
        await arti.save()
        res.json({msg:"Referencia actualizada"})
    },

    
    //actualizar costo
    articuloPutCosto : async (req,res)=>{
        //reciibr valores de la peticion
        const {id} = req.params;
        const {costo} = req.body;

        //limbiar variables
        const cost = Number(costo);

        //validar estado del articulo   
        const arti = await Articulo.findOne({_id:id})
        if (arti.estado === 0) {return res.status(400).json({msg:'Articulo desactivado'})}

        //actualizar articulo en la bd y enviar respuesta al cliente
        const articulo = await Articulo.findByIdAndUpdate(id,{costo:cost});
        res.json({msg:"Costo actualizado"})
    },

    //actualizar precio
    articuloPutPrecio : async (req,res)=>{
        //recibir valores de la peticion
        const {id} = req.params;
        const {precio} = req.body;

        //limpiar valores de la peticion
        const price = Number(precio);    

        //verificar estado del articulo
        const arti = await Articulo.findOne({_id:id})
        if (arti.estado === 0) {return res.status(400).json({msg:'Articulo desactivado'})}

        //actualizar articulo en la bd y enviar respuesta al cliente
        const articulo = await Articulo.findByIdAndUpdate(id,{precio:price});
        res.json({msg:"Precio actualizado"})
    },

    //actualizar cantDisponible
    articuloPutcantDisponible : async (req,res)=>{
        //recibir parametros de la peticion
        const {id} = req.params;
        const { cantDisponibles} = req.body;

        //limbiar varialbes de la peticion
        const cant = Number(cantDisponibles);        

        //verificar estado del articulo 
        const arti = await Articulo.findOne({_id:id})
        if (arti.estado === 0) {return res.status(400).json({msg:'Articulo desactivado'})}

        //actualizar articulo en la bd y enviar respuesta al cliente
        const articulo = await Articulo.findByIdAndUpdate(id,{cantDisponibles:cant});
        res.json({msg:"Cantidad actualizada"})
    },

    //actualizar cantDisponible
    articuloPutcantSalieron : async (req,res)=>{
        //recibir valores de la peticion
        const {id} = req.params;
        const {cantSalieron} = req.body;

        //limpiar variables
        const cant = Number(cantSalieron);     
        
        //verificar estado del articulo
        const arti = await Articulo.findOne({_id:id})
        if (arti.estado === 0) {return res.status(400).json({msg:'Articulo desactivado'})}

        //actualizar articulo en la bd y enviar respuesta al cliente
        const articulo = await Articulo.findByIdAndUpdate(id,{cantSalieron:cant});
        res.json({msg:"Cantidad actualizada"})
    },

    //actualizar cantVendieron
    articuloPutcantVendieron : async (req,res)=>{
        //recibir datos de la peticion
        const {id} = req.params;
        const {cantVendieron} = req.body;

        //limpiar datos de la peticon
        const cant = Number(cantVendieron); 
        
        //verificar estado del articulo
        const arti = await Articulo.findOne({_id:id})
        if (arti.estado === 0) {return res.status(400).json({msg:'Articulo desactivado'})}

        //actualizar articulo en la bd
        const articulo = await Articulo.findByIdAndUpdate(id,{cantVendieron:cant});
        res.json({msg:"Cantidad actualizada"})
    },

    //actualizar cantAlmacenadas
    articuloPutcantSeparadas : async (req,res)=>{
        //recibir datos del apeticion
        const {id} = req.params;
        const {cantSeparadas} = req.body;

        //limpiar datos de la peticion
        const cant = Number(cantSeparadas);        
        const arti = await Articulo.findOne({_id:id})

        //verificar estado del articulo
        if (arti.estado === 0) {return res.status(400).json({msg:'Articulo desactivado'})}
        const articulo = await Articulo.findByIdAndUpdate(id,{cantSeparadas:cant});
        res.json({msg:"Cantidad actualizada"})
    },

    //actualizar cantCompradas
    articuloPutcantCompradas : async (req,res)=>{
        //recibir datos de la peticion
        const {id} = req.params;
        const {cantCompradas} = req.body;

        //limpiar datos de la peticion
        const cant = Number(cantCompradas);        

        //verificar estado del articulo
        const arti = await Articulo.findOne({_id:id})
        if (arti.estado === 0) {return res.status(400).json({msg:'Articulo desactivado'})}

        //actualizar datos del articulo en la bd y enviar respuesta al clietne
        const articulo = await Articulo.findByIdAndUpdate(id,{cantCompradas:cant});
        res.json({msg:"Cantidad actualizada"})
    },

    
}
export default articuloControllers