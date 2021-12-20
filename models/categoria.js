import mongoose from "mongoose"

const CategoriaSchema = mongoose.Schema({
    //createAt:{type:Date, default:Date.now},
    estado:{type:Number, default:1},//1 activo 0 desactivo
    nombre:{type:String, required:true, maxlength:50, unique:true},   
},{
    timestamps : true,
    versionkey : false
})
export default mongoose.model('Categoria', CategoriaSchema)