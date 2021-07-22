var express = require('express');
const dbFunctions = require('./dbFunctions');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', function (req, res) {
  res.send('Ruta principal de la api')
})


router.get('/generos', function (req, res) {

    dbFunctions.getGeneros((err,data)=>{
        if (err)
            res.status(500).send({message: err.message || "Some error occurred while creating the Customer."});
        else 
            res.json(data);
    });

})

router.get('/top', function (req, res) {
    dbFunctions.getTitulos(null,(err,data)=>{
        if (err)
            res.status(500).send({message: err.message || "Some error occurred while creating the Customer."});
        else 
            res.json(data);
    });
})

router.get('/top/:date1.:date2', function (req, res) {
    dbFunctions.getTitulos([req.params.date1,req.params.date2],(err,data)=>{
        if (err)
            res.status(500).send({message: err.message || "Some error occurred while creating the Customer."});
        else 
            res.json(data);
    });
})

module.exports = router