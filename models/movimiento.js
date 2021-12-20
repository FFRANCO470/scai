import mongoose from 'mongoose';

const MovimientoSchema = mongoose.Schema({
    estado:{type:Number,default:1},//1 activo 0 desactivo
    tipoMovimiento:{type:String,required:true,maxlength:20},
    usuario:{type:mongoose.Schema.ObjectId,ref:'Usuario',required:true},
    proveedor:{type:String,ref:'Proveedor'},
    numFactura:{type:String,maxlength:20},
    comentario:{type:String,default:"",maxlength:250},
    totalPrecio:{type:Number,default:0},
    totalCosto:{type:Number,default:0},
    articulos:{type:Array,default:[]},
    
},{
    timestamps:true,
    versionKey:false
})

export default mongoose.model('Movimiento',MovimientoSchema)