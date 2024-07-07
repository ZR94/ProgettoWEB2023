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
      </ul>
      <div class="container col-md-auto bodyPage">
      </div> 
    </div>
  `;
}

function createUserPage(user) {
  return `
    <div class="container col-md-auto containerUser">

      <div class="row g-3">
        <div class="col-md-4">
          <label for="user-name" class="form-label">Nome</label>
          <input type="text" class="form-control" id="user-name" placeholder="${user.name}" aria-label="${user.name}">
        </div>
        <div class="col-md-4">
          <label for="user-surname" class="form-label">Cognome</label>
          <input type="text" class="form-control" id="user-surname" placeholder="${user.surname}" aria-label="${user.surname}">
        </div>
        <div class="col-md-4">
          <label for="user-email" class="form-label">Email</label>
          <input type="email" class="form-control" id="user-email" placeholder="${user.email}" aria-label="${user.email}">
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

function createWishlistPage() {
  return `
    <div class="container col-md-auto">
      <h5 class="offcanvas-title" id="offcanvasScrollingLabel">Wishlist</h5>
      <div class="row row-cols-1 row-cols-md-3 g-4" id="list">
        
        <div class="table-responsive rounded-3 item-wishlist" id="item-wishlist">
          <table class="table table-striped m-0">
            <tbody>
              <!-- Le righe sono inserite da JS -->
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  `;
}

function createCard(item) {
  return `
  <div class="d-flex align-items-center mb-5">
      <div class="flex-shrink-0">
        <img src="${item.img}" class="img-fluid" style="width: 80px;" alt="Generic placeholder image">
      </div>
      <div class="float">
          <h5 class="align-items-center fw-bold">${item.name}</h5>
      </div>
  </div>
  `;
}

function createHistoryPurchasePage() {
  return `
  <div class="container">
  <h5 class="offcanvas-title" id="offcanvasScrollingLabel">History Purchase</h5>
  <div class="row" id="purchase-history-row">
    <!-- Le tabelle saranno inserite qui -->
  </div>
</div>
`;
}

function createTablePurchase() {
  return `
  <div class="col-md-4 mb-4">
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
  <div class="card mb-3" style="width: 12rem; height: 8rem;">
    <div class="">
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

export { navbarUserPage, createUserPage, createWishlistPage, createCard, createHistoryPurchasePage, createCardPurchase, createTablePurchase, createTotalRow };