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




// -----------------menu button---------------------

var menuu = document.getElementById("menu");

function openmenu(){
    menuu.style.right = "0";
  
}


function closemenu(){
     menuu.style.right = "-200px";

}






// ---------------thankyou----------------





    function copyNote(e){
      e.preventDefault();
      const text = "Thank you so much — your support means the world to me! 💖";
      navigator.clipboard?.writeText(text).then(()=>{
        alert('Sweet note copied to clipboard!');
      }).catch(()=>{
        prompt('Copy this note:', text);
      });
    }

    function celebrate(){
      const colors = ['#FF6F91','#FF9FB3','#FFD1E6','#FFC3A0','#FFF5BA'];
      for(let i=0;i<32;i++){
        const el = document.createElement('div');
        el.textContent = '✨';
        el.style.position='fixed';
        el.style.left = Math.random()*100+'%';
        el.style.top = Math.random()*100+'%';
        el.style.fontSize = (8+Math.random()*28)+'px';
        el.style.opacity = 0.9;
        el.style.pointerEvents='none';
        el.style.zIndex = 9999;
        el.style.transform = 'translate(-50%,-50%)';
        el.style.transition = 'transform 900ms ease-out, opacity 1000ms linear';
        el.style.color = colors[Math.floor(Math.random()*colors.length)];
        document.body.appendChild(el);
        requestAnimationFrame(()=>{
          el.style.transform = 'translate(-50%,-50%) translateY(-140px) scale(0.8)';
          el.style.opacity = '0';
        });
        setTimeout(()=>el.remove(),1100);
      }
    }
 