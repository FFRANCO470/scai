import {Router} from 'express';
import ventaControllers from '../controllers/venta.js'
import {validarCampo} from '../middlewares/validarCampos.js';
import { validarJWR } from '../middlewares/validarJwt.js';
import { validarRol } from '../middlewares/validarRoles.js';
import { check } from 'express-validator';
import { existeUsuarioById } from '../helpers/usuario.js';


import {
    validarNumeroFactura,
    validarTipoFactura,
    validarGuardarDatos,
    existeVentaId,
    validarCriterioBusqueda,
    validarDatoBusqueda
} from '../helpers/venta.js'


const router = Router();

//agregar factura de debito, abonoAbono, credito, efectivo
router.post("/",[
    validarJWR,    
    check("usuario","usuario obligatorio").not().isEmpty(),
    check("numFactura","Numero de factura obligatorio").not().isEmpty(),
    check("tipoFactura","Tipo de factura obligatorio").not().isEmpty(),
    check("guardarDatos","Condicion guardar datos obligatoria").not().isEmpty(),
    check("existeCliente","Existencia de cliente obligatoria").not().isEmpty(),
    check('usuario','ID de usuario no valido').isMongoId(),
    check('usuario').custom(existeUsuarioById),
    check('numFactura').custom(validarNumeroFactura),
    check('tipoFactura').custom(validarTipoFactura),
    check('guardarDatos').custom(validarGuardarDatos),
    check('existeCliente').custom(validarGuardarDatos),
    validarRol("vendedor"),
    validarCampo
],ventaControllers.agregarFacturaPost)

//traer venta por id
router.get('/ventaId/:id',[
    validarJWR,
    validarRol("vendedor"),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeVentaId),
    validarCampo
],ventaControllers.traerVentaByIdGet)


//traer debitos
router.get("/debito",[
    validarJWR,
    validarRol("vendedor"),
    validarCampo
],ventaControllers.traerDebidosGet)

//traer abonos
router.get("/abono",[
    validarJWR,
    validarRol("vendedor"),
    validarCampo
],ventaControllers.traerAbonosGet)

//traer ventas
router.get("/venta",[
    validarJWR,
    validarRol("vendedor"),
    validarCampo
],ventaControllers.traerVentasGet)

//traer factura por numero de factura o cedula cliente (id )
router.get("/ventaByCriterio",[
    validarJWR,
    validarRol("vendedor"),
    check("buscar","Criterio de busqueda obligatorio en la peticion").not().isEmpty(),
    check("buscarDato","Dato a buscar obligatorio en la peticion").not().isEmpty(),
    check('buscar').custom(validarCriterioBusqueda),
    check('buscarDato').custom(validarDatoBusqueda),
    validarCampo
],ventaControllers.traerFacturaByNumber)


export default router
