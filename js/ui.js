(function () {
  const { icon } = CST;
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  function button(
    action,
    label,
    { style = "primary", symbol = "", id = "", extra = "" } = {},
  ) {
    return /* HTML */ `<button
      type="button"
      class="btn ${style}"
      data-action="${action}"
      ${id ? `data-id="${esc(id)}"` : ""}
      ${extra}
    >
      ${symbol ? icon(symbol) : ""}${label}
    </button>`;
  }
  function iconButton(action, name, label, id = "") {
    return /* HTML */ `<button
      type="button"
      class="icon-button"
      data-action="${action}"
      data-id="${esc(id)}"
      aria-label="${esc(label)}"
      title="${esc(label)}"
    >
      ${icon(name)}
    </button>`;
  }
  function field(
    name,
    label,
    {
      value = "",
      type = "text",
      symbol = "",
      options = null,
      error = "",
      placeholder = "",
      required = false,
      step = "",
      min = "",
    } = {},
  ) {
    const id = "field-" + name.replace(/[^a-z\d-]/gi, "-");
    const invalid = error
      ? `aria-invalid="true" aria-describedby="${id}-error"`
      : "";
    const control = options
      ? `<select id="${id}" name="${esc(name)}" ${required ? "required" : ""} ${invalid}>${["", ...options].map((opt) => `<option value="${esc(opt)}" ${String(value) === String(opt) ? "selected" : ""}>${opt ? esc(opt) : "Select…"}</option>`).join("")}</select>`
      : `<input id="${id}" name="${esc(name)}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" ${step ? `step="${step}"` : ""} ${min !== "" ? `min="${min}"` : ""} ${required ? "required" : ""} autocomplete="off" ${error ? 'aria-invalid="true" aria-describedby="' + id + '-error"' : ""}>`;
    return /* HTML */ `<div class="field ${error ? "invalid" : ""}">
      <label for="${id}">${esc(label)}${required ? "*" : ""}</label>
      <div class="input-box ${symbol ? "has-icon" : ""}">
        ${symbol ? icon(symbol) : ""}${control}${options ? icon("chevron") : ""}
      </div>
      ${error
        ? `<small class="error" id="${id}-error">${esc(error)}</small>`
        : ""}
    </div>`;
  }
  function pager(count, page = 1, size = 10) {
    const start = count ? (page - 1) * size + 1 : 0;
    return /* HTML */ `<div class="pager">
      <label
        ><span class="sr-only">Rows per page</span
        ><select name="page-size" aria-label="Rows per page">
          ${[5, 10, 20]
            .map((n) => `<option ${n === size ? "selected" : ""}>${n}</option>`)
            .join("")}
        </select></label
      >
      <div>
        <span>${start} – ${Math.min(page * size, count)} of ${count}</span
        ><button
          data-action="page-prev"
          aria-label="Previous page"
          ${page <= 1 ? "disabled" : ""}
        >
          ‹</button
        ><button
          data-action="page-next"
          aria-label="Next page"
          ${page * size >= count ? "disabled" : ""}
        >
          ›
        </button>
      </div>
    </div>`;
  }
  function search(value = "") {
    return /* HTML */ `<div class="search-box">
      ${icon("search")}<input
        name="search"
        type="search"
        placeholder="Search"
        aria-label="Search records"
        value="${esc(value)}"
      />
    </div>`;
  }
  function switchControl(name, label, checked = true, tone = "green") {
    return /* HTML */ `<label class="switch-label ${tone}"
      ><input type="checkbox" name="${name}" ${checked ? "checked" : ""} /><span
        class="switch-track"
      ></span
      ><span>${label}</span></label
    >`;
  }
  function multiSelect(
    name,
    label,
    options,
    selected = [],
    open = false,
    helper = "",
  ) {
    return /* HTML */ `<div class="field multi-field">
      <label>${label}</label>
      <details class="multi-select" data-multi="${name}" ${open ? "open" : ""}>
        <summary aria-label="${label}">
          ${icon(name === "sensors" ? "sensor" : "users")}<span
            class="selection-label"
            >${selected.length ? esc(selected.join(", ")) : ""}</span
          >${icon("chevron")}
        </summary>
        <div class="select-options">
          ${options
            .map(
              (opt) =>
                `<label><input type="checkbox" name="${name}" value="${esc(opt)}" ${selected.includes(opt) ? "checked" : ""}>${esc(opt)}</label>`,
            )
            .join("")}
        </div>
      </details>
      ${helper ? `<small class="help">${helper}</small>` : ""}
    </div>`;
  }
  CST.ui = {
    esc,
    button,
    iconButton,
    field,
    pager,
    search,
    switchControl,
    multiSelect,
  };
})();
