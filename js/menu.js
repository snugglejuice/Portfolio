var button = document.querySelector("#menuButton");
var volet = document.querySelector("#openVolet");
var button2 = document.querySelector("#closeButton");
function toggleMenu(){
  if(volet.style.display=="none"){
    volet.style.display = "block";
  }
  else{
    volet.style.display = "none";
  }
}

function closeMenu(){
  volet.style.display="none";
}
button.addEventListener('click',toggleMenu);
button.addEventListener('click',closeMenu);
