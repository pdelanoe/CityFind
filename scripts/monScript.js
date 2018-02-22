
//////////////////////////////////////////// AJOUT DES MAPS /////////////////////////////////////////////////////
L.mapbox.accessToken = 'pk.eyJ1Ijoic2NoYXJib2lzIiwiYSI6ImNqZGQzdnQxYTI4bDQzM3F4c2dkeWpwbjAifQ.LZK526KEY8lQMhoV1Uit_g';
var map = L.mapbox.map('map')
  .setView([46.8, 1.5], 6.4);
L.mapbox.styleLayer('mapbox://styles/scharbois/cjdwuxlm31lp02rqfm77lnozd').addTo(map);


L.mapbox.accessToken = 'pk.eyJ1Ijoic2NoYXJib2lzIiwiYSI6ImNqZGQzdnQxYTI4bDQzM3F4c2dkeWpwbjAifQ.LZK526KEY8lQMhoV1Uit_g';
var mapResult = L.mapbox.map('mapResult')
  .setView([46.8, 1.5], 6.4);
L.mapbox.styleLayer('mapbox://styles/scharbois/cjdwunja77e8m2smo9709wjmb').addTo(mapResult);



/////////////////////////////////////////////////////////////////////////////////////////////////////////
var nbCityFind = 0;
var nbCityNeedToFind = 5;
var monScoreTotal = 0;
var lastmarker = null;
var lastmarkerResult = null;
var lastCityResult = null;
var lastLine = null;
var maVille;


$(document).ready(function () {
  hide_div('result');
  newCity();


  $("#button_restart").click(function () {
    restartGame();
  });


  $("#button_valider").click(function () {
    if (lastmarker != null) {
      setMapView(mapResult);
      hide_div('game');
      result();
      show_div('result');
      if (nbCityFind >= nbCityNeedToFind) {
        var bouton = document.getElementById('button_retour');
        bouton.disabled = true;
      }
    }
  });

  $("#button_retour").click(function () {
    setMapView(map);
    hide_div('result');
    //Remove marker sur la map de recherche et resultat
    if (lastmarker != null && lastmarkerResult != null) {
      lastmarker.remove();
      lastmarkerResult.remove();
      lastmarker = null;
      lastmarkerResult = null;
    }
    newCity();
    show_div('game');
  });

  $('#selectorNb button').click(function () {
    nbCityNeedToFind = this.value;
    restartGame();
  });


  function setMapView(m) {
    m.setView([46.8, 1.5], 6.4);
  }

  function restartGame() {
    var bouton = document.getElementById('button_retour');
    if(bouton.disabled == true)
    {
      bouton.disabled = false;
    }  
    setMapView(map);
    nbCityFind = 0;
    monScoreTotal = 0;
    //Remove marker sur la map de recherche et resultat
    if (lastmarker != null && lastmarkerResult != null) {
      lastmarker.remove();
      lastmarkerResult.remove();
      lastmarker = null;
      lastmarkerResult = null;
    }
    newCity();
    hide_div('result');
    show_div('game');
  }
  

  //FONCTION QUI GERE LA PARTIE DE RESULTAT AVEC L'AFFICHAGE DES MARKERS/TRAITS ET LE CALCUL DU SCORE
  function result() {

    //Ajoute le marker de la ville exact sur la map de resultat
    if (lastCityResult != null) {
      lastCityResult.remove();
    }
    // create custom icon
    var markerIcon = L.icon({
      iconUrl: 'styles/resultMarker.png',
      iconSize: [64, 64], // size of the icon
    });
    lastCityResult = L.marker([maVille.Latitude, maVille.Longitude], { icon: markerIcon }).addTo(mapResult);

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
    var lon1 = lastCityResult._latlng.lng;
    var lat2 = lastmarkerResult._latlng.lat;
    var lon2 = lastmarkerResult._latlng.lng;
    var maDistance = calculDistance(lat1, lon1, lat2, lon2);   //Kilomètres de retour

    var monScore = scores(maDistance);
    monScoreTotal = monScoreTotal + monScore;
    //document.getElementById("myScore").innerHTML = "SCORE = " + monScore.toFixed(2) + " POINTS";
    document.getElementById("myScoreTotal").innerHTML = "<center>" + monScoreTotal.toFixed(0); +"</center>";
  }

  //FONCTION QUI CALCULE LE SCORE
  function scores(dist) {
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

  //FONCTION QUI CALCULE LA DISTANCE ENTRE LES DEUX COORDONNEES
  function calculDistance(lat1, lon1, lat2, lon2) {
    rad = function (x) { return x * Math.PI / 180; }

    var R = 6378.137;  //La radio de la Terre en km (WGS84)
    var dLat = rad(lat2 - lat1);
    var dLong = rad(lon2 - lon1);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d.toFixed(3);
  }

  //FONCTION QUI RENVOIE UNE NOUVELLE VILLE A CHERCHER
  function newCity() {
    nbCityFind++;
    document.getElementById("myNbCityFind").innerHTML = "<center>" + nbCityFind + "/" + nbCityNeedToFind + "</center>";
    $.getJSON('scripts/VillesFr.json', function (donnees) {
      var rd = Math.floor((Math.random() * 273) + 1);
      maVille = donnees.Ville[rd]
      console.log(maVille);
      document.getElementById("City").innerHTML = maVille.Nom;
    });
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

  //ACTION AU CLICK SU LA MAP DE RECHERCHE
  map.on('click', function (e) {
    //Supprime les anciens markers si ils sont présents
    if (lastmarker != null && lastmarkerResult != null) {
      lastmarker.remove();
      lastmarkerResult.remove();
    }
    //Recuperation Lat/Lng
    var mylat = e.latlng.lat;
    var mylng = e.latlng.lng;
    //Ajoute le marker sur la map de recherche
    lastmarker = L.marker([mylat, mylng]).addTo(map);
    //Ajoute le marker sur la map de resultat
    lastmarkerResult = L.marker([mylat, mylng]).addTo(mapResult);
  });

});