document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  console.log('Javascript Loaded !');

});

// J'enregistre mes variables liées au DOM HTML, que je reconnais via le $ qui les précède.
const $citiesContainer = document.getElementById('panelRight-result');
const $fromInput = document.getElementById('callToDeparture');
const $toInput = document.getElementById('callToArrival');


/*
Ici je déclare mes variables avec arguments que je peux appeler où je veux
en ajoutant un arguement différent en fonction de l'usage que j'en fais.
L'interpolation est faite en ES6 grâce aux `` (back quotes) puis au ${}
*/
const urlCities = city => `http://www-uat.tictactrip.eu/api/cities/autocomplete/?q=${city}`;
const urlPopularCities = nb => `http://www-uat.tictactrip.eu/api/cities/popular/${nb}`;
const urlFromCities = (city, nb) => `http://www-uat.tictactrip.eu/api/cities/popular/from/${city}/${nb}`;


/* 
  function appelée quand on écrit dans l'input et/ou au focus en récupérant sa valeur (si en keypress)
  ou bien l'unique_name de l'élément sur lequel on a cliqué.
  le get nous fait savoir que la function a pour but de faire un appel asynchrone
*/
function getCities(url) {
  fetch(url)
    .then(function (response) {
      // Dès qu'on a la réponse, on récupère le json pour générer le Markup html
      response.json().then(function (json) {
        generateMarkupForCities(json);
      });
    }).catch(function (error) {
      // On vérifie que le call a bien fonctionné sinon on affiche une erreur en console (ou en alert())
      console.error(error);
    });
}

// Cette fonction a juste pour but d'afficher les cities
function generateMarkupForCities(cities) {
  // Je reset le HTML du container à chaque fois
  $citiesContainer.innerHTML = '';
  // Je vérifie que la réponse contient effectivement de la data (et non 0 ville)
  if (cities.length > 0) {
    // on peut également utiliser un map() sur la réponse
    for (let i = 0; i < cities.length; i++) {
      let city = document.createElement('li');
      city.setAttribute('class', 'searchBody-panel-information__result');
      city.innerHTML = cities[i].local_name;
      $citiesContainer.appendChild(city);

      // Je rajoute un listener sur chaque item avec l'unique_name qui sera utilisé pour l'appel sur le prochain input
      city.addEventListener('click', function () {
        focusNextInput(cities[i].unique_name);
        $fromInput.value = cities[i].unique_name;
        // $toInput.value = cities[i].local_name;
      });
    }
  } else {

    // Si je n'ai pas de résultat, je le montre à l'utilisateur
    let liError = document.createElement('li');
    liError.innerHTML = 'Aucun résultat';
    $citiesContainer.appendChild(liError);
  }
}

function focusNextInput(value) {
  $toInput.focus();
  getCities(urlFromCities(value, 5));
}

// J'ajoute un évènement sur le keypress de l'input et j'appelle ma fonction
$fromInput.addEventListener('keypress', function (e) {
  getCities(urlCities(e.currentTarget.value));
});

$fromInput.addEventListener('focus', function () {
  getCities(urlPopularCities(5));
});

$toInput.addEventListener('keypress', function (e) {
  getCities(urlCities(e.currentTarget.value));
});


