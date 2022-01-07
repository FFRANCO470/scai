import Venta from '../models/venta.js';
//https://docs.mongodb.com/manual/reference/operator/aggregation/reduce/



const informesControllers = {
    //traer los debitos por fecha
    getCantidadCategoriasDia : async(req,res)=>{
        //reciber fechas formato = yyyy-mm-dd
        const { fecha } = req.query;

        //verificar que existan la variables en la peticion
        if(fecha==undefined ){
            return res.status(400).json({msg:"Fecha no estan en la peticion"})
        }


        //funcion para agregar un dia a la fecha final
        let addDays = function(str,days){
            var myDate = new Date(str);
            myDate.setDate(myDate.getDate()+parseInt(days));
            return myDate
        }

        //obtener la fecha final  + 1 dia
        let FechaFinalModi = addDays( new Date(fecha),1);

        //buacar por filtros en la bd

        let articulos = await Venta.find(
            {
                subTipoFactura:"venta",
                "createdAt":{
                    $gte:new Date(fecha),
                    $lt:new Date(FechaFinalModi)
                }
            },
            {
                articulos:1,
                _id:0,
            }
        )

        // tabla dinamica
        const resultado = {
            //valores unicos
            list:[],
            
        };

        if(articulos.length==0){
            return res.json({resultado});
        }


        let informe = [];

        for (let articulo of articulos) {
            let newArray = articulo.articulos;
            for( let arti of newArray){
                let codigo = arti.sku.split("-");
                informe.push({
                    categoria:codigo[0],
                    cantidad:arti.cantidad,
                    totalPrecio:arti.cantidad*arti.precio,
                    totalCosto:arti.cantidad*arti.costo
                });
            }
        }

        articulos=[];

        

        let columna = 'categoria';
        let agrupador = 'cantidad';
        let agrupador2 = 'totalPrecio';
        let agrupador3 = 'totalCosto';   

        for (let index of informe) {
            const dato = index;
            // busque el dato dentro de la lista unica sino esta agregelo
            if(resultado.list.indexOf(dato[columna]) == -1){
                // meter al array de valores unicos
                resultado.list.push(dato[columna]);
                //crear propiedad con el valor
                resultado[dato[columna]] = {};
                //crear el contador
                resultado[dato[columna]][agrupador] = 0;
                resultado[dato[columna]][agrupador2] = 0;
                resultado[dato[columna]][agrupador3] = 0;
            }
            resultado[dato[columna]][agrupador] += parseInt(dato[agrupador]);
            resultado[dato[columna]][agrupador2] += parseInt(dato[agrupador2]);
            resultado[dato[columna]][agrupador3] += parseInt(dato[agrupador3]);
        }

        res.json({resultado})

     
    },
}

export default informesControllers