(function () {
  "use strict";
  const { esc, button, iconButton, field, pager, search } = CST.ui;
  const { filtered, paginate } = CST.list;
  function companies(s, store) {
    const rows = filtered(s, store.get("companies"), ["name", "email"]);
    return /* HTML */ `<section class="page company-page">
      <div class="heading-row"><h1 class="page-heading">Company</h1></div>
      <div class="list-tools">
        ${search(s.search)}${button("add-company", "Add", { symbol: "plus" })}
      </div>
      <div data-search-results>
        ${rows.length
          ? paginate(s, rows)
              .map(
                (r) =>
                  `<article class="card company-record"><dl><div><dt>Company name:</dt><dd>${esc(r.name)}</dd></div><div><dt>E-mail:</dt><dd>${esc(r.email)}</dd></div><div><dt>Phone:</dt><dd>${esc(r.phone)}</dd></div><div><dt>Fax:</dt><dd>${esc(r.fax)}</dd></div></dl><div class="record-actions">${iconButton("edit-company", "edit", "Edit company " + r.name, r.id)}${iconButton("remove", "trash", "Delete company " + r.name, r.id)}</div>${pager(rows.length, s.page, s.pageSize)}<div class="record-rule"></div>${r.establishments.length ? `<small>${r.establishments.length} establishment(s)</small>` : ""}</article>`,
              )
              .join("")
          : '<p class="no-results">No companies found.</p>'}
      </div>
    </section>`;
  }
  function companyForm(s) {
    const d = s.draft,
      e = s.errors;
    return /* HTML */ `<section class="page company-form-page">
      <div class="heading-row">
        <button
          type="button"
          class="icon-button back-button"
          data-action="back-company"
          aria-label="Back to companies"
        >
          ${CST.icon("back")}
        </button>
        <h1 class="page-heading">${d.id ? "Edit" : "New"} Company</h1>
      </div>
      <form
        data-form="company"
        class="card company-form ${Object.keys(e).length ? "has-errors" : ""}"
        novalidate
      >
        ${field("name", "Company name", {
          value: d.name,
          symbol: "building",
          required: true,
          error: e.name,
        })}${field("customerType", "Customer Type", {
          value: d.customerType,
          options: ["contractuelle", "ponctuelle"],
          symbol: "users",
          required: true,
          error: e.customerType,
        })}${field("activity", "Activity", {
          value: d.activity,
          options: ["Selles|Buying", "Storage", "Manufacturing"],
          symbol: "bars",
          required: true,
          error: e.activity,
        })}${field("email", "E-mail", {
          value: d.email,
          type: "email",
          symbol: "mail",
          required: true,
          error: e.email,
        })}${field("phone", "Phone", {
          value: d.phone,
          type: "tel",
          symbol: "phone",
          required: true,
          error: e.phone,
        })}${field("fax", "Fax", {
          value: d.fax,
          type: "tel",
          symbol: "fax",
          required: true,
          error: e.fax,
        })}
        <div class="form-section">
          <h3>Establishment</h3>
          ${button("add-establishment", "New Establishment", {
            style: "dark wide",
            symbol: "plus",
          })}${d.establishments?.length
            ? d.establishments
                .map(
                  (r) =>
                    `<div class="establishment-item"><strong>${esc(r.name)}</strong><br><span class="muted">${esc(r.address)}</span></div>`,
                )
                .join("")
            : '<div class="empty-state">Empty List!</div>'}
        </div>
        <button class="btn blue save-company" type="submit">
          ${CST.icon("save")}Save
        </button>
      </form>
    </section>`;
  }
  Object.assign(CST.screens, { companies, "company-form": companyForm });
})();
