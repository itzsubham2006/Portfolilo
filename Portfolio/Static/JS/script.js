var taplinks = document.getElementsByClassName('links')
var tapcontents = document.getElementsByClassName('contents')


function open(tapname){
    for(taplink of taplinks){
        taplink.classList.remove('active-link');   
    }
    for(tapcontent of tapcontents){
        tapcontent.classList.remove('skill');   
    }
}