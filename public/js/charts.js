
var myChart;
var chart2;




function cargarTitulo(){
    if(f1.value == '' || f2.value == ''){
        getTitulos(null,updateTitulos);
    }else{
        getTitulos([f1.value,f2.value],updateTitulos);
    }

}

const getGeneros = (loadC)=>{
    fetch('http://localhost:3000/api/generos')
  .then(response => response.json())
  .then(data => loadC(data));
}

const getTitulos = (date,loadC)=>{

    let t;
    if(date){
        t = `http://localhost:3000/api/top/${date[0]}.${date[1]}`;
    }else{
        t = 'http://localhost:3000/api/top';
    }
    
    fetch(t)
  .then(response => response.json())
  .then(data => loadC(data));
}

const updateTitulos = (data)=>{
    let labels = [];
    let datos = [];
    labels = data.map(e=>e.titulo_manga.slice(0,16));
    datos = data.map(e=>e.puntuacion);

    chart2.data.labels = labels;
    chart2.data.datasets[0].data = datos;

    chart2.update();
}

const loadChartTitulos = (data)=>{
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
    
    chart2 =  new Chart(document.getElementById('myChart2'),config);
}

window.addEventListener('DOMContentLoaded', (event) => {

    getGeneros((data)=>{
        let labels = [];
        let datos = [];
        labels = data.map(e=>e.genero);
        datos = data.map(e=>e.total);

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
        
        
        myChart = new Chart(document.getElementById('myChart'),config);
    });

    getTitulos(null,loadChartTitulos);

});