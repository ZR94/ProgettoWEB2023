import Api from './api.js';
import {createLoginForm} from './templates/login-template.js';
import page from "//unpkg.com/page/page.mjs";


class App {

    constructor(appContainer) {
        // reference to the the exam container (HTML element)
        this.appContainer = appContainer;
        //this.logoutLink = document.querySelector('#logout');
        
        // client-side routing with Page.js
        page('/login', () => {
            this.appContainer.innerHTML = "";
            this.appContainer.innerHTML = createLoginForm();
            document.getElementById('login-form').addEventListener('submit', this.onLoginSubmitted);
        });
        
        // very simple example of how to handle a 404 Page Not Found 
        // page('*', () => this.appContainer.innerHTML = 'Page not found!');
        page();


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

}

export default App;