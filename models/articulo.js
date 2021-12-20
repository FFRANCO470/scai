    import mongoose from 'mongoose';

const ArticuloSchema = mongoose.Schema({
    estado : {type : Number, default : 1},//1 activo 0 desactivo
    categoria : {type : mongoose.Schema.ObjectId,ref:'Categoria', required : true},
    marca : {type : mongoose.Schema.ObjectId,ref:'Marca', required : true},
    referencia: {type : String, required : true, maxlength : 50},
    talla : {type : String,maxlength:50},
    color : {type : String,maxlength:50},
    estilo : {type : String,maxlength:50},
    sku : {type : String, required : true, maxlength : 152},
    costo: {type : Number, required : true, default : 0},//valor al que compra
    precio: {type : Number, required : true, default : 0},//valor al que vende
    cantDisponibles: {type : Number, required : true, default : 0},
    cantSalieron: {type : Number, required : true, default : 0},
    cantVendieron: {type : Number, required : true, default : 0},
    cantSeparadas: {type : Number, required : true, default : 0},
    cantCompradas: {type : Number, required : true, default : 0},
},{
    timestamps : true,
    versionkey : false
})
export default mongoose.model('Articulo',ArticuloSchema)