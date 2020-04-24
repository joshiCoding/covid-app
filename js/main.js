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

// //testing the position feature
// const indiaView = document.querySelector('#india-view');
// let newLinkPos = indiaView.getBoundingClientRect().top ;
// document.addEventListener('load', () =>{
//     window.scrollTo(0,newLinkPos);
// })

// console.log(menuBtnClose);
menuBtn.addEventListener('click', e =>{

    const page = document.querySelector('.page');
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
}

//experimental use of window scroll
const linkToIndiaView = document.querySelector('.linkto_indiaView');
linkToIndiaView.addEventListener('click',e =>{
    const page = document.querySelector('.page');
    const indiaView = document.querySelector('#india-view');

    menuClose();
    let newLinkPos = indiaView.getBoundingClientRect().top ;
    window.scrollTo(0,newLinkPos);
    console.log(newLinkPos);
    console.log(window.scrollTo(0,newLinkPos));

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
        fillStatewiseChart(data, 5);
        fillEffectedStateData(data);
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

    // console.log(len);
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
                    borderColor:'#121212'
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
                    backgroundColor:'#121212'
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


//***** for displaying how effected is your area section
let effectedStateData ;
const effectedState = document.querySelector('.statewise_effectedArea_stateName');
const effectedStateName = effectedState.querySelector('.search_box');
const effectedSearchBox = effectedState.querySelector('.search_box_container');
const effectedActiveNo = document.querySelector('.statewise_effectedArea_stat_bar-active h4');
const effectedConfirmedNo = document.querySelector('.statewise_effectedArea_stat_bar-confirmed h4');
const effectedRecoveredNo = document.querySelector('.statewise_effectedArea_stat_bar-recovered h4');
const effectedDeathNo = document.querySelector('.statewise_effectedArea_stat_bar-death h4');

const effectedCityBox = document.querySelector('.statewise_effectedArea_cityStat_box');
const effectedCityhead = document.querySelector('.statewise_effectedArea_cityStat_para');
const effectedStateSearchBox = document.querySelector('.match_list');

let effectedStateSearchText  ;
// effectedStateName.value = "Uttar Pradesh";

effectedState.querySelector('.search_box_container svg').addEventListener('click', () =>{
  effectedStateName.focus();
});

effectedStateName.addEventListener('focus', () =>{
    effectedSearchBox.classList.add('search_box_container-active');
    effectedStateSearchText = '';
    effectedStateName.value = effectedStateSearchText;
})

effectedStateName.addEventListener('blur', () =>{
    effectedSearchBox.classList.remove('search_box_container-active');
})

effectedStateName.addEventListener('input', () => {
    effectedStateSearchText = effectedStateName.value ;

    effectedStateSearchBox.style.display = 'block';

    let matches = Object.keys(effectedStateData).filter( st =>{
        let regex = new RegExp(`^${effectedStateSearchText}`, 'gi');
        return st.match(regex);
    });

    let output = '';
    matches.forEach(match => {
        output = output + `<li class = "search-box-list">${match}</li>`;
    });

    if(output === ''){
        output = output + `<li class = "search-box-list">No Such State in Database</li>`;
    }

    effectedStateSearchBox.innerHTML = output;

 })

 effectedStateSearchBox.addEventListener('click', e =>{
    effectedStateSearchText =e.target.innerText;
    effectedStateName.value = effectedStateSearchText;
    effectedCityhead.innerText = `Cities effected in ${effectedStateSearchText}`;
    effectedStateSearchBox.style.display = 'none';
    effectedSearchBox.classList.remove('search_box_container-active');


    fillEffectedStateData(dataofapi);
    fillEffectedCityData(effectedStateData);
 })



function fillEffectedStateData(data){
    if(effectedStateName.value == ""){
        effectedStateSearchText = "Total";
    }

    data.statewise.forEach( st =>{
        if(st.state === effectedStateSearchText){
            // console.log(st.active);
            effectedActiveNo.innerText = st.active;
            effectedConfirmedNo.innerText = st.confirmed;
            effectedRecoveredNo.innerText = st.recovered;
            effectedDeathNo.innerText = st.deaths;
        }
    });
}

function fillEffectedCityData(data){
    if(effectedStateName.value == ""){
        effectedStateSearchText = "Total";
    }

    for(const [key, value] of Object.entries(data)){
        if(key === effectedStateSearchText){
            const temp = Object.keys(value.districtData);
            // console.log(temp);

            let output = '';
            temp.forEach( t =>{
                // console.log('State is : ' + t );
                output = output + `<li class = "statewise_effectedArea_cityStat_box_cityList">${t}</li>`
            })

            effectedCityBox.innerHTML = output;
           

            // console.log(output);
            
          

        }
    }
    effectedCityhead.innerText = `Cities effected in ${effectedStateSearchText}`;

    if(effectedStateName.value === ""){
        effectedCityhead.innerText = `Select State above to see effected cities`;
    }
}



function getEffectedData(){
    fetch('https://api.covid19india.org/state_district_wise.json')
    .then(res => res.json())
    .then(data => {
        effectedStateData = data;
        fillEffectedCityData(data);
    })
}
getEffectedData();






// ********************custom script for testing map svg 
const mapObj = document.querySelector('#india-map');
mapObj.addEventListener('load', mapLoad);

const mapActiveNo = document.querySelector('.map_statBox_stateStat-activeNo');
const mapConfirmedNo = document.querySelector('.map_statBox_stateStat-confirmedNo');
const mapRecoveredNo = document.querySelector('.map_statBox_stateStat-recoveredNo');
const mapDeathNo = document.querySelector('.map_statBox_stateStat-deathNo');

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
    

    const svgIndia = map.getElementById('indiaMap-svg');

    svgIndia.addEventListener('click',e =>{
        // console.log((e.target).getAttribute('title'));
        // e.target.style.strokeWidth = "3px";
        state.innerText = e.target.getAttribute('title');
        if(e.target.getAttribute('title') === null){
            state.innerText = "Total";
        }
        fillMapBox(dataofapi, state.innerText)

    })
}


    
