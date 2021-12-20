import express from 'express';
import cors from 'cors';

import dbConnection from '../database/config.js';

import marca from '../routes/marca.js';
import categoria from '../routes/categoria.js';
import usuario from '../routes/usuario.js';
import cliente from '../routes/cliente.js';
import articulo from '../routes/artuculo.js';
import venta from '../routes/venta.js';
import setting from '../routes/setting.js';
import fileUpload from 'express-fileupload';
import generalData from '../routes/generalData.js';
import movimiento from '../routes/movimiento.js';
import proveedor from '../routes/proveedor.js';

class Server {
    constructor(){
        this.port = process.env.PORT;
        this.app = express();
        this.conectarDB();
        this.middlewares();
        this.routes();
    }
    routes(){
        this.app.use('/api/marca',marca);
        this.app.use('/api/categoria',categoria);
        this.app.use('/api/usuario',usuario);
        this.app.use('/api/cliente',cliente);
        this.app.use('/api/articulo',articulo);
        this.app.use('/api/venta',venta);
        this.app.use('/api/setting',setting);
        this.app.use('/api/generalData',generalData);
        this.app.use('/api/movimiento',movimiento);
        this.app.use('/api/proveedor',proveedor);
    }
    async conectarDB(){
        await dbConnection();
    }
    middlewares(){
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(express.static('public'));
        //subir fotos
        this.app.use(fileUpload({
            //crar archivo temporal
            useTempFiles:true,
            //carpeta donde va guardar el temporal
            tempFileDir:'/tmp',
            //si no existe la foto donde va a meter la foto creela
            createParentPath:true
        }))
    }
    listen(){
        this.app.listen(this.port,()=>{
            console.log(`Servidor corriendo ${this.port}`);
        })
    }
}
export default Server