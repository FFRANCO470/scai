import {Router} from 'express';
import {validarCampo} from '../middlewares/validarCampos.js';
import { validarJWR } from '../middlewares/validarJwt.js';
import { validarRol } from '../middlewares/validarRoles.js';
import { check } from 'express-validator';

import informesControllers from '../controllers/informes.js'

const router = Router();

// contar categorias de  venta venta dia
router.get('/cantidadCategoria',[
    validarJWR,
    validarRol(),
    validarCampo
],informesControllers.getCantidadCategoriasDia);

// sumar efectivo tarjeta nequi credigo dia
router.get('/saldoCaja',[
    validarJWR,
    validarRol(),
    validarCampo
],informesControllers.getTotalCajaDia);

export default router