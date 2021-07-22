const sql = require("./db.js");

// constructor
const query = {}

query.getGeneros = (result) => {
    let e = "SELECT generos.genero, (select COUNT(*)from manga_genero where manga_genero.id_genero = generos.id_genero) as total from generos";
    sql.query(e, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("success");
        result(null, res);
  });
};

query.getTitulos = (dates,result) =>{
    let e = "SELECT mangas.titulo_manga, mangas.year, mangas.puntuacion from mangas where mangas.year BETWEEN ? and ? order by mangas.puntuacion DESC LIMIT 10";
    
    if(!dates){
        dates = [];
        dates[0] = 1800;
        dates[1] = new Date().getFullYear();
    }
    console.log(dates);
    sql.query(e,dates,(err, res)=>{
        if(err){
            console.log("error: ",err);
            result(err,null);
            return;
        }
        console.log("success");
        result(null,res);
    });
}

module.exports = query;