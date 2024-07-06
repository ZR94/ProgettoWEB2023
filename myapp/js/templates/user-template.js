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
          <a class="nav-link text-dark ${active === 'delete' ? 'active' : ''}" ${active === 'delete' ? 'aria-current="page"' : ''} href="/delete">Delete account</a>
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
        <div class="col">
          <input type="text" class="form-control" placeholder="${user.name}" aria-label="${user.name}">
        </div>
        <div class="col">
          <input type="text" class="form-control" placeholder="${user.surname}" aria-label="${user.surname}">
        </div>
        <div class="col">
          <input type="text" class="form-control" placeholder="${user.email}" aria-label="${user.email}">
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
    <div class="container col-md-auto">
      <h5 class="offcanvas-title" id="offcanvasScrollingLabel">History Purchase</h5>

    </div>
  `;
}

function createTablePurchase() {
  return `
    <div class="row row-cols-1 row-cols-md-3 g-4" id="list">
          
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
  <div class="card mb-3" style="width: 12rem; height: 12rem;">
    <div class="">
      <h5 class="card-title fw-bold">${item.name}</h5>
      <p class="card-text">Price: $${item.price.toFixed(2)}</p>
      <p class="card-text">Quantity: ${qta}</p>
      <button type="button" class="btn btn-primary btn-comment-add" data-bs-toggle="modal" data-bs-target="#commentModal" value="${item.id}">Add Comment</button>
    </div>
  </div>
  `;
}

export { navbarUserPage, createUserPage, createWishlistPage, createCard, createHistoryPurchasePage, createCardPurchase, createTablePurchase };

