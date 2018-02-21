L.mapbox.accessToken = 'pk.eyJ1Ijoic2NoYXJib2lzIiwiYSI6ImNqZGQzdnQxYTI4bDQzM3F4c2dkeWpwbjAifQ.LZK526KEY8lQMhoV1Uit_g';
    //////////////////////////////////////////// AJOUT DES MAPS /////////////////////////////////////////////////////

var map = L.mapbox.map('map')
  .setView([46.8, 1.5], 6.5);
L.mapbox.styleLayer('mapbox://styles/scharbois/cjdwuxlm31lp02rqfm77lnozd').addTo(map);
map.scrollWheelZoom.disable();
