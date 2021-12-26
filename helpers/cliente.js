import Cliente from '../models/cliente.js'

//validar la existencia de tipo de documento
const existeTipoDocumento  = async (tipoDocumento)=>{
    //limpiar la variable
    tipoDocumento = tipoDocumento.toString().toLowerCase().trim()

    //validar
    if(tipoDocumento===''){throw new Error('Tipo de documento vacio')}
    if(tipoDocumento.length>70){throw new Error('Tipo de documento mayor a 70 carácteres')}
}

//validar existencia de # documento
const existeNumDocumento = async (numDocumento)=>{
    //limpiar la variable
    numDocumento = numDocumento.toString().trim();

    //validar
    if(numDocumento==="")throw new Error("Numero de documento  obligatorio") 
    if(numDocumento.length>70) throw new Error("Numero de documento mayor a 70 carácteres") 

    //buscar en la bd retornar error si existe
    const existe = await Cliente.findOne({_id:numDocumento})
    if(existe) throw new Error('Numero de documento ya existente')
}

//validar nombre : 
const existeNombre = async (nombre)=>{
    //limpiar la variable
    nombre = nombre.toString().toLowerCase().trim();

    //validar
    if(nombre==="")throw new Error("Nombre de persona  obligatorio") 
    if(nombre.length>70) throw new Error("Nombre de documento mayor a 70 carácteres")
}

//direccion validacion: controller personaFormularioPost
const existeDireccion = async (direccion)=>{
    //variable de error
    var mensaje='';
    
    //validar
     if(direccion.length>70) {
        mensaje = "Direccion mayor a 70 carácteres";
        return mensaje;
    }else{
        return true
    }  
}

// ciudad validacion: controller personaFormularioPost
const existeCiudad = async (ciudad)=>{
    //variable error
    var mensaje='';

    //validar
    if(ciudad.length>70){
        mensaje = "Ciudad mayor a 70 carácteres";
        return mensaje;
    }else{
        return true
    }
}

// telefono validacion : controller personaFormaularioPost
const existeTelefono = async (telefono)=>{
    //variable error
    var mensaje = '';

    //validar
    if(telefono.length>70){
        mensaje="Telefono mayor a 70 carácteres";
        return mensaje;
    }else{
        return true
    }
}

//email validacion: controllers personaFormularioPost
const existeEmail = async (email)=>{

    //variable error
    var mensaje='';

    //validar
    if(email.length>70){ 
        mensaje="Email mayor a 70 caracteres";
        return mensaje;
    }else{
        return true
    }
}

//validar tamaño # documento
const validarNumDocumento = async (numDocumento)=>{
    //limpiar varialbe
    var numDocumento = numDocumento.toString().trim()

    //validar
    if(numDocumento.length>70){throw new Error("Cedula mayor a 70 carácteres")}
}

//validar existencia de # documento
const existePersonaById = async (id)=>{

    //limpiar variable
    var id = id.toString().trim()

    //buscar en la bd
    const existe = await Cliente.findById(id)

    //retornar error si no existe
    if(!existe) throw new Error(`No existe persona con ese documento`)
}


// validar caracteres de nombre
const actualizarNombre = async(nombre)=>{
    //limpiar variable
    nombre = nombre.toString().toLowerCase().trim();

    //validar
    if(nombre==='') throw new Error('Nombre vacio');
    if(nombre.length>70)throw new Error('Nombre mayor a 70 caracteres')
}

// direccion validarcion : ruta 7
const actualizarDireccion=async(direccion)=>{
    //limpiar variable
    direccion = direccion.toString().toLowerCase().trim();

    //validar
    if(direccion ==='')throw new Error('Direccion vacia');
    if(direccion.length>70)throw new Error('Direccion mayor a 70 caracteres');
}

// ciudad validarcion : 
const actualizarCiudad = async(ciudad) =>{   
    //limpiar variable
    ciudad = ciudad.toString().toLowerCase().trim();

    //validar
    if(ciudad=='')throw new Error('Ciudad vacia');
    if(ciudad.length>70) throw new Error('Ciudad mayor a 70 caracteres');
}

//  telefono validacion : 
const actualizarTelefono = async(telefono)=>{
    //limpiar variable
    telefono = telefono.toString().trim();

    //validar
    if(telefono=='')throw new Error('Telefono vacio');
    if(telefono.length>70)throw new Error('Telefono mayor a 70 caracteres')
}

const actualizarEmail = async(email)=>{
    //limpiar
    email = email.toString().trim();

    //validar 
    if(email==='')throw new Error('Email vacio');
    if(email.length>70) throw new Error('Email mayor a 70 caracteres');
}

//agregar una persona si no existe
const personaFacturaVenta = async(persona)=>{
    //recibir variables
    var {_id,tipoDocumento,nombre,direccion,ciudad,telefono,email} = persona;

    //validar que la variable id exista
    if(persona._id===undefined){return 'Numero de documento faltante'}

    
    //limpiar y declarar variables no obligatorios
    _id = _id.toString().trim();
    var typeDocument ='';
    var name = '';
    var address = '';
    var city ='';
    var phone = '';
    var correo = '';

    //validar # documento
    if(_id==""){return 'Numero de documento vacio'}

    //buscar cliente por id o # documento en la bd
    const existe = await Cliente.findOne({_id:_id});

    //si no existe agregelo
    if (!existe) {
        //validar nombre
        if(nombre===undefined){return "Nombre faltante"}
        if(nombre!==undefined){
            name = nombre.toString().toLowerCase().trim();
            if(name.length>70){return 'Nombre mayor a 70 caracteres'}
            if(name.length==0){return 'Nombre faltante'}
        }

        //validar tipo documento
        if(tipoDocumento!=undefined){
            typeDocument = tipoDocumento.toString().toLowerCase().trim();
            if(typeDocument.length>70){return 'Tipo de documento mayor a 70 caracteres'}
        }

        //validar direccion
        if(direccion!=undefined){
            address = direccion.toString().trim();
            if(address.length>70){return 'Direccion mayor a 70 caracteres'}
        }

        //validar ciudad
        if(ciudad!=undefined){
            city = ciudad.toString().trim();
            if(city.length>70){return 'Ciudad mayor a 70 caracteres'}
        }

        //validar telefono
        if(telefono!=undefined){
            phone = telefono.toString().trim();
            if(phone.length>70){return 'Telefono mayor a 70 caracteres'}
        }

        //validar email
        if(email!=undefined){
            correo = email.toString().trim();
            if(correo.length>70){return 'Correo mayor a 70 caracteres'}
        }

        // crear objeto opersona
        const personaNew = Cliente({
            tipoDocumento:typeDocument, 
            _id:_id,
            nombre:name,
            direccion:address,
            ciudad:city, 
            telefono:phone, 
            email:correo
        });

        //guardar persona
        await personaNew.save();
        
        return true
    } else {
        return true
    }
    
}

const guardarClientesImportados = async(cliente)=>{

    //documento,tipoDocumento,nombre,direccion,ciudad,telefono,email
    
    let existe = await Cliente.findOne({_id:cliente.documento});
    if(!existe){
        console.log("guardar");
        let clienteBD = Cliente({
            tipoDocumento:cliente.tipoDocumento,
            _id:cliente.documento,
            nombre:cliente.nombre,
            direccion:cliente.direccion,
            ciudad:cliente.ciudad,
            telefono:cliente.telefono,
            email:cliente.email
        })
        await clienteBD.save();
    }
}



export {
    existeTipoDocumento,
    existeNumDocumento,
    existeNombre,
    existeDireccion,
    existeCiudad,
    existeTelefono,
    existeEmail,
    validarNumDocumento,
    existePersonaById,
    actualizarNombre,
    actualizarDireccion,
    actualizarCiudad,
    actualizarTelefono,
    actualizarEmail,
    personaFacturaVenta,
    guardarClientesImportados
    }