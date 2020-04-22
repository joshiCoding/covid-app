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





// for navbar
const menuBtn = document.querySelector('.menuBtn');
const menuBtnClose = document.querySelector('.menuBtn-close');

const mainNav = document.querySelector('.mainNav');
mainNav.style.zIndex = "-1";


console.log(menuBtnClose)
menuBtn.addEventListener('click', e =>{
    const page = document.querySelector('.page');
    page.classList.toggle("page-out");
    console.log('inside btn');
    if(page.classList.contains("page-out")){
        mainNav.style.zIndex = "0";
        mainNav.style.pointerEvents = "auto";
        console.log("i am here in if");
    }
    else{
        mainNav.style.zIndex = "-1";
        console.log("i am here in else");


    }
})

menuBtnClose.addEventListener('click', e =>{
    const page = document.querySelector('.page');
    const mainNav = document.querySelector('.mainNav');

    page.classList.toggle("page-out");
    console.log('inside btn');
    if(page.classList.contains("page-out")){
        mainNav.style.zIndex = "0";
        mainNav.style.pointerEvents = "auto";
        console.log("i am here in if");
    }
    else{
        mainNav.style.zIndex = "-1";
        console.log("i am here in else");


    }
   
})


// using the fetch api here
function getData(){
    fetch('https://api.covid19india.org/data.json')
    .then(res => res.json())
    .then( data =>{
        console.log(data);
        fillCurrentSituation(data);

    })
}

function fillCurrentSituation(data){
    console.log(data.cases_time_series[data.cases_time_series.length -1]);

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

// for displaying datewise chart here

const datewiseCanvas = document.querySelector('#datewise_graph_canvas');

const datewiseChart = new Chart(datewiseCanvas, {
    type : "line",
    data : {
        labels : ['1 Apr', '2 Apr', '3 Apr', '4 Apr', '5 Apr'],
        datasets :[
            {
                label : 'Confirmed',
                data : [1,4,6,8,2],
                borderColor: clrWarning
            },
            {
                label : 'Recovered',
                data : [2,3,7,3,1],
                borderColor: clrPrim
            },
            {
                label : 'Death',
                data : [3,2,1,1,2],
                borderColor:'#121212'
            },  
           
        ]
    }
});


//for displaying statewise chart here

const statewiseCanvas = document.querySelector('#statewise_graph_canvas');

const statewiseChart = new Chart(statewiseCanvas, {
    type :'horizontalBar',
    data : {
        labels : ['Maharastra','Haryana', 'Delhi', 'Uttar Pradesh', 'West Bengal'],
        datasets :[
            {
                label : 'Confirmed',
                data : [1,4,6,8,2],
                backgroundColor:clrWarning
            },
            {
                label : 'Recovered',
                data : [2,3,7,3,1],
                backgroundColor:clrPrim

            },
            {
                label : 'Death',
                data : [3,2,1,1,2],
                backgroundColor:'#121212'

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