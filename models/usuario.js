import mongoose from 'mongoose';

const  UsuarioSchema=mongoose.Schema({
    estado:{type:Number,default:1}, // 1:acrivo  0:desactivo
    nombreUser:{type:String,required:true,unique:true,maxlength:50},//inicia sesion
    password:{type:String,required:true},
    rol:{type:String, required:true, maxlength:14},//administrador vendedor
    nombre:{type:String,required:true,maxlength:100},//nombre de pila
    cedula:{type:String,required:true,maxlength:100},
    telefono:{type:String,default:"",maxlength:100}, 
    direccion :{type:String,default:"",maxlength:100},   
    numCuenta :{type:String,default:"",maxlength:100},  
    tipoCuenta :{type:String,default:"",maxlength:100},  
    banco :{type:String,default:"",maxlength:100},  
    numContrato :{type:String,default:"",maxlength:100}, 
},{
    timestamps : true,
    versionkey : false
})

export default mongoose.model('Usuario',UsuarioSchema)
