import mongoose from 'mongoose';

const VentaSchema = mongoose.Schema({
    //createAt:{type:Date,default:Date.now},
    estado:{type:Number,default:1},//1 activo 0 desactivo
    
    usuario:{type:mongoose.Schema.ObjectId,ref:'Usuario',required:true},
    numFactura:{type:Number,require:true},
    tipoFactura:{type:String ,required:true,maxlength:11},//debito, abonoAbono, credito, efectivo, salida
    subTipoFactura:{type:String,maxlength:11},//venta, abono
    comentario:{type:String,default:"",maxlength:250},

    existeCliente:{type:Boolean,require:true},
    guardarDatos:{type:Boolean,require:true},
    persona:{type:String,ref:"Cliente",default:"",maxlength:100},//cliente proveedor
    saldoAnterior:{type:Number},
    efectivo:{type:Number},
    nequi:{type:Number},
    tarjeta:{type:Number},
    credito:{type:Number},
    descuento:{type:Number},
    
    totalPrecio:{type:Number},
    totalCosto:{type:Number},
    articulos:{type:Array}
},{
    timestamps : true,
    versionkey : false
})

export default mongoose.model('Venta',VentaSchema)    