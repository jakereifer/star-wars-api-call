require('es6-promise').polyfill();
require('isomorphic-fetch');

fetch('https://swapi.co/api/people/1/')
.then(function(response) {
    return response.json()})
.then(function(person) {console.log(person.name)});