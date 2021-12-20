import {Router} from 'express';
import categoriaControllers from '../controllers/categoria.js';
import {validarCampo} from '../middlewares/validarCampos.js';
import { validarJWR } from '../middlewares/validarJwt.js';
import { validarRol } from '../middlewares/validarRoles.js';
import { check } from 'express-validator';
import { existeCategoriaNombre,existeCategoriaById } from '../helpers/categoria.js';

const router = Router();

//agregar categoria
router.post('/',[
    validarJWR,
    validarRol(),
    check('nombre','Nombre obligatorio').not().isEmpty(),
    check('nombre').custom(existeCategoriaNombre),
    validarCampo
],categoriaControllers.categoriaPost);

//traer todas las categorias
router.get('/',[
    validarJWR,
    validarRol(),
    validarCampo
],categoriaControllers.categoriaGet);

//traer categorias activas
router.get('/activas',[
    validarJWR,
    validarRol(),
    validarCampo
],categoriaControllers.categoriasActivasGet);

//comprobar existencia de categoria devolverla
router.get('/buscar',[
    validarJWR,
    validarRol(),
    check('nombre','Nombre obligatorio').not().isEmpty(),
    validarCampo
],categoriaControllers.buscarCategoriaGet)

//activar
router.put('/activar/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validarCampo
],categoriaControllers.categoriaPutActivar);

//desactivar
router.put('/desactivar/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validarCampo
],categoriaControllers.categoriaPutDesactivar);

//actualizar nombre 
router.put('/actualizar/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeCategoriaById),
    check('nombre','Nombre obligatorio').not().isEmpty(),
    check('nombre').custom(existeCategoriaNombre),
    validarCampo
],categoriaControllers.categoriaPut);

export default router