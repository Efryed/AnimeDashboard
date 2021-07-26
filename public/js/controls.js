let f1 = document.querySelector('#date1');
let f2 = document.querySelector('#date2');
let f3 = document.querySelector('#numeroObras');

let chartGeneros;
let chartTipos;
let chartObras;

let labelsObras = [];
let labelsGeneros = [];
let labelsTitulos = [];


let totalAutores = 0;
let totalGeneros = 0;
let totalTipos = 0;
let totalEditoriales = 0;
let totalObras = 0;

let listTipos = [];
let listGeneros = [];

let tmpData = {};


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

function getDatosControls(update = false){

    if(update){
        return tmpData;
    }

    data = {};

    data.date = {};

    data.date.d1 = f1.value == '' ? 1800: parseInt(f1.value);
    data.date.d2 = f2.value == '' ? new Date().getFullYear(): parseInt(f2.value);

    data.limit = f3.value == '' ? -1: parseInt(f3.value);

    

    let generos = [];
    document.querySelectorAll('#obrasGeneros > div input').forEach(ele=>{if(ele.checked)generos.push(ele.value)});
    data.generos = generos;

    let tipos = [];
    document.querySelectorAll('#obrasTipos > div input').forEach(ele=>{if(ele.checked)tipos.push(ele.value)});
    data.tipos = tipos;

    data.orden = document.querySelector('#obrasCalificacion').value; 

    tipos = [];
    document.querySelectorAll('#generosTipos > div input').forEach(ele=>{if(ele.checked)tipos.push(ele.value)})

    tmpData = {
        data,
        tipos
    }
    
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

function obtenerGeneros(data){
    fetch('http://localhost:3000/api/generos',{
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json'
        }
    }).then(res => res.json())
      .then(response =>{ 
          console.log('Success:', response);
          updateGeneros(response);
      }).catch(error => console.error('Error:', error));
}

function obtenerDatos(data,update){
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
          mostrarInfo(response,update);
      });
}

function mostrarInfo(data,update){
    document.querySelector('#totalObras span').innerText = data.totalObras[0].total == totalObras ? totalObras:data.totalObras[0].total;
    document.querySelector('#totalGeneros span').innerText = data.totalGeneros[0].total == totalGeneros ? totalGeneros:data.totalGeneros[0].total;
    document.querySelector('#totalTipos span').innerText = data.totalTipos[0].total == totalTipos ? totalTipos:data.totalTipos[0].total;
    document.querySelector('#totalAutores span').innerText = data.totalAutores[0].total == totalAutores ? totalAutores:data.totalAutores[0].total;
    document.querySelector('#totalEditoriales span').innerText = data.totalSerializaciones[0].total == totalEditoriales ? totalEditoriales:data.totalSerializaciones[0].total;

    if(data.totalObras[0].total > totalObras){
        document.querySelector('#totalObras i').innerHTML = '<i class="indicador-verde">▲</i>';
    }else if(data.totalObras[0].total < totalObras){
        document.querySelector('#totalObras i').innerHTML = '<i class="indicador-rojo">▼</i>';
    }else{
        document.querySelector('#totalObras i').innerHTML = '';
    }

    if(data.totalGeneros[0].total > totalGeneros){
        document.querySelector('#totalGeneros i').innerHTML = '<i class="indicador-verde">▲</i>';
    }else if(data.totalGeneros[0].total < totalGeneros){
        document.querySelector('#totalGeneros i').innerHTML = '<i class="indicador-rojo">▼</i>';
    }else{
        document.querySelector('#totalGeneros i').innerHTML = '';
    }

    if(data.totalTipos[0].total > totalTipos){
        document.querySelector('#totalTipos i').innerHTML = '<i class="indicador-verde">▲</i>';
    }else if(data.totalTipos[0].total < totalTipos){
        document.querySelector('#totalTipos i').innerHTML = '<i class="indicador-rojo">▼</i>';
    }else{
        document.querySelector('#totalTipos i').innerHTML = '';
    }

    if(data.totalAutores[0].total > totalAutores){
        document.querySelector('#totalAutores i').innerHTML = '<i class="indicador-verde">▲</i>';
    }else if(data.totalAutores[0].total < totalAutores){
        document.querySelector('#totalAutores i').innerHTML = '<i class="indicador-rojo">▼</i>';
    }else{
        document.querySelector('#totalAutores i').innerHTML = '';
    }

    if(data.totalSerializaciones[0].total > totalEditoriales){
        document.querySelector('#totalEditoriales i').innerHTML = '<i class="indicador-verde">▲</i>';
    }else if(data.totalSerializaciones[0].total < totalEditoriales){
        document.querySelector('#totalEditoriales i').innerHTML = '<i class="indicador-rojo">▼</i>';
    }else{
        document.querySelector('#totalEditoriales i').innerHTML = '';
    }

    totalEditoriales = data.totalSerializaciones[0].total;
    totalAutores = data.totalAutores[0].total;
    totalGeneros = data.totalGeneros[0].total;
    totalObras = data.totalObras[0].total;
    totalTipos = data.totalTipos[0].total;

    document.querySelectorAll('.indicador').forEach(e=>e.style.display = 'inline');
    setTimeout(()=>{
        document.querySelectorAll('.indicador').forEach(e=>e.style.display = 'none');
    },2000);

    if(JSON.stringify(data.listTipos) !== JSON.stringify(listTipos)){
        listTipos = data.listTipos;

        let t = '';
        for(let e of listTipos){
            t += `<label for="">
                    <input type="checkbox" value=${e.id_tipo}> ${e.tipo}
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
                    <input type="checkbox" value=${e.id_genero}> ${e.genero}
                  </label>`;
        }

        document.querySelector('#obrasGeneros div').innerHTML = t;
    }

    if(update){
        updateGeneros(data.generosCount);
        updateTipos(data.tiposCount);
        updateTitulos(data.Obras);
    }else{
        loadChartGeneros(data.generosCount);
        loadChartTipos(data.tiposCount);
        loadChartObras(data.Obras);
    }
}



function loadChartGeneros(data){
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

function loadChartTipos(data){
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

function loadChartObras(data){
    let labels = [];
    let datos = [];
    labelsObras = data.map(e=>{return {titulo: e.titulo_manga,year: e.year,puntuacion: e.puntuacion}}); 
    labels = data.map(e=>e.titulo_manga.slice(0,16));
    datos = data.map(e=>e.puntuacion);
    let min = Math.min(...datos) <= 0 ? 0: Math.min(...datos) - 0.1;
    let max = Math.max(...datos) + 0.1;
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
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            return labelsObras[context[0].dataIndex].titulo;
                        },
                        label: function(context){
                            return `Año: ${labelsObras[context.dataIndex].year}`
                        },
                        afterLabel: function(context){
                            return `Puntuación: ${labelsObras[context.dataIndex].puntuacion}`
                        }
                    }
                }
            },
            y:{
                max: max,
                min: min,
                ticks:{
                    stepSize: 0.1
                }
            }
        }
    };
    
    chartObras =  new Chart(document.getElementById('chartObras'),config);
}

const updateTipos = (data) =>{
    let labels = [];
    let datos = [];
    labels = data.map(e=>e.tipo);
    datos = data.map(e=>e.total);

    // if(JSON.stringify(datos) === JSON.stringify(chartTipos.data.)){
    //     console.log("chart tipos no actualizado");
    //     return;
    // }

    chartTipos.data.labels = labels;
    chartTipos.data.datasets[0].data = datos;

    chartTipos.update();
}

const updateTitulos = (data)=>{
    let labels = [];
    let datos = [];
    labels = data.map(e=>e.titulo_manga.slice(0,16));
    datos = data.map(e=>e.puntuacion);

    // if(JSON.stringify(labels) === JSON.stringify(chartObras.data.labels)){
    //     console.log("chart Obras no actualizado");
    //     return;
    // }

    labelsObras = data.map(e=>{return {titulo: e.titulo_manga,year: e.year,puntuacion: e.puntuacion}}); 
    let min = Math.min(...datos) <= 0 ? 0: Math.min(...datos) - 0.1;
    let max = Math.max(...datos) + 0.1;
    

    chartObras.data.labels = labels;
    chartObras.data.datasets[0].data = datos;
    chartObras.options.y = {
        max: max,
        min: min,
        ticks:{
            stepSize: 0.1
        }
    }

    chartObras.update();
}

const updateGeneros = (data)=>{
    let labels = [];
    let datos = [];
    labels = data.map(e=>e.genero);
    datos = data.map(e=>e.totalNotNull);

    // if(JSON.stringify(labels) === JSON.stringify(chartGeneros.data.labels)){
    //     console.log("chart Generos no actualizado");
    //     return;
    // }

    chartGeneros.data.labels = labels;
    chartGeneros.data.datasets[0].data = datos;

    chartGeneros.update();
}


window.addEventListener('DOMContentLoaded', (event) => {


    obtenerDatos(getDatosControls(),false);

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
        obtenerObras(data.data);
    });

    document.querySelector("#actualizarChartGeneros").addEventListener('click',()=>{
        let data = getDatosControls();
        obtenerGeneros(data.tipos);
    });

    setInterval(()=>{
        obtenerDatos(getDatosControls(true),true);
    }, 5000);

});