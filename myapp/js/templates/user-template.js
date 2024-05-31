function createUserPage(user) {
  return `
    <div class="container col-md-auto containerUser">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/userPage">Profilo</a>
        </li>
        <li class="nav-item" id="user-wishlist">
          <a class="nav-link" href="/wishlist">WishList</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/history">Cronologia acquisti</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/delete">Delete account</a>
        </li>
      </ul>

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

export { createUserPage };

