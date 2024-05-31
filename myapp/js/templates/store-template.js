"use strict";

function createStoreTable() {
    return `
    <div class="row row-cols-1 row-cols-md-3 g-4">

        <div class="col align-items-center">
            <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" 
            data-bs-target="#offcanvasRight" aria-controls="offcanvasScrolling">Cart</button>
        </div>

        <div class="row row-cols-1 row-cols-md-3 g-4" id="my-items">

        </div>
        
        <div class="listProduct">
            
            <div class="offcanvas offcanvas-end" data-bs-scroll="true" data-bs-backdrop="false" 
                tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="offcanvasScrollingLabel">List cart</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>               
                <div class="offcanvas-body listCart">
                </div>
                <div class="" id="checkoutBox">
                    <button class="btn btn-primary btn-add" type="button" value="">Checkout</button>
                </div>
            </div>

        </div>

    </div>
    `;
}

function createStoreCard(item) {
    return `
    <div class="col">
        <div class="card h-100">
                <img src="${item.img}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text"></p>
            </div>
            <div class="card-footer" id= "product-card">
                <small class="text-body-secondary">${item.price}</small>
                <button class="btn btn-primary btn-add" type="button" value="${item.id}">Add</button>

                <button type="button" class="btn btn-primary btn-favourite-add" id="follow" value="${item.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"></path>
                    </svg>
                </button>

                <button type="button" class="btn btn-primary btn-favourite-remove invisible" id="unfollow" value="${item.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"></path>
                    </svg>
                </button>
            </div>

        </div>
    </div>
    `;
}

/*

*/

function createCartCard(item, quantity) {
    return `
    <div class="d-flex align-items-center mb-5">
        <div class="flex-shrink-0">
        <img src="${item.img}" class="img-fluid" style="width: 80px;" alt="Generic placeholder image">
            <p class="align-items-center fw-bold">$ ${item.price}</p>
        </div>
        <div class="float">
            <h5 class="align-items-center fw-bold">${item.name}</h5>
            <div class="d-flex flex-sm-column mb-3">
                <div class="def-number-input number-input safari_only">
                    <button name="-" value="${item.id}" class="minus btn btn-primary btn-sm btnQnt"> - </button>
                    <span class="value">${quantity}</span>
                    <button name="+" value="${item.id}" class="plus btn btn-primary btn-sm btnQnt"> + </button>
                </div>
            </div>
        </div>
    
    </div>
    `;
}

export {createStoreTable, createStoreCard, createCartCard};