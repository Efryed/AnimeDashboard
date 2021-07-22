const puppeteer = require('puppeteer');
const query = require('./connec.js');
const con = require('./connec.js');

const url = 'https://myanimelist.net/topmanga.php?limit=';

const responder = async (n)=>{
    let browser;
    let message;
    let links = [];
    try{
        browser = await puppeteer.launch();
        let page = await browser.newPage();
        await page.setViewport({
            width: 1280,
            height: 720,
            deviceScaleFactor: 1,
        });

        for(let i = 0;i<n;i++){
            await page.goto(`${url}${i*50}`,{ waitUntil: 'domcontentloaded' });

            let lt = await page.evaluate(()=>{
                let links = [];
                document.querySelectorAll('.ranking-list td.title div.detail a').forEach(e=>{
                    links.push(e.href);
                });
                return links;
            });
            links = links.concat(lt);
        }

        await browser.close();
        return links;
    }catch(e){
        console.log(e);
        await browser.close();
        return null;    
    }

}

const getInfo = async (links)=>{
    let browser;
    let message;
    let infoList = [];
    try{
        browser = await puppeteer.launch();
        let page = await browser.newPage();
        await page.setViewport({
            width: 1280,
            height: 720,
            deviceScaleFactor: 1,
        });
        // links.length

        for(let i = 0;i<links.length;i++){
            console.log(`quedan: ${links.length - i}`);
            console.log(`es: ${i+1}`);
            await page.goto(`${links[i]}`,{ waitUntil: 'domcontentloaded' });

            // let lt = await page.evaluate(()=>{
                let info = {};
                let elemt;
                // Nombre
                console.log('nombre')
                elemt = await page.$('H1 span');
                info.nombre = await page.evaluate(el=>el.innerText,elemt);

                // año de publicacion
                console.log('anio')
                elemt = await page.$x(`//div[span[contains(text(), "Published:")]]`);
                info.year = await page.evaluate(el=>parseInt(el.textContent.match(/[0-9]{4}/)[0]),elemt[0]);

                // puntuacion
                console.log('puntuacion')
                elemt = await page.$('.score-label');
                elemt = await page.evaluate(el=>el.textContent,elemt);
                info.puntuacion = parseFloat(elemt);

                // descripcion
                console.log('desc')
                elemt = await page.$('span[itemprop="description"]');
                if(elemt != null)
                    info.desc = await page.evaluate(el=>el.innerText.replaceAll('"',"-"),elemt);
                else
                    info.desc = "No synopsis information"
                // Imagen
                console.log('imagen')
                elemt = await page.$('div a img[itemprop="image"]');
                info.img = await page.evaluate(el=>el.src,elemt);

                // Status
                console.log('status')
                elemt = await page.$x(`//div[span[contains(text(), "Status:")]]`);
                info.status = await page.evaluate(el=>el.innerText.slice(8),elemt[0]);

                // Tipo
                console.log('tipos')
                elemt = await page.$x(`//div[span[contains(text(), "Type:")]]`);
                info.tipo = await page.evaluate(el=>el.innerText.slice(6),elemt[0]);

                // Autor
                console.log('autor')
                elemt = await page.$x(`//div[span[contains(text(), "Authors:")]]`)
                info.autor = await page.evaluate(el=>el.innerText.match(/( [A-Z]+, [A-Z]+)|( [A-Z]+ )/gi)[0].trim(),elemt[0]);

                // Serializacion
                console.log('serializa')
                elemt = await page.$x(`//div[span[contains(text(), "Serialization:")]]`);
                info.serializacion = await page.evaluate(el=>el.innerText.slice(15),elemt[0]);

                // Generos
                console.log('generos')
                elemt = await page.$x(`//div[span[contains(text(), "Genres:")]]`);
                info.generos = await page.evaluate(el=>el.innerText.slice(8).replaceAll(' ','').split(','),elemt[0]);
                // return info;
            // });
            infoList.push(info);
        }

        await browser.close();
        return infoList;
    }catch(e){
        console.log(e);
        await browser.close();
        return null;    
    }

}

const verifyData = async( sql, values )=>{
    let res = await query(sql,values);
    if(res.length >= 1){
        return {res: true,
                rows: res};
    }
    return {res: false,
        rows: res};
}


const run = async ()=>{
    
    let links = await responder(5);
    console.log('Links obtenidos');


    let info = await getInfo(links);

    // let res = await verifyData('select * from mangas where id_manga = 1');
    // console.log(res);
    for(let element of info){
        console.log(`guardando ${element.nombre}`);
        let res = await verifyData(`select * from mangas where titulo_manga = "${element.nombre}"`);
        let status = 1;
        let tipo = 1;
        let autor = 1;
        let seriali = 1;
        if(!res.res){
            res = await verifyData(`select * from status where status = "${element.status}"`);
            if(res.res){
                status = res.rows[0].id_status;
            }else{
                res = await query(`insert into status values (NULL,"${element.status}")`);
                status = res.insertId;
            }

            res = await verifyData(`select * from tipos where tipo = "${element.tipo}"`);
            if(res.res){
                tipo = res.rows[0].id_tipo;
            }else{
                res = await query(`insert into tipos values (NULL,"${element.tipo}")`);
                tipo = res.insertId;
            }

            res = await verifyData(`select * from autores where autor = "${element.autor}"`);
            if(res.res){
                autor = res.rows[0].id_autor;
            }else{
                res = await query(`insert into autores values (NULL,"${element.autor}")`);
                autor = res.insertId;
            }

            res = await verifyData(`select * from serializaciones where serializacion = "${element.serializacion}"`);
            if(res.res){
                seriali = res.rows[0].id_serializacion;
            }else{
                res = await query(`insert into serializaciones values (NULL,"${element.serializacion}")`);
                seriali = res.insertId;
            }

            res = await query(`insert into mangas values (null,"${element.nombre}",${element.year},${element.puntuacion},"${element.desc}","${element.img}",${status},${tipo},${autor},${seriali})`);

            let idM = res.insertId;
            for(let gen of element.generos){
                res = await verifyData(`select * from generos where genero = "${gen}"`);
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
    }
    console.log('finale');
};

run();





