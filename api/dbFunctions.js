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

query.getUltimasObras = (result) =>{
    let e = "SELECT mangas.id_manga, mangas.titulo_manga, mangas.year, mangas.puntuacion from mangas ORDER BY id_manga DESC LIMIT 10";
    sql.query(e,(err,res)=>{
        if(err){
            console.log("error: ",err);
            result(err,null);
            return;
        }
        console.log("success");
        result(null,res);
    });
}

query.deleteObra = (id,result) =>{
    let e = 'Delete from mangas where id_manga = '+id;

    sql.query(e,(err,res)=>{
        if(err){
            console.log("error: ",err);
            result(err,null);
            return;
        }
        console.log("success");
        result(null,res);
    });
}

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

query.getGeneros = (data,result) =>{
    let e = "SELECT * FROM generos";

    sql.query(e,(err, res)=>{
        if(err){
            console.log("error: ",err);
            result(err,null);
            return;
        }
        console.log("success");
        result(null,res);
    });
}

query.getTipos = (data,result) =>{
    let e = "SELECT * FROM tipos";

    sql.query(e,(err, res)=>{
        if(err){
            console.log("error: ",err);
            result(err,null);
            return;
        }
        console.log("success");
        result(null,res);
    });
}

query.getAutores = (data,result) =>{
    let e = "SELECT * FROM autores";

    sql.query(e,(err, res)=>{
        if(err){
            console.log("error: ",err);
            result(err,null);
            return;
        }
        console.log("success");
        result(null,res);
    });
}

query.getSerializaciones = (data,result) =>{
    let e = "SELECT * FROM serializaciones";

    sql.query(e,(err, res)=>{
        if(err){
            console.log("error: ",err);
            result(err,null);
            return;
        }
        console.log("success");
        result(null,res);
    });
}

query.getGenerosCount = (data,result) =>{
    let e = '';

    if(data.length > 0)
        e = `SELECT COUNT(generos.genero) as total, SUM(case when mangas.titulo_manga is not null then 1 else 0 end) as totalNotNull, generos.genero, mangas.tipo from generos LEFT JOIN manga_genero ON manga_genero.id_genero = generos.id_genero LEFT JOIN mangas ON mangas.id_manga = manga_genero.id_manga WHERE mangas.tipo in (${data.reduce((e,r)=>`${e},`+r)}) GROUP BY generos.genero`;
    else
        e = 'SELECT COUNT(generos.genero) as total, SUM(case when mangas.titulo_manga is not null then 1 else 0 end) as totalNotNull, generos.genero, mangas.tipo from generos LEFT JOIN manga_genero ON manga_genero.id_genero = generos.id_genero LEFT JOIN mangas ON mangas.id_manga = manga_genero.id_manga GROUP BY generos.genero';
    sql.query(e,(err, res)=>{
        if(err){
            console.log("error: ",err);
            result(err,null);
            return;
        }
        console.log("success");
        result(null,res);
    });
}

query.getTiposCount = (data,result) =>{
    let e = "Select tipos.tipo, (SELECT COUNT(*) from mangas WHERE mangas.tipo = tipos.id_tipo) as total from tipos";

    sql.query(e,(err, res)=>{
        if(err){
            console.log("error: ",err);
            result(err,null);
            return;
        }
        console.log("success");
        result(null,res);
    });
}

query.getAutoresCount = (data,result) =>{
    let e = "Select autores.autor, (SELECT COUNT(*) from mangas WHERE mangas.autor = autores.id_autor) as total from autores";

    sql.query(e,(err, res)=>{
        if(err){
            console.log("error: ",err);
            result(err,null);
            return;
        }
        console.log("success");
        result(null,res);
    });
}

query.getSerializacionesCount = (data,result) =>{
    let e = "Select serializaciones.serializacion, (SELECT COUNT(*) from mangas WHERE mangas.serializacion = serializaciones.id_serializacion) as total from serializaciones";

    sql.query(e,(err, res)=>{
        if(err){
            console.log("error: ",err);
            result(err,null);
            return;
        }
        console.log("success");
        result(null,res);
    });
}

query.getObrasTotal = (data,result) =>{
    let e = "SELECT COUNT(*) as total from mangas";

    sql.query(e,(err, res)=>{
        if(err){
            console.log("error: ",err);
            result(err,null);
            return;
        }
        console.log("success");
        result(null,res);
    });
}

query.getGenerosTotal = (data,result) =>{
    let e = "SELECT COUNT(*) as total from generos";

    sql.query(e,(err, res)=>{
        if(err){
            console.log("error: ",err);
            result(err,null);
            return;
        }
        console.log("success");
        result(null,res);
    });
}

query.getTiposTotal = (data,result) =>{
    let e = "SELECT COUNT(*) as total from tipos";

    sql.query(e,(err, res)=>{
        if(err){
            console.log("error: ",err);
            result(err,null);
            return;
        }
        console.log("success");
        result(null,res);
    });
}

query.getSerializacionesTotal = (data,result) =>{
    let e = "SELECT COUNT(*) as total from serializaciones";

    sql.query(e,(err, res)=>{
        if(err){
            console.log("error: ",err);
            result(err,null);
            return;
        }
        console.log("success");
        result(null,res);
    });
}

query.getAutoresTotal = (data,result) =>{
    let e = "SELECT COUNT(*) as total from autores";

    sql.query(e,(err, res)=>{
        if(err){
            console.log("error: ",err);
            result(err,null);
            return;
        }
        console.log("success");
        result(null,res);
    });
}




query.getObras = (data,result) =>{
    let e = "SELECT mangas.titulo_manga, mangas.puntuacion, mangas.year, manga_genero.id_genero, generos.genero FROM mangas INNER JOIN manga_genero on manga_genero.id_manga = mangas.id_manga INNER JOIN generos ON manga_genero.id_genero = generos.id_genero WHERE ";
    
    if(data.generos.length > 0){
        e += `manga_genero.id_genero IN (${data.generos.reduce((e,r)=>`${e},`+r)}) AND `;
    }
    if(data.tipos.length > 0){
        e += `mangas.tipo IN (${data.tipos.reduce((e,r)=>`${e},`+r)}) AND `;
    }

    e += `(mangas.year BETWEEN ${data.date.d1} and ${data.date.d2}) GROUP BY mangas.titulo_manga ORDER BY mangas.puntuacion ${data.orden == 0 ? 'DESC':'ASC'}${data.limit < 0 ? ``:` LIMIT ${data.limit}`}`;


    sql.query(e,(err, res)=>{
        if(err){
            console.log("error: "+err);
            result(err,null);
            return;
        }
        console.log("success");
        result(null,res);
    });
}




module.exports = query;