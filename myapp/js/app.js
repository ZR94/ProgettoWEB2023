"use strict";

import Api from './api.js';
import User from './user.js';
import Item from './item.js';
import Comment from './comment.js';
import { createLoginForm } from './templates/login-template.js';
import { createSignUpForm } from './templates/sign-template.js';
import { createHomeForm } from './templates/home-template.js';
import { createUserPage } from './templates/user-template.js';
import { createStoreTable, createStoreCard, createCartCard } from './templates/store-template.js';
import { createContactForm } from './templates/contact-template.js';
import { createPricingForm } from './templates/pricing-template.js';
import { createWishlistPage } from './templates/wishlist-template.js';
import page from "//unpkg.com/page/page.mjs";



class App {

    constructor(appContainer) {
        // reference to the the item container (HTML element)
        this.appContainer = appContainer;
        this.logoutLink = document.querySelector('#logout');
        this.loginLink = document.querySelector('#login');
        this.followBtn = document.querySelector('#follow');
        this.unfollowBtn = document.querySelector('#unfollow');
        this.loggedUser = null;
        this.itemCart = [];
        this.wishlist = [];

        // client-side routing with Page.js
        page('/login', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser == null) {
                this.appContainer.innerHTML = "";
                this.appContainer.innerHTML = createLoginForm();
                document.getElementById('login-form').addEventListener('submit', this.onLoginSubmitted);
            }
        });

        page('/signUp', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser == null) {
                this.appContainer.innerHTML = "";
                this.appContainer.innerHTML = createSignUpForm();
                document.getElementById('signUp-form').addEventListener('submit', this.onSignUpSubmitted);
            }
        });

        page('/logout', this.logout);

        page('/userPage', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser != null) {
                this.renderNavBar(this.loggedUser.name);
                this.appContainer.innerHTML = "";
                this.appContainer.innerHTML = this.personalUserPage();
            }

        });
       
        page('/wishlist', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser != null) {
                this.renderNavBar(this.loggedUser.name);
            }
            this.appContainer.innerHTML = "";
            this.appContainer.innerHTML = this.createUserWishList();
        });

        page('/history', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser != null) {
                this.renderNavBar(this.loggedUser.name);
            }
            this.appContainer.innerHTML = "";
            //this.appContainer.innerHTML = ;
        });

        page('/delete', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser != null) {
                this.renderNavBar(this.loggedUser.name);
            }
            this.appContainer.innerHTML = "";
            //this.appContainer.innerHTML = ;
        });

        page('/store', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser != null) {
                this.renderNavBar(this.loggedUser.name);
            }
            this.appContainer.innerHTML = "";
            this.appContainer.innerHTML = this.showStore();
        });

        page('/contact', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser != null) {
                this.renderNavBar(this.loggedUser.name);
            }
            this.appContainer.innerHTML = "";
            this.appContainer.innerHTML = createContactForm();
        });

        page('/pricing', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser != null) {
                this.renderNavBar(this.loggedUser.name);
            }
            this.appContainer.innerHTML = "";
            this.appContainer.innerHTML = createPricingForm();
        });

        page('/', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser != null) {
                this.renderNavBar(this.loggedUser.name);
            }
            this.appContainer.innerHTML = "";
            this.appContainer.innerHTML = createHomeForm();

        });

        // very simple itemple of how to handle a 404 Page Not Found 
        // page('*', () => this.appContainer.innerHTML = 'Page not found!');
        // page('/', );
        page();
    }

    /**
     * Event listener for the submission of the login form. Handle the login.
     * @param {*} event 
     */
    onLoginSubmitted = async (event) => {
        event.preventDefault();
        const form = event.target;

        if (form.checkValidity()) {
            try {
                const user = await Api.doLogin(form.email.value, form.password.value);
                localStorage.setItem('user', JSON.stringify(user));

                page.redirect('/store');
            } catch (error) {
                if (error) {

                }
            }
        }
    }

    onSignUpSubmitted = async (event) => {
        event.preventDefault();
        const form = event.target;

        if (form.checkValidity()) {
            try {
                const user = await Api.doSignUp(form.validationCustom01.value, form.validationCustom02.value, form.validationCustomUsername.value, form.validationCustomPassword.value);

                page.redirect('/login');
            } catch (error) {
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
     * Render the navbar and show the logout link
     */
    renderNavBar = (active) => {
        this.loginLink.innerHTML = "";
        this.loginLink.innerHTML = '<a class="nav-link" href="/userPage">' + `${active}` + '</a>';
        this.logoutLink.classList.remove('invisible');
    };

    /**
    * Perform the logout
    */
    logout = async () => {
        await Api.doLogout();
        this.logoutLink.classList.add('invisible');
        this.loginLink.innerHTML = "";
        this.loginLink.innerHTML = '<a class="nav-link" href="/login">Login | Register</a>';
        this.loggedUser = null;
        localStorage.removeItem('user');
        page.redirect('/login');
    }


    personalUserPage = async () => {

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userLog = await Api.getLoggedUser(user.id);
            if (user != null) this.appContainer.innerHTML = createUserPage(userLog);

        } catch (error) {
            page.redirect('/');
        }

    }

    createUserWishList = async () => {
        
        const user = JSON.parse(localStorage.getItem('user'));
        this.wishlist = Api.createWishlist(user.id);
    }

    addItemWishList = async (event) => {

        event.preventDefault();
        const itemId = event.target.value;
        const user = JSON.parse(localStorage.getItem('user'));
        
        try {
            const item = await Api.getItemById(itemId);
    
            await Api.addItemWishlist(user.id, item);
            
        }  catch (error) {
            page.redirect('/');
        }

    }

    /*
        const followBtn = document.querySelector('#follow');
        const unfollowBtn = document.querySelector('#unfollow');
        followBtn.classList.add('invisible');
        unfollowBtn.classList.remove('invisible');
    */

    /*
    getUser = async () => {
        try {
            const user  = JSON.parse(localStorage.getItem('user'));
            return user;

        } catch (error) {
            page.redirect('/');
        }
    };*/

    /**
     * Create the HTML table for showing the items
     * @param {*} items 
     */
    showStore = async () => {
        try {
            const items = await Api.getItems();

            this.appContainer.innerHTML = createStoreTable();
            const storeTable = document.querySelector('#my-items');
            this.updateCartHtml();

            for (let item of items) {
                const itemRow = createStoreCard(item);
                storeTable.insertAdjacentHTML('beforeend', itemRow);
            }

            const buttons = document.querySelectorAll(".btn-add");
            for (const btn of buttons) {
                btn.addEventListener("click", this.addCart);
            }

            const buttonsWish = document.querySelectorAll(".btn-favourite-add");
            for (const btn of buttonsWish) {
                btn.addEventListener("click", this.addItemWishList);
            }

        } catch (error) {
            page.redirect('/login');
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
            if (!this.itemCart[itemId]) {
                this.itemCart[itemId] = items.filter(product => product.id == itemId)[0];
                this.itemCart[itemId].quantity = 1;
            } else {
                this.itemCart[itemId].quantity++;
            }
            localStorage.setItem('cart', JSON.stringify(this.itemCart));
            this.updateCartHtml();
        } catch (error) {
            page.redirect('/');
        }
    }

    /**
     * Update cart with item added at the cart in the HTML
     */
    updateCartHtml() {

        this.itemCart = JSON.parse(localStorage.getItem('cart')) || [];
        const listCart = document.querySelector('.listCart');
        listCart.innerHTML = '';
        if (this.itemCart) {
            this.itemCart.forEach(x => {
                if (x) {
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

        if (btnType == '+') {
            this.itemCart[itemId].quantity++;
        } else if (btnType == '-') {
            this.itemCart[itemId].quantity--;
            if (this.itemCart[itemId].quantity <= 0) {
                delete this.itemCart[itemId];
            }
        }
        localStorage.setItem('cart', JSON.stringify(this.itemCart));
        this.updateCartHtml();
    }

}

export default App;