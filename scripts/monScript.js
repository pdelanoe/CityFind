
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
document.getElementById('progress').style.marginLeft = "96%";


$(document).ready(function () {
  hide_div('id01');
  hide_div('result');
  newCity();
  initStorage();
  getScores(nbCityNeedToFind);
  document.getElementById('addValue').style.display = "none"

  //BOUTON QUI PERMET DE RESTART LA PARTIE
  $("#button_restart").click(function () {
    restartGame();
  });


  //BOUTON QUI PERMET D'AFFICHER LE RESULTAT DE LA VILLE CHERCHE
  $("#button_valider").click(function () {
    if (lastmarker != null) {
      setMapView(mapResult);
      hide_div('game');
      result();
      show_div('result');
      if (nbCityFind >= nbCityNeedToFind) {
        document.getElementById('addValue').style.display = "initial";
        document.getElementById('button_retour').style.display = "none";
      }
    }
  });

  //BOUTON QUI PERMET DE CHERCHER UNENOUVELLE VILLE QUAND ON EST SUR L'AFFICHAGE RESULTAT
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

  //FONCTION MODIFIANT LE NOMBRE DE VILLE A TROUVER
  $('#selectorNb button').click(function () {
    nbCityNeedToFind = Number(this.value);
    switch (nbCityNeedToFind) {
      case 5:
        document.getElementById('progress').style.marginLeft = "96%";
        break;
      case 10:
        document.getElementById('progress').style.marginLeft = "80%";
        break;
      case 15:
        document.getElementById('progress').style.marginLeft = "65%";
        break;
    }

    var c = document.getElementById('selectorNb').children;
    for (var i = 0; i < c.length; i++) {
      c[i].className = 'btn'
    }

    this.classList.toggle("btn-toggled");

    getScores(nbCityNeedToFind);
    restartGame();
  });

  $('#selectorCountry button').click(function () {

    var c = document.getElementById('selectorCountry').children;
    for (var i = 0; i < c.length; i++) {
      c[i].className = 'btn'
    }

    this.classList.toggle("btn-toggled");
    restartGame();
  });


  //BOUTON QUI AJOUTE UN SCORE
  $("#addValue").click(function () {
    AddValueStorage(nbCityNeedToFind, monScoreTotal);
    this.style.display = "none";
  });


  //FONCTION PERMETTANT DE RESET L'EMPLACEMENT DE LA CARTE
  function setMapView(m) {
    m.setView([46.8, 1.5], 6.4);
  }

  function restartGame() {

    $("#bullet_points").empty();
    $("#bullet_points").append('<li class="activated"><span></span></li>');
    for (var i = 1; i < nbCityNeedToFind - 1; i++) {
      $("#bullet_points").append('<li><span></span></li>');
    }
    $("#bullet_points").append('<li></li>');

    setMapView(map);
    nbCityFind = 0;
    monScoreTotal = 0;
    document.getElementById("myScoreTotal").innerHTML = "<center>" + monScoreTotal.toFixed(0); +"</center>";
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
    document.getElementById('button_retour').style.display = "initial";
    document.getElementById('addValue').style.display = "none";
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
    document.getElementById("myScore").innerHTML = "This round : " + monScore.toFixed(0) + " Points";
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
    if (nbCityFind)
      document.getElementById("bullet_points").children[nbCityFind].className += 'activated';
    nbCityFind++;
    document.getElementById("myNbCityFind").innerHTML = "<center>" + nbCityFind + "/" + nbCityNeedToFind + "</center>";
    $.getJSON('scripts/VillesFr.json', function (donnees) {
      var rd = Math.floor((Math.random() * 273) + 1);
      maVille = donnees.Ville[rd]
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

  //FONCTION QUI RECUPERE LES SCORES 
  function getScores(nb) {
    var localObject;
    var mesScores = new Array();
    for (var i = 1; i <= localStorage.length; i++) {
      localObject = JSON.parse(localStorage.getItem(i));
      if (localObject.NbCity == nb) {
        mesScores.push(localObject);
      }
    }
    //trie la liste
    mesScores.sort(function (a, b) {
      return a.Score - b.Score;
    })
    mesScores.reverse();
    //Affiche les scores
    document.getElementById("id02").innerHTML = "";
    for (var i = 0; i < mesScores.length; i++) {
      j = i + 1;
      if (i < 5) {
        $('#id02').append('<h4> Score ' + j + ' : ' + mesScores[i].Score.toFixed(0) + ' Points <h4><br>');
      }
    }
  }

  //INITIALISATION DU LOCAL STORAGE
  function initStorage() {
    if (typeof localStorage != 'undefined') {
      $.getJSON('scripts/Scores.json', function (donnees) {
        donnees.Score.forEach(function (d) {
          localStorage.setItem(d.id, JSON.stringify(d));
        });
      });
    }
    else {
      alert("localStorage n'est pas supporté");
    }
  }

  //FONCTION QUI AJOUTE UNE VALEUR AU LOCAL STOARGE
  function AddValueStorage(nb, score) {
    var local = {
      id: localStorage.length,
      NbCity: nb,
      Score: score
    };
    localStorage.setItem(localStorage.length + 1, JSON.stringify(local));
    getScores(nbCityNeedToFind);
  }
});