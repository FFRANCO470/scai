import { Router } from "express"
import { check } from 'express-validator';
import settingControllers from '../controllers/setting.js'
import { validarCampo } from '../middlewares/validarCampos.js';
import { validarJWR } from '../middlewares/validarJwt.js';
import { validarRol } from '../middlewares/validarRoles.js';
//import validarExistaArchivo  from '../middlewares/validar-exista-archivo.js'
import {
        validarNombre,
        validarNit,
        validarRegimen,
        validarRepresentante,
        validarDepartamento,
        validarCiudad,
        validarDireccion,
        validarCelular,
        validarTelefono,
        validarEmail,
    } from '../helpers/setting.js'

const router = Router();

//crear modelo
router.post('/',[
    validarJWR,
    validarRol(),
    validarCampo
],settingControllers.configuracionesPost);

//traer la configuracion
router.get('/',[
    validarJWR,
    validarRol('vendedor'),
    validarCampo
],settingControllers.configuracionesGet);

//actualizar name Store
router.put('/nameStore',[
    validarJWR,
    validarRol(),
    check('nameStore','Nombre obligatorio').not().isEmpty(),
    check('nameStore').custom(validarNombre),
    validarCampo
],settingControllers.nameStorePut);
//actualizar nit
router.put('/nit',[
    validarJWR,
    validarRol(),
    check('nit','Nit obligatorio').not().isEmpty(),
    check('nit').custom(validarNit),
    validarCampo
],settingControllers.nitPut);
//actualizar regimen
router.put('/regimen',[
    validarJWR,
    validarRol(),
    check('regimen','Regimen obligatorio').not().isEmpty(),
    check('regimen').custom(validarRegimen),
    validarCampo
],settingControllers.regimenPut);
//actualizar representante
router.put('/representanteCC',[
    validarJWR,
    validarRol(),
    check('representanteCC','Representante obligatorio').not().isEmpty(),
    check('representanteCC').custom(validarRepresentante),
    validarCampo
],settingControllers.representantePut);

//actualizar departamento
router.put('/departamento',[
    validarJWR,
    validarRol(),
    check('departamento','Departamento obligatorio').not().isEmpty(),
    check('departamento').custom(validarDepartamento),
    validarCampo
],settingControllers.departamentoPut);

//actualizar ciudad
router.put('/ciudad',[
    validarJWR,
    validarRol(),
    check('ciudad','Ciudad obligatorio').not().isEmpty(),
    check('ciudad').custom(validarCiudad),
    validarCampo
],settingControllers.ciudadPut);

//actualizar direccion
router.put('/direccion',[
    validarJWR,
    validarRol(),
    check('direccion','Direccion obligatorio').not().isEmpty(),
    check('direccion').custom(validarDireccion),
    validarCampo
],settingControllers.direccionPut);

//actualizar celular
router.put('/celular',[
    validarJWR,
    validarRol(),
    check('celular','Celular obligatorio').not().isEmpty(),
    check('celular').custom(validarCelular),
    validarCampo
],settingControllers.celularPut);

//actualizar telefono
router.put('/telefono',[
    validarJWR,
    validarRol(),
    check('telefono','Telefono obligatorio').not().isEmpty(),
    check('telefono').custom(validarTelefono),
    validarCampo
],settingControllers.telefonoPut);

//actualizar email
router.put('/email',[
    validarJWR,
    validarRol(),
    check('email','Email obligatorio').not().isEmpty(),
    check('email').custom(validarEmail),
    validarCampo
],settingControllers.emailPut);



export default router