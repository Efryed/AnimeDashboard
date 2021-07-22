const express = require("express");
const api = require('./api/api');
const path = require('path');



const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use('/api',api);
app.use('/static', express.static(path.join(__dirname, 'public')))
