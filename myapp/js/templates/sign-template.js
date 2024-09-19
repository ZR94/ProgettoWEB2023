"use strict";

function createSignUpForm() {
    return `
    <div class="container col-md-auto containerSignUp">
  
      <h3 class="signUpTitle text-center">Sign Up</h3>

        <form class="col-md-4 mx-auto needs-validation" novalidate method="POST" action="" id="signUp-form">
            <div class="mb-4">
                <label for="validationCustom01" class="form-label">First name</label>
                <input type="text" class="form-control" id="validationCustom01" value="" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
            </div>
            <div class="mb-4">
                <label for="validationCustom02" class="form-label">Last name</label>
                <input type="text" class="form-control" id="validationCustom02" value="" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
            </div>
            <div class="mb-4">
                <label for="validationCustomUsername" class="form-label">Email</label>
                <div class="input-group has-validation">
                    <span class="input-group-text" id="inputGroupPrepend">@</span>
                    <input type="text" class="form-control" id="validationCustomUsername" aria-describedby="inputGroupPrepend" required>
                        <div class="invalid-feedback">
                            Please choose a username.
                        </div>
                </div>
            </div>
            <div class="mb-4">
                <label for="validationCustomPassword" class="form-label">Password</label>
                <input type="password" class="form-control" id="validationCustomPassword" required>
                    <div class="invalid-feedback">
                        Please provide a valid city.
                    </div>
            </div>
            <div class="mb-4">
                <div class="form-check">
                    <input class="form-check-input-01" type="checkbox" value="" id="invalidCheck" required>
                        <label class="form-check-label" for="invalidCheck">
                            Agree to terms and conditions
                        </label>
                        <div class="invalid-feedback">
                            You must agree before submitting.
                        </div>
                </div>
            </div>
            <div class="mb-4">
                <div class="form-check">
                    <input class="form-check-input-02" type="checkbox" value="" id="adminCheck" />
                    <label class="form-check-label" for="adminCheck">
                        Register as Administrator
                    </label>
                </div>
            </div>            
            <div class="mb-4">
                <button class="btn btn-primary" type="submit">Confirm</button>
            </div>
        </form>
    </div>
    `;
}

export { createSignUpForm };    