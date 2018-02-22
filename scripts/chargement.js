if(window.addEventListener){
    window.addEventListener('load', chargement, false);
}else{
    window.attachEvent('onload', chargement);
}

function chargement(){
 hide_div('id01')
 hide_div('id02')
}

  //FONCTION QUI CACHE UNE DIV
  function hide_div(nomdiv) {
    var lediv = document.getElementById(nomdiv);
    lediv.style.display = "none";
  }
  //FONCTION QUI AFFICHE UNE DIV
  function show_div(nomdiv) {
    var lediv = document.getElementById(nomdiv);
    lediv.style.display = "inline";
  }