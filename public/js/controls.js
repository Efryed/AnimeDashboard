let f1 = document.querySelector('#date1');
let f2 = document.querySelector('#date2');
let f3 = document.querySelector('#numeroObras');

let chartGeneros;
let chartTipos;
let chartObras;


let totalAutores = 0;
let totalGeneros = 0;
let totalTipos = 0;
let totalEditoriales = 0;
let totalObras = 0;

let listTipos = [];
let listGeneros = [];


f1.addEventListener('input',inputNumber);
f2.addEventListener('input',inputNumber);
f3.addEventListener('input',inputNumber);

function inputNumber(e){
    let c = e.target.value;
    e.target.value = e.target.value.replaceAll(' ','');
    if(isNaN(c[c.length-1])){
        e.target.value = e.target.value.slice(0,-1);
    }
}

function getDatosControls(){
    data = {};

    data.date = {};

    data.date.d1 = f1.value == '' ? 1800: parseInt(f1.value);
    data.date.d2 = f2.value == '' ? 2020: parseInt(f2.value);

    data.limit = f3.value == '' ? 5: parseInt(f3.value);

    

    let generos = [];
    document.querySelectorAll('#obrasGeneros > div input').forEach(ele=>{if(ele.checked)generos.push(ele.value)});
    data.generos = generos;

    let tipos = [];
    document.querySelectorAll('#obrasTipos > div input').forEach(ele=>{if(ele.checked)tipos.push(ele.value)});
    data.tipos = tipos;

    data.orden = document.querySelector('#obrasCalificacion').value; 

    tipos = [];
    document.querySelectorAll('#generosTipos > div input').forEach(ele=>{if(ele.checked)tipos.push(ele.value)})

    
    return {
        data,
        tipos
    };
}


function obtenerObras(data){
    fetch('http://localhost:3000/api/obras', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json'
        }
    }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response =>{ 
          console.log('Success:', response);
          updateTitulos(response);
      });
}

function obtenerDatos(data){
    fetch('http://localhost:3000/api/data', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json'
        }
    }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response =>{ 
          console.log('Success:', response);
          mostrarInfo(response);
      });
}

function mostrarInfo(data){
    document.querySelector('#totalObras span').innerText = data.totalObras[0].total == totalObras ? totalObras:data.totalObras[0].total;
    document.querySelector('#totalGeneros span').innerText = data.totalGeneros[0].total == totalGeneros ? totalGeneros:data.totalGeneros[0].total;
    document.querySelector('#totalTipos span').innerText = data.totalTipos[0].total == totalTipos ? totalTipos:data.totalTipos[0].total;
    document.querySelector('#totalAutores span').innerText = data.totalAutores[0].total == totalAutores ? totalAutores:data.totalAutores[0].total;
    document.querySelector('#totalEditoriales span').innerText = data.totalSerializaciones[0].total == totalEditoriales ? totalEditoriales:data.totalSerializaciones[0].total;

    if(JSON.stringify(data.listTipos) !== JSON.stringify(listTipos)){
        listTipos = data.listTipos;

        let t = '';
        for(let e of listTipos){
            t += `<label for="">
                    <input type="checkbox" value=${e.id_tipo}>${e.tipo}
                  </label>`;
        }

        document.querySelector('#obrasTipos div').innerHTML = t;
        document.querySelector('#generosTipos div').innerHTML = t;
    }

    if(JSON.stringify(data.listGeneros) !== JSON.stringify(listGeneros)){
        listGeneros = data.listGeneros;

        let t = '';
        for(let e of listGeneros){
            t += `<label for="">
                    <input type="checkbox" value=${e.id_genero}>${e.genero}
                  </label>`;
        }

        document.querySelector('#obrasGeneros div').innerHTML = t;
    }

    updateChartGeneros(data.generosCount);
    updateChartTipos(data.tiposCount);
    updateChartObras(data.Obras);

}



function updateChartGeneros(data){
    let labels = [];
    let datos = [];
    labels = data.map(e=>e.genero);
    datos = data.map(e=>e.totalNotNull);

    let info = {
        labels: labels,
        datasets: [{
          label: 'Generos',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: datos,
        }]
    };

    let config = {
        type: 'bar',
        data: info,
        options: {}
    };
    
    
    chartGeneros = new Chart(document.getElementById('chartGeneros'),config);
}

function updateChartTipos(data){
    let labels = [];
    let datos = [];
    labels = data.map(e=>e.tipo);
    datos = data.map(e=>e.total);

    let info = {
        labels: labels,
        datasets: [{
          label: 'Tipos de obras',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: datos,
        }]
    };

    let config = {
        type: 'bar',
        data: info,
        options: {}
    };
    
    
    chartTipos = new Chart(document.getElementById('chartTipos'),config);
}

function updateChartObras(data){
    let labels = [];
    let datos = [];
    labels = data.map(e=>e.titulo_manga.slice(0,16));
    datos = data.map(e=>e.puntuacion);
    console.log(labels);
    console.log(datos);
    let info = {
        labels: labels,
        datasets: [{
          label: 'Top Mangas',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: datos,
        }]
    };

    let config = {
        type: 'bar',
        data: info,
        options: {
            y:{
                max: 10,
                min: 5,
                ticks:{
                    stepSize: 0.1
                }
            }
        }
    };
    
    chartObras =  new Chart(document.getElementById('chartObras'),config);
}

const updateTitulos = (data)=>{
    let labels = [];
    let datos = [];
    labels = data.map(e=>e.titulo_manga.slice(0,16));
    datos = data.map(e=>e.puntuacion);

    chartObras.data.labels = labels;
    chartObras.data.datasets[0].data = datos;

    chartObras.update();
}

const updateGeneros = (data)=>{
    let labels = []
}


window.addEventListener('DOMContentLoaded', (event) => {


    obtenerDatos(getDatosControls());

    document.querySelector('#generosTipos button').addEventListener('click',()=>{

        document.querySelector('#generosTipos div').classList.toggle("select-options");
        document.querySelector('#generosTipos div').classList.toggle("select-options-show");
    });

    document.querySelector('#obrasTipos button').addEventListener('click',()=>{

        document.querySelector('#obrasTipos div').classList.toggle("select-options");
        document.querySelector('#obrasTipos div').classList.toggle("select-options-show");
    });

    document.querySelector('#obrasGeneros button').addEventListener('click',()=>{

        document.querySelector('#obrasGeneros div').classList.toggle("select-options");
        document.querySelector('#obrasGeneros div').classList.toggle("select-options-show");
    });

    document.querySelector("#actualizarChartObras").addEventListener('click',()=>{
        

        let data = getDatosControls();
        obtenerObras(data);

    })

});