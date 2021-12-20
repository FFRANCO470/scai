import mongoose from 'mongoose';

const ClienteSchema = mongoose.Schema({
    tipoDocumento:{type:String, default:"", maxlength:70},
    _id:{type:String, required:true,maxlength:70,uniqued:true},
    nombre:{type:String, required:true, maxlength:70},
    direccion:{type:String, default:"",maxlength:70},
    ciudad:{type:String, default:"",maxlength:70},
    telefono:{type:String, default:"", maxlength:70},
    email:{type:String, default:"", maxlength:70}      
},{
    timestamps : true,
    versionkey : false
})

export default mongoose.model('Cliente',ClienteSchema)