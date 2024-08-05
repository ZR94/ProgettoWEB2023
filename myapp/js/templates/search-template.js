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


            <!-- Contenuto principale -->
            <div class="col-sm-8 col-12">

                <div class="row row-cols-1 row-cols-md-3 g-4" id="">
                
                    <div class="input-group mb-3">
                        <label class="input-group-text" for="inputGroupSelectUsers">Utenti</label>
                        <select class="form-select" id="inputGroupSelectUsers">
                            <option selected>Choose...</option>
                        </select>
                    </div>

                    <div class="input-group mb-3">
                        <label class="input-group-text" for="inputGroupSelect01">Items</label>
                        <select class="form-select" id="inputGroupSelect01">
                            <option selected>Choose...</option>
                        </select>
                    </div>

                    <!-- Input per parola commento -->
                    <div class="mb-3">
                        <label for="commentWordInput" class="form-label">Parola commento</label>
                        <input type="text" class="form-control" id="commentWordInput" placeholder="Inserisci parola da cercare">
                    </div>

                </div>

                <div class="col-12 text-center">
                    <button type="button" class="btn btn-primary btn-searchButtonComment" id="searchButtonComment">Cerca</button>
                </div>

            </div>
            <div id="resultsContainer"></div>
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