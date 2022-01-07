import {Router} from 'express';
import {validarCampo} from '../middlewares/validarCampos.js';
import { validarJWR } from '../middlewares/validarJwt.js';
import { validarRol } from '../middlewares/validarRoles.js';
import { check } from 'express-validator';

import informesControllers from '../controllers/informes.js'

const router = Router();

//agregar articulo por formulario
router.get('/cantidadCategoria',[
    validarJWR,
    validarRol(),
    validarCampo
],informesControllers.getCantidadCategoriasDia);

export default router