import mongoose from 'mongoose';

const ProveedorSchema = mongoose.Schema({
    estado:{type:Number,default:1},
    nombre:{type:String,required:true,maxlength:200, unique:true},
    telefono:{type:String,default:"",maxlength:150},
    direccion:{type:String,default:"",maxlength:150}
},{
    timestamps:true,
    versionKey:false
})

export default mongoose.model('Proveedor',ProveedorSchema)