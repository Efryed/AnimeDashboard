var express = require('express');
const dbFunctions = require('./dbFunctions');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/',(req, res) => {
  res.send('Ruta principal de la api')
})


router.get('/ultimasObras',(req,res)=>{
    dbFunctions.getUltimasObras((err,data)=>{
        if (err)
            res.status(500).send({message: err.message || "Error al obtener la informacionr."});
        else 
            res.json(data);
    });
})


router.get('/deleteObra/:id',(req,res)=>{
    dbFunctions.deleteObra(req.params.id,(err,data)=>{
        if (err)
            res.status(500).send({message: err.message || "Error al obtener la informacionr."});
        else 
            res.json(data);
    });
})

router.get('/generos',(req, res) => {

    dbFunctions.getGeneros((err,data)=>{
        if (err)
            res.status(500).send({message: err.message || "Error al obtener la informacionr."});
        else 
            res.json(data);
    });

})

router.get('/top',(req, res) => {
    dbFunctions.getTitulos(null,(err,data)=>{
        if (err)
            res.status(500).send({message: err.message || "Error al obtener la informacionr."});
        else 
            res.json(data);
    });
})

router.get('/top/:date1.:date2',(req, res) =>{
    dbFunctions.getTitulos([req.params.date1,req.params.date2],(err,data)=>{
        if (err)
            res.status(500).send({message: err.message || "Error al obtener la informacionr."});
        else 
            res.json(data);
    });
})

router.post('/generos',(req,res) =>{
    dbFunctions.getGenerosCount(req.body,(err,data)=>{
        if (err)
            res.status(500).send({message: err.message || "Error al obtener la informacionr."});
        else 
            res.json(data);
    });
})

router.post('/obras',(req,res)=>{
    console.log(req.body);
    dbFunctions.getObras(req.body,(err,data)=>{
        if (err)
            res.status(500).send({message: err.message || "Error al obtener la informacionr."});
        else 
            res.json(data);
    });
    
});

router.post('/data',(req,res)=>{
    console.log(req.body);
    let rData = {};

    dbFunctions.getAutoresTotal(null,(err,data)=>{
        if (err){
            res.status(500).send({message: err.message || "Error al obtener la informacionr."});
        }else{
            rData.totalAutores = data;
            dbFunctions.getGenerosTotal(null,(err,data)=>{
                if(err){
                    res.status(500).send({message: err.message || "Error al obtener la informacionr."});
                }else{
                    rData.totalGeneros = data;
                    dbFunctions.getObrasTotal(null,(err,data)=>{
                        if(err){
                            res.status(500).send({message: err.message || "Error al obtener la informacionr."});
                        }else{
                            rData.totalObras = data;
                            dbFunctions.getTiposTotal(null,(err,data)=>{
                                if(err){
                                    res.status(500).send({message: err.message || "Error al obtener la informacionr."});
                                }else{
                                    rData.totalTipos = data;
                                    dbFunctions.getSerializacionesTotal(null,(err,data)=>{
                                        if(err){
                                            res.status(500).send({message: err.message || "Error al obtener la informacionr."});
                                        }else{
                                            rData.totalSerializaciones = data;
                                            dbFunctions.getAutoresCount(null,(err,data)=>{
                                                if(err){
                                                    res.status(500).send({message: err.message || "Error al obtener la informacionr."});
                                                }else{
                                                    rData.autoresCount = data;
                                                    dbFunctions.getGenerosCount(req.body.tipos,(err,data)=>{
                                                        if(err){
                                                            res.status(500).send({message: err.message || "Error al obtener la informacionr."});
                                                        }else{
                                                            rData.generosCount = data;
                                                            dbFunctions.getSerializacionesCount(null,(err,data)=>{
                                                                if(err){
                                                                    res.status(500).send({message: err.message || "Error al obtener la informacionr."});
                                                                }else{
                                                                    rData.serializacionesCount = data;
                                                                    dbFunctions.getTiposCount(null,(err,data)=>{
                                                                        if(err){
                                                                            res.status(500).send({message: err.message || "Error al obtener la informacionr."});
                                                                        }else{
                                                                            rData.tiposCount = data;
                                                                            dbFunctions.getObras(req.body.data,(err,data)=>{
                                                                                if(err){
                                                                                    res.status(500).send({message: err.message || "Error al obtener la informacionr."});
                                                                                }else{
                                                                                    rData.Obras = data;
                                                                                    dbFunctions.getTipos(null,(err,data)=>{
                                                                                        if(err){
                                                                                            res.status(500).send({message: err.message || "Error al obtener la informacionr."});
                                                                                        }else{
                                                                                            rData.listTipos = data;
                                                                                            dbFunctions.getGeneros(null,(err,data)=>{
                                                                                                if(err){
                                                                                                    res.status(500).send({message: err.message || "Error al obtener la informacionr."});
                                                                                                }else{
                                                                                                    rData.listGeneros = data;
                                                                                                    res.json(rData);   
                                                                                                }
                                                                                            })   
                                                                                        }
                                                                                    })   
                                                                                }
                                                                            })   
                                                                        }
                                                                    })   
                                                                }
                                                            })
                                                        }   
                                                    })
                                                }
                                            });  
                                        }
                                    })   
                                }
                            })   
                        }
                    })
                }
            })
        } 
    })

})

module.exports = router