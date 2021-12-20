import Articulo from '../models/articulo.js';
import Categoria from '../models/categoria.js';
import Marca from '../models/marca.js';

//middlewares verificar que la referencia no este vacia
const existeReferencai = async (referencia)=>{
    referencia = referencia.trim()
    if(referencia==="")throw new Error("Referencia obligatoria")
}

//middlewares verificar que exista el articulo en la bd
const existeArticuloById = async (id)=>{
    const existe = await Articulo.findById(id)
    if(!existe) throw new Error(`No existe articulo con ese ID`)
}

//middlewares validar variable cantidad
const validandoStock = async (cantDisponibles)=>{
    //limpiar variable
    cantDisponibles = Number(cantDisponibles);

    //validar
    if(cantDisponibles==="")throw new Error("Cantidad obligatoria helpers")
    if ( Number.isNaN(cantDisponibles)) throw new Error("Cantidad tipo numero NAN")
    if ( Number(cantDisponibles)<0) throw new Error("Cantidad negativa")
}

//middlewares validar variable costo
const validandoCosto = async(costo)=>{
    //limpiar variables
    costo = Number(costo);

    //validar
    if(costo==="")throw new Error("Costo obligatorio")
    if ( Number.isNaN(costo)) throw new Error("Costo tipo numero NAN")
    if ( Number(costo)<0) throw new Error("Costo negativa")
}

//middlewares validar variable precio
const validandoPrecio = async (precio)=>{
    //limpiar variable
    precio = Number(precio);

    //validar
    if(precio==="")throw new Error("Precio obligatorio")
    if ( Number.isNaN(precio)) throw new Error("Precio tipo numero NAN")
    if ( Number(precio)<0) throw new Error("Precio negativa")
}

//validar la existencia de un articulo segun su categoria, marac y referencia
const existeArticuloByDescription = async (categoria,marca,referencia)=>{
    //limpoar variable
    referencia = referencia.toString().trim()

    //buscar en la bd
    const existe = await Articulo.findOne({$and:[{categoria:categoria},{marca:marca},{referencia:referencia}]})

    //si existe retornelo sino enviar falso
    if (existe) {
        return existe
    }else{
        return false
    }
}

//crear codigo unico de inventario sku
const crearSku = async(categoria,marca,referencia)=>{
    //buscar categoria por id
    const cate = await Categoria.findOne({_id:categoria});

    //capturar nombre de categoria
    const nameCate = cate.nombre;

    //buscar marca por id
    const marc = await Marca.findOne({_id:marca});

    //capturar nombre de marca
    const nameMarc = marc.nombre;

    //crear sku y retornarlo
    const sku = nameCate + '-' + nameMarc + '-' + referencia;
    return sku;
}

//validar la existencia del articulo en la bd
const existeArticuloByIdBool = async (id)=>{
    //buscar articulo por id
    const existe = await Articulo.findById(id)

    //is existe retornar true si no false
    if(existe) return true 
    else return false
}

const registrarArticulosCompra = async(articulo)=>{
    //buscar articulo en la bd
    let existe = await Articulo.findOne({sku:articulo.sku})

    //si existe agregar unidades
    if(existe){
        //capturar variables
        let { _id,cantDisponibles,cantCompradas } = existe;

        //aumentar unidades
        cantDisponibles = parseInt(cantDisponibles) + parseInt(articulo.cantidad)
        cantCompradas = parseInt(cantCompradas) + parseInt(articulo.cantidad)

        //actualizar
        await Articulo.findByIdAndUpdate({_id},{cantDisponibles,cantCompradas,costo:articulo.costo,precio:articulo.precio})

    //si no existe crear
    }else{
        let articuloBD = Articulo({
            categoria:articulo.categoria,
            marca:articulo.marca,
            referencia:articulo.referencia,
            sku:articulo.sku,
            costo:articulo.costo,
            precio:articulo.precio,
            cantDisponibles:articulo.cantidad,
            cantCompradas:articulo.cantidad
        });

        await articuloBD.save();
    }
}


export{
    existeReferencai,
    existeArticuloById,
    validandoStock,
    validandoCosto,
    validandoPrecio,
    existeArticuloByDescription,
    crearSku,
    existeArticuloByIdBool,
    registrarArticulosCompra
}