"use strict";

import Api from './api.js';
import User from './user.js';
import Item from './item.js';
import Purchase from './purchase.js';
import Comment from './comment.js';
import { createLoginForm } from './templates/login-template.js';
import { createSignUpForm } from './templates/sign-template.js';
import { createHomeForm } from './templates/home-template.js';
import {
    navbarUserPage, createUserPage, createWishlistPage, createCard, createHistoryPurchasePage,
    createCardPurchase, createTablePurchase, createTotalRow, createHistoryCommentsPage, cardShowCommentsUser
} from './templates/user-template.js';
import { createStoreTable, createStoreCard, createCartCard, addFollowButton, removeFollowButton, addPubIcon, addPrvIcon } from './templates/store-template.js';
import { navbarAdminPage, createAdminProfile, createUsersPage, createItemsPage, loadUsers, loadItems, cardShowItems } from './templates/admin-template.js';
import { createSearchItemTable, createSearchCommentTable, cardShowComment, createSearchItemCard } from './templates/search-template.js';
import { createContactForm } from './templates/contact-template.js';
import { createPricingForm } from './templates/pricing-template.js';
import { createAlert } from './templates/alert-template.js';
import page from "//unpkg.com/page/page.mjs";

class App {

    /**
     * Constructor of the App class.
     * @param {HTMLElement} appContainer - The element that will contain the application.
     */
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
                this.appContainer.innerHTML = this.userPersonalPage();
            }

        });

        page('/wishlist', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser != null) {
                this.appContainer.innerHTML = this.userWishListPage();
            }
        });

        page('/history', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser != null) {
                this.appContainer.innerHTML = this.historyPurchasePage();
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
                this.appContainer.innerHTML = this.adminUsersPage();
            }
        });

        page('/items', () => {
            this.loggedUser = JSON.parse(localStorage.getItem('user'));
            if (this.loggedUser != null) {
                this.appContainer.innerHTML = this.adminItemsPage();
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
     * @param {Event} event - The event object of the form submission
     */
    onLoginSubmitted = async (event) => {
        event.preventDefault();
        const form = event.target;

        try {
            // Call the login API and get the user object
            const user = await Api.doLogin(form.email.value, form.password.value);
            // Save the user in the local storage
            localStorage.setItem('user', JSON.stringify(user));
            // Show a success alert message with the welcome message
            this.showAlertMessage('success', `Welcome ${user.name}!`);
            // Redirect to the store page
            page.redirect('/store');

        } catch (error) {
            // Show an error alert message with the error message
            if (error) {
                const errorMsg = error;
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


        // extract form data
        const userName = form.validationCustom01.value;
        const userSurname = form.validationCustom02.value;
        const userEmail = form.validationCustomUsername.value;
        const userPassword = form.validationCustomPassword.value;
        const adminCheck = form.adminCheck.checked;

        // create user object
        const user = new User(userName, userSurname, userEmail, userPassword);

        // set admin property
        if (adminCheck) {
            user.admin = 1;
        }
        try {
            // make API call to signup
            const response = await Api.doSignUp(user);

            if (response.success) {
                this.showAlertMessage('success', response.message);
                page.redirect('/login');
            }
        } catch (error) {
            if (Array.isArray(error)) {
                error.forEach(err => {
                    this.showAlertMessage('danger', err.msg);
                });
            } else {

                this.showAlertMessage('danger', error.toString());
            }
        }
    }

    /**
    * Perform the logout
    */
    logout = async () => {
        try {
            await Api.doLogout();
            this.logoutLink.classList.add('invisible');
            this.loginLink.innerHTML = "";
            this.loginLink.innerHTML = '<a class="nav-link" href="/login">Login | Register</a>';
            this.loggedUser = null;
            localStorage.removeItem('user');
            page.redirect('/login');
        } catch (error) {
            if (error) {
                const errorMsg = error;
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    //------------- USER ------------

    /**
     * Renders the personal user page with the user's information.
     * If the user is an admin, it renders the admin user page.
     * If there's an error, it redirects to the main page.
     *
     * @returns {Promise<void>} Promise that resolves when the page is rendered
     */
    userPersonalPage = async () => {

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

            ['birthdate', 'address', 'city'].forEach(field => {
                if (userLog[field]) {
                    document.getElementById(field).value = userLog[field];
                }
            });

            // Add event listeners
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
     * Create the user's wishlist page.
     *
     * @returns {Promise<void>}
     */
    userWishListPage = async () => {

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const wishlist = await Api.getWishlistByUser(user.id);
            let userAdmin = await Api.getLoggedUser(user.id);

            if(userAdmin.admin === 1){
                this.appContainer.innerHTML = "";
                this.appContainer.innerHTML = navbarAdminPage('wishlist');
            } else {
                this.appContainer.innerHTML = "";
                this.appContainer.innerHTML = navbarUserPage('wishlist');
            }
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

    /**
     * Create the user's purchase history page.
     *
     * @returns {Promise<void>} Promise that resolves when the page is rendered
     */
    historyPurchasePage = async () => {

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const history = await Api.getHistoryPurchase(user.id);
            let userAdmin = await Api.getLoggedUser(user.id);

            if(userAdmin.admin === 1){
                this.appContainer.innerHTML = "";
                this.appContainer.innerHTML = navbarAdminPage('history');
            } else {
                this.appContainer.innerHTML = "";
                this.appContainer.innerHTML = navbarUserPage('history');
            }
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

                // Assegna una classe univoca al td
                td.classList.add('no-purchase-message');

                td.innerHTML = "Nessun acquisto ancora effettuato";
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
    
    /**
     * Handle the click event on the "Comment" button in the User page.
     * This function sets up the modal for adding a new comment and
     * updates the title and input field of the modal with the
     * recipient user's name.
     */
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

    /**
     * Handle the click event on the "Save" button in the User page.
     * This function gets the values of the form fields and sends them
     * to the server to save the user's information.
     */
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

    /**
     * Handle the click event on the "Delete Account" button in the User page.
     * This function gets the user's ID from the localStorage and sends it to the server to delete the user's account.
     */
    onClickDeleteAccount = async () => {

        try {
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
        } catch (error) {
            this.showAlertMessage('danger', error);
        }
    }

    //------------- ADMIN ------------

    /**
     * Creates the admin users page.
     *
     * @returns {Promise<void>} Promise that resolves when the page is rendered
     */
    adminUsersPage = async () => {
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

    /**
     * Create the admin items page.
     *
     * @returns {Promise<void>} Promise that resolves when the page is rendered 
     */
    adminItemsPage = async () => {
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
                categorySelect.innerHTML = '';

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
     * Handle the click event on the "Delete Item" button in the Admin page.
     * This function gets the item's ID from the button's value and sends it to the server to delete the item.
     * @param {Event} event - The click event on the button.
     */
    onClickDeleteItem = async (event) => {
        try {
            event.preventDefault();
            const itemId = parseInt(event.target.value);
            const response = await Api.removeItem(itemId);

            if (response.success) {
                this.showAlertMessage('success', response.message);
                this.adminItemsPage();
            } else {
                this.showAlertMessage('danger', 'Errore durante l\'eliminazione dell\'item. Si prega di riprovare.');
            }
        } catch (error) {
            this.showAlertMessage('danger', error);
        }

    }

    /**
     * Handle the click event on the "Add Item" button in the Admin page.
     * This function gets the item's details from the form and sends it to the server to add the item.
     * @param {Event} event - The click event on the button.
     */
    onClickAddItem = async (event) => {
        event.preventDefault();

        try {
            const itemName = document.getElementById('itemName').value;
            const itemPrice = parseFloat(document.getElementById('itemPrice').value);
            const itemCategory = parseFloat(document.getElementById('itemCategory').value);
            const itemImg = document.getElementById('itemImg').value;

            const item = new Item(itemPrice, itemName, itemCategory, itemImg);

            const response = await Api.addItem(item);
            if (response.success) {
                this.showAlertMessage("success", response.message);
                this.adminItemsPage();
            } else {
                this.showAlertMessage("danger", "Errore durante l'inserimento dell'item. Si prega di riprovare.");
            }
        } catch (error) {
            this.showAlertMessage("danger", "Errore durante l'inserimento dell'item. Si prega di riprovare.");
        }
    }

    /**
     * Handle the click event on the "Add User" button in the Admin page.
     * This function gets the user's details from the form and sends it to the server to add the user.
     * @param {Event} event - The click event on the button.
     */
    onClickAddUser = async (event) => {
        event.preventDefault();

        try {
            const userName = document.getElementById('userName').value;
            const userSurname = document.getElementById('userSurname').value;
            const userEmail = document.getElementById('userEmail').value;
            const password = document.getElementById('password').value;

            if (!userName || !userSurname || !userEmail || !password) {
                throw new Error('Tutti i campi sono obbligatori.');
            }
            const user = new User(userName, userSurname, userEmail, password);

            const response = await Api.doSignUp(user);
            if (response.success) {
                this.showAlertMessage('success', response.message);
                this.adminUsersPage();
            } else {
                this.showAlertMessage('danger', 'Errore durante l\'aggiunta dell\'user. Si prega di riprovare.');
            }
        } catch (error) {
            this.showAlertMessage('danger', error);
        }

    }

    /**
     * Handle the click event on the "Delete User" button in the Admin page.
     * This function gets the user's ID from the button and sends it to the server to delete the user.
     * @param {Event} event - The click event on the button.
     */
    onClickDeleteUser = async (event) => {
        event.preventDefault();

        try {
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
                this.adminUsersPage();
            }

        } catch (error) {
            this.showAlertMessage('danger', error.message || 'Errore durante l\'eliminazione dell\'user. Si prega di riprovare.');
        }
    }

    //------------- WISHLIST -------------

    /**
     * Insert the items in the wishlist into the page.
     *
     * @param {Array} wishlist The wishlist array, containing the items.
     * @returns {Promise<void>} Promise that resolves when the page is rendered
     */
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
     * Add an item to the user's wishlist
     * @param {Event} event - The event that triggered the function
     */
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

                // Find the specific card of the item
                const card = document.getElementById(itemId);
                if (card) {

                    // Update the "Add to favourites" button with a remove button
                    const followButton = card.querySelector('.btn-favourite-add');
                    followButton.outerHTML = removeFollowButton(itemId);

                    // Add the visibility icon
                    const visibilityIcon = (visibility == 1) ? addPubIcon() : addPrvIcon();
                    card.querySelector('.card-footer-price').insertAdjacentHTML('afterbegin', visibilityIcon);

                    // Add the event listeners to the new button
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
     * Remove an item from the wishlist of the current user.
     * @param {*} event The click event.
     */
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
     * Populates the categories dropdown menu with the list of all users' names.
     * Adds event listeners to handle user clicks in the dropdown menu.
     * 
     * This function uses the `getUsers` method to retrieve the list of all users
     * from the server, and then iterates over the list to create the menu items.
     * The `createFiltersByCategory` method is called to add event listeners to the
     * menu items.
     * 
     * @return {Promise<void>}
     */
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

    /**
     * Handles the click event on a user link in the left sidebar.
     * @param {Event} event - The click event object.
     */
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

    /**
     * Shows the wishlist of a user.
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

    //------------- STORE -------------

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
        try {
            const storeTable = document.querySelector('#my-items');
            storeTable.innerHTML = "";

            this.updateCartHtml();
            this.updateStoreHTML(items, storeTable);
        } catch (error) {
            this.showAlertMessage('danger', error);
        }
    }

    /**
     * Handles the click event when the "Checkout" button is clicked.
     * Retrieves the items in the user's cart, creates a new purchase object for each item and sends the purchase request to the server.
     * If the checkout is successful, it removes the user's cart from local storage and updates the cart icon in the UI.
     * @return {Promise<void>} - A promise that resolves when the checkout is completed.
     */
    onClickCheckout = async () => {

        try {
            const user = JSON.parse(localStorage.getItem('user')); // Recupera l'utente corrente
            if (!user) {
                console.error("User not found. Please log in.");
                return;
            }

            const cartKey = `cart_${user.id}`;
            this.itemCart = JSON.parse(localStorage.getItem(cartKey)) || {}; // Carica il carrello specifico dell'utente

            const listPurchase = [];
            const dateTime = moment().format("DD/MM/YYYY HH:mm:ss");

            // Itera attraverso gli elementi del carrello e crea l'ordine di acquisto
            Object.values(this.itemCart).forEach(item => {
                if (item) {
                    const itemId = item.id;
                    const itemQuantity = item.quantity;
                    const itemPrice = item.price;

                    let addPurchase = new Purchase(user.id, itemId, itemQuantity, itemPrice, dateTime);
                    listPurchase.push(addPurchase);
                }
            });

            // Effettua il checkout tramite l'API
            const response = await Api.doCheckout(listPurchase);
            if (response) {
                localStorage.removeItem(cartKey); // Rimuove il carrello specifico dell'utente
                this.showAlertMessage('success', response.message); // Mostra un messaggio di successo
                this.updateCartHtml(); // Aggiorna l'interfaccia utente del carrello
            }
        } catch (error) {
            console.error(error); // Log dell'errore per il debug
            this.showAlertMessage('danger', 'An error occurred during checkout. Please try again.'); // Messaggio di errore per l'utente
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

    /**
     * Handles the click event when the "Private" button is clicked.
     * Retrieves the private wishlist items for the logged-in user and updates the store table in the UI.
     *
     * @return {Promise<void>} - A promise that resolves when the store table is updated.
     */
    onClickPrivate = async () => {

        try {
            // Retrieve the logged-in user from local storage
            const user = JSON.parse(localStorage.getItem('user'));

            // Retrieve the private wishlist items for the user
            const wishlist = await Api.getWishlistByUser(user.id);

            // Get the store table element from the UI
            const storeTable = document.querySelector('#my-items');

            // Clear the store table before updating it
            storeTable.innerHTML = "";

            // Create an empty array to store the private wishlist items
            const itemWishlist = [];

            // Iterate over each wishlist item
            for (let item of wishlist) {
                // Check if the item is private
                if (item.visibility === 0) {
                    // Retrieve the item details by its ID
                    const itemWish = await Api.getItemById(item.idWishItem);

                    // Add the item to the private wishlist array
                    itemWishlist.push(itemWish);
                }
            }

            // Update the cart HTML to reflect any changes in the cart
            this.updateCartHtml();

            // Update the store table HTML with the private wishlist items
            this.updateStoreHTML(itemWishlist, storeTable);

        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    /**
     * Handle the click event on the "Public" button in the User page.
     * This function retrieves the public wishlist items for the user
     * and updates the store table in the UI.
     */
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

    /**
     * Updates the HTML of the store page with the given items.
     * Also adds the "Add to Cart" and "Add to Wishlist" buttons to each item.
     * @param {Array} items - The array of items to display in the store.
     * @param {HTMLElement} storeTable - The table element where the items will be displayed.
     */
    updateStoreHTML = async (items, storeTable) => {
        try {
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

        } catch (error) {
            this.showAlertMessage('danger', error.message || 'Si è verificato un errore durante l\'aggiornamento del negozio.');
        }
    }

    /**
     * Add selected item at list cart
     * @param {*} items 
     */
    addCart = async (event) => {
        event.preventDefault();

        try {
            const itemId = event.target.value;
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                this.showAlertMessage('danger', 'Please log in to add items to your cart.');
                return;
            }

            const cartKey = `cart_${user.id}`;
            this.itemCart = JSON.parse(localStorage.getItem(cartKey)) || {};

            const items = await Api.getItems();
            if (!this.itemCart[itemId]) {
                this.itemCart[itemId] = items.filter(product => product.id == itemId)[0];
                this.itemCart[itemId].quantity = 1;
            } else {
                this.itemCart[itemId].quantity++;
            }
            this.showAlertMessage('success', 'Item added to cart');
            localStorage.setItem(cartKey, JSON.stringify(this.itemCart));
            this.updateCartHtml();
        } catch (error) {
            this.showAlertMessage('danger', 'An error occurred while adding the item to your cart. Please try again.');
            page.redirect('/');
        }
    }

    /**
     * Update cart with item added at the cart in the HTML
     */
    updateCartHtml = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user')); // Assicurati che l'utente sia già memorizzato nel localStorage
            if (!user) {
                console.error("User not found. Please log in.");
                return;
            }

            const cartKey = `cart_${user.id}`;
            this.itemCart = JSON.parse(localStorage.getItem(cartKey)) || {}; // Carica il carrello specifico dell'utente

            const listCart = document.querySelector('.listCart');
            listCart.innerHTML = '';
            if (this.itemCart) {
                Object.values(this.itemCart).forEach(x => {
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
        } catch (error) {
            this.showAlertMessage('danger', 'An error occurred while updating your cart. Please try again.');
        }
    }

    /**
     * Change quantity of the item in the cart, if the quantity is less of 0, 
     * the item is deleted
     * @param {*} event 
     */
    changeQntCart = async (event) => {

        event.preventDefault();

        try {
            const itemId = event.target.value;
            const btnType = event.target.name;

            const user = JSON.parse(localStorage.getItem('user')); // Recupera l'utente corrente
            if (!user) {
                this.showAlertMessage('danger', 'Please log in to update your cart.');
                return;
            }

            const cartKey = `cart_${user.id}`;
            this.itemCart = JSON.parse(localStorage.getItem(cartKey)) || {}; // Carica il carrello specifico dell'utente

            if (this.itemCart[itemId]) {
                if (btnType === '+') {
                    this.itemCart[itemId].quantity++;
                } else if (btnType === '-') {
                    this.itemCart[itemId].quantity--;
                    if (this.itemCart[itemId].quantity <= 0) {
                        delete this.itemCart[itemId];
                    }
                }
            } else {
                throw new Error("Item not found in cart.");
            }

            localStorage.setItem(cartKey, JSON.stringify(this.itemCart)); // Salva il carrello aggiornato
            this.updateCartHtml(); // Aggiorna l'HTML del carrello
        } catch (error) {
            this.showAlertMessage('danger', error.message || 'An error occurred while updating your cart. Please try again.');
        }
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
        try {
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
        } catch (error) {
            this.showAlertMessage('danger', 'Si è verificato un errore durante la gestione dei filtri. Si prega di riprovare.');
        }
    }

    /**
     * Retrieves the list of all categories from the server.
     * 
     * @return {Promise<string[]>} A promise that resolves to an array of category names.
     */
    getTypes = async () => {
        try {
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
        } catch (error) {
            this.showAlertMessage('danger', 'Si è verificato un errore durante il recupero delle categorie. Si prega di riprovare.');
        }
    }

    /**
     * Populates the categories dropdown menu with the list of item categories.
     * Adds event listeners to handle category clicks in the dropdown menu.
     * 
     * This function uses the `getTypes` method to retrieve the list of all categories
     * from the server, and then iterates over the list to create the menu items.
     * The `createFiltersByCategory` and `createFiltersByTitle` methods are called
     * to add event listeners to the menu items.
     * 
     * @return {Promise<void>}
     */
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

    /**
     * Adds event listeners to handle category clicks in the dropdown menu.
     * 
     * This function iterates over all the `li` elements in the `leftSidebar` element.
     * For each of them, it adds a click event listener that calls the callback function
     * with the click event as argument.
     * 
     * @param {function} fun - The callback function to be called when a category is clicked.
     */
    createFiltersByCategory(fun) {
        const leftSidebar = document.querySelector("#left-sidebar");

        const categoryLinks = leftSidebar.querySelectorAll('.dropdown-menu a');

        categoryLinks.forEach(cat => { cat.addEventListener('click', fun) });
    }

    /**
     * Adds event listeners to each title in the list group of the left sidebar.
     * Handles the click event to filter movies by the selected title.
     */
    createFiltersByTitle() {
        const leftSidebar = document.querySelector("#left-sidebar");

        const categoryLinks = leftSidebar.querySelectorAll('.list-group a');

        categoryLinks.forEach(cat => { cat.addEventListener('click', this.titleClick) });
    }

    /**
     * Returns an array of integers representing the IDs of the cards in the page.
     * The IDs are obtained from the elements with class "card h-100" inside the element with id "my-items".
     * The IDs are converted from strings to integers using the parseInt function.
     * @returns {number[]} - an array of integers representing the IDs of the cards in the page
     */
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

    /**
     * Handles the click event on a category link in the left sidebar.
     * @param {Event} event - The click event object.
     */
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

    /**
     * Handles the click event on a category link in the left sidebar.
     * @param {Event} event - The click event object.
     */
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

    /**
     * Updates the active category state in the sidebar.
     * @param {string} filterCat - The category to be marked as active.
     */
    updateActiveCategory(filterCat) {
        let dd_menu = document.querySelector(".dropdown-menu");
        dd_menu.querySelector('a.active').classList.remove('active');
        dd_menu.querySelector(`a[data-id="${filterCat}"`).classList.add('active');
    }

    //------------- COMMENT ------------

    /**
     * Handles the click event on the "Add comment" button.
     * @param {Event} event - The event object.
     */
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

    /**
     * Handles the click event on the "Remove comment" button.
     * @param {Event} event - The event object.
     */
    removeComment = async (event) => {
        event.preventDefault();
        const commentId = parseInt(event.target.dataset.id, 10);

        try {
            const response = await Api.removeComment(commentId);
            if (response.success) {
                this.showAlertMessage('success', response.message);

                // Rimuovi la card del commento eliminato dal DOM
                const commentCard = event.target.closest('.card');
                if (commentCard) {
                    commentCard.remove();
                }
            }
        } catch (error) {
            if (error) {
                const errorMsg = error;
                // Aggiungi un messaggio di alert nel DOM in caso di errore
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    /**
     * Handles the click event on the "Update comment" button.
     * This method will show a modal to the user to input the new text for the comment.
     * After the user inputs the text, it will send a request to the server to update the comment.
     * If the request is successful, it will update the comment text in the DOM and show a success message to the user.
     * @param {Event} event - The event object.
     */
    updateComment = async (event) => {
        event.preventDefault();
        const commentId = parseInt(event.target.dataset.id, 10);

        try {
            // Ottieni il testo del commento aggiornato dall'utente tramite il modale
            const text = await this.showModalAndGetText(commentId);

            // Invia il commento aggiornato al server tramite l'API
            const response = await Api.updateComment(text, commentId);

            if (response.success) {
                // Mostra un messaggio di successo all'utente
                this.showAlertMessage('success', response.message);

                // Trova l'elemento del commento nel DOM
                const commentElement = document.querySelector(`.card-text-${commentId}`);

                if (commentElement) {
                    // Aggiorna il testo del commento nel DOM
                    commentElement.textContent = text;
                } else {
                    // Se non si trova l'elemento nel DOM, aggiorna la cronologia dei commenti
                    this.createHistoryComments();
                }
            }

        } catch (error) {
            if (error) {
                // Mostra un messaggio di errore se qualcosa va storto
                const errorMsg = error;
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    /**
     * Shows the comments of a user in the page.
     * @param {Event} event - The event object.
     */
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

    /**
     * Shows the comments of an item in the page.
     * @param {Event} event - The event object.
     */
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

    /**
     * This function is used to display the user's history of comments made
     * @returns {Promise<void>}
     */
    createHistoryComments = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const comments = await Api.getCommentsbyUserId(user.id);
            let userAdmin = await Api.getLoggedUser(user.id);

            if(userAdmin.admin === 1){
                this.appContainer.innerHTML = "";
                this.appContainer.innerHTML = navbarAdminPage('historyComments');
            } else {
                this.appContainer.innerHTML = "";
                this.appContainer.innerHTML = navbarUserPage('historyComments');
            }

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

    //------------- SEARCH ------------

    /**
     * This function is used to display the search form for items.
     * @returns {Promise<void>}
     */
    searchItems = async () => {
        try {
            this.appContainer.innerHTML = "";
            this.appContainer.innerHTML = createSearchItemTable();
            this.populateCategories();
            this.addEventListenersToButtons('.btn-searchButton', this.performSearchItem);

        } catch (error) {
            if (error) {
                const errorMsg = error;
                // add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
            }
        }
    }

    /**
     * This function is used to display the search form for comments.
     * It populates the form with the list of users and items, and adds
     * event listeners to the buttons.
     * @returns {Promise<void>}
     */
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

    /**
     * Populate the select element with the list of categories.
     * @returns {Promise<void>}
     */
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

    /**
     * Populate the select element with the list of items.
     * @returns {Promise<void>}
     */
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

    /**
     * Populate the select element with the list of users.
     * @returns {Promise<void>}
     */
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

    /**
     * Perform a search of items by category and price range.
     * @returns {Promise<void>}
     */
    performSearchItem = async () => {
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
                page.redirect('/login');
            }
        }
    }

    /**
     * Perform a search of comments by user, item, or keyword.
     * If all fields are empty, the function does nothing.
     * @returns {Promise<void>}
     */
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
            } else {
                this.showAlertMessage('danger', 'Per favore, seleziona un utente, un item o una inserire una keyword');
            }
        } catch (error) {
            if (error) {
                const errorMsg = error;
                // Add an alert message in DOM
                this.showAlertMessage('danger', errorMsg);
                page.redirect('/login');
            }
        }
    }

    /**
     * Display the results of a search in the page.
     * If the search has no results, a message is shown.
     * @param {Array<Object>} items - the array of items to show
     * @returns {Promise<void>}
     */
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

    /**
     * Display the results of a search in the page.
     * If the search has no results, a message is shown.
     * @param {Array<Object>} comments - the array of comments to show
     * @returns {Promise<void>}
     */
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

    //------------- OTHER ------------

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
            saveButton.onclick = function () {
                try {
                    const visibility = parseInt(modal.querySelector('input[name="visibilityOptions"]:checked').value, 10);
                    resolve(visibility);
                } catch (error) {
                    reject('Non si è selezionata la visibilità. Prego riprovare.');
                }
            };
        });
    }

    /**
     * Shows a modal dialog to get the comment text from the user.
     * @param {number} itemId - The ID of the item for which the comment is being added.
     * @returns {Promise<string>} - A promise that resolves with the comment text entered by the user.
     */
    showModalAndGetText = (itemId) => {
        return new Promise((resolve, reject) => {
            const modalId = `#commentModal-${itemId}`;
            const modal = document.querySelector(modalId);
            const messageText = document.getElementById(`message-text-${itemId}`);

            // Quando l'utente clicca su "Save choice", risolvi la Promise con la scelta dell'utente
            const saveButton = modal.querySelector('.btn-saveComment');
            saveButton.onclick = function () {
                try {
                    const text = messageText.value;
                    resolve(text);
                } catch (error) {
                    reject('Non è stato aggiunto il teste del commento. Prego riprovare.');
                }
            };
        });
    }

    /**
     * Adds click event listeners to buttons.
     * @param {string} buttonClass - The class name of the buttons to add event listeners to.
     * @param {function} event - The function to call when a button is clicked.
     */
    addEventListenersToButtons(buttonClass, event) {

        try {
            const buttons = document.querySelectorAll(buttonClass);
            for (const btn of buttons) {
                btn.addEventListener("click", event);
            }
        } catch (error) {
            this.showAlertMessage('danger', error.message || 'Errore durante l\'aggiunta degli event listener ai pulsanti.');
        }
    }

    /**
     * Returns the HTML string for the public icon.
     * @return {string} - The HTML string for the public icon.
     */
    static pubIcon() {
        return `<img src='./svg/eye.svg' alt='visibilità pubblica'>`
    }

    /**
     * Render the navbar and show the logout link
     */
    renderNavBar = (active) => {
        try {
            if (!this.loginLink || !this.logoutLink) {
                throw new Error('Elementi loginLink o logoutLink mancanti');
            }
            this.loginLink.innerHTML = "";
            this.loginLink.innerHTML = '<a class="nav-link" href="/userPage">' + `${active}` + '</a>';
            this.logoutLink.classList.remove('invisible');
        } catch (error) {
            this.showAlertMessage('danger', error);
        }
    }

}

export default App;