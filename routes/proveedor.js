import {Router} from 'express';
import proveedorControllers from '../controllers/proveedor.js';
import { check } from 'express-validator';
import { validarCampo } from '../middlewares/validarCampos.js';
import { validarJWR } from '../middlewares/validarJwt.js';
import { validarRol } from '../middlewares/validarRoles.js';
import {
    validarNombre,
    existeProveedorById,
    validarTelefonoProveedor,
    validarDireccionProveedor
} from '../helpers/proveedor.js'

const router = Router();

//ruta 1 agregar proveedor por formulario
router.post("/",[
    validarJWR,
    validarRol(),
    check('nombre','Nombre obligatorio').not().isEmpty(),
    check('nombre').custom(validarNombre),
    validarCampo
],proveedorControllers.proveedorFormularioPost)

//ruta 2 traer todos los proveedores
router.get("/proveedores",[
    validarJWR,
    validarRol(),
    validarCampo
],proveedorControllers.proveedoresGet)

//ruta 3 traer proveedor por id
router.get("/proveedor/:id",[
    validarJWR,
    validarRol(),
    check('id','ID vacio').not().isEmpty(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeProveedorById),
    validarCampo
],proveedorControllers.proveedorByIdGet)

//traer proveedores activos
router.get('/activos',[
    validarJWR,
    validarRol(),
    validarCampo
],proveedorControllers.proveedorerActivosGet);

//activar proveedor
router.put("/activar/:id",[
    validarJWR,
    validarRol(),
    check('id','ID vacio').not().isEmpty(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeProveedorById),
    validarCampo
],proveedorControllers.proveedorPutActivar)

//desactivar proveedor
router.put("/desactivar/:id",[
    validarJWR,
    validarRol(),
    check('id','ID vacio').not().isEmpty(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeProveedorById),
    validarCampo
],proveedorControllers.proveedorPutDesactivar)


//ruta 4 actualizar nombre provedor
router.put("/nombre/:id",[
    validarJWR,
    validarRol(),
    check('id','ID vacio').not().isEmpty(),
    check('nombre','nombre obligatorio').not().isEmpty(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeProveedorById),
    check('nombre').custom(validarNombre),
    validarCampo
],proveedorControllers.proveedorNombrePut)

//ruta 5 actualizar telefono provedor
router.put("/telefono/:id",[
    validarJWR,
    validarRol(),
    check('id','ID vacio').not().isEmpty(),
    check('telefono','telefono obligatorio').not().isEmpty(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeProveedorById),
    check('telefono').custom(validarTelefonoProveedor),
    validarCampo
],proveedorControllers.proveedorTelefonoPut)

//ruta 5 actualizar telefono provedor
router.put("/direccion/:id",[
    validarJWR,
    validarRol(),
    check('id','ID vacio').not().isEmpty(),
    check('direccion','direccion obligatorio').not().isEmpty(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeProveedorById),
    check('direccion').custom(validarDireccionProveedor),
    validarCampo
],proveedorControllers.proveedorDireccionPut)

export default router