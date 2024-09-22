"use strict";

import App from './app.js';

const appContainer = document.querySelector('#app-container');

// creating our app
const app = new App(appContainer);

const navLinks = document.querySelectorAll('.nav-link');

// Aggiungi un event listener per ogni link
navLinks.forEach(link => {
    link.addEventListener('click', function () {
        // Rimuovi la classe active da tutti i link
        navLinks.forEach(nav => nav.classList.remove('active'));

        // Aggiungi la classe active al link cliccato
        this.classList.add('active');
    });
});