import mongoose from "mongoose"

const GeneralDataSchema = mongoose.Schema({
    _id:{type:Number,defauld:1,uniqued:true},
    numFactura:{type:Number, default:0},  
},{
    timestamps : true,
    versionkey : false
})
export default mongoose.model('GeneralData', GeneralDataSchema)