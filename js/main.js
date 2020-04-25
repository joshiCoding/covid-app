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
const clrDeath = '#121212';


//font colors
const fontClrPrim = clrPrimDark;

const fontClrSec = '#089099';

//****** gloabal variables
let dataofapi ;



// for navbar
const menuBtn = document.querySelector('.menuBtn');
const menuBtnClose = document.querySelector('.menuBtn-close');

const mainNav = document.querySelector('.mainNav');
const page = document.querySelector('.page');

// //testing the position feature
// const indiaView = document.querySelector('#india-view');
// let newLinkPos = indiaView.getBoundingClientRect().top ;
// document.addEventListener('load', () =>{
//     window.scrollTo(0,newLinkPos);
// })

// console.log(menuBtnClose);
menuBtn.addEventListener('click', e =>{

    page.classList.toggle("page-out");
    if(page.classList.contains("page-out")){
        mainNav.style.zIndex = "0";
        mainNav.style.pointerEvents = "auto";
    }
    else{
        mainNav.style.zIndex = "-1";
    }

})

menuBtnClose.addEventListener('click', menuClose);

function menuClose(){

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
}

//experimental use of window scroll
// const linkToIndiaView = document.querySelector('.linkto_indiaView');
// linkToIndiaView.addEventListener('click',e =>{
//     const page = document.querySelector('.page');
//     const indiaView = document.querySelector('#india-view');

//     menuClose();
//     let newLinkPos = indiaView.getBoundingClientRect().top ;
//     window.scrollTo(0,newLinkPos);
//     console.log(newLinkPos);
//     console.log(window.scrollTo(0,newLinkPos));

// })

//testing for scroll up navshow feature (this feature is not needed i think)
// window.addEventListener('scroll', () =>{
//     header.classList.add('header-fixed');
//     header.style.background = "red";
//     // console.log('current scroll' + window.pageYOffset)
// }) 

//styling for sticky nav bottom
// const plusBtn = document.querySelector('.plus_btn');
// plusBtn.addEventListener('click',()=>{
//     plusBtn.classList.toggle('plus_btn-close');
// })

//********************* using the fetch api here
function getData(){
     fetch('https://api.covid19india.org/data.json')
    .then(res => res.json())
    .then( data =>{
        // console.log(data);
        dataofapi = data;
        fillCurrentSituation(data);
        fillDatewiseChart(data, 7);
        fillStatewiseChart(data, 5);
        // fillEffectedStateData(data);
        fillMapBox(data,"Total")


       
        // console.log(dataofapi);

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
                borderColor:clrDeath
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

    const dates = data.cases_time_series.filter((cases, index) => {
        if((len - desiredlen) <= index){
            return true;
        }
    });

    dates.forEach(cases => {
         datewiseChart.data.labels.push(cases.date);
         datewiseChart.data.datasets[0].data.push( cases.dailyconfirmed);
         datewiseChart.data.datasets[1].data.push( cases.dailyrecovered);
         datewiseChart.data.datasets[2].data.push( cases.dailydeceased);
     });
    
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
    let daysforData ;
    if(dateWeekBtn.classList.contains('chips-active')){
        daysforData = 7;
    }
    else if(dateMonthBtn.classList.contains('chips-active')){
        daysforData = 30;
    }
    else if(dateBegBtn.classList.contains('chips-active')){
        daysforData = dataofapi.cases_time_series.length;
    }

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
                    borderColor:clrDeath
                },  
               
            ]
        }
    });
    fillDatewiseChart(dataofapi, daysforData);
})

dateBarBtn.addEventListener('click', () =>{
    dateLinearBtn.classList.remove('chips-active');
    dateBarBtn.classList.add('chips-active');
    let daysforData ;
    if(dateWeekBtn.classList.contains('chips-active')){
        daysforData = 7;
    }
    else if(dateMonthBtn.classList.contains('chips-active')){
        daysforData = 30;
    }
    else if(dateBegBtn.classList.contains('chips-active')){
        daysforData = dataofapi.cases_time_series.length;
    }


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
                    backgroundColor:clrDeath
                },  
               
            ]
        }
    });
    fillDatewiseChart(dataofapi, daysforData);
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
                backgroundColor:clrDeath

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
        },
        responsive: true,
        maintainAspectRatio: true
      
    }
}
   
)
//dynamic update of state-wise chart

function fillStatewiseChart(data,noOfState){
    //empting the preexisting data
    statewiseChart.data.labels = [];
    statewiseChart.data.datasets[0].data = [];
    statewiseChart.data.datasets[1].data = [];
    statewiseChart.data.datasets[2].data = [];

    const states = data.statewise.filter( (cases , index) =>{
        if(index <= noOfState && index !== 0){
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
        statewiseChart.data.datasets[2].data.push( cases.deaths);
    })

    
     statewiseChart.update();
}

//for updating link on view btn click
const viewAllBtn = document.querySelector('.statewise_viewDetailBtn');
viewAllBtn.addEventListener('click', ()=>{
    const stateCanvasContainer = statewiseCanvas.parentElement;
    stateCanvasContainer.style.transition = "transform 1s ease-in-out"

    if(viewAllBtn.innerText === 'View All States'){
        stateCanvasContainer.style.height = "50rem";
        stateCanvasContainer.firstChild.style.height = "50rem";      
        fillStatewiseChart(dataofapi, dataofapi.statewise.length);
        statewiseChart.options.maintainAspectRatio = 0;
        
        statewiseChart.update();
        viewAllBtn.innerText = "View Five Most Effected";
    }
    else if(viewAllBtn.innerText === "View Five Most Effected"){
        stateCanvasContainer.style.height = "auto";
        stateCanvasContainer.firstChild.style.height = "auto";
        
        fillStatewiseChart(dataofapi, 5);
        statewiseChart.options.maintainAspectRatio = 'true';
        statewiseChart.update();
        viewAllBtn.innerText = "View All States";
    }
})








// ********************custom script for testing map svg 
const mapObj = document.querySelector('#india-map');
mapObj.addEventListener('load', mapLoad);

const mapActiveNo = document.querySelector('.map_statBox_stateStat-activeNo');
const mapConfirmedNo = document.querySelector('.map_statBox_stateStat-confirmedNo');
const mapRecoveredNo = document.querySelector('.map_statBox_stateStat-recoveredNo');
const mapDeathNo = document.querySelector('.map_statBox_stateStat-deathNo');

let effectedSearchData;

let svgIndia ;


function fillMapBox(data, state){
    data.statewise.forEach( st =>{
        if(st.state === state){
            // console.log(st.active);
            mapActiveNo.innerText = st.active;
            mapConfirmedNo.innerText = st.confirmed;
            mapRecoveredNo.innerText = st.recovered;
            mapDeathNo.innerText = st.deaths;
        }
    });
}

function mapLoad(){
    const map = mapObj.contentDocument;
    const state = document.querySelector('.map_statBox_stateName');
    svgIndia = map.getElementById('indiaMap-svg');
    const topDistrictContainer = document.querySelector(".topDistrictInState");


    svgIndia.addEventListener('click',e =>{

        let childofSvg = svgIndia.querySelectorAll('path');
        childofSvg.forEach(ch =>{
             ch.classList.remove('indiaMap_path-active');
        });

        if(e.target.getAttribute('title') !== null){
            e.target.classList.add('indiaMap_path-active');
        }
        state.innerText = e.target.getAttribute('title');
        topDistrictContainer.classList.add('topDistrictInState-active');


        if(e.target.getAttribute('title') === null){
            state.innerText = "Total";
            topDistrictContainer.classList.remove('topDistrictInState-active');

        }
        fillMapBox(dataofapi, state.innerText);
        fillTopDistrictData(effectedSearchData,e.target.getAttribute('title'));

    })
}

 // creating canvas for the top district chart
 const topDistrictCanvas = document.querySelector('#topDistrict_canvas');
 const topDistrictChart = new Chart(topDistrictCanvas, {
     type :'bar',
     data : {
         labels : ["Agra", "Lucknow", "Kanpur", "Jaunpur" , "Moradabad"],
         datasets :[
             {
                 label : 'Active',
                 data : [8,4,3,2,1],
                 backgroundColor:clrWarning
             },
             {
                 label : 'Recovered',
                 data : [2,1,1,1,0],
                 backgroundColor:clrPrim
 
             },
             {
                 label : 'Death',
                 data : [2,1,0,0,0],
                 backgroundColor: clrDeath
 
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
         },
         responsive: true,
         maintainAspectRatio: true,
         tooltips :{
             mode : 'index'
         }
       
     }
 })

 function fillTopDistrictData(data,state){
     //empting the preexisting data
    topDistrictChart.data.labels = [];
    topDistrictChart.data.datasets[0].data = [];
    topDistrictChart.data.datasets[1].data = [];
    topDistrictChart.data.datasets[2].data = [];

 
    let districts = [];
    data.forEach( st =>{
        if(st.state === state){
            districts.push(st.districtData);
        }
    })

    //for sorting data (for bubble sorting the array and picking top five of it)
    for(let i=0;i< (districts[0].length-1);i++){
        for(let j=i;j<districts[0].length;j++){
            if(districts[0][i].active < districts[0][j].active){
                let temp = districts[0][i];
                districts[0][i] = districts[0][j];
                districts[0][j] = temp;
            }
        }
    }
    let i = 0;
    districts = districts[0].filter(dist =>{
        i++;

        if(i <= 5){
            return dist;
        }
    })

    console.log(districts);


    
     districts.forEach(cases => {
         topDistrictChart.data.labels.push(cases.district);
     });
 
     districts.forEach( cases => {
         topDistrictChart.data.datasets[0].data.push( cases.active);
     })
 
     districts.forEach(cases =>{
         topDistrictChart.data.datasets[1].data.push( cases.recovered);
     })
 
     districts.forEach(cases =>{
         topDistrictChart.data.datasets[2].data.push( cases.deceased);
     })
 
     
      topDistrictChart.update();
 }
 
 

//***** for displaying how effected is your area section
let effectedStateData ;
const effectedState = document.querySelector('.statewise_effectedArea_stateName');
const effectedStateName = document.querySelector('.search_box');
const effectedSearchBox = document.querySelector('.search_box_container');
const effectedActiveNo = document.querySelector('.state_statBox_stateStat-activeNo');
const effectedConfirmedNo = document.querySelector('.state_statBox_stateStat-confirmedNo');
const effectedRecoveredNo = document.querySelector('.state_statBox_stateStat-recoveredNo');
const effectedDeathNo = document.querySelector('.state_statBox_stateStat-deathNo');

const effectedCityBox = document.querySelector('.statewise_effectedArea_cityStat_box');
const effectedCityhead = document.querySelector('.statewise_effectedArea_cityStat_para');
const effectedStateSearchBox = document.querySelector('.match_list');

let effectedStateSearchText  ;
let effectedStateSearchCode;
// effectedStateName.value = "Uttar Pradesh";    //default value for test purposes


//handling the design of the textbox

effectedStateName.addEventListener('focus', () =>{
    effectedSearchBox.classList.add('search_box_container-active');
    effectedStateSearchText = '';
    effectedStateName.value = effectedStateSearchText;
})


effectedState.querySelector('.search_box_container svg').addEventListener('click', () =>{
    effectedStateName.focus();
  });

//searching the fetched data for keyword as they are types

    // effectedStateName.addEventListener('input', () => {
    //     effectedStateSearchText = effectedStateName.value ;

    //     effectedStateSearchBox.style.display = 'block';

    //     let matches = Object.keys(effectedStateData).filter( st =>{
    //         let regex = new RegExp(`^${effectedStateSearchText}`, 'gi');
    //         return st.match(regex);
    //     });

    //     //  console.log(Object.entries(effectedStateData)[0][1].districtData);
    //     //  Object.entries(effectedStateData).forEach( st =>{
    //     //      console.log(st[1]);
    //     //  })

    //     let output = '';
    //     matches.forEach(match => {
    //         output = output + `<li class = "search-box-list">${match}</li>`;
    //     });

    //     if(output === ''){
    //         output = output + `<li class = "search-box-list">No Such State in Database</li>`;
    //     }

    //     effectedStateSearchBox.innerHTML = output;

    //  })

let matchNames = [];
let matchStateNames = [];
let matchDistrictNames = [];
let matchStateCode = [];
   
   

effectedStateName.addEventListener('input' , ()=>{
    effectedStateSearchText = effectedStateName.value;
    effectedStateSearchBox.style.display = 'block';

    let matches = matchNames.filter( mtch => {
        let regex = new RegExp(`^${effectedStateSearchText}`, 'gi');
       
            return mtch.match(regex) 
        
    })


    let output = '';
    matches.forEach(match => {
        if(match !== 'Unknown'){
        output = output + `<li class = "search-box-list">${match}</li>`;
        }
    });

    if(output === ''){
        output = output + `<li class = "search-box-list">No Such State in Database</li>`;
    }

    effectedStateSearchBox.innerHTML = output;
    console.log('fired input change');
})

effectedStateSearchBox.addEventListener('click', e =>{

    effectedStateSearchText =e.target.innerText;
    effectedStateName.value = effectedStateSearchText;
    console.log(effectedStateName);
    effectedStateSearchBox.style.display = 'none';
    effectedSearchBox.classList.remove('search_box_container-active');


    fillEffectedStateData(dataofapi,effectedStateName.value);
    fillStateDatewiseChart(effectedStateDatewiseData , 7,effectedStateSearchCode);
    // fillEffectedCityData(effectedStateData);
    fillEffectedDistrictData(effectedSearchData);

    const stateTemplate = document.querySelector('.state_template');
    const districtTemplate = document.querySelector('.district_template');
    let isState = false;
    effectedSearchData.forEach(st => {
        console.log(effectedStateName.value === st.state);
        if(effectedStateName.value === st.statecode.toUpperCase() || effectedStateName.value === st.state){   
          isState = true;
        }
    })
    if(isState === true){
        stateTemplate.style.display = "block";
        districtTemplate.style.display = "none";
    }
    else{
        stateTemplate.style.display = "none";
        districtTemplate.style.display = "block";
        fillDistrictStat(effectedStateName.value);
    }
 })

 

//  effectedStateName.addEventListener('blur', e =>{
//     console.log(e.target);
//     effectedSearchBox.classList.remove('search_box_container-active');
//     effectedStateSearchBox.style.display = 'none';

// })


 //state-datewise section
const stateDatewiseCanvas = document.querySelector('#state_datewise_graph_canvas');
let stateDatewiseChart = new Chart(stateDatewiseCanvas, {
    type : "line",
    data : {
        labels : ["a", "b", "c", "d", "e", "f", "g"],
        datasets :[
            {
                label : 'Confirmed',
                data : [30,20,23,45,67,21,45],
                borderColor: clrWarning
            },
            {
                label : 'Recovered',
                data : [10,10,13,15,17,21,15],
                borderColor: clrPrim
            },
            {
                label : 'Death',
                data : [0,0,3,5,7,1,5],
                borderColor:clrDeath
            }  
           
        ]
    }
    
});

//dynamic update of state date-wise chart
let effectedStateDatewiseData;
function fillStateDatewiseChart(data, desiredlen, stateCode){
    const len = data.states_daily.length;
    console.log(len);
    console.log(desiredlen)
    console.log(len - (len - (desiredlen*3)));

    //emptying the existing value from chart
    stateDatewiseChart.data.labels = [];
    stateDatewiseChart.data.datasets[0].data = [];
    stateDatewiseChart.data.datasets[1].data = [];
    stateDatewiseChart.data.datasets[2].data = [];

    const dates = data.states_daily.filter((cases, index) => {
        if((len - (desiredlen*3)) <= index){
            return cases;
        }
    });
    console.log(dates);
   
    let  datecollection = [];

    let i =0;
    dates.forEach(cases =>{
        if(i%3 == 0){
            datecollection.push(cases.date.slice(0,cases.date.length-3))
        }
        i++;
        if(cases.status === "Confirmed"){
                Object.entries(cases).forEach( entry => {
                    if(entry[0] === stateCode){
                    stateDatewiseChart.data.datasets[0].data.push(entry[1]);
                        
                    }
                }) 
        }

        if(cases.status === "Recovered"){
                Object.entries(cases).forEach( entry => {
                    if(entry[0] === stateCode)
                    stateDatewiseChart.data.datasets[1].data.push(entry[1]);
                })
        }
        
        
        if(cases.status === "Deceased"){
                Object.entries(cases).forEach( entry => {
                    if(entry[0] === stateCode)
                    stateDatewiseChart.data.datasets[2].data.push(entry[1]);

    
                })
    
            }
    })
    datecollection.forEach( date =>{
    stateDatewiseChart.data.labels.push(date);
    })


    
       stateDatewiseChart.update();
}
//adding update functionality on buttons
const statedateLinearBtn = document.querySelector('.state_datewise_linear');
const statedateBarBtn = document.querySelector('.state_datewise_bar');

const statedateWeekBtn = document.querySelector('.state_datewise_week');
const statedateMonthBtn = document.querySelector('.state_datewise_month');
const statedateBegBtn = document.querySelector('.state_datewise_beg');

statedateLinearBtn.addEventListener('click', () =>{
    statedateBarBtn.classList.remove('chips-active');
    statedateLinearBtn.classList.add('chips-active');
    let daysforData ;
    if(statedateWeekBtn.classList.contains('chips-active')){
        daysforData = 7;
    }
    else if(statedateMonthBtn.classList.contains('chips-active')){
        daysforData = 30;
    }
    else if(statedateBegBtn.classList.contains('chips-active')){
        daysforData = effectedStateDatewiseData.states_daily.length;
    }

    stateDatewiseChart.destroy();
    stateDatewiseChart = new Chart(stateDatewiseCanvas, {
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
                    borderColor:clrDeath
                },  
               
            ]
        }
    });
    fillStateDatewiseChart(effectedStateDatewiseData, daysforData, effectedStateSearchCode);
})

statedateBarBtn.addEventListener('click', () =>{
    statedateLinearBtn.classList.remove('chips-active');
    statedateBarBtn.classList.add('chips-active');
    let daysforData ;
    if(statedateWeekBtn.classList.contains('chips-active')){
        daysforData = 7;
    }
    else if(statedateMonthBtn.classList.contains('chips-active')){
        daysforData = 30;
    }
    else if(statedateBegBtn.classList.contains('chips-active')){
        daysforData = effectedStateDatewiseData.states_daily.length;
    }


    stateDatewiseChart.destroy();
    stateDatewiseChart = new Chart(stateDatewiseCanvas, {
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
                    backgroundColor:clrDeath
                },  
               
            ]
        }
    });
    fillStateDatewiseChart(effectedStateDatewiseData, daysforData, effectedStateSearchCode);
});


statedateWeekBtn.addEventListener('click', () =>{
    statedateWeekBtn.classList.add('chips-active');
    statedateMonthBtn.classList.remove('chips-active');
    statedateBegBtn.classList.remove('chips-active');

    fillStateDatewiseChart(effectedStateDatewiseData, 7, effectedStateSearchCode);
});
statedateMonthBtn.addEventListener('click',() =>{
    statedateWeekBtn.classList.remove('chips-active');
    statedateMonthBtn.classList.add('chips-active');
    statedateBegBtn.classList.remove('chips-active');

    fillStateDatewiseChart(effectedStateDatewiseData , 30, effectedStateSearchCode);
})
statedateBegBtn.addEventListener('click', () =>{
    statedateWeekBtn.classList.remove('chips-active');
    statedateMonthBtn.classList.remove('chips-active');
    statedateBegBtn.classList.add('chips-active');

    fillStateDatewiseChart(effectedStateDatewiseData , effectedStateDatewiseData.states_daily.length, effectedStateSearchCode);
})






// fetch api and fill data functions for Effected district wise

// getEffectedData();
getSearchData();
getStateDatewiseData();

function getSearchData(){
    fetch('https://api.covid19india.org/v2/state_district_wise.json')
    .then(res => res.json())
    .then( data => {
        effectedSearchData = data;

        effectedSearchData.forEach(st =>{
            matchStateNames.push(st.state);
            matchNames.push(st.state);

        }) //storing all state names at once
        effectedSearchData.forEach( dist =>{
            dist.districtData.forEach(distName =>{
                matchDistrictNames.push(distName.district) ;
                matchNames.push(distName.district) ;
            });
        }); //storing all district names at once
        effectedSearchData.forEach(st =>{
            matchStateCode.push(st.statecode);
            matchNames.push(st.statecode);
        }) //storing all state code at once
        
    })
}
function getStateDatewiseData(){
    fetch('https://api.covid19india.org/states_daily.json')
    .then(res => res.json())
    .then(data =>{
        effectedStateDatewiseData = data;
        fillStateDatewiseChart(data,7);
    })
}
// function getEffectedData(){
//     fetch('https://api.covid19india.org/state_district_wise.json')
//     .then(res => res.json())
//     .then(data => {
//         effectedStateData = data;
//         fillEffectedCityData(data);
//     })
// }

function fillEffectedStateData(data, stateName){
    if(stateName === ""){
        effectedStateSearchText = "Total";
    }
    data.statewise.forEach(st => {
        if(stateName === st.statecode){
            effectedStateSearchText = st.state;
            effectedStateSearchCode = st.statecode.toLowerCase();
        }
        else if(stateName === st.state){
            effectedStateSearchCode = st.statecode.toLowerCase();
        }
    })

    data.statewise.forEach( st =>{
        if(st.state === effectedStateSearchText){
            effectedActiveNo.innerText = st.active;
            effectedConfirmedNo.innerText = st.confirmed;
            effectedRecoveredNo.innerText = st.recovered;
            effectedDeathNo.innerText = st.deaths;
            document.querySelector('.state_statBox_stateName').innerText = effectedStateSearchText;
        }
    });
}

function fillEffectedDistrictData(data){
    if(effectedStateName.value == ""){
        effectedStateSearchText = "Total";
    }
    let output = '';

    data.forEach( st =>{
        if(st.state === effectedStateSearchText){
           st.districtData.forEach( dist =>{
                output = output + 
                `<div class="district chips">${dist.district}</div>`
                  
           
           }) 
        }
    })
    const districtBox = document.querySelector('.state_districtNames_body_districts');
    districtBox.innerHTML =  output;

   
    const effectedDistrictHead = document.querySelector('.state_districtNames_head_text');
    effectedDistrictHead.innerText = `Districts effected in ${effectedStateSearchText}`;

    if(effectedStateName.value === ""){
        effectedDistrictHead.innerText = `Select State above to see effected cities`;
    }
}
//for event on click on a district
const districtContainer = document.querySelector(".state_districtNames_body_districts");

districtContainer.addEventListener('click' , e =>{
    const distConfirmed = document.querySelector('.district_statBox_districtStat-confirmedNo');
    const distActive = document.querySelector('.district_statBox_districtStat-activeNo');
    const distRecovered = document.querySelector('.district_statBox_districtStat-recoveredNo');
    const distDeath = document.querySelector('.district_statBox_districtStat-deathNo');
    const districtName = document.querySelector('.district_statBox_districtName');

    if(e.target.classList.contains('district')){
        console.log(e.target.innerText);
        const distName = e.target.innerText;
        effectedSearchData.forEach(st => {
            st.districtData.forEach( dist =>{
                if(distName === dist.district){
                    console.log("Found the district " + dist.district);
                    distConfirmed.innerText = dist.confirmed;
                    distActive.innerText = dist.active;
                    distRecovered.innerText = dist.recovered;
                    distDeath.innerText = dist.deceased;
                    districtName.innerText = dist.district;

                }
            })
        })

    }
})
function fillDistrictStat(distName){
    const distConfirmed = document.querySelector('.dist_statBox_distStat-confirmedNo');
    const distActive = document.querySelector('.dist_statBox_distStat-activeNo');
    const distRecovered = document.querySelector('.dist_statBox_distStat-recoveredNo');
    const distDeath = document.querySelector('.dist_statBox_distStat-deathNo');
    const districtName = document.querySelector('.dist_statBox_distName');

    effectedSearchData.forEach(st => {
        st.districtData.forEach( dist =>{
            if(distName === dist.district){
                console.log("Found the district " + dist.district);
                distConfirmed.innerText = dist.confirmed;
                distActive.innerText = dist.active;
                distRecovered.innerText = dist.recovered;
                distDeath.innerText = dist.deceased;
                districtName.innerText = dist.district;

            }
        })
    })

    
}
// //adding event to view state button
// const viewStateBtn = document.querySelector('.state_viewBtn');
// viewStateBtn.addEventListener('click', e =>{
//     const stateTemplate = document.querySelector('.state_template');
//     stateTemplate.style.display = 'block';

// })



    
