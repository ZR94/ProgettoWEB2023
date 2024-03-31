"use strict";

function createStoreTable() {
    return `
    <div class="row row-cols-1 row-cols-md-3 g-4" id="my-items">
        <div class="listProduct">
            <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" 
                data-bs-target="#offcanvasRight" aria-controls="offcanvasScrolling">Cart</button>

            <div class="offcanvas offcanvas-end" data-bs-scroll="true" data-bs-backdrop="false" 
                tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="offcanvasScrollingLabel">List cart</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    
                </div>
                <div class="offcanvas-body listCart">
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
            </div>
        </div>
    </div>
    `;
}

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