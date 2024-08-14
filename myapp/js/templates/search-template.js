"use strict";

function createSearchItemTable() {
    return `
        <div class="container-fluid">
            <div class="row justify-content-center">

                <!-- Titolo centrale -->
                <div class="col-12 text-center">
                    <h4 id="searchTitle">Ricerca Item</h4>
                </div>

                <!-- Contenuto principale centrato e con margini ridotti -->
                <div class="col-lg-6 col-md-8 col-sm-10 col-12 mx-auto">

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

                        <div class="col-12 text-center">
                            <button type="button" class="btn btn-primary btn-searchButton" id="searchButton">Cerca</button>
                        </div>
                    </div>

                </div>

                <!-- Contenitore dei risultati centrato e con margini ridotti -->
                <div class="col-lg-8 col-md-10 col-12 mx-auto">
                    <div class="row row-cols-1 row-cols-md-3 g-4" id="resultsContainer"></div>
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
                <h4 id="searchTitle">Ricerca Commenti</h4>
            </div>

                <!-- Contenuto principale centrato e con margini ridotti -->
                <div class="col-lg-6 col-md-8 col-sm-10 col-12 mx-auto">
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

                <!-- Contenitore dei risultati centrato -->
                <div class="col-lg-8 col-md-10 col-12 mx-auto mt-4">
                    <div class="row" id="resultsContainer"></div>
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


export { createSearchItemTable, createSearchCommentTable, createSearchItemPage, createSearchCommentPage, cardShowComment };