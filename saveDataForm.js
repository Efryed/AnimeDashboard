const query = require('./connec.js');


const verifyData = async( sql, values )=>{
    let res = await query(sql,values);
    if(res.length >= 1){
        return {res: true,
                rows: res};
    }
    return {res: false,
        rows: res};
}

let f = async (element,succ)=>{
        console.log(`guardando ${element.nombre}`);
        let res = await verifyData(`select * from mangas where titulo_manga like "${element.nombre}"`);
        let status = 1;
        let tipo = 1;
        let autor = 1;
        let seriali = 1;
        if(!res.res){
            res = await verifyData(`select * from status where status like "${element.status}"`);
            if(res.res){
                status = res.rows[0].id_status;
            }else{
                res = await query(`insert into status values (NULL,"${element.status}")`);
                status = res.insertId;
            }

            res = await verifyData(`select * from tipos where tipo like "${element.tipo}"`);
            if(res.res){
                tipo = res.rows[0].id_tipo;
            }else{
                res = await query(`insert into tipos values (NULL,"${element.tipo}")`);
                tipo = res.insertId;
            }

            res = await verifyData(`select * from autores where autor like "${element.autor}"`);
            if(res.res){
                autor = res.rows[0].id_autor;
            }else{
                res = await query(`insert into autores values (NULL,"${element.autor}")`);
                autor = res.insertId;
            }

            res = await verifyData(`select * from serializaciones where serializacion like "${element.serializacion}"`);
            if(res.res){
                seriali = res.rows[0].id_serializacion;
            }else{
                res = await query(`insert into serializaciones values (NULL,"${element.serializacion}")`);
                seriali = res.insertId;
            }

            res = await query(`insert into mangas values (null,"${element.nombre}",${element.year},${element.puntuacion},"${element.desc}","${element.img}",${status},${tipo},${autor},${seriali})`);

            let idM = res.insertId;
            for(let gen of element.generos){
                res = await verifyData(`select * from generos where genero like "${gen}"`);
                let id = 1;
                if(res.res){
                    id = res.rows[0].id_genero;
                }else{
                    res = await query(`insert into generos values (null,"${gen}")`);
                    id = res.insertId;
                }
                res = await query(`insert into manga_genero values (${idM},${id})`);
            }
        }
        succ();
}

module.exports =  f