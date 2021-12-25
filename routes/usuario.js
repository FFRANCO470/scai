import {Router} from 'express';
import usuarioControllers from '../controllers/usuario.js';
import { check } from 'express-validator';
import { validarCampo } from '../middlewares/validarCampos.js';
import { validarJWR } from '../middlewares/validarJwt.js';
import { validarRol } from '../middlewares/validarRoles.js';
import { 
            existeUsuarioById, 
            existeUsuarioByName,
            existeUsuarioByRol,
            validarPass,
            existeUsuarioByNameLogin,
            validarNombre,validarCedula,
            existeTelefonoUser,
            existeDireccionUser,
            existeNumeroCuentaUser,
            existeTipoCuentaUser,
            existeBancoUser,
            existeNumContratoUser 
} from '../helpers/usuario.js';

const router = Router();

//agregar usuarios
router.post('/',[
    check('nombreUser','Usuario obligatorio').not().isEmpty(),
    check('password','Password obligatorio').not().isEmpty(),
    check('rol','Rol obligatorio').not().isEmpty(),
    check('nombre','Nombre obligatorio').not().isEmpty(),
    check('cedula','Cedula obligatoria').not().isEmpty(),
    check('nombreUser').custom(existeUsuarioByName),
    check('password').custom(validarPass),
    check('rol').custom(existeUsuarioByRol),
    check('nombre').custom(validarNombre),
    check('cedula').custom(validarCedula),
    validarCampo
],usuarioControllers.usuarioPost);

//iniciar sesion
router.post('/login',[
    check('nombreUser','Nombre obligatorio').not().isEmpty(),
    check('password','Clave obligatoria').not().isEmpty(),
    check('nombreUser').custom(existeUsuarioByNameLogin),
    check('password').custom(validarPass),
    validarCampo
],usuarioControllers.login);

//traer todos los usuarios
router.get('/',[
    validarJWR,
    validarRol(),
    validarCampo
],usuarioControllers.usuarioGet);

//traer usuario por id
router.get('/usuario/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampo
],usuarioControllers.usuarioGetById);

//activar usuario
router.put('/activar/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampo
],usuarioControllers.usuarioPutActivar);

//desactivar usuario
router.put('/desactivar/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampo
],usuarioControllers.usuarioPutDesactivar);

//actualizar  usuario
router.put('/actualizarNombreUser/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    check('nombreUser','Nombre obligatorio').not().isEmpty(),
    check('nombreUser').custom(existeUsuarioByName),
    validarCampo
],usuarioControllers.usuarioPutNombre);

//actualizar password de usuario
router.put('/actualizarPass/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    check('password','Clave obligatoria').not().isEmpty(),
    check('password').custom(validarPass),
    validarCampo
],usuarioControllers.usuarioPutPassword);

//actualizar nombre usuarios
router.put('/actualizarNombrePila/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    check('nombre','Nombre obligatorio').not().isEmpty(),
    check('nombre').custom(validarNombre),
    validarCampo
],usuarioControllers.usuarioPutNombrePila);

//actualizar cedula
router.put('/actualizarCedula/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    check('cedula','Cedula obligatoria').not().isEmpty(),
    check('cedula').custom(validarCedula),
    validarCampo
],usuarioControllers.usuarioPutCedula);

//actualizar telefono
router.put('/actualizarTelefono/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    check('telefono','Telefono obligatorio').not().isEmpty(),
    check('telefono').custom(existeTelefonoUser),
    validarCampo
],usuarioControllers.usuarioPutTelefono);

//actualizar direccion
router.put('/actualizarDireccion/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    check('direccion','Direccion obligatoria').not().isEmpty(),
    check('direccion').custom(existeDireccionUser),
    validarCampo
],usuarioControllers.usuarioPutDireccion);

//actualizar #cuenta
router.put('/actualizarNumcuenta/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    check('numCuenta','Numero de cuenta obligatorio').not().isEmpty(),
    check('numCuenta').custom(existeNumeroCuentaUser),
    validarCampo
],usuarioControllers.usuarioPutNumCheck);

//actualizar tipo cuenta
router.put('/actualizarTypecuenta/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    check('tipoCuenta','tipo obligatorio').not().isEmpty(),
    check('tipoCuenta').custom(existeTipoCuentaUser),
    validarCampo
],usuarioControllers.usuarioPutTypeCheck);

//actualizar banco
router.put('/actualizarBanco/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    check('banco','banco obligatorio').not().isEmpty(),
    check('banco').custom(existeBancoUser),
    validarCampo
],usuarioControllers.usuarioPutBanco);

//actualizar num contrato
router.put('/actualizarContrato/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeUsuarioById),
    check('numContrato','Numero de contrato obligatorio').not().isEmpty(),
    check('numContrato').custom(existeNumContratoUser),
    validarCampo
],usuarioControllers.usuarioPutNumContrato);

export default router