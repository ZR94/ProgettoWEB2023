"use strict";


function navbarAdminPage(active) {
  return `
    <div class="container col-md-auto navbarAdmin">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link text-dark ${active === 'userPage' ? 'active' : ''}" ${active === 'userPage' ? 'aria-current="page"' : ''} href="/userPage" >Profilo</a>
        </li>
        <li class="nav-item" id="user-wishlist">
          <a class="nav-link text-dark ${active === 'users' ? 'active' : ''}" ${active === 'users' ? 'aria-current="page"' : ''} href="/users">Users</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-dark ${active === 'items' ? 'active' : ''}" ${active === 'items' ? 'aria-current="page"' : ''} href="/items">Items</a>
        </li>
      </ul>
      <div class="container col-md-auto bodyPage" id="adminContent"></div> 
    </div>
  `;
}

// Funzione per generare le schede admin
function createAdminProfile(user) {
  return `
    <div class="container mt-5 adminContainer">

        <h3>Profilo Personale</h3>
        <div id="adminProfile">
            <div class="row g-3">
                <div class="col-md-4">
                    <label for="user-name" class="form-label">Nome</label>
                    <input type="text" class="form-control" id="user-name" placeholder="${user.name}" aria-label="${user.name}" readonly>
                </div>
                <div class="col-md-4">
                    <label for="user-surname" class="form-label">Cognome</label>
                    <input type="text" class="form-control" id="user-surname" placeholder="${user.surname}" aria-label="${user.surname}" readonly>
                </div>
                <div class="col-md-4">
                    <label for="user-email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="user-email" placeholder="${user.email}" aria-label="${user.email}" readonly>
                </div>
                <div class="col-md-4">
                    <label for="birthdate" class="form-label">Data di nascita</label>
                    <input type="date" class="form-control" id="birthdate" aria-label="Data di nascita">
                </div>
                <div class="col-md-4">
                    <label for="address" class="form-label">Indirizzo</label>
                    <input type="text" class="form-control" id="address" placeholder="Indirizzo" aria-label="Indirizzo">
                </div>
                <div class="col-md-4">
                    <label for="city" class="form-label">Città</label>
                    <input type="text" class="form-control" id="city" placeholder="Città" aria-label="Città">
                </div>
                <div class="col-12 text-end">
                    <button type="button" class="btn btn-primary" id="saveButton">Salva</button>
                    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteAccountModal">
                    Elimina Account
                    </button>
                </div>
            </div>
      </div>
  
      <!-- Modal for confirming account deletion -->
      <div class="modal fade" id="deleteAccountModal" tabindex="-1" aria-labelledby="deleteAccountModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="deleteAccountModalLabel">Conferma eliminazione account</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              Sei sicuro di voler eliminare il tuo account? Questa azione non può essere annullata.
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
              <button type="button" class="btn btn-danger" id="confirmDeleteButton" data-bs-dismiss="modal">Sì, elimina il mio account</button>
            </div>
          </div>
        </div>
    </div>
  `;
}

function createUsersPage() {
    return `
        <div id="users" class="container mt-5 users">
            <h3>Gestione Utenti</h3>
            <div class="row g-3 justify-content-center usersList" id="usersList"></div>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#userModal" id="addUser">Aggiungi Utente</button>
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
                        <input type="text" class="form-control" required="" id="userName">
                    </div>
                    <div class="mb-3">
                        <label for="userSurname" class="form-label">Cognome</label>
                        <input type="text" class="form-control" required="" id="userSurname">
                    </div>
                    <div class="mb-3">
                        <label for="userEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" required="" id="userEmail">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" required="" id="password">
                    </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
                    <button type="button" class="btn btn-primary btn-user-add" id="saveUser" data-bs-dismiss="modal">Salva Utente</button>
                </div>
                </div>
            </div>
        </div>
    `;
}

function createItemsPage() {
    return `
        <div id="items" class="container mt-5 items">
            <h3>Gestione Items</h3>
            <div class="row g-3 justify-content-center itemsList" id="itemsList"></div>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#itemModal" id="addItem">Aggiungi Item</button>
        </div>

        <!-- Modal for Add Item -->
        <div class="modal fade" id="itemModal" tabindex="-1" aria-labelledby="itemModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="itemModalLabel">Aggiungi Item</h5>
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
                        <label for="itemCategory" class="form-label">Categoria</label>
                        <select class="form-select" id="itemCategory">
                            <!-- Le opzioni saranno popolate dinamicamente -->
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="itemImg" class="form-label">Link immagine</label>
                        <input type="text" class="form-control" id="itemImg">
                    </div>
                
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
                <button type="button" class="btn btn-primary btn-item-add" id="addItem" data-bs-dismiss="modal">Aggiungi Item</button>
            </div>
            </div>
        </div>
    `;
}

function loadUsers(user) {
    return `
        <div class="card col-md-4 mb-3 me-3" style="width: 18rem; height: 14rem;">
            <div class="card-body justify-content-center">
                <h5 class="card-title">${user.name} ${user.surname}</h5>
                <p class="card-text">${user.email}</p>
                <button class="btn btn-primary btn-sm btn-user-wishlist" data-bs-toggle="modal" data-bs-target="#userWishlistModal" value="${user.id}">Vedi Wishlist</button>
                <button class="btn btn-primary btn-sm btn-user-comments" data-bs-toggle="modal" data-bs-target="#userCommentsModal" value="${user.id}">Vedi Commenti</button>
                <button class="btn btn-danger btn-sm btn-user-delete" value="${user.id}">Elimina</button>
            </div>
        </div>

        <!-- Modal for Viewing User Comments -->
        <div class="modal fade" id="userCommentsModal" tabindex="-1" aria-labelledby="userCommentsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="userCommentsModalLabel">Commenti</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3 justify-content-center" id="commentsList"></div>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
                </div>
                </div>

            </div>
        </div>

        <!-- Modal for Viewing User Wishlist -->
        <div class="modal fade" id="userWishlistModal" tabindex="-1" aria-labelledby="userWishlistModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="userWishlistModalLabel">Wishlist</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3 justify-content-center" id="wishItemsList"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
                    </div>
                </div>
            </div>
        </div>


    `;
}

function loadItems(item) {
    return `
    <div class="card col-md-4 mb-3 me-3">
        <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">Prezzo: $${item.price}</p>
            <button class="btn btn-primary btn-sm btn-item-comments" data-bs-toggle="modal" data-bs-target="#userCommentsModal" value="${item.id}">Vedi Commenti</button>
            <button class="btn btn-danger btn-sm btn-item-delete" value="${item.id}">Elimina</button>
        </div>
    </div>

    <!-- Modal for Viewing User Comments -->
    <div class="modal fade" id="userCommentsModal" tabindex="-1" aria-labelledby="userCommentsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="userCommentsModalLabel">Commenti</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-3 justify-content-center" id="commentsList"></div>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
            </div>
            </div>

        </div>
    </div>

    `;
}

function cardShowComments(comment) {
    return `
    <div class="card col-md-4 mb-3 me-3">
        <div class="card-body">
            <p class="card-text">${comment.text}</p>
            <button class="btn btn-secondary btn-sm btn-update-comment" data-bs-toggle="modal" data-bs-target="#commentModal" data-id="${comment.id}">Modifica</button>
            <button class="btn btn-danger btn-sm btn-delete-comment" data-bs-dismiss="modal" data-id="${comment.id}">Elimina</button>
        </div>
    </div>

    <div class="modal fade" id="commentModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5 text-dark" id="exampleModalLabel">New comment</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label for="message-text" class="col-form-label">Comment:</label>
                        <textarea class="form-control" id="message-text"></textarea>
                    </div>
                </form>
            </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary btn-save-comment" id="btn-save-comment" data-bs-dismiss="modal">Salva</button>
                </div>
            </div>
        </div>
    </div>
    `;
}

function cardShowItems(item) {
    return `
    <div class="card col-md-4 mb-3 me-3">
        <div class="card-body">
            <p class="card-text">${item.name}</p>
            <img src="${item.img}" class="img-fluid" style="width: 80px;" alt="Generic placeholder image">
            <div class="float">
            <h5 class="align-items-center fw-bold">${item.name}</h5>
            </div>
            <button type="button" class="btn btn-danger btn-sm btn-favourite-delete" data-bs-dismiss="modal" id="unfollow-${item.id}" value="${item.id}">Elimina</button>
        </div>
    </div>
    `;
}

export { navbarAdminPage, createAdminProfile, createUsersPage, createItemsPage, loadUsers, loadItems, cardShowComments, cardShowItems };