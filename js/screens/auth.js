(function () {
  const { field, iconButton } = CST.ui;
  function login(state) {
    const d = state.draft || {},
      e = state.errors;
    return /* HTML */ `<div class="login-scroll">
      <section class="login-main">
        <img
          class="login-logo"
          src="assets/cst-logo.svg"
          alt="Canadian System Technology"
        />
        <h1 class="login-title">Welcome back</h1>
        <p class="login-subtitle">Sign in to continue to your dashboard</p>
        <form class="login-form" data-form="login" novalidate>
          ${field("email", "Email Address", {
            value: d.email,
            type: "email",
            symbol: "mail",
            placeholder: "your@email.com",
            error: e.email,
          })}
          <div class="login-password">
            ${field("password", "Password", {
              value: d.password,
              type: state.showPassword ? "text" : "password",
              symbol: "lock",
              placeholder: "********",
              error: e.password,
            })}${iconButton(
              "password-toggle",
              "eye",
              state.showPassword ? "Hide password" : "Show password",
            )}
          </div>
          <button class="btn sign-in" type="submit">Sign In</button>
        </form>
        <p class="login-footer">© 2026 CST Qatar. All rights reserved.</p>
      </section>
      <img
        class="login-photo"
        src="assets/warehouse.png"
        alt="Temperature-controlled warehouse"
      />
    </div>`;
  }
  (CST.screens ||= {}).login = login;
})();
