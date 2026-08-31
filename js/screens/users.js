(function () {
  "use strict";
  const { esc, button, iconButton, field, pager, switchControl } = CST.ui;
  const { filtered, paginate } = CST.list;
  function userForm(s) {
    const d = s.draft,
      e = s.errors;
    return /* HTML */ `<form class="user-form" data-form="user" novalidate>
      <div class="user-form-grid">
        ${field("username", "Username", {
          value: d.username,
          error: e.username,
        })}${field("name", "Name", { value: d.name, error: e.name })}${field(
          "firstName",
          "First Name",
          { value: d.firstName, error: e.firstName },
        )}${field("email", "E-mail*", {
          value: d.email,
          error: e.email,
        })}${field("role", "Role*", {
          value: d.role,
          options: ["User", "Administrator"],
          error: e.role,
        })}${field("password", "Password", {
          value: d.password,
          type: "password",
        })}${field("company", "Company", { value: d.company })}${switchControl(
          "active",
          "Active",
          d.active !== false,
          "slate",
        )}
      </div>
      <div class="form-actions">
        ${button("cancel-edit", "Cancel", { style: "ghost" })}<button
          class="btn primary"
          type="submit"
        >
          Save
        </button>
      </div>
    </form>`;
  }
  function users(s, store) {
    const rows = filtered(s, store.get("users"), ["username", "name", "email"]);
    return /* HTML */ `<section class="page users-page">
      <div class="heading-row">
        <h1 class="page-heading">User</h1>
        ${iconButton("add-user", "plus", "Add user")}
      </div>
      <div class="card">
        <table class="data-table">
          <colgroup>
            <col style="width:25%" />
            <col style="width:15%" />
            <col style="width:20%" />
            <col style="width:18%" />
            <col style="width:16%" />
            <col style="width:6%" />
          </colgroup>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>First<br />Name</th>
              <th>E-<br />mail</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${s.form === "user"
              ? `<tr><td class="details-cell" colspan="6">${userForm(s)}</td></tr>`
              : ""}${paginate(s, rows)
              .map(
                (r) =>
                  `<tr><td title="${esc(r.username)}">${esc(r.username)}</td><td>${esc(r.name)}</td><td>${esc(r.firstName)}</td><td>${esc(r.email)}</td><td>${esc(r.role)}</td><td class="row-action">${iconButton("edit-user", "chevron", "Edit user " + r.username, r.id)}</td></tr>`,
              )
              .join("")}${!rows.length
              ? '<tr><td colspan="6" class="table-empty">No users found.</td></tr>'
              : ""}
          </tbody>
        </table>
        ${pager(rows.length, s.page, s.pageSize)}
      </div>
    </section>`;
  }
  CST.screens.users = users;
})();
