import {Router} from 'express';
import movimientoControllers from '../controllers/movimiento.js';
import {validarCampo} from '../middlewares/validarCampos.js';
import { validarJWR } from '../middlewares/validarJwt.js';
import { validarRol } from '../middlewares/validarRoles.js';
import { check } from 'express-validator';
import { existeUsuarioById } from '../helpers/usuario.js'
import { existeProveedorById } from '../helpers/proveedor.js'
import {
    validarTotalPrecio,
    validarTotalCosto,
    existeCompraById
} from '../helpers/movimiento.js';

const router = Router();

router.post("/crearSalida",[
    validarJWR,
    check("usuario","usuario obligatorio").not().isEmpty(),
    check('usuario','ID de usuario no valido').isMongoId(),
    check('usuario').custom(existeUsuarioById),
    check("totalPrecio","Total precio obligatorio obligatoria").not().isEmpty(),
    check("totalPrecio").custom(validarTotalPrecio),
    check("totalCosto","Total costo obligatorio obligatoria").not().isEmpty(),
    check("totalCosto").custom(validarTotalCosto),
    check("articulos","Articulos obligatorias").not().isEmpty(),
    
    validarRol("vendedor"),
    validarCampo
],movimientoControllers.agregarSalidaPost)

router.post("/crearCompra",[
    validarJWR,
    validarRol(),
    check("usuario","Proveedor obligatorio").not().isEmpty(),
    check("proveedor","Proveedor obligatorio").not().isEmpty(),
    check('usuario','ID de usuario no valido').isMongoId(),
    check('proveedor','ID de proveedor no valido').isMongoId(),
    check('proveedor').custom(existeProveedorById),
    check('usuario').custom(existeUsuarioById),
    check("articulos","Articulos obligatorias").not().isEmpty(),
    check("totalPrecio","Total precio obligatorio obligatoria").not().isEmpty(),
    check("totalPrecio").custom(validarTotalPrecio),
    check("totalCosto","Total costo obligatorio obligatoria").not().isEmpty(),
    check("totalCosto").custom(validarTotalCosto),
    validarCampo
],movimientoControllers.agregarCompra)


router.get("/salida",[
    validarJWR,
    validarRol(),
    validarCampo
],movimientoControllers.traerSalidasGet)

router.get("/compra",[
    validarJWR,
    validarRol(),
    validarCampo
],movimientoControllers.traerCompraGet)

router.get("/salidaById/:id",[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeCompraById),
    validarCampo
],movimientoControllers.traerSalidaByIdGet)

router.get("/compraById/:id",[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeCompraById),
    validarCampo
],movimientoControllers.traerCompraByIdGet)

router.get("/eliminarCompraById/:id",[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeCompraById),
    validarCampo
],movimientoControllers.eliminarMovimientoByIdGet)


export default router