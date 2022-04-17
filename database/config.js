import mongoose from 'mongoose';

const dbConnection = async()=>{
    try{
        //await mongoose.connect(process.env.MONGOOSE_CNX,{
        await mongoose.connect(process.env.MONGO_LOCAL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex:true,
            useFindAndModify:false
        });
        console.log('Conectado a la base de datos');
    }
    catch(error){
        throw new Error('Error al conectarse a la base de datos')
    }
}
export default dbConnection