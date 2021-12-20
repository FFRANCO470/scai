import Categoria from '../models/categoria.js';

const categoriaControllers={
    
    //agregar categoria por formulario
    categoriaPost : async (req,res)=>{
        const {nombre} = req.body;
        const name = nombre.toString().toLowerCase().trim();
        let fechita = new Date(new Date(Date.now()).getTime() - 1000 * 60 * 60 * 5)
        const categoria = Categoria({nombre:name,createdAt:fechita});
        await categoria.save();
        res.json({msg:"Categoría agregada"});
    },
    
    //traer todas las categorias que contenga un caracter en especial
    categoriaGet : async (req,res)=>{
        //recibir valor de la peticion
        const value = req.query.value;
        //buscar categorias en la bd
        const categoria = await Categoria.find({nombre:new RegExp(value,'i')}).sort({'createAt':1});
        //enviar categorias al cliente
        res.json({categoria})
    },

    //traer categorias activas
    categoriasActivasGet : async(req,res)=>{
      const categoria = await Categoria.find({estado:1});
      res.json({categoria}) 
    },
    
    //buscar categoria por nombre y devolverla, si no esta devolver false
    buscarCategoriaGet : async (req,res)=>{
        //recibir valor de la peticion
        const nombre = req.query.nombre;

        //limpiar y validar variables
        const name = nombre.toString().toLowerCase().trim();
        if(name==""){return res.status(400).json({msg:'Nombre obligatorio'})}

        //buscar categoria por nombre y devolverla, si no se encuentra devolver false
        const categoria = await Categoria.findOne({nombre:name})
        if (!categoria) {return res.json({categoria:false})}
        res.json({categoria:categoria.nombre})
    },

    //activar categoria
    categoriaPutActivar : async (req,res)=>{
        const {id} = req.params;
        const categoria = await Categoria.findByIdAndUpdate(id,{estado:1});
        res.json({msg:"Categoria activada"})
    },

    //Desactivar categoria
    categoriaPutDesactivar : async (req,res)=>{
        const {id} = req.params;
        const categoria = await Categoria.findByIdAndUpdate(id,{estado:0});
        res.json({msg:"Categoria desactivada"})
    },

    //actualizar nombre de categoria
    categoriaPut : async (req,res)=>{
        //recibir valrialbes de peticion
        const {id} = req.params;
        const {nombre}=req.body;

        //limpiar variable
        const name = nombre.toLowerCase().trim();

        //verificar estado de categoria
        const categoria2 = await Categoria.findOne({_id:id})
        if(categoria2.estado === 0) {return res.status(400).json({msg:'Categoria desactivada'})}
        
        //actualizar categoria en la bd y responder a cliente
        const categoria = await Categoria.findByIdAndUpdate(id,{nombre:name});
        res.json({msg:"Categoria actualizada"})
    },
    
}
export default categoriaControllers