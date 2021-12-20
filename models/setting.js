import mongoose from "mongoose"

const SettingSchema = mongoose.Schema({
    _id:{type:Number,defauld:1,uniqued:true},
    nameStore:{type:String, required:true, default:"Name store",maxlength:100, unique:true},
    nit:{type:String, required:true, default:"nit",maxlength:100, unique:true},
    regimen:{type:String, required:true, default:"regimen",maxlength:100, unique:true},
    representanteCC:{type:String, required:true, default:"representatne",maxlength:100, unique:true},
    departamento:{type:String, required:true, default:"departameno",maxlength:100, unique:true},
    ciudad:{type:String, required:true, default:"ciudad",maxlength:100, unique:true},
    direccion:{type:String, required:true, default:"direccion",maxlength:100, unique:true},
    celular:{type:String, required:true, default:"celular",maxlength:100, unique:true},
    telefono:{type:String, required:true, default:"celular",maxlength:100, unique:true},
    email:{type:String, required:true, default:"email",maxlength:100, unique:true},
    logo:{type:String}
},{
    timestamps : true,
    versionkey : false
})
export default mongoose.model('Setting', SettingSchema)