import mongoose from "mongoose"

const SettingSchema = mongoose.Schema({
    _id:{type:Number,defauld:1,uniqued:true},
    nameStore:{type:String, required:true, default:"NAME STORE",maxlength:100, unique:true},
    nit:{type:String, required:true, default:"NIT",maxlength:100, unique:true},
    regimen:{type:String, required:true, default:"REGIMEN",maxlength:100, unique:true},
    representanteCC:{type:String, required:true, default:"REPRESETANTE",maxlength:100, unique:true},
    departamento:{type:String, required:true, default:"DEPARTAMENTO",maxlength:100, unique:true},
    ciudad:{type:String, required:true, default:"CIUDAD",maxlength:100, unique:true},
    direccion:{type:String, required:true, default:"DIRECCION",maxlength:100, unique:true},
    celular:{type:String, required:true, default:"CELULAR",maxlength:100, unique:true},
    telefono:{type:String, required:true, default:"TELEFONO",maxlength:100, unique:true},
    email:{type:String, required:true, default:"EMAIL",maxlength:100, unique:true},
    logo:{type:String}
},{
    timestamps : true,
    versionkey : false
})
export default mongoose.model('Setting', SettingSchema)