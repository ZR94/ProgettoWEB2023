"use strict";

function navbarUserPage(active) {
  return `
    <div class="container col-md-auto navbarUser">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link text-dark ${active === 'userPage' ? 'active' : ''}" ${active === 'userPage' ? 'aria-current="page"' : ''} href="/userPage">Profilo</a>
        </li>
        <li class="nav-item" id="user-wishlist">
          <a class="nav-link text-dark ${active === 'wishlist' ? 'active' : ''}" ${active === 'wishlist' ? 'aria-current="page"' : ''} href="/wishlist">WishList</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-dark ${active === 'history' ? 'active' : ''}" ${active === 'history' ? 'aria-current="page"' : ''} href="/history">Cronologia acquisti</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-dark ${active === 'historyComments' ? 'active' : ''}" ${active === 'historyComments' ? 'aria-current="page"' : ''} href="/historyComments">Commenti</a>
        </li>
      </ul>
      <div class="container col-md-auto bodyPage"></div> 
    </div>
  `;
}

function createUserPage(user) {
  return `
    <div class="container col-md-auto containerUser">

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
          <button type="button" class="btn btn-primary btn-save" id="saveButton">Salva</button>
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

function createWishlistPage() {
  return `
  <div class="container-fluid">
    <div class="row">
      <!-- Sidebar a sinistra -->
      <aside class="col-sm-4 col-12 bg-light p-3" id="left-sidebar">
          <div class="list-group list-group-flush border mt-2">
              <span id="users" class="list-group-item dropdown">
                  <div class="dropdown">
                      <span class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                          <img src="./svg/filter.svg" alt="filtro per utente"> Wishlist utenti
                      </span>
                      <ul class="dropdown-menu">
                          <!-- le varie voci (categorie) sono inserite da JS -->
                      </ul>
                  </div> 
              </span>
          </div>
      </aside>

      <!-- Contenuto principale -->
      <div class="col-sm-8 col-12">
        <h5 class="offcanvas-title mb-4" id="offcanvasScrollingLabel">Wishlist di <span id="userName"></span></h5>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4" id="wishlistBody">
          <!-- Gli elementi sono inseriti da JS -->
        </div>
      </div>
    </div>
  </div>
  `;
}


function createCard(item) {
  return `
  <div class="col-md-4 mb-4">
    <div class="card h-100 card-wishlist" id="${item.id}">
      <img src="${item.img}" class="card-img-top-wishlist" alt="${item.name}">
      <div class="card-body">
        <h5 class="card-title">${item.name}</h5>
        <p class="card-text"></p>
      </div>
      <div class="card-footer" id="product-card-${item.id}">
        <small class="text-body-secondary">Price: ${item.price}</small>
      </div>
      <div class="card-footer" id="product-card-${item.id}-footer">
        <!-- Additional content can be added here -->
      </div>
    </div>
  </div>
  `;
}


function createHistoryPurchasePage() {
  return `
  <div class="container">
  <h3 class="offcanvas-title" id="offcanvasScrollingLabel">History Purchase</h3>
  <div class="row" id="purchase-history-row">
    <!-- Le tabelle saranno inserite qui -->
  </div>
</div>
`;
}

function createTablePurchase() {
  return `
  <div class="col-md-4 mb-4 justify-content-center">
  <div class="table-responsive rounded-3 item-purchase" id="item-purchase">
    <table class="table table-striped m-0">
      <p class="card-text dateTime"></p>
      <tbody>
        <!-- Le righe sono inserite da JS -->
      </tbody>
    </table>
  </div>
</div>
`;
}

function createCardPurchase(item, qta) {
  return `
  <div class="card card-purchase mb-3">
    <div class="card-body">
      <h5 class="card-title fw-bold">${item.name}</h5>
      <p class="card-text">Price: $${item.price.toFixed(2)}</p>
      <p class="card-text">Quantity: ${qta}</p>
    </div>
  </div>
  `;
}

function createTotalRow(total) {
  return `
  <tr>
    <td colspan="3" class="text-first fw-bold">Total: $${total.toFixed(2)}</td>
  </tr>
  `;
}

function createHistoryCommentsPage() {
  return `

    <div class="container">

      <h3 class="offcanvas-title" id="offcanvasScrollingLabel">History Comments</h3>

        <!-- Contenuto principale -->
        <div class="row">
          <div class="row row-cols-1 row-cols-md-3 g-4 justify-content-center" id="comments-history-row">
            <!-- Le card saranno inserite qui -->
          </div>
          
        </div>

    </div>
 
  `;
}

function cardShowCommentsUser(comment, itemName) {
  return `
  <div class="card col-md-4 mb-3 me-3">
    <div class="card-body">
        <!-- Nome dell'oggetto (item) -->
        <h5 class="card-title">${itemName}</h5>
        
        <!-- Testo del commento -->
        <p class="card-text">${comment.text}</p>
        <button class="btn btn-secondary btn-sm btn-update-comment-${comment.id}" data-bs-toggle="modal" data-bs-dismiss="modal" data-bs-target="#commentModal-${comment.id}" data-id="${comment.id}">Modifica</button>
        <button class="btn btn-danger btn-sm btn-remove-comment-${comment.id}" data-bs-dismiss="modal" data-id="${comment.id}">Elimina</button>
    </div>
  </div>

  <div class="modal fade" id="commentModal-${comment.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                      <textarea class="form-control" id="message-text-${comment.id}"></textarea>
                  </div>
              </form>
          </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary btn-saveComment" id="saveComment" data-bs-dismiss="modal">Salva</button>
              </div>
          </div>
      </div>
  </div>
  `;
}

export { navbarUserPage, createUserPage, createWishlistPage, createCard, createHistoryPurchasePage, createCardPurchase, createTablePurchase, createTotalRow, createHistoryCommentsPage, cardShowCommentsUser };