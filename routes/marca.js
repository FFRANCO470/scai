import {Router} from 'express';
import marcaControllers from '../controllers/marca.js';
import {validarCampo} from '../middlewares/validarCampos.js';
import { validarJWR } from '../middlewares/validarJwt.js';
import { validarRol } from '../middlewares/validarRoles.js';
import { check } from 'express-validator';
import { existeMarcaNombre,existeMarcaById } from '../helpers/marca.js';
const router = Router();

//ruta 1 : agregar marca
router.post('/',
    validarJWR,
    validarRol(),
    check('nombre','Nombre obligatorio').not().isEmpty(),
    check('nombre').custom(existeMarcaNombre),
    validarCampo
,marcaControllers.marcaPost);

//ruta 2 : traer todas las marcas
router.get('/',[
    validarJWR,
    validarRol(),
    validarCampo
],marcaControllers.marcaGet);

//ruta 3 : traer marcas activas
router.get('/activas',[
    validarJWR,
    validarRol(),
    validarCampo
],marcaControllers.marcasActivasGet);

//ruta 4 : traer marca si existe
router.get('/buscar',[
    validarJWR,
    validarRol(),
    check('nombre','Nombre obligatorio').not().isEmpty(),
    validarCampo
],marcaControllers.buscarMarcaGet)

//ruta 5 : activar marca
router.put('/activar/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeMarcaById),
    validarCampo
],marcaControllers.marcaPutActivar);

//ruta 6 : activar marca
router.put('/desactivar/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeMarcaById),
    validarCampo
],marcaControllers.marcaPutDesactivar);

//ruta 7 : actualizar marca
router.put('/actualizar/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeMarcaById),
    check('nombre','Nombre obligatorio').not().isEmpty(),
    check('nombre').custom(existeMarcaNombre),
    validarCampo
],marcaControllers.marcaPut);

export default router