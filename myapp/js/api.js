import Item from './item.js';

class Api {

    /**
     * Perform the login
     */
    static doLogin = async (username, password) => {
        let response = await fetch('/api/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });
        if(response.ok) {
            const username = await response.json();
            return username;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.message;
            }
            catch(err) {
                throw err;
            }
        }
    }

    /**
     * Get the list of items store
     */
    static getItems = async () => {
        let response = await fetch('/api/items');
        const itemsJson = await response.json();
        if (response.ok) {
            return itemsJson.map((it) => Item.from(it));
        } else {
            throw itemsJson;  // an object with the error coming from the server
        }
    }
}

export default Api;