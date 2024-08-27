"use strict";

import Api from './api.js';
import User from './user.js';
import Item from './item.js';
import Purchase from './purchase.js';
import Comment from './comment.js';
import { createLoginForm } from './templates/login-template.js';
import { createSignUpForm } from './templates/sign-template.js';
import { createHomeForm } from './templates/home-template.js';
import { navbarUserPage, createUserPage, createWishlistPage, createCard, createHistoryPurchasePage, createCardPurchase, createTablePurchase, createTotalRow, createHistoryCommentsPage, cardShowCommentsUser } from './templates/user-template.js';
import { createStoreTable, createStoreCard, createCartCard, addFollowButton, removeFollowButton, addPubIcon, addPrvIcon } from './templates/store-template.js';
import { navbarAdminPage, createAdminProfile, createUsersPage, createItemsPage, loadUsers, loadItems, cardShowComments, cardShowItems, cardUpdateComments } from './templates/admin-template.js';
import { createContactForm } from './templates/contact-template.js';
import { createPricingForm } from './templates/pricing-template.js';
import { createAlert } from './templates/alert-template.js';
import { createSearchItemTable, createSearchCommentTable, createSearchItemPage, createSearchCommentPage, cardShowComment, createSearchItemCard } from './templates/search-template.js';
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
                this.appContainer.innerHTML = "";
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
                this.appContainer.innerHTML = this.createHistoryPurchase();
            }
        });

        page('/historyComments', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser != null) {
                this.appContainer.innerHTML = this.createHistoryComments();
            }
        });

        page('/users', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser != null) {
                this.appContainer.innerHTML = this.createAdminUsers();
            }
        });

        page('/items', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser != null) {
                this.appContainer.innerHTML = this.createAdminItems();
            }
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

        document.querySelector('.btn-search-item').addEventListener('click', this.searchItems);
        document.querySelector('.btn-search-comment').addEventListener('click', this.searchComments);

        // very simple itemple of how to handle a 404 Page Not Found 
        page('*', () => this.appContainer.innerHTML = 'Page not found!');

        page();
    }

    /**
     * Event listener for the submission of the login form. Handle the login.
     * @param {*} event 
     */
    onLoginSubmitted = async (event) => {
        event.preventDefault();
        const form = event.target;
        try {
            const user = await Api.doLogin(form.email.value, form.password.value);
            localStorage.setItem('user', JSON.stringify(user));
            this.showAlertMessage('success', 'Welcome ' + user.name + '!');
            page.redirect('/store');

        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }

    }

    /**
     * Event listener for the submission of the signup form. Handle the signup.
     * @param {Event} event - The event object of the form submission
     */
    onSignUpSubmitted = async (event) => {
        event.preventDefault();
        const form = event.target;

        try {
            // extract form data
            const userName = form.validationCustomUsername.value;
            const userSurname = form.validationCustom02.value;
            const userEmail = form.validationCustomUsername.value;
            const userPassword = form.validationCustomPassword.value;

            // create user object
            const user = new User(userName, userSurname, userEmail, userPassword);

            // make API call to signup
            const response = await Api.doSignUp(user);

            // show success message
            this.showAlertMessage('success', 'Signup avvenuto con successo!');

            // redirect to login page
            page.redirect('/login');
        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    /**
     * Show an alert message in the DOM.
     * @param {string} type - The type of the alert (e.g. 'success', 'danger', etc.).
     * @param {string} message - The message to be displayed in the alert.
     */
    showAlertMessage = (type, message) => {
        // Get the alert message container element
        const alertMessage = document.getElementById('alert-message');

        // Set the innerHTML of the container to the alert message
        alertMessage.innerHTML = createAlert(type, message);

        // Automatically remove the flash message after 3 seconds
        setTimeout(() => {
            // Reset the innerHTML of the container to an empty string
            alertMessage.innerHTML = '';
        }, 3000);
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
    }

    /**
     * Renders the personal user page with the user's information.
     * If the user is an admin, it renders the admin user page.
     * If there's an error, it redirects to the main page.
     *
     * @returns {Promise<void>} Promise that resolves when the page is rendered
     */
    personalUserPage = async () => {

        try {
            // Get the logged user from local storage
            const user = JSON.parse(localStorage.getItem('user'));

            // Get the user's information from the API
            const userLog = await Api.getLoggedUser(user.id);

            if (user != null && userLog.admin === 1) {
                // If the user is an admin, render the admin user page
                this.appContainer.innerHTML = "";
                this.appContainer.innerHTML = navbarAdminPage('userPage');
                const bodyPage = document.querySelector('.bodyPage');
                bodyPage.innerHTML = createAdminProfile(userLog);
            } else {
                // If the user is not an admin, render the user page
                this.appContainer.innerHTML = "";
                this.appContainer.innerHTML = navbarUserPage('userPage');
                const bodyPage = document.querySelector('.bodyPage');
                bodyPage.innerHTML = createUserPage(userLog);
            }

            if (userLog.birthdate) {
                document.getElementById('birthdate').value = userLog.birthdate;
            }

            if (userLog.address) {
                document.getElementById('address').value = userLog.address;
            }

            if (userLog.city) {
                document.getElementById('city').value = userLog.city;
            }

            // Add event listener to the delete button
            document.getElementById('confirmDeleteButton').addEventListener('click', this.onClickDeleteAccount(user.id));
            document.getElementById('saveButton').addEventListener('click', this.onClickSaveInfo());

        } catch (error) {
            if (error) {
                const errorMsg = error;
                // Add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
            page.redirect('/');
        }

    }

    /**
     * Asynchronously creates the admin users page.
     *
     * @returns {Promise<void>} Promise that resolves when the page is rendered
     */
    createAdminUsers = async () => {
        try {
            // Get the logged user from local storage
            const user = JSON.parse(localStorage.getItem('user'));

            // If the user is logged in, proceed
            if (user != null) {
                // Get the list of users from the API
                const users = await Api.getUsers();

                // Clear the app container
                this.appContainer.innerHTML = "";

                // Render the admin users page
                this.appContainer.innerHTML = navbarAdminPage('users');
                const bodyPage = document.querySelector('.bodyPage');
                bodyPage.innerHTML = createUsersPage();

                // Get the users list element
                const usersList = document.querySelector('.usersList');

                // Loop through the users and insert them into the DOM
                users.forEach(user => {
                    if (user) {
                        usersList.insertAdjacentHTML('beforeend', loadUsers(user));
                    }
                })

                // Add event listeners to the add and delete buttons
                this.addEventListenersToButtons(".btn-user-add", this.onClickAddUser);
                this.addEventListenersToButtons(".btn-user-delete", this.onClickDeleteUser);
                this.addEventListenersToButtons(".btn-user-comments", this.showCommentsUsers);
                this.addEventListenersToButtons(".btn-user-wishlist", this.showWhislist);
            }
        } catch (error) {
            if (error) {
                const errorMsg = error;
                // Add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    createAdminItems = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user != null) {
                const items = await Api.getItems();
                const categories = await Api.getCategories();
                this.appContainer.innerHTML = "";
                this.appContainer.innerHTML = navbarAdminPage('items');
                const bodyPage = document.querySelector('.bodyPage');
                bodyPage.innerHTML = createItemsPage();

                const categorySelect = document.getElementById('itemCategory');
                categorySelect.innerHTML = ''; // Clear existing options

                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.text = category.obj;
                    categorySelect.appendChild(option);
                });

                const itemsList = document.querySelector('.itemsList');
                items.forEach(item => {
                    if (item) {
                        itemsList.insertAdjacentHTML('beforeend', loadItems(item));
                    }
                })
                //aggiungere addeventlistener
                this.addEventListenersToButtons(".btn-item-delete", this.onClickDeleteItem);
                this.addEventListenersToButtons(".btn-item-add", this.onClickAddItem);
                this.addEventListenersToButtons(".btn-item-comments", this.showCommentsItems);

            }
        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    /**
     * Create the user's wishlist page.
     *
     * @returns {Promise<void>}
     */
    createUserWishList = async () => {

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const wishlist = await Api.getWishlistByUser(user.id);

            this.appContainer.innerHTML = "";
            this.appContainer.innerHTML = navbarUserPage('wishlist');
            const bodyPage = document.querySelector('.bodyPage');
            bodyPage.innerHTML = createWishlistPage();
            document.getElementById('userName').textContent = user.name;

            // Add each item in the wishlist to the table
            this.insertItemWishList(wishlist);
            this.createCategoriesListWish();

        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
            page.redirect('/');
        }

    }

    insertItemWishList = async (wishlist) => {

        try {
            let wishlistTable = document.getElementById("wishlistBody");
            wishlistTable.innerHTML = "";

            if (wishlist.length > 0) {
                for (let item of wishlist) {
                    const getItem = await Api.getItemById(item.idWishItem);
                    const col = document.createElement("div");
                    col.classList.add("col-md-4", "mb-4"); // Aggiungi classi Bootstrap per gestione dello spazio
                    col.innerHTML = createCard(getItem); // Usa la funzione createCard per generare HTML
                    wishlistTable.appendChild(col);

                    const productCard = document.querySelector(`#product-card-${getItem.id}-footer`);
                    productCard.insertAdjacentHTML('beforeend', removeFollowButton(getItem.id));

                    if (item.visibility > 0) {
                        productCard.insertAdjacentHTML('beforeend', addPubIcon());
                    } else {
                        productCard.insertAdjacentHTML('beforeend', addPrvIcon());
                    }
                }
            } else {
                const emptyMessage = document.createElement("div");
                emptyMessage.classList.add("col-12", "text-center", "my-4");
                emptyMessage.innerHTML = `<p class="text-center mb-0">Non ci sono elementi nella lista dei desideri</p>`;
                wishlistTable.appendChild(emptyMessage);
            }

            this.addEventListenersToButtons(".btn-favourite-remove", this.removeItemWishList.bind(this));

        } catch (error) {
            console.error("Errore durante l'inserimento degli elementi nella wishlist:", error);
        }
    }

    /**
     * Create the user's purchase history page.
     *
     * @returns {Promise<void>}
     */
    createHistoryPurchase = async () => {

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const history = await Api.getHistoryPurchase(user.id);
            this.appContainer.innerHTML = "";
            this.appContainer.innerHTML = navbarUserPage('history');

            const bodyPage = document.querySelector('.bodyPage');
            bodyPage.innerHTML = createHistoryPurchasePage();

            const purchaseHistoryRow = document.getElementById('purchase-history-row');

            // Add each purchase to the table, organizing them by date and time
            if (history.length > 0) {
                let previousDateTime = null;
                let currentTotal = 0;

                for (let item of history) {
                    if (item.dateTime !== previousDateTime) {
                        // Add a total row to the previous table if it exists
                        if (previousDateTime !== null) {
                            let historyTables = purchaseHistoryRow.querySelectorAll(".table > tbody");
                            let historyTable = historyTables[historyTables.length - 1];
                            historyTable.insertAdjacentHTML('beforeend', createTotalRow(currentTotal));
                        }

                        // Create a new table when the time changes
                        purchaseHistoryRow.insertAdjacentHTML('beforeend', createTablePurchase());
                        // Select the newly added table
                        let historyTables = purchaseHistoryRow.querySelectorAll(".table > tbody");
                        let historyTable = historyTables[historyTables.length - 1]; // Last added table
                        // Add the title of the dateTime to the new table
                        let trDateTime = document.createElement("tr");
                        let tdDateTime = document.createElement("td");
                        const [date, time] = item.dateTime.split(' ');
                        tdDateTime.innerHTML = `<p class="card-text dateTime">Acquisto effettuato il giorno: ${date} alle ore: ${time}</p>`;
                        trDateTime.appendChild(tdDateTime);
                        historyTable.appendChild(trDateTime);

                        // Reset the current total for the new table
                        currentTotal = 0;
                    }

                    // Add the card inside the current table
                    let historyTables = purchaseHistoryRow.querySelectorAll(".table > tbody");
                    let historyTable = historyTables[historyTables.length - 1]; // Last added table
                    let tr = document.createElement("tr");
                    let td = document.createElement("td");

                    // Imposta lo stile per centrare il contenuto nella cella
                    td.style.textAlign = "center";
                    td.style.verticalAlign = "middle"; // Centra verticalmente

                    const getItem = await Api.getItemById(item.idPurchaseItem);
                    td.innerHTML = createCardPurchase(getItem, item.qta);
                    tr.appendChild(td);
                    historyTable.appendChild(tr);

                    // Update the current total
                    currentTotal += getItem.price * item.qta;

                    // Update the previousDateTime with the current item
                    previousDateTime = item.dateTime;
                }

                // Add a total row to the last table
                let historyTables = purchaseHistoryRow.querySelectorAll(".table > tbody");
                let historyTable = historyTables[historyTables.length - 1];
                historyTable.insertAdjacentHTML('beforeend', createTotalRow(currentTotal));
            } else {
                let tr = document.createElement("tr");
                let td = document.createElement("td");
                td.innerHTML = "Nessun acquisto ancora effetuato";
                tr.appendChild(td);
                purchaseHistoryRow.appendChild(tr);
            }

        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
            page.redirect('/');
        }
    }

    addItemWishList = async (event) => {

        event.preventDefault();
        const button = event.target.closest('.btn-favourite-add');
        const itemId = button.value;
        const user = JSON.parse(localStorage.getItem('user'));

        try {
            const item = await Api.getItemById(itemId);
            const visibility = await this.showModalAndGetVisibility(item.id);
            const response = await Api.addItemWishlist(user.id, item, visibility);
            if (response) {
                this.showAlertMessage('success', response.message);

                // Trova la card specifica dell'item
                const card = document.getElementById(itemId);
                if (card) {
                    // Aggiorna il pulsante "Aggiungi ai preferiti" con uno di rimozione
                    const followButton = card.querySelector('.btn-favourite-add');
                    followButton.outerHTML = removeFollowButton(itemId);

                    // Aggiungi l'icona di visibilità
                    const visibilityIcon = (visibility == 1) ? addPubIcon() : addPrvIcon();
                    card.querySelector('.card-footer-price').insertAdjacentHTML('afterbegin', visibilityIcon);

                    this.addEventListenersToButtons(".btn-favourite-remove", this.removeItemWishList.bind(this));
                }
            }

        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }

    }

    /**
     * Show a modal to get visibility choice from user and return the choice.
     *
     * @return {Promise<number>} A promise that resolves to the visibility choice made by the user.
     */
    showModalAndGetVisibility = (itemId) => {
        return new Promise((resolve, reject) => {
            const modalId = `#staticBackdrop-${itemId}`;
            const modal = document.querySelector(modalId);
        
            // Quando l'utente clicca su "Save choice", risolvi la Promise con la scelta dell'utente
            const saveButton = modal.querySelector('.btn-saveChoice');
            saveButton.onclick = function() {
                try {
                    const visibility = parseInt(modal.querySelector('input[name="visibilityOptions"]:checked').value, 10);
                    resolve(visibility);
                } catch (error) {
                    reject('Non si è selezionata la visibilità. Prego riprovare.');
                }
            };
        });
    }
    
    removeItemWishList = async (event) => {

        event.preventDefault();
        const button = event.target.closest('button');
        const itemId = button.value;
        const user = JSON.parse(localStorage.getItem('user'));

        try {
            const item = await Api.getItemById(itemId);
            const response = await Api.removeItemFromWishlist(user.id, item.id);
            if (response) {
                this.showAlertMessage('success', "Item removed from wishlist successfully");
                const card = document.getElementById(item.id);
                const wishlistPage = document.getElementById('wishlistBody');

                if (wishlistPage) {
                    card.remove();
                } else {
                    // Trova la card specifica dell'item
                    if (card) {
                        // Aggiorna il pulsante "Rimuovi dai preferiti" con uno di aggiunta
                        const unfollowButton = card.querySelector('.btn-favourite-remove');
                        unfollowButton.outerHTML = addFollowButton(item.id);

                        // Rimuovi l'icona di visibilità se presente
                        const visibilityIcon = card.querySelector('img[alt^="visibilità"]');
                        if (visibilityIcon) {
                            visibilityIcon.remove();
                        }

                        this.addEventListenersToButtons(".btn-favourite-add", this.addItemWishList.bind(this));
                    }
                }


            }

        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', "Error while removing item from wishlist");
            }
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
            if (error) {
                const errorMsg = "Effettua il login per accedere al negozio";
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
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

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const listPurchase = [];
            const dateTime = moment().format("DD/MM/YYYY HH:mm:ss");

            this.itemCart.forEach(item => {

                if (item) {
                    const itemId = item.id;
                    const itemQuantity = item.quantity;
                    const itemPrice = item.price;

                    let addPurchase = new Purchase(user.id, itemId, itemQuantity, itemPrice, dateTime);
                    listPurchase.push(addPurchase);
                }

            });

            const response = await Api.doCheckout(listPurchase);
            if (response) {
                localStorage.removeItem('cart');
                this.showAlertMessage('success', response.message);
                this.updateCartHtml();
            }
        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }

        }

    }

    /**
     * Handles the click event when the "Favourites" button is clicked.
     * Retrieves the wishlist items for the logged-in user and updates the store table in the UI.
     *
     * @return {Promise<void>} - A promise that resolves when the store table is updated.
     */
    onClickFavourities = async () => {
        try {

            // Retrieve the logged-in user from local storage
            const user = JSON.parse(localStorage.getItem('user'));
            // Retrieve the wishlist items for the user
            const wishlist = await Api.getWishlistByUser(user.id);
            // Get the store table element from the UI
            const storeTable = document.querySelector('#my-items');
            // Clear the store table before updating it
            storeTable.innerHTML = "";
            // Create an empty array to store the wishlist items
            const itemWishlist = [];

            // Iterate over each wishlist item
            for (let item of wishlist) {
                // Retrieve the item details by its ID
                const itemWish = await Api.getItemById(item.idWishItem);
                // Add the item to the wishlist array
                itemWishlist.push(itemWish);
            }

            // Update the cart HTML to reflect any changes in the cart
            this.updateCartHtml();
            // Update the store table HTML with the wishlist items
            this.updateStoreHTML(itemWishlist, storeTable);
        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    onClickPrivate = async () => {

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const wishlist = await Api.getWishlistByUser(user.id);
            const storeTable = document.querySelector('#my-items');
            storeTable.innerHTML = "";
            const itemWishlist = [];

            for (let item of wishlist) {
                if (item.visibility === 0) {
                    const itemWish = await Api.getItemById(item.idWishItem);
                    itemWishlist.push(itemWish);
                }
            }

            this.updateCartHtml();
            this.updateStoreHTML(itemWishlist, storeTable);

        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    onClickPublic = async () => {

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const wishlist = await Api.getWishlistByUser(user.id);
            const storeTable = document.querySelector('#my-items');
            storeTable.innerHTML = "";
            const itemWishlist = [];

            for (let item of wishlist) {
                if (item.visibility === 1) {
                    const itemWish = await Api.getItemById(item.idWishItem);
                    itemWishlist.push(itemWish);
                }
            }

            this.updateCartHtml();
            this.updateStoreHTML(itemWishlist, storeTable);
        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    onClickComment = async () => {

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const exampleModal = document.getElementById('commentModal')
            if (exampleModal) {
                exampleModal.addEventListener('show.bs.modal', event => {
                    // Button that triggered the modal
                    const button = event.relatedTarget
                    // Extract info from data-bs-* attributes
                    const recipient = button.getAttribute('data-bs-whatever')
                    // Update the modal's content.
                    const modalTitle = exampleModal.querySelector('.modal-title')
                    const modalBodyInput = exampleModal.querySelector('.modal-body input')

                    modalTitle.textContent = `New comment to ${recipient}`
                    modalBodyInput.value = recipient
                })
            }
        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    onClickSaveInfo = async () => {

        document.getElementById('saveButton').addEventListener('click', async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));

                const birthdate = document.getElementById('birthdate').value;
                const address = document.getElementById('address').value;
                const city = document.getElementById('city').value;

                const dataInfo = {
                    birthdate: birthdate,
                    address: address,
                    city: city
                };

                const response = await Api.addUserInfo(user.id, dataInfo);

                if (response.success) {
                    this.showAlertMessage("success", response.message);
                } else {
                    this.showAlertMessage("danger", response.message);
                }
            } catch (err) {
                this.showAlertMessage("danger", "Si è verificato un errore: " + err.message);
            }
        });
    }

    onClickDeleteAccount = async () => {

        document.getElementById('confirmDeleteButton').addEventListener('click', async () => {
            const user = JSON.parse(localStorage.getItem('user'));

            const response = await Api.deleteUser(user.id);
            if (response.success) {
                localStorage.removeItem('user');
                this.showAlertMessage("success", response.message);
                page.redirect('/login');
            } else {
                this.showAlertMessage("danger", "Errore durante l'eliminazione dell'account. Si prega di riprovare.");
            }
        });
    }

    onClickDeleteItem = async (event) => {
        event.preventDefault();
        const itemId = parseInt(event.target.value);
        const response = await Api.removeItem(itemId);

        if (response.success) {
            this.showAlertMessage('success', response.message);
            this.createAdminItems();
        } else {
            this.showAlertMessage('danger', 'Errore durante l\'eliminazione dell\'item. Si prega di riprovare.');
        }

    }

    onClickAddItem = async (event) => {
        event.preventDefault();
        const itemName = document.getElementById('itemName').value;
        const itemPrice = parseFloat(document.getElementById('itemPrice').value);
        const itemCategory = parseFloat(document.getElementById('itemCategory').value);
        const itemImg = document.getElementById('itemImg').value;

        try {
            const item = new Item(itemPrice, itemName, itemCategory, itemImg);

            const response = await Api.addItem(item);
            if (response.success) {
                this.showAlertMessage("success", response.message);
                this.createAdminItems();
            } else {
                this.showAlertMessage("danger", "Errore durante l'inserimento dell'item. Si prega di riprovare.");
            }
        } catch (error) {
            this.showAlertMessage("danger", "Errore durante l'inserimento dell'item. Si prega di riprovare.");
        }
    }

    onClickAddUser = async (event) => {
        event.preventDefault();
        const userName = document.getElementById('userName').value;
        const userSurname = document.getElementById('userSurname').value;
        const userEmail = document.getElementById('userEmail').value;
        const password = document.getElementById('password').value;
        const user = new User(userName, userSurname, userEmail, password);

        const response = await Api.doSignUp(user);
        if (response.success) {
            this.showAlertMessage('success', response.message);
            this.createAdminUsers();
        } else {
            this.showAlertMessage('danger', 'Errore durante l\'aggiunta dell\'user. Si prega di riprovare.');
        }

    }

    onClickDeleteUser = async (event) => {
        event.preventDefault();
        const userId = parseInt(event.target.value);
        const response = await Api.deleteUser(userId);
        if (response.success) {
            // Recupera gli utenti dal localStorage
            let users = JSON.parse(localStorage.getItem('users')) || [];

            // Filtra l'array per rimuovere l'utente con l'userId specificato
            users = users.filter(user => user.id !== userId);

            // Aggiorna il localStorage con l'array filtrato
            localStorage.setItem('users', JSON.stringify(users));

            // Mostra un messaggio di successo e aggiorna la UI
            this.showAlertMessage('success', response.message);
            this.createAdminUsers();
        } else {
            this.showAlertMessage('danger', 'Errore durante l\'eliminazione dell\'user. Si prega di riprovare.');
        }
    }

    updateStoreHTML = async (items, storeTable) => {

        const user = JSON.parse(localStorage.getItem('user'));
        const wishlist = await Api.getWishlistByUser(user.id);

        for (let item of items) {
            const itemRow = createStoreCard(item);
            storeTable.insertAdjacentHTML('beforeend', itemRow);
            // Seleziona il productCard corrispondente all'item corrente
            const productCard = document.querySelector(`#product-card-follow-${item.id}`);

            if (wishlist.error) {
                productCard.insertAdjacentHTML('beforeend', addFollowButton(item.id));
            } else {
                const itemFound = wishlist.filter(itemWish => itemWish.idWishItem == item.id);
                if (itemFound.length > 0) {
                    productCard.insertAdjacentHTML('beforeend', removeFollowButton(item.id));
                    if (itemFound[0].visibility > 0) {
                        productCard.insertAdjacentHTML('beforeend', addPubIcon());
                    } else {
                        productCard.insertAdjacentHTML('beforeend', addPrvIcon());
                    }
                } else {
                    productCard.insertAdjacentHTML('beforeend', addFollowButton(item.id));
                }
            }
        }

        this.addEventListenersToButtons(".btn-add", this.addCart.bind(this));
        this.addEventListenersToButtons(".btn-favourite-add", this.addItemWishList.bind(this));
        this.addEventListenersToButtons(".btn-favourite-remove", this.removeItemWishList.bind(this));
        this.addEventListenersToButtons(".btn-comment-add", this.addComment.bind(this));

    }

    addEventListenersToButtons(buttonClass, event) {
        const buttons = document.querySelectorAll(buttonClass);
        for (const btn of buttons) {
            btn.addEventListener("click", event);
        }
    }

    static pubIcon() {
        return `<img src='./svg/eye.svg' alt='visibilità pubblica'>`
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

    /**
     * Adds click event listeners to filter elements.
     *
     * This function iterates over all the `li` elements in the `leftSidebar` element.
     * For each of them, it adds a click event listener that calls the `onClickFilter` method
     * with the click event as argument. It also checks if `leftSidebar` is not null before
     * iterating over its elements.
     *
     * @throws {Error} If `leftSidebar` is null.
     */
    manageFilters() {
        if (!this.leftSidebar) {
            throw new Error('leftSidebar is null');
        }

        this.leftSidebar.querySelectorAll("li").forEach(li_el => {
            if (li_el) {
                li_el.addEventListener("click", event => {
                    this.onClickFilter(event);
                });
            }
        });
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
        this.createFiltersByCategory(this.categoryClick);
        this.createFiltersByTitle();
    }

    createCategoriesListWish = async () => {
        const leftSidebar = document.querySelector("#left-sidebar");
        let dd_menu = leftSidebar.querySelector(".dropdown-menu");
        let users = await Api.getUsers();
        users.forEach(user => {
            dd_menu.insertAdjacentHTML('beforeend',
                `<li><a class="dropdown-item" data-id="${user.id}" href="#">${user.name}</a></li>`);
        });
        // Add event listeners to handle category clicks in the dropdown menu
        this.createFiltersByCategory(this.categoryClickWish);
    }

    createFiltersByCategory(fun) {
        const leftSidebar = document.querySelector("#left-sidebar");

        const categoryLinks = leftSidebar.querySelectorAll('.dropdown-menu a');

        categoryLinks.forEach(cat => { cat.addEventListener('click', fun) });
    }

    createFiltersByTitle() {
        const leftSidebar = document.querySelector("#left-sidebar");

        const categoryLinks = leftSidebar.querySelectorAll('.list-group a');

        categoryLinks.forEach(cat => { cat.addEventListener('click', this.titleClick) });
    }

    getCardIds() {
        // Seleziona il div con id "my-items"
        const myItemsDiv = document.getElementById('my-items');

        // Seleziona tutti gli elementi con la classe "card h-100" all'interno di "my-items"
        const cards = myItemsDiv.getElementsByClassName('card h-100');

        // Crea un array per memorizzare gli ID
        const ids = [];

        // Itera attraverso gli elementi e aggiungi i loro ID all'array
        for (let card of cards) {
            ids.push(card.id);
        }

        const intIds = ids.map(id => parseInt(id, 10));

        return intIds;
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

        const itemsFilter = await Api.getFilterItems(category)

        this.showItem(itemsFilter);
        // Update the active category state in the sidebar
        this.updateActiveCategory(category);
    }

    categoryClickWish = async (event) => {
        event.preventDefault();
        const el = event.target;
        const currentUser = JSON.parse(localStorage.getItem('user'));
        // Get the id from the element's data-id property
        const userId = parseInt(el.dataset.id, 10);
        const visibilityPublic = 1;
        // Remove the 'active' class from the currently active main menu link
        const leftSidebar = document.querySelector("#left-sidebar");
        leftSidebar.querySelectorAll('.active').forEach(
            el => el.classList.remove('active')
        );
        // Add the 'active' class to the "Categories" main menu link and the clicked category
        document.getElementById("users").classList.add('active');
        el.classList.add('active');

        const selectedUserName = await Api.getLoggedUser(userId);
        document.getElementById('userName').textContent = selectedUserName.name;

        if (userId === currentUser.id) {
            const itemsWish = await Api.getWishlistByUser(userId);
            this.insertItemWishList(itemsWish);
        } else {
            const itemsWish = await Api.getWishlistByVisibility(userId, visibilityPublic);
            this.insertItemWishList(itemsWish);
        }
        // Update the active category state in the sidebar
        this.updateActiveCategory(userId);
    }

    titleClick = async (event) => {
        event.preventDefault();
        const el = event.target;
        // Get the category from the element's data-id property
        const category = el.dataset.id;
        // Remove the 'active' class from the currently active main menu link
        const leftSidebar = document.querySelector("#left-sidebar");
        leftSidebar.querySelectorAll('.active').forEach(
            el => el.classList.remove('active')
        );
        // Add the 'active' class to the clicked category
        el.classList.add('active');
        // Apply the category filter and get the filtered items
        if (category === 'all') {
            this.showStore();
        } else if (category === 'favourities') {
            this.onClickFavourities();
        } else if (category === 'private') {
            this.onClickPrivate();
        } else if (category === 'public') {
            this.onClickPublic();
        }
    }

    updateActiveCategory(filterCat) {
        let dd_menu = document.querySelector(".dropdown-menu");
        dd_menu.querySelector('a.active').classList.remove('active');
        dd_menu.querySelector(`a[data-id="${filterCat}"`).classList.add('active');
    }


    showModalAndGetText = (itemId) => {
        return new Promise((resolve, reject) => {
            const modalId = `#commentModal-${itemId}`;
            const modal = document.querySelector(modalId);
            const messageText = document.getElementById(`message-text-${itemId}`);
        
            // Quando l'utente clicca su "Save choice", risolvi la Promise con la scelta dell'utente
            const saveButton = modal.querySelector('.btn-saveComment');
            saveButton.onclick = function() {
                try {
                    const text = messageText.value;
                    resolve(text);
                } catch (error) {
                    reject('Non è stato aggiunto il teste del commento. Prego riprovare.');
                }
            };
        });
    }
    

    addComment = async (event) => {

        event.preventDefault();
        const button = event.target.closest('.btn-comment-add');
        const itemId = parseInt(button.value, 10);
        const user = JSON.parse(localStorage.getItem('user'));

        try {
            const text = await this.showModalAndGetText(itemId);
            const comment = new Comment(user.id, itemId, text);
            const response = await Api.addComment(comment);
            if (response) {
                this.showAlertMessage('success', response.message);
            }


        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }

    }

    removeComment = async (event) => {
        event.preventDefault();
        const button = event.target.closest('button');
        const commentId = parseInt(event.target.dataset.id, 10);

        try {
            if (button.classList.contains(`btn-remove-comment-${commentId}`)) {
                const response = await Api.removeComment(commentId);
                if (response.success) {
                    this.showAlertMessage('success', response.message);
                    this.createHistoryComments();
                }
            } else if (button.classList.contains('btn-delete-comment')) {
                const response = await Api.removeComment(commentId);
                if (response.success) {
                    this.showAlertMessage('success', response.message);
                }
            }

        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }

    }

    updateComment = async (event) => {
        event.preventDefault();
        const commentId = parseInt(event.target.dataset.id, 10);

        try {
            const text = await this.showModalAndGetText(commentId);
            const response = await Api.updateComment(text, commentId);
            if (response) {
                this.showAlertMessage('success', "Commento modificato con successo");
                this.createHistoryComments();
            }

        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }

        }
    }

    updateCommentAdmin = async (event) => {
        event.preventDefault();
        const commentId = parseInt(event.target.dataset.id, 10);

        try {
            const text = await this.showModalAndGetText('btn-save-comment');
            const response = await Api.updateComment(text, commentId);
            if (response.success) {
                this.showAlertMessage(response.message);
                this.showCommentsItems();
            }

        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }

        }
    }

    updateItem = async (event) => {
        event.preventDefault();
        const commentId = parseInt(event.target.dataset.id, 10);

        try {
            const text = await this.showModalAndGetText('btn-update-comment');
            const response = await Api.updateComment(text, commentId);
            if (response.success) {
                this.showAlertMessage('success', "Commento modificato con successo");
                this.createHistoryComments();
            }

        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }

        }
    }

    showCommentsUsers = async (event) => {
        try {
            event.preventDefault();
            const userId = event.target.value;
            const comments = await Api.getCommentsbyUserId(userId);
            const bodyPage = document.querySelector('.bodyPage');
            bodyPage.innerHTML = createHistoryCommentsPage();
            const commentsHistoryRow = document.getElementById('comments-history-row');

            if (comments.error) {
                commentsHistoryRow.insertAdjacentHTML('beforeend', '<p>Non ci sono commenti per questo utente</p>');
            } else {
                comments.forEach(async comment => {
                    let itemName = await Api.getItemById(comment.idCommentItem);
                    let card = cardShowCommentsUser(comment, itemName.name, itemName.id);
                    commentsHistoryRow.insertAdjacentHTML('beforeend', card);
                });
            }

            this.addEventListenersToButtons('.btn-remove-comment', this.removeComment);
            this.addEventListenersToButtons('.btn-update-comment', this.updateCommentAdmin);

        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    showCommentsItems = async (event) => {
        try {
            event.preventDefault();
            const itemId = event.target.value;
            const comments = await Api.getCommentsbyItemId(itemId);
            const bodyPage = document.querySelector('.bodyPage');
            bodyPage.innerHTML = createHistoryCommentsPage();
            const commentsHistoryRow = document.getElementById('comments-history-row');

            if (comments.error) {
                commentsHistoryRow.insertAdjacentHTML('beforeend', '<p>Non ci sono commenti per questo utente</p>');
            } else {
                comments.forEach(async comment => {
                    let itemName = await Api.getItemById(comment.idCommentItem);
                    let card = cardShowCommentsUser(comment, itemName.name);
                    commentsHistoryRow.insertAdjacentHTML('beforeend', card);
                });
            }

            this.addEventListenersToButtons('.btn-remove-comment', this.removeComment);
            this.addEventListenersToButtons('.btn-update-comment', this.updateCommentAdmin);

        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    /**
     * Asynchronously shows the wishlist of a user.
     * @param {Event} event - The event triggered by the user.
     */
    showWhislist = async (event) => {
        try {
            // Prevent the default action of the event
            event.preventDefault();
            // Get the user ID from the event target
            const userId = event.target.value;
            // Get the wishlist of the user
            const wishlist = await Api.getWishlistByUser(userId);
            // Get the DOM element to display the wishlist items
            const wishItemsList = document.getElementById('wishItemsList');
            // Clear the wishlist items in the DOM
            wishItemsList.innerHTML = '';

            // If there are no items in the wishlist, display a message
            if (wishlist.error) {
                wishItemsList.insertAdjacentHTML('beforeend', '<p>Non ci sono item nella wishlist di questo utente</p>');
            } else {
                // If there are items in the wishlist, display them
                if (wishlist.length > 0) {
                    // Iterate over each item in the wishlist
                    for (const item of wishlist) {
                        // Get the details of the item
                        const getItem = await Api.getItemById(item.idWishItem);
                        // Create a card to display the item details
                        const card = cardShowItems(getItem);
                        // Add the card to the DOM
                        wishItemsList.insertAdjacentHTML('beforeend', card);
                    }
                }
            }

            this.addEventListenersToButtons('.btn-favourite-delete', this.removeItemWishList);

        } catch (error) {
            // If there is an error, display the error message
            if (error) {
                const errorMsg = error;
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    createHistoryComments = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const comments = await Api.getCommentsbyUserId(user.id);
            this.appContainer.innerHTML = "";
            this.appContainer.innerHTML = navbarUserPage('historyComments');
            const bodyPage = document.querySelector('.bodyPage');
            bodyPage.innerHTML = createHistoryCommentsPage();
            const commentsHistoryRow = document.getElementById('comments-history-row');

            if (comments.error) {
                commentsHistoryRow.insertAdjacentHTML('beforeend', '<p>Non ci sono commenti per questo utente</p>');
            } else {
                comments.forEach(async comment => {
                    let itemName = await Api.getItemById(comment.idCommentItem);
                    let card = cardShowCommentsUser(comment, itemName.name);
                    commentsHistoryRow.insertAdjacentHTML('beforeend', card);
                    let btnUpdate = document.querySelector(`.btn-update-comment-${comment.id}`);
                    let btnRemove = document.querySelector(`.btn-remove-comment-${comment.id}`);
                    btnUpdate.addEventListener('click', this.updateComment);
                    btnRemove.addEventListener('click', this.removeComment);
                });
            }

        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    searchItems = async () => {
        try {
            this.appContainer.innerHTML = "";
            this.appContainer.innerHTML = createSearchItemTable();
            this.populateCategories();
            this.addEventListenersToButtons('.btn-searchButton', this.performSearch);

        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    searchComments = async () => {
        try {
            this.appContainer.innerHTML = "";
            this.appContainer.innerHTML = createSearchCommentTable();
            this.populateUsers();
            this.populateItems();

            this.addEventListenersToButtons('.btn-searchButtonComment', this.performSearchComment);

        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    populateCategories = async () => {

        let categories = await Api.getCategories();
        let select = document.getElementById('inputGroupSelect01');
        categories.forEach(category => {
            let option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.obj;
            select.appendChild(option);
        });

    }

    populateItems = async () => {

        let categories = await Api.getItems();
        let select = document.getElementById('inputGroupSelect01');
        categories.forEach(category => {
            let option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });

    }

    populateUsers = async () => {

        let users = await Api.getUsers(); // Fetch users from the API
        let select = document.getElementById('inputGroupSelectUsers');
        users.forEach(user => {
            let option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            select.appendChild(option);
        });
    }

    performSearch = async () => {
        let selectedCategory = parseInt((document.getElementById('inputGroupSelect01').value), 10);
        let priceRangeMin = 0;
        let priceRangeMax = parseInt((document.getElementById('customRange3').value), 10);

        try {
            const items = await Api.getSearchByCategoryAndPrice(selectedCategory, priceRangeMin, priceRangeMax);
            this.displayResultsItems(items);
        } catch (error) {
            if (error) {
                const errorMsg = error;
                // Add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    performSearchComment = async () => {
        let selectedUser = parseInt((document.getElementById('inputGroupSelectUsers').value), 10);
        let selectedItem = parseInt((document.getElementById('inputGroupSelect01').value), 10);
        let keyword = (document.getElementById('commentWordInput').value);

        try {
            if (selectedUser && selectedItem) {
                const comments = await Api.getCommentsbyUserIdandItemId(selectedUser, selectedItem);
                this.displayResultsComments(comments);
            } else if (selectedUser && !selectedItem) {
                const comments = await Api.getCommentsbyUserId(selectedUser);
                this.displayResultsComments(comments);
            } else if (selectedItem && !selectedUser) {
                const comments = await Api.getCommentsbyItemId(selectedItem);
                this.displayResultsComments(comments);
            } else if (keyword && !selectedUser && !selectedItem) {
                const comments = await Api.getCommentsbyKeyword(keyword);
                this.displayResultsComments(comments);
            }
        } catch (error) {
            if (error) {
                const errorMsg = error;
                // Add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    displayResultsItems = async (items) => {
        let resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.innerHTML = '';

        if (items.length === 0 || items.error) {
            resultsContainer.innerHTML = '<p>No items found.</p>';
            return;
        }

        items.forEach(item => {
            let card = createSearchItemCard(item);
            resultsContainer.insertAdjacentHTML('beforeend', card);
        });

    }

    displayResultsComments(comments) {
        let resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.innerHTML = '';

        if (comments.length === 0 || comments.error) {
            resultsContainer.innerHTML = '<p>No comments found.</p>';
            return;
        }

        comments.forEach(async comment => {
            let itemName = await Api.getItemById(comment.idCommentItem);
            let userName = await Api.getLoggedUser(comment.idCommentUser);
            let card = cardShowComment(comment, itemName.name, userName.name);
            resultsContainer.insertAdjacentHTML('beforeend', card);
        });

    }

}

export default App;

/** 
 *         const user = JSON.parse(localStorage.getItem('user'));
        const wishlist = await Api.getWishlistByUser(user.id);
 *             const productCard = document.querySelector(`#product-card-${item.id}`);

            if (wishlist.error) {
                productCard.insertAdjacentHTML('beforeend', addFollowButton(item.id));
            } else {
                const itemFound = wishlist.filter(itemWish => itemWish.idWishItem == item.id);
                if (itemFound.length > 0) {
                    productCard.insertAdjacentHTML('beforeend', removeFollowButton(item.id));
                    if (itemFound[0].visibility > 0) {
                        productCard.insertAdjacentHTML('beforeend', addPubIcon());
                    } else {
                        productCard.insertAdjacentHTML('beforeend', addPrvIcon());
                    }
                } else {
                    productCard.insertAdjacentHTML('beforeend', addFollowButton(item.id));
                }
            }

                    this.addEventListenersToButtons(".btn-comment-add", this.addComment.bind(this));
        this.addEventListenersToButtons(".btn-favourite-add", this.addItemWishList.bind(this));
        this.addEventListenersToButtons(".btn-favourite-remove", this.removeItemWishList.bind(this));
*/