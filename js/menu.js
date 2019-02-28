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


var arrowButton = document.querySelector("#arrowBtn");
var projectPageOne = document.querySelector("#projectPageOne");
var projectPageTwo = document.querySelector("#projectPageTwo");

function displayProject(){
  console.log("CLICK !");
  if (projectPageOne.style.display == "none")
  {
    projectPageOne.style.display = "block";
    projectPageTwo.style.display = "none";
  }
  else{
    projectPageOne.style.display = "none";
    projectPageTwo.style.display = "block";
  }
}


arrowButton.addEventListener('click',displayProject);
