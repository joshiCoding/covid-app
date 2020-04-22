// color used in chart and other things
const clrPrim = "#248C1D";
const clrPrimLighter = '#E7FFE5';
const clrPrimLight = '#7CD275';
const clrPrimDark = '#0C5507';

const clrSec = '#00A4AE';
const clrSecLight= '#75D9E3';
const clrSecLighter = '#D9F6F8';
const clrMapBorder = '#28EDFA';


const clrWarning = '#D0387D';


//font colors
const fontClrPrim = clrPrimDark;

const fontClrSec = '#089099';

//****** gloabal variables
let dataofapi ;



// for navbar
const menuBtn = document.querySelector('.menuBtn');
const menuBtnClose = document.querySelector('.menuBtn-close');

const mainNav = document.querySelector('.mainNav');
// mainNav.style.zIndex = "-1";


// console.log(menuBtnClose);
menuBtn.addEventListener('click', e =>{
    const page = document.querySelector('.page');
    page.classList.toggle("page-out");
    // console.log('inside btn');
    if(page.classList.contains("page-out")){
        mainNav.style.zIndex = "0";
        mainNav.style.pointerEvents = "auto";
        // console.log("i am here in if");
    }
    else{
        mainNav.style.zIndex = "-1";
        // console.log("i am here in else");


    }
})

menuBtnClose.addEventListener('click', e =>{
    const page = document.querySelector('.page');
    const mainNav = document.querySelector('.mainNav');

    page.classList.toggle("page-out");
    // console.log('inside btn');
    if(page.classList.contains("page-out")){
        mainNav.style.zIndex = "0";
        mainNav.style.pointerEvents = "auto";
        // console.log("i am here in if");
    }
    else{
        mainNav.style.zIndex = "-1";
        // console.log("i am here in else");


    }
   
})


// using the fetch api here
function getData(){
     fetch('https://api.covid19india.org/data.json')
    .then(res => res.json())
    .then( data =>{
        // console.log(data);
        dataofapi = data;
        fillCurrentSituation(data);
        fillDatewiseChart(data, 7);
        fillStatewiseChart(data);
       
        console.log(dataofapi);

    })
}

function fillCurrentSituation(data){
    // console.log(data.cases_time_series[data.cases_time_series.length -1]);

    const today = data.cases_time_series[data.cases_time_series.length -1];

    const activeNo = document.querySelector('.stat_active .stat_number');
    const activeChangeNo = document.querySelector('.stat_active .stat_change');

    const confirmedNo = document.querySelector('.stat_confirmed .stat_number');
    const confirmedChangeNo = document.querySelector('.stat_confirmed .stat_change');

    const recoveredNo = document.querySelector('.stat_recovered .stat_number');
    const recoveredChangeNo = document.querySelector('.stat_recovered .stat_change');

    const deathNo = document.querySelector('.stat_death .stat_number');
    const deathChangeNo = document.querySelector('.stat_death .stat_change');

    const statsFor = document.querySelector('.updated b');

    
    let activeSum = parseInt(today.totalconfirmed) - parseInt(today.totalrecovered) - parseInt(today.totaldeceased);
    let activeDiff = parseInt(today.dailyconfirmed) - parseInt(today.dailyrecovered) - parseInt(today.dailydeceased);
   

    confirmedNo.innerText = today.totalconfirmed;
    confirmedChangeNo.innerText = "+" + today.dailyconfirmed;

    activeNo.innerText = activeSum;
    activeChangeNo.innerText = "+" + activeDiff;

    recoveredNo.innerText = today.totalrecovered;
    recoveredChangeNo.innerText = "+" + today.dailyrecovered;

    deathNo.innerText = today.totaldeceased;
    deathChangeNo.innerText = "+" + today.dailydeceased;

    statsFor.innerText = today.date;

    
}
getData();

// ********for displaying datewise chart here

const datewiseCanvas = document.querySelector('#datewise_graph_canvas');
let datewiseChart = new Chart(datewiseCanvas, {
    type : "line",
    data : {
        labels : [],
        datasets :[
            {
                label : 'Confirmed',
                data : [],
                borderColor: clrWarning
            },
            {
                label : 'Recovered',
                data : [],
                borderColor: clrPrim
            },
            {
                label : 'Death',
                data : [],
                borderColor:'#121212'
            },  
           
        ]
    }
});
//dynamic update of date-wise chart

function fillDatewiseChart(data, desiredlen){
    const len = data.cases_time_series.length;
    //emptying the existing value from chart
    datewiseChart.data.labels = [];
    datewiseChart.data.datasets[0].data = [];
    datewiseChart.data.datasets[1].data = [];
    datewiseChart.data.datasets[2].data = [];

    console.log(len);
    const dates = data.cases_time_series.filter((cases, index) => {
        if((len - desiredlen) <= index){
            return true;
        }
    });

   
    dates.forEach(cases => {
        datewiseChart.data.labels.push(cases.date);
    });

    dates.forEach( cases => {
        datewiseChart.data.datasets[0].data.push( cases.dailyconfirmed);
    })

    dates.forEach(cases =>{
        datewiseChart.data.datasets[1].data.push( cases.dailyrecovered);
    })

    dates.forEach(cases =>{
        datewiseChart.data.datasets[2].data.push( cases.dailydeceased);
    })

    
     datewiseChart.update();
}



//adding update functionality on buttons
const dateLinearBtn = document.querySelector('.datewise_linear');
const dateBarBtn = document.querySelector('.datewise_bar');

const dateWeekBtn = document.querySelector('.datewise_week');
const dateMonthBtn = document.querySelector('.datewise_month');
const dateBegBtn = document.querySelector('.datewise_beg');

dateLinearBtn.addEventListener('click', () =>{
    dateBarBtn.classList.remove('chips-active');
    dateLinearBtn.classList.add('chips-active');

    datewiseChart.destroy();
    datewiseChart = new Chart(datewiseCanvas, {
        type : "line",
        data : {
            labels : [],
            datasets :[
                {
                    label : 'Confirmed',
                    data : [],
                    borderColor: clrWarning
                },
                {
                    label : 'Recovered',
                    data : [],
                    borderColor: clrPrim
                },
                {
                    label : 'Death',
                    data : [],
                    borderColor:'#121212'
                },  
               
            ]
        }
    });
    fillDatewiseChart(dataofapi, 7);
})

dateBarBtn.addEventListener('click', () =>{
    dateLinearBtn.classList.remove('chips-active');
    dateBarBtn.classList.add('chips-active');


    datewiseChart.destroy();
    datewiseChart = new Chart(datewiseCanvas, {
        type : "bar",
        data : {
            labels : [],
            datasets :[
                {
                    label : 'Confirmed',
                    data : [],
                    backgroundColor: clrWarning
                },
                {
                    label : 'Recovered',
                    data : [],
                    backgroundColor: clrPrim
                },
                {
                    label : 'Death',
                    data : [],
                    backgroundColor:'#121212'
                },  
               
            ]
        }
    });
    fillDatewiseChart(dataofapi, 7);
});


dateWeekBtn.addEventListener('click', () =>{
    dateWeekBtn.classList.add('chips-active');
    dateMonthBtn.classList.remove('chips-active');
    dateBegBtn.classList.remove('chips-active');

    fillDatewiseChart(dataofapi, 7);
});
dateMonthBtn.addEventListener('click',() =>{
    dateWeekBtn.classList.remove('chips-active');
    dateMonthBtn.classList.add('chips-active');
    dateBegBtn.classList.remove('chips-active');

    fillDatewiseChart(dataofapi , 30);
})
dateBegBtn.addEventListener('click', () =>{
    dateWeekBtn.classList.remove('chips-active');
    dateMonthBtn.classList.remove('chips-active');
    dateBegBtn.classList.add('chips-active');

    fillDatewiseChart(dataofapi , dataofapi.cases_time_series.length);
})


//**********************for displaying statewise chart here

const statewiseCanvas = document.querySelector('#statewise_graph_canvas');

const statewiseChart = new Chart(statewiseCanvas, {
    type :'horizontalBar',
    data : {
        labels : [],
        datasets :[
            {
                label : 'Confirmed',
                data : [],
                backgroundColor:clrWarning
            },
            {
                label : 'Recovered',
                data : [],
                backgroundColor:clrPrim

            },
            {
                label : 'Death',
                data : [],
                backgroundColor:'black'

            },  
        ]
    },
    options :{
        scales : {
            xAxes : [{
                stacked : true
            }],
            yAxes : [{
                stacked :true
            }]
        }
    }
}
   
)
//dynamic update of state-wise chart

function fillStatewiseChart(data){
    const states = data.statewise.filter( (cases , index) =>{
        if(index <= 5 && index !== 0){
            return true;
        }
    });

   
    states.forEach(cases => {
        statewiseChart.data.labels.push(cases.state);
    });

    states.forEach( cases => {
        statewiseChart.data.datasets[0].data.push( cases.confirmed);
    })

    states.forEach(cases =>{
        statewiseChart.data.datasets[1].data.push( cases.recovered);
    })

    states.forEach(cases =>{
        statewiseChart.data.datasets[2].data.push( cases.deceased);
    })

    
     statewiseChart.update();
}

// custom script for testing map svg 
const mapObj = document.querySelector('#india-map');
mapObj.addEventListener('load', mapLoad);
// console.log(mapObj);

function mapLoad(){
    const map = mapObj.contentDocument;
    const state = document.querySelector('.map_statBox_stateName');
    

    const svgIndia = map.getElementById('indiaMap-svg');

    svgIndia.addEventListener('click',e =>{
        // console.log((e.target).getAttribute('title'));
        e.target.style.strokeWidth = "3px";
        state.innerText = e.target.getAttribute('title');
        if(e.target.getAttribute('title') === null){
            state.innerText = "Total";
        }
    })
}


    
