var taplinks = document.getElementsByClassName('links');
var tapcontents = document.getElementsByClassName('contents');

function opentab(tabname, event){
    
    for (let taplink of taplinks) {
        taplink.classList.remove("active-link");
    }

    for (let tapcontent of tapcontents) {
        tapcontent.classList.remove("active-tab");
    }

    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
}


var menuu = document.getElementById("menu");

function openmenu(){
    menuu.style.right = "0";
  
}


function closemenu(){
     menuu.style.right = "-200px";

}