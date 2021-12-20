import {Router} from 'express';
import articuloControllers from '../controllers/articulo.js'
import {validarCampo} from '../middlewares/validarCampos.js';
import { validarJWR } from '../middlewares/validarJwt.js';
import { validarRol } from '../middlewares/validarRoles.js';
import { check } from 'express-validator';
import { existeCategoriaById } from '../helpers/categoria.js';
import { existeMarcaById } from '../helpers/marca.js';
import { existeReferencai,
            existeArticuloById,
            validandoStock,
            validandoCosto,
            validandoPrecio 
} from '../helpers/artiuculo.js';

const router = Router();

//agregar articulo por formulario
router.post('/',[
    validarJWR,
    validarRol(),
    check('categoria','Categoria obligatoria').not().isEmpty(),
    check('marca','Marca obligatoria').not().isEmpty(),
    check('referencia','Referencia obligatoria').not().isEmpty(),
    check('cantDisponibles','Cantidad obligatoria').not().isEmpty(),
    check('costo','Costo obligatoria').not().isEmpty(),
    check('precio','Precio obligatorio').not().isEmpty(),
    check('categoria','ID no valido').isMongoId(),
    check('marca','ID no valido').isMongoId(),
    check('categoria').custom(existeCategoriaById),
    check('marca').custom(existeMarcaById),
    check('referencia').custom(existeReferencai),
    check('cantDisponibles').custom(validandoStock),
    check('costo').custom(validandoCosto),
    check('precio').custom(validandoPrecio),
    validarCampo
],articuloControllers.articuloPost);

//enviar todos los articulos
router.get('/',[
    validarJWR,
    validarRol(),
    validarCampo
],articuloControllers.articuloGet);

//enviar articulos por categoria y/o marca o por nada
router.post('/categoriaAndMarca',[
    validarJWR,
    validarRol(),
    validarCampo
],articuloControllers.articuloPostMarcaAndCategoria)

//traer articulos activos
router.get('/activos',[
    validarJWR,
    validarRol('vendedor'),
    validarCampo
],articuloControllers.articulosActivosGet);

//traer articulos separados y activos
router.get('/separados',[
    validarJWR,
    validarRol('vendedor'),
    validarCampo
],articuloControllers.articulosSeparadasGet);

//traer articulo por id
router.get('/articulo/:id',[
    validarJWR,
    validarRol(),
    check('id','ID obligatorio').not().isEmpty(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeArticuloById),
    validarCampo
],articuloControllers.articuloGetId);

//activar articulo
router.put('/activar/:id',[
    validarJWR,
    validarRol(),
    check('id','ID obligatorio').not().isEmpty(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeArticuloById),
    validarCampo
],articuloControllers.articuloPutActivar);

//desactivar articulo
router.put('/desactivar/:id',[
    validarJWR,
    validarRol(),
    check('id','ID obligatorio').not().isEmpty(),
    check('id','ID obligatorio').not().isEmpty(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeArticuloById),
    validarCampo
],articuloControllers.articuloPutDesactivar);

//actualizar categoria
router.put('/actualizarCategoria/:id',[
    validarJWR,
    validarRol(),
    check('id','ID obligatorio').not().isEmpty(),
    check('id','ID obligatorio').not().isEmpty(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeArticuloById),
    check('categoria','Categoria obligatoria').not().isEmpty(),
    check('categoria','ID no valido de categoria').isMongoId(),
    check('categoria').custom(existeCategoriaById),
    validarCampo
],articuloControllers.articuloPutCategoria)

//actualizar marca
router.put('/actualizarMarca/:id',[
    validarJWR,
    validarRol(),
    check('id','ID obligatorio').not().isEmpty(),
    check('id','ID obligatorio').not().isEmpty(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeArticuloById),
    check('marca','Marca obligatoria').not().isEmpty(),
    check('marca','ID no valido de marca').isMongoId(), 
    check('marca').custom(existeMarcaById),
    validarCampo
],articuloControllers.articuloPutMarca)

//actualizar referencia
router.put('/actualizarReferencia/:id',[
    validarJWR,
    validarRol(),
    check('id','ID obligatorio').not().isEmpty(),
    check('id','ID obligatorio').not().isEmpty(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeArticuloById),
    check('referencia','Referencia obligatoria').not().isEmpty(),
    check('referencia').custom(existeReferencai),
    validarCampo
],articuloControllers.articuloPutReferencia)

//actualziar costo
router.put('/actualizarCosto/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeArticuloById),
    check('costo','Costo obligatoria').not().isEmpty(),
    check('costo').custom(validandoCosto),
    validarCampo
],articuloControllers.articuloPutCosto);

//actualizar precio
router.put('/actualizarPrecio/:id',[
    validarJWR,
    validarRol(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeArticuloById),
    check('precio','Precio obligatorio').not().isEmpty(),
    check('precio').custom(validandoPrecio),
    validarCampo
],articuloControllers.articuloPutPrecio);

//actualizar cantDisponible
router.put('/actualizarCantDisponible/:id',[
    validarJWR,
    validarRol(),
    check('id','ID obligatorio').not().isEmpty(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeArticuloById),
    check('cantDisponibles','Cantidad obligatoria ruta').not().isEmpty(),
    check('cantDisponibles').custom(validandoStock),
    validarCampo
],articuloControllers.articuloPutcantDisponible);

//actualizar cantSalieron
router.put('/actualizarCantSalieron/:id',[
    validarJWR,
    validarRol(),
    check('id','ID obligatorio').not().isEmpty(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeArticuloById),
    check('cantSalieron','Cantidad obligatoria ruta').not().isEmpty(),
    check('cantSalieron').custom(validandoStock),
    validarCampo
],articuloControllers.articuloPutcantSalieron);

//actualizar cantVendieron
router.put('/actualizarCantVendieron/:id',[
    validarJWR,
    validarRol(),
    check('id','ID obligatorio').not().isEmpty(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeArticuloById),
    check('cantVendieron','Cantidad obligatoria ruta').not().isEmpty(),
    check('cantVendieron').custom(validandoStock),
    validarCampo
],articuloControllers.articuloPutcantVendieron);

//actualizar cantAlmacenadas
router.put('/actualizarCantSeparadas/:id',[
    validarJWR,
    validarRol(),
    check('id','ID obligatorio').not().isEmpty(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeArticuloById),
    check('cantSeparadas','Cantidad obligatoria ruta').not().isEmpty(),
    check('cantSeparadas').custom(validandoStock),
    validarCampo
],articuloControllers.articuloPutcantSeparadas);

//actualizar cantCompradas
router.put('/actualizarCantCompradas/:id',[
    validarJWR,
    validarRol(),
    check('id','ID obligatorio').not().isEmpty(),
    check('id','ID no valido').isMongoId(),
    check('id').custom(existeArticuloById),
    check('cantCompradas','Cantidad obligatoria ruta').not().isEmpty(),
    check('cantCompradas').custom(validandoStock),
    validarCampo
],articuloControllers.articuloPutcantCompradas);


export default router