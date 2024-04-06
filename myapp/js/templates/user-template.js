function createUserPage(user) {
  return `
    <div class="container col-md-auto containerUser">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Profilo</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Cronologia acquisti</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Delete account</a>
        </li>
      </ul>

      <div class="row g-3">
        <div class="col">
          <input type="text" class="form-control" placeholder="First name" aria-label="{user.name}">
        </div>
        <div class="col">
          <input type="text" class="form-control" placeholder="Last name" aria-label="{user.surname}">
        </div>
      </div>

    </div>
  `;
}

export { createUserPage };

