"use strict";

import Api from './api.js';
import User from './user.js';
import Item from './item.js';
import Purchase from './purchase.js';
import Comment from './comment.js';
import { createLoginForm } from './templates/login-template.js';
import { createSignUpForm } from './templates/sign-template.js';
import { createHomeForm } from './templates/home-template.js';
import { navbarUserPage, createUserPage, createWishlistPage, createCard } from './templates/user-template.js';
import { createStoreTable, createStoreCard, createCartCard, addFollowButton, removeFollowButton } from './templates/store-template.js';
import { createContactForm } from './templates/contact-template.js';
import { createPricingForm } from './templates/pricing-template.js';
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
        this.item = [];

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
                this.appContainer.innerHTML = this.personalUserPage();
            }

        });

        page('/wishlist', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser != null) {
                this.appContainer.innerHTML = this.createUserWishList();

            }
        });

        page('/history', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser != null) {
                this.renderNavBar(this.loggedUser.name);
            }
            this.appContainer.innerHTML = "";
        });

        page('/delete', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser != null) {
                this.renderNavBar(this.loggedUser.name);
            }
            this.appContainer.innerHTML = "";
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

    /**
     * Render the navbar and show the logout link
     */
    renderNavBar = (active) => {
        this.loginLink.innerHTML = "";
        this.loginLink.innerHTML = '<a class="nav-link" href="/userPage">' + `${active}` + '</a>';
        this.logoutLink.classList.remove('invisible');
    };

    personalUserPage = async () => {

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userLog = await Api.getLoggedUser(user.id);
            if (user != null) {
                this.appContainer.innerHTML = "";
                this.appContainer.innerHTML = navbarUserPage('userPage');
                const bodyPage = document.querySelector('.bodyPage');
                bodyPage.innerHTML = createUserPage(userLog);
            }
        } catch (error) {
            page.redirect('/');
        }

    }

    createUserWishList = async () => {

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const wishlist = await Api.getWishlist(user.id);

            this.appContainer.innerHTML = "";
            this.appContainer.innerHTML = navbarUserPage('wishlist');
            const bodyPage = document.querySelector('.bodyPage');
            bodyPage.innerHTML = createWishlistPage();
            //const wishlistContainer = document.querySelector('#list');
            let wishlistTable = document.querySelector("table > tbody");

            if (wishlist.length > 0) {
                for (let item of wishlist) {
                    let tr = document.createElement("tr");
                    let td = document.createElement("td");
                    const getItem = await Api.getItemById(item.idWishItem);
                    td.innerHTML = createCard(getItem);
                    //wishlistContainer.insertAdjacentHTML('beforeend', itemRow);
                    tr.appendChild(td);
                    wishlistTable.appendChild(tr);
                }
            }
            
        } catch (error) {
            page.redirect('/');
        }

    }

    addItemWishList = async (event) => {

        event.preventDefault();
        const itemId = event.target.closest('.btn-favourite-add');
        const user = JSON.parse(localStorage.getItem('user'));

        try {
            const item = await Api.getItemById(itemId.value);

            const response = await Api.addItemWishlist(user.id, item);
            this.showStore();

        } catch (error) {
            page.redirect('/');
        }

    }

    removeItemWishList = async (event) => {

        event.preventDefault();
        const itemId = event.target.closest('.btn-favourite-remove');
        const user = JSON.parse(localStorage.getItem('user'));

        try {
            const item = await Api.getItemById(itemId.value);

            const response = await Api.removeItemFromWishlist(user.id, item);
            this.showStore();

        } catch (error) {
            page.redirect('/');
        }

    }

    /**
     * Create the HTML table for showing the items
     * @param {*} items 
     */
    showStore = async () => {
        try {
            const items = await Api.getItems();

            this.appContainer.innerHTML = createStoreTable();
            const storeTable = document.querySelector('#my-items');
            const btnCheckout = document.getElementById('checkoutBox');
            btnCheckout.addEventListener('click', this.onClickCheckout);
            this.updateCartHtml();
            this.updateStoreHTML(items, storeTable);
            this.createCategoriesList();

        } catch (error) {
            page.redirect('/login');
        }
    }

    /**
     * Displays the items in the items container.
     * @param  {Array} items - The array of items objects to display.
     */
    showItem = async (items) => {
        const storeTable = document.querySelector('#my-items');
        storeTable.innerHTML = "";

        this.updateCartHtml();
        this.updateStoreHTML(items, storeTable);
    }

    onClickCheckout = async () => {

        const user = JSON.parse(localStorage.getItem('user'));
        const listPurchase = [];


        this.itemCart.forEach(item => {

            if(item) {
                const itemId = item.id;
                const itemQuantity = item.quantity;
                const itemPrice = item.price;
                
                let addPurchase = new Purchase(user.id, itemId, itemQuantity, itemPrice);
                listPurchase.push(addPurchase);
            }

        });

        const response = await Api.doCheckout(listPurchase);
        if(response){
            localStorage.removeItem('cart');
            this.updateCartHtml();
        }

    }

    updateStoreHTML = async (items, storeTable) => {

        const user = JSON.parse(localStorage.getItem('user'));
        const wishlist = await Api.getWishlist(user.id);

        for (let item of items) {
            const itemRow = createStoreCard(item);
            storeTable.insertAdjacentHTML('beforeend', itemRow);
            // Seleziona il productCard corrispondente all'item corrente
            const productCard = document.querySelector(`#product-card-${item.id}`);

            if (wishlist.error) {
                productCard.insertAdjacentHTML('beforeend', addFollowButton(item.id));
            } else {
                const itemFound = wishlist.filter(itemWish => itemWish.idWishItem == item.id);
                if (itemFound.length > 0) {
                    productCard.insertAdjacentHTML('beforeend', removeFollowButton(item.id));
                } else {
                    productCard.insertAdjacentHTML('beforeend', addFollowButton(item.id));
                }
            }
        }

        const buttons = document.querySelectorAll(".btn-add");
        for (const btn of buttons) {
            btn.addEventListener("click", this.addCart);
        }

        const buttonsAddsWish = document.querySelectorAll(".btn-favourite-add");
        for (const btn of buttonsAddsWish) {
            btn.addEventListener("click", this.addItemWishList);
        }

        const buttonsRemoveWish = document.querySelectorAll(".btn-favourite-remove");
        for (const btn of buttonsRemoveWish) {
            btn.addEventListener("click", this.removeItemWishList);
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

    getTypes = async () => {
        let categories = [];
        const items = await Api.getCategories();
        // Itera su ogni item per estrarre le categorie
        items.forEach(m => {
            categories = categories.concat(m.obj);
        });
        // Filtra le categorie rimuovendo i duplicati
        categories = categories.filter((item, index) => categories.indexOf(item) === index);
        // Ordina le categorie in ordine alfabetico
        return categories.sort();
    }

    createCategoriesList = async () => {
        const leftSidebar = document.querySelector("#left-sidebar");
        let dd_menu = leftSidebar.querySelector(".dropdown-menu");
        dd_menu.innerHTML = `<li><a class="dropdown-item active" data-id="all-categories" href="#">Tutte</a></li>`;
        let categories = await this.getTypes();
        categories.forEach(category => {
            dd_menu.insertAdjacentHTML('beforeend',
                `<li><a class="dropdown-item" data-id="${category}" href="#">${category}</a></li>`);
        });
        // Add event listeners to handle category clicks in the dropdown menu
        this.createFiltersByCategory();
    }

    createFiltersByCategory() {
        const leftSidebar = document.querySelector("#left-sidebar");
        const categoryLinks = leftSidebar.querySelectorAll('.dropdown-menu a');

        categoryLinks.forEach(cat => { cat.addEventListener('click', this.categoryClick) });
    }

    categoryClick = async (event) => {
        event.preventDefault();
        const el = event.target;
        // Get the category from the element's data-id property
        const category = el.dataset.id;
        // Remove the 'active' class from the currently active main menu link
        const leftSidebar = document.querySelector("#left-sidebar");
        leftSidebar.querySelectorAll('.active').forEach(
            el => el.classList.remove('active')
        );
        // Add the 'active' class to the "Categories" main menu link and the clicked category
        document.getElementById("category").classList.add('active');
        el.classList.add('active');
        // Apply the category filter and get the filtered items
        let itemsFilter = await Api.getFilterItems(category);
        // Display the filtered items
        this.showItem(itemsFilter);
        // Update the active category state in the sidebar
        this.updateActiveCategory(category);
    };

    updateActiveCategory(filterCat) {
        let dd_menu = document.querySelector(".dropdown-menu");
        dd_menu.querySelector('a.active').classList.remove('active');
        dd_menu.querySelector(`a[data-id="${filterCat}"`).classList.add('active');
    }

}

export default App;