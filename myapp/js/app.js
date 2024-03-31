"use strict";

import Api from './api.js';
import {createLoginForm} from './templates/login-template.js';
import {createHomeForm} from './templates/home-template.js';
import {createStoreTable, createStoreCard, createCartCard} from './templates/store-template.js';
import page from "//unpkg.com/page/page.mjs";

const itemCart = [];

class App {

    constructor(appContainer) {
        // reference to the the item container (HTML element)
        this.appContainer = appContainer;
        //this.logoutLink = document.querySelector('#logout');
        
        // client-side routing with Page.js
        page('/login', () => {
            this.appContainer.innerHTML = "";
            this.appContainer.innerHTML = createLoginForm();
            document.getElementById('login-form').addEventListener('submit', this.onLoginSubmitted);
        });

        page('/', () => {
            this.appContainer.innerHTML = "";
            this.appContainer.innerHTML = createHomeForm();
        });

        page('/store', () => {
            this.appContainer.innerHTML = "";
            this.appContainer.innerHTML = this.showItems();
        });
        
        // very simple itemple of how to handle a 404 Page Not Found 
        // page('*', () => this.appContainer.innerHTML = 'Page not found!');
        //page('/', );
        page();
    }



    /**
     * Event listener for the submission of the login form. Handle the login.
     * @param {*} event 
     */
    onLoginSubmitted = async (event) => {
        event.preventDefault();
        const form = event.target;
        //const alertMessage = document.getElementById('alert-message');

        if(form.checkValidity()) {
            try {
                const user = await Api.doLogin(form.email.value, form.password.value);
                
                /*
                this.logoutLink.classList.remove('invisible');
                // welcome the user
                alertMessage.innerHTML = createAlert('success', `Welcome ${user}!`);
                // automatically remove the flash message after 3 sec
                setTimeout(() => {
                    alertMessage.innerHTML = '';
                }, 3000);
                */

                page.redirect('/');
            } catch(error) {
                if (error) {
                    const errorMsg = error;
                    // add an alert message in DOM
                    alertMessage.innerHTML = createAlert('danger', errorMsg);
                    // automatically remove the flash message after 3 sec
                    setTimeout(() => {
                        alertMessage.innerHTML = '';
                    }, 3000);
                }
            }
        }
    }

    /**
    * Perform the logout
    */
    logout = async () => {
        await Api.doLogout();
        this.logoutLink.classList.add('invisible');
        page.redirect('/login');
    }

    /**
     * Create the HTML table for showing the items
     * @param {*} items 
     */
    showItems = async () => { 
        try {
            const items = await Api.getItems();

            this.appContainer.innerHTML = createStoreTable();
            const storeTable = document.querySelector('#my-items');

            for(let item of items) {
                const itemRow = createStoreCard(item);
                storeTable.insertAdjacentHTML('beforeend', itemRow);
            }
            
            const buttons = document.querySelectorAll(".btn-add");
            for (const btn of buttons) {
                btn.addEventListener("click", this.addCart);
            }

        } catch(error) {
            page.redirect('/');
        }
    }

    /**
     * Add selected item at list cart
     * @param {*} items 
     */
    addCart = async (event) => {
        
        event.preventDefault();
        const itemId = event.target.value;
        const items = await Api.getItems();
        
        try {
            if(!itemCart[itemId]) {
                itemCart[itemId] = items.filter(product => product.id == itemId)[0];
                itemCart[itemId].quantity = 1;
            } else {
                itemCart[itemId].quantity++;
            }
            this.updateCartHtml();
        } catch(error) {
            page.redirect('/');
        }
    }

    /**
     * Update cart with item added at the cart in the HTML
     */
    updateCartHtml() {

        const listCart = document.querySelector('.listCart');
        listCart.innerHTML = '';
        if(itemCart){
            itemCart.forEach( x => { 
                if(x) {
                    const newItem = createCartCard(x, x.quantity);
                    listCart.insertAdjacentHTML('beforeend', newItem);
                }
            });
            const buttons = document.querySelectorAll(".btnQnt");
            for (const btn of buttons) {
                btn.addEventListener("click", this.changeQntCart);
            }
        }      
    }

    /**
     * Change quantity of the item in the cart, if the quantity is less of 0, 
     * the item is deleted
     * @param {*} event 
     */
    changeQntCart = async (event) => {

        event.preventDefault();
        const itemId = event.target.value;
        const btnType = event.target.name;

        if(btnType == '+') {
            itemCart[itemId].quantity++;
        } else if(btnType == '-'){
            itemCart[itemId].quantity--;
            if(itemCart[itemId].quantity < 0) {
                delete itemCart[itemId];
            }
        }
        this.updateCartHtml();
    }

}

export default App;