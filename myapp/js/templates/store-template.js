"use strict";

function createStoreTable() {
    return `
    <div class="row row-cols-1 row-cols-md-3 g-4" id="my-items">
        <div class="listProduct">
            <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" data-bs-target="#offcanvasRight" aria-controls="offcanvasScrolling">Chart</button>

            <div class="offcanvas offcanvas-end" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
                <div class="offcanvas-header list-cart">
                    <h5 class="offcanvas-title" id="offcanvasScrollingLabel">List chart</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <p>Qui vanno gli articoli</p>
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
            <div class="card-footer">
                <small class="text-body-secondary">${item.price}</small>
                <button class="btn btn-primary" type="submit">Add</button>
            </div>
        </div>
    </div>
    `;
}

export {createStoreTable, createStoreCard};
