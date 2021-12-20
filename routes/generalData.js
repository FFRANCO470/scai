import {Router} from 'express';
import { check } from 'express-validator';
import {validarCampo} from '../middlewares/validarCampos.js';
import { validarJWR } from '../middlewares/validarJwt.js';
import { validarRol } from '../middlewares/validarRoles.js';
import generalDataControllers from '../controllers/generalData.js';


const router = Router();

//crear documento con variables generales
router.post('/',
    validarJWR,
    validarRol(),
    validarCampo
,generalDataControllers.generalDataPost);

//traer numero de factura de venta
router.get('/venta',[
    validarJWR,
    validarRol('vendedor'),
    validarCampo
],generalDataControllers.numVentaGet)




export default router
