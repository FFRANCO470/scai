import {Router} from 'express';
import clienteControllers from '../controllers/cliente.js'
import { check } from 'express-validator';
import { validarCampo } from '../middlewares/validarCampos.js';
import { validarJWR } from '../middlewares/validarJwt.js';
import { validarRol } from '../middlewares/validarRoles.js';
import { 
    existeTipoDocumento,
    existeNumDocumento,
    existeNombre,
    validarNumDocumento,
    existePersonaById,
    actualizarNombre,
    actualizarDireccion,
    actualizarCiudad,
    actualizarTelefono,
    actualizarEmail 
} from '../helpers/cliente.js';

const router = Router();

//agregar persona por formulario
router.post('/',[
    validarJWR,
    validarRol('vendedor'),
    check('tipoDocumento','Tipo de documento obligatorio').not().isEmpty(),
    check('_id','Numero de documento obligatorio').not().isEmpty(),
    check('nombre','Nombre obligatorio').not().isEmpty(),
    check('tipoDocumento').custom(existeTipoDocumento),
    check('_id').custom(existeNumDocumento),
    check('nombre').custom(existeNombre),
    validarCampo
],clienteControllers.clienteFormularioPost);

// traer todos los clientes
router.get('/clientes',[
    validarJWR,
    validarRol(),
    validarCampo
],clienteControllers.clientesGet);


//buscar persona por # documento, si no devolver false
router.get('/buscando',[
    validarJWR,
    validarRol('vendedor'),
    check('numDocumento','Numero de documento obligatorio').not().isEmpty(),
    check('numDocumento').custom(validarNumDocumento),
    validarCampo
],clienteControllers.buscarClienteGet)

//actualizar tipo de documento
router.put('/actualizarTipoDoc/:id',[
    validarJWR,
    validarRol('vendedor'),
    check('id').custom(existePersonaById),
    check('tipoDocumento','Tipo de documento obligatorio').not().isEmpty(),
    check('tipoDocumento').custom(existeTipoDocumento),
    validarCampo
],clienteControllers.clientePutTipoDoc);


//actualiza nombre de persona
router.put('/actualizarNombre/:id',[
    validarJWR,
    validarRol('vendedor'),
    check('id').custom(existePersonaById),
    check('nombre','Nombre obligatorio').not().isEmpty(),
    check('nombre').custom(actualizarNombre),
    validarCampo
],clienteControllers.clientePutNombre);

//actualizar direccion de persona
router.put('/actualizarDireccion/:id',[
    validarJWR,
    validarRol('vendedor'),
    check('id').custom(existePersonaById),
    check('direccion','direccion obligatorio').not().isEmpty(),
    check('direccion').custom(actualizarDireccion),
    validarCampo
],clienteControllers.clientePutDireccion);

//actualizar ciudad de persona
router.put('/actualizarCiudad/:id',[
    validarJWR,
    validarRol('vendedor'),
    check('id').custom(existePersonaById),
    check('ciudad','ciudad obligatorio').not().isEmpty(),
    check('ciudad').custom(actualizarCiudad),
    validarCampo
],clienteControllers.clientePutCiudad);

//actualizar telefono
router.put('/actualizarTelefono/:id',[
    validarJWR,
    validarRol('vendedor'),
    check('id').custom(existePersonaById),
    check('telefono','telefono obligatorio').not().isEmpty(),
    check('telefono').custom(actualizarTelefono),
    validarCampo
],clienteControllers.clientePutTelefono);

//actualizar email
router.put('/actualizarEmail/:id',[
    validarJWR,
    validarRol(),
    check('id').custom(existePersonaById),
    check('email','email obligatorio').not().isEmpty(),
    check('email').custom(actualizarEmail),
    validarCampo
],clienteControllers.clientePutEmail);

// eliminar cliente
router.delete('/:id',[
    validarJWR,
    validarRol(),
    check('id').custom(existePersonaById),
    validarCampo
],clienteControllers.clienteDelete);

export default router