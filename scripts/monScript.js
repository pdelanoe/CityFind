
//////////////////////////////////////////// AJOUT DES MAPS /////////////////////////////////////////////////////
L.mapbox.accessToken = 'pk.eyJ1Ijoic2NoYXJib2lzIiwiYSI6ImNqZGQzdnQxYTI4bDQzM3F4c2dkeWpwbjAifQ.LZK526KEY8lQMhoV1Uit_g';
var map = L.mapbox.map('map')
  .setView([46.8, 1.5], 6.5);
L.mapbox.styleLayer('mapbox://styles/scharbois/cjdwuxlm31lp02rqfm77lnozd').addTo(map);
map.scrollWheelZoom.disable();

L.mapbox.accessToken = 'pk.eyJ1Ijoic2NoYXJib2lzIiwiYSI6ImNqZGQzdnQxYTI4bDQzM3F4c2dkeWpwbjAifQ.LZK526KEY8lQMhoV1Uit_g';
var mapResult = L.mapbox.map('mapResult')
  .setView([46.8, 1.5], 6.5);
L.mapbox.styleLayer('mapbox://styles/scharbois/cjdwunja77e8m2smo9709wjmb').addTo(mapResult);
mapResult.scrollWheelZoom.disable();


/////////////////////////////////////////////////////////////////////////////////////////////////////////
var nbCityFind = 0;
var monScoreTotal = 0;

hide_div('result');
newCity();


$("#button_restart").click(function () {
  nbCityFind = 0;
  scoreTotal = 0;
  var bouton = document.getElementById('button_retour');
  bouton.disabled = false;
  if (lastmarker != undefined) {
    lastmarker.remove();
  }
  newCity();
  hide_div('result');
  show_div('game');
});


$("#button_valider").click(function () {
  if (lastmarker != undefined) {
    hide_div('game');
    result();
    show_div('result');
    if (nbCityFind >= 5) {
      var bouton = document.getElementById('button_retour');
      bouton.disabled = true;
    }
  }
});


$("#button_retour").click(function () {
  hide_div('result');
  //Remove marker sur la map de recherche
  if (lastmarker != undefined) {
    lastmarker.remove();
  }
  newCity();
  show_div('game');
});


var lastCityResult;
var lastLine;
var maVille;

function result() {

  //Ajoute le marker de la ville exact sur la map de resultat
  if (lastCityResult != undefined) {
    lastCityResult.remove();
  }
  lastCityResult = L.marker([maVille.Latitude, maVille.Longitude]).addTo(mapResult);

  // Gestion de la création de la ligne entre les deux markers
  if (lastLine != undefined) {
    lastLine.remove();
  }
  var pointList = [lastCityResult._latlng, lastmarkerResult._latlng];
  lastLine = new L.Polyline(pointList, {
    color: 'red',
    weight: 3,
    opacity: 0.6,
    smoothFactor: 1
  }).addTo(mapResult);

  // Gestion du calcul de la distance
  var lat1 = lastCityResult._latlng.lat;
  console.log("lat1=" + lat1);
  var lon1 = lastCityResult._latlng.lng;
  console.log("lon1=" + lon1);
  var lat2 = lastmarkerResult._latlng.lat;
  console.log("lat2=" + lat2);
  var lon2 = lastmarkerResult._latlng.lng;
  console.log("lon2=" + lon2);
  var maDistance = calculDistance(lat1, lon1, lat2, lon2);   //Kilomètres de retour
  console.log(maDistance);
  var valbar = 0;
  if (maDistance < 400) {
    valbar = (1 - (maDistance / 400)) * 100;
  }

  var monScore = Scores(maDistance);
  console.log(monScore);
  monScoreTotal = monScoreTotal + monScore;
  //document.getElementById("myScore").innerHTML = "SCORE = " + monScore.toFixed(2) + " POINTS";
  //document.getElementById("myScoreTotal").innerHTML = "SCORE TOTAL = " + monScoreTotal.toFixed(2) + " POINTS";
}

function Scores(dist) {
  var score;;
  if (dist < 50) {
    score = 20000;
    return score;
  }
  else {
    if (dist > 400) {
      score = 0;
      return score;
    }
    else {
      score = (20000 - (dist * 50)) + 1000;
      return score;
    }
  }

}

function calculDistance(lat1, lon1, lat2, lon2) {
  rad = function (x) { return x * Math.PI / 180; }

  var R = 6378.137;                     //La radio de la Terre en km (WGS84)
  var dLat = rad(lat2 - lat1);
  var dLong = rad(lon2 - lon1);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  return d.toFixed(3);
}

function newCity() {
  nbCityFind++;
  getJSON('VillesFr.json', function (donnees) {
    var rd = Math.floor((Math.random() * 273) + 1);
    maVille = donnees.Ville[rd]
    console.log(maVille);
    //document.getElementById("ville").innerHTML = "TROUVER SUR LA CARTE : " + maVille.Nom;
  });
}

function hide_div(nomdiv) {
  var lediv = document.getElementById(nomdiv);
  lediv.style.display = "none";
}

function show_div(nomdiv) {
  var lediv = document.getElementById(nomdiv);
  lediv.style.display = "inline";
}


var lastmarker;
var lastmarkerResult;

map.on('click', function (e) {

  if (lastmarker != undefined && lastmarkerResult != undefined) {
    lastmarker.remove();
    lastmarkerResult.remove();
  }

  console.log(e.latlng.lng, e.latlng.lat);

  var mylat = e.latlng.lat;
  var mylng = e.latlng.lng;

  //Ajoute le marker sur la map de recherche
  // create custom icon
  var firefoxIcon = L.icon({
    iconUrl: 'marker-icon.png',
    iconSize: [38, 38], // size of the icon
  });
  lastmarker = L.marker([mylat, mylng], { icon: firefoxIcon }).addTo(map);


  //Ajoute le marker sur la map de resultat
  lastmarkerResult = L.marker([mylat, mylng]).addTo(mapResult);
});