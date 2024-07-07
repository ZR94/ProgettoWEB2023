"use strict";


function navbarAdminPage(active) {
  return `
    <div class="container col-md-auto navbarUser">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link text-dark ${active === 'userPage' ? 'active' : ''}" ${active === 'userPage' ? 'aria-current="page"' : ''} href="#" onclick="showTab('userPage')">Profilo</a>
        </li>
        <li class="nav-item" id="user-wishlist">
          <a class="nav-link text-dark ${active === 'users' ? 'active' : ''}" ${active === 'users' ? 'aria-current="page"' : ''} href="#" onclick="showTab('users')">Users</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-dark ${active === 'items' ? 'active' : ''}" ${active === 'items' ? 'aria-current="page"' : ''} href="#" onclick="showTab('items')">Items</a>
        </li>
      </ul>
      <div class="container col-md-auto bodyPage" id="adminContent">
      </div> 
    </div>
  `;
}

// Funzione per generare le schede admin
function createAdminTabs() {
  return `
    <div class="container mt-5">
      <div id="userPage" class="tab-pane fade">
        <h3>Profilo Personale</h3>
        <div id="adminProfile"></div>
        <button class="btn btn-primary" id="saveProfile">Salva Profilo</button>
      </div>
      <div id="users" class="tab-pane fade">
        <h3>Gestione Utenti</h3>
        <div id="userList"></div>
        <button class="btn btn-primary" id="addUser">Aggiungi Utente</button>
      </div>
      <div id="items" class="tab-pane fade">
        <h3>Gestione Items</h3>
        <div id="itemList"></div>
        <button class="btn btn-primary" id="addItem">Aggiungi Item</button>
      </div>
    </div>

    <!-- Modal for Add/Edit User -->
    <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="userModalLabel">Aggiungi/Modifica Utente</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="userForm">
              <div class="mb-3">
                <label for="userName" class="form-label">Nome</label>
                <input type="text" class="form-control" id="userName">
              </div>
              <div class="mb-3">
                <label for="userSurname" class="form-label">Cognome</label>
                <input type="text" class="form-control" id="userSurname">
              </div>
              <div class="mb-3">
                <label for="userEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="userEmail">
              </div>
              <!-- Add other fields as necessary -->
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
            <button type="button" class="btn btn-primary" id="saveUser">Salva Utente</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Add/Edit Item -->
    <div class="modal fade" id="itemModal" tabindex="-1" aria-labelledby="itemModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="itemModalLabel">Aggiungi/Modifica Item</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="itemForm">
              <div class="mb-3">
                <label for="itemName" class="form-label">Nome</label>
                <input type="text" class="form-control" id="itemName">
              </div>
              <div class="mb-3">
                <label for="itemPrice" class="form-label">Prezzo</label>
                <input type="number" class="form-control" id="itemPrice">
              </div>
              <div class="mb-3">
                <label for="itemQuantity" class="form-label">Quantità</label>
                <input type="number" class="form-control" id="itemQuantity">
              </div>
              <!-- Add other fields as necessary -->
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
            <button type="button" class="btn btn-primary" id="saveItem">Salva Item</button>
          </div>
        </div>
      </div>
    </div>
  `;
}


export { navbarAdminPage, createAdminTabs };

// Carica la navbar e le schede admin
document.getElementById('adminContainer').innerHTML = navbarAdminPage('userPage') + createAdminTabs();

// Funzione per mostrare le schede
function showTab(tabId) {
  document.querySelectorAll('.tab-pane').forEach(tab => {
    tab.classList.remove('show', 'active');
  });
  document.getElementById(tabId).classList.add('show', 'active');
}

// Carica i dati iniziali
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  loadItems();

  // Eventi per i pulsanti di salvataggio
  document.getElementById('saveProfile').addEventListener('click', saveProfile);
  document.getElementById('addUser').addEventListener('click', showUserModal);
  document.getElementById('saveUser').addEventListener('click', saveUser);
  document.getElementById('addItem').addEventListener('click', showItemModal);
  document.getElementById('saveItem').addEventListener('click', saveItem);
});

async function saveProfile() {
  // Logica per salvare il profilo admin
}

function showUserModal() {
  // Logica per mostrare la modale di aggiunta/modifica utente
  new bootstrap.Modal(document.getElementById('userModal')).show();
}

async function saveUser() {
  // Logica per salvare l'utente
}

function showItemModal() {
  // Logica per mostrare la modale di aggiunta/modifica item
  new bootstrap.Modal(document.getElementById('itemModal')).show();
}

async function saveItem() {
  const itemData = {
    name: document.getElementById('itemName').value,
    price: document.getElementById('itemPrice').value,
    quantity: document.getElementById('itemQuantity').value,
  };

  try {
    const response = await axios.post('/api/admin/items', itemData);
    alert('Item salvato con successo');
    loadItems();
    new bootstrap.Modal(document.getElementById('itemModal')).hide();
  } catch (error) {
    console.error('Errore durante il salvataggio dell\'item', error);
    alert('Errore durante il salvataggio dell\'item');
  }
}

async function viewWishlist(userId) {
  // Logica per visualizzare la wishlist dell'utente
}

async function viewComments(userId) {
  // Logica per visualizzare i commenti dell'utente
}

async function deleteUser(userId) {
  // Logica per eliminare l'utente
}

async function viewItemComments(itemId) {
  // Logica per visualizzare i commenti dell'item
}

async function deleteItem(itemId) {
  // Logica per eliminare l'item
}