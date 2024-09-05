"use strict";

function createSearchItemTable() {
    return `
        <div class="container-fluid">
            <div class="row justify-content-center">

                <!-- Titolo centrale -->
                <div class="col-12 text-center">
                    <h2 id="searchTitle">Ricerca Item</h2>
                </div>

                <!-- Contenuto principale centrato e con margini ridotti -->
                <div class="col-lg-8 col-md-10 col-sm-10 col-12 mx-auto">

                    <div class="row g-4" id="itemsList">
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

                        <div class="col-12 text-center mb-4">
                            <button type="button" class="btn btn-primary btn-searchButton" id="searchButton">Cerca</button>
                        </div>
                    </div>

                </div>

                <!-- Contenitore dei risultati centrato e con margini ridotti -->
                <div class="col-lg-8 col-md-10 col-12 mx-auto">
                    <div class="row row-cols-1 row-cols-md-3 g-4 d-flex justify-content-center align-items-center" id="resultsContainer"></div>
                </div>

            </div>
        </div>

    `;
}

function createSearchCommentTable() {
    return `
        <div class="container-fluid">
            <div class="row justify-content-center">

            <!-- Titolo centrale -->
            <div class="col-12 text-center">
                <h2 id="searchTitle">Ricerca Commenti</h2>
            </div>

                <!-- Contenuto principale centrato e con margini ridotti -->
                <div class="col-lg-8 col-md-10 col-sm-10 col-12 mx-auto">
                    <div class="row g-4">
                        <div class="col-12">
                            <div class="input-group mb-3">
                                <label class="input-group-text" for="inputGroupSelectUsers">Utenti</label>
                                <select class="form-select" id="inputGroupSelectUsers">
                                    <option selected>Choose...</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="input-group mb-3">
                                <label class="input-group-text" for="inputGroupSelect01">Items</label>
                                <select class="form-select" id="inputGroupSelect01">
                                    <option selected>Choose...</option>
                                </select>
                            </div>
                        </div>

                        <!-- Input per parola commento -->
                        <div class="col-12">
                            <div class="mb-3">
                                <label for="commentWordInput" class="form-label">Parola commento</label>
                                <input type="text" class="form-control" id="commentWordInput" placeholder="Inserisci parola da cercare">
                            </div>
                        </div>
                    </div>

                    <div class="col-12 text-center">
                        <button type="button" class="btn btn-primary btn-searchButtonComment" id="searchButtonComment">Cerca</button>
                    </div>
                </div>

                <!-- Contenitore dei risultati centrato e con margini ridotti -->
                <div class="col-lg-8 col-md-10 col-12 mx-auto">
                    <div class="row row-cols-1 row-cols-md-3 g-4 d-flex justify-content-center align-items-center" id="resultsContainer"></div>
                </div>

            </div>
        </div>

    `;
}

function cardShowComment(comment, itemName, userName) {
    return `
        <div class="card col-md-4 mb-3 me-3">
            <div class="card-body">
                <!-- Nome dell'oggetto (item) -->
                <h5 class="card-title">${itemName}</h5>
                
                <!-- Nome dell'utente -->
                <h6 class="card-subtitle mb-2 text-muted">Commentato da: ${userName}</h6>
                
                <!-- Testo del commento -->
                <p class="card-text">${comment.text}</p>
            </div>
        </div>
    `;
  }

  function createSearchItemCard(item) {
    return `
    <div class="col">
        <div class="card h-100" id="${item.id}">
                <img src="${item.img}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text"></p>
            </div>
            <div class="card-footer" id= "product-card-${item.id}">
                <small class="text-body-secondary">Price: ${item.price}</small>
                

            </div>

            <div class="card-footer" id= "product-card-${item.id}">
                
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
                                <button type="button" class="btn btn-primary btn-saveComment" id="saveComment" data-bs-dismiss="modal">Save comment</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    `;
}

export { createSearchItemTable, createSearchCommentTable, cardShowComment, createSearchItemCard };