"use strict";

function createSearchItemTable() {
    return `
    <div class="container-fluid">
        <div class="row justify-content-center">

            <h4 id="searchTitle"> Ricerca Item </h4>
            <!-- Contenuto principale -->
            <div class="col-sm-8 col-12 ">

                <div class="row row-cols-1 row-cols-md-3 g-4" id="itemsList">


                    <div class="input-group mb-3">
                        <label class="input-group-text" for="inputGroupSelect01">Categoria</label>
                        <select class="form-select" id="inputGroupSelect01">
                            <option selected>Choose...</option>
                        </select>
                    </div>

                    <div class="input-group mb-3">
                        <label for="customRange3" class="form-label">Fascia Prezzo</label>
                        <input type="range" class="form-range" min="0" max="200" step="5" id="customRange3">
                    </div>

                    
                    <div class="col-12 text-center">
                        <button type="button" class="btn btn-primary btn-searchButton" id="searchButton">Cerca</button>
                    </div>
                </div>

            </div>
            <div id="resultsContainer"></div>
        </div>
    </div>
    `;
}

function createSearchCommentTable() {
    return `
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar a sinistra -->
            <aside class="col-sm-4 col-12 bg-light p-3" id="left-sidebar">
                <div class="mb-3">
                    <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" 
                    data-bs-target="#offcanvasRight" aria-controls="offcanvasScrolling">Cart</button>
                </div> 
                <div class="list-group list-group-flush border" >
                    <a href="#" data-id="all" class="list-group-item list-group-item-action active" aria-current="true">
                        <img src="./svg/list.svg" alt="tutti gli items nella wishlist"> Tutti</a>
                    <a href="#" data-id="favourities" class="list-group-item list-group-item-action">
                        <img src="./svg/exclamation-circle.svg" alt="Favourities"> Favourities</a>
                    <a href="#" data-id="private" class="list-group-item list-group-item-action">
                        <img src="./svg/eye-slash.svg" alt="visibilità privata"> Privati</a>
                    <a href="#" data-id="public" class="list-group-item list-group-item-action">
                        <img src="./svg/eye.svg" alt="visibilità pubblica"> Pubblici</a>
                </div>
                <div class="list-group list-group-flush border mt-2">
                    <span id="category" class="list-group-item dropdown">
                        <div class="dropdown">
                            <span class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="./svg/filter.svg" alt="filtro per catagoria"> Categorie
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

                <div class="row row-cols-1 row-cols-md-3 g-4" id="my-items"></div>

                <div class="listProduct">
                    <div class="offcanvas offcanvas-end" data-bs-scroll="true" data-bs-backdrop="false" 
                        tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
                        <div class="offcanvas-header">
                            <h5 class="offcanvas-title" id="offcanvasScrollingLabel">List cart</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div class="" id="checkout-form" > 

                            <div class="offcanvas-body listCart"></div>
                            
                            <div class="d-flex justify-content-center mb-3" id="checkoutBox">
                                <button class="btn btn-primary btn-checkout" type="button" value="">Checkout</button>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function createSearchItemPage() {
    return `
    <div class="container mt-5">
      <h3>Search Items</h3>
      <div class="row g-3" id="itemsList">
        <!-- Items will be inserted here by JS -->
      </div>
    </div>`;
}

function createSearchCommentPage() {
    return `
    <div class="container mt-5">
      <h3>Search Comments by User</h3>
      <div class="row g-3" id="usersList">
        <!-- Users will be inserted here by JS -->
      </div>
    </div>`;
}


export { createSearchItemTable, createSearchCommentTable, createSearchItemPage, createSearchCommentPage };