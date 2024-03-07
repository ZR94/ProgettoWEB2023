function createLoginForm() {
  return `
  <div class="container col-md-auto containerLogin">

    <h3 class="loginTitle text-center">Log in</h3>
  
    <form class="col-md-4 mx-auto" method="POST" action="" id="login-form" >
  
      <div class="mb-4">
  
        <label for="email">Email</label>
        <input type="email" name="email" class="form-control" required="" autocomplete=""/>
    
      </div>
  
      <div class="mb-4">
  
        <label for="password">Password</label>
  
        <div class="password-container">
          <input type="password" name="password" class="form-control" required="" autocomplete=""/>
        </div>
  
      </div>
  
      <div class="d-flex justify-content-between mb-3">
  
        <div class="mb-4 bodySmall">
  
          <input type="hidden" name="remember_me" value="0">
          <input type="checkbox" name="remember_me" id="remember_me" value="1" class="m-l-0-xs" checked="checked">
          <label for="remember_me">Remember Me</label>
          
        </div>
        
        <div>
          <a class="bodySmall form-footer" href="/secure/812109/identity/forgot_password">Forgot Password</a>
        </div>
  
      </div>
  
      <div class="d-flex justify-content-center mb-3">
        <button type="submit" class="btn btn-primary">Log in</button>
      </div>
  
    </form>
  
    <div class="col mx-auto text-center bodySmall">Need an account? <a href="">Sign Up</a></div>
  </div>
  `;
}

export {createLoginForm};