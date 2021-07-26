const express = require("express");
const api = require('./api/api');
const path = require('path');
const f = require("./saveDataForm");
require('./saveDataForm');



const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/form',(req,res)=>{
  res.sendFile(path.join(__dirname+'/form.html'));
});

app.post('/form',(req,res)=>{
  console.log(req.body);
  f(req.body,()=>{
    res.send("Nice");
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use('/api',api);
app.use('/static', express.static(path.join(__dirname, 'public')))
