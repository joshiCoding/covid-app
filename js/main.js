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