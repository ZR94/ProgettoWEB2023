function createStoreTable() {
    return `
    <div class="row row-cols-1 row-cols-md-3 g-4">
        <div class="col">
        
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
            </div>
        </div>
    </div>

    `;
}

export {createStoreTable, createStoreCard};