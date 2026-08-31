(function () {
  "use strict";
  const { esc, button, iconButton, field, pager, search, multiSelect } = CST.ui;
  const { filtered, paginate } = CST.list;
  function roomForm(s, store) {
    const d = s.draft,
      e = s.errors;
    return /* HTML */ `<form
      class="edit-panel room-form"
      data-form="room"
      novalidate
    >
      ${field("name", "Room Name", {
        value: d.name,
        symbol: "home",
        required: true,
        error: e.name,
      })}${multiSelect(
        "contacts",
        "Email Alerts",
        store.get("contacts"),
        d.contacts,
        s.roomOpen === "contacts",
        "Select contacts for email alerts",
      )}${multiSelect(
        "sensors",
        "Select Sensors",
        [...new Set([...store.get("availableSensors"), ...(d.sensors || [])])],
        d.sensors,
        s.roomOpen === "sensors",
      )}
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
  function rooms(s, store) {
    const rows = filtered(s, store.get("rooms"), ["name"]);
    return /* HTML */ `<section class="page room-page">
      <h1 class="page-heading">Room</h1>
      <div class="list-tools">
        ${search(s.search)}${button("add-room", "Add", { symbol: "plus" })}
      </div>
      <div class="card table-card" data-search-results>
        <table class="data-table">
          <colgroup>
            <col style="width:30%" />
            <col style="width:30%" />
            <col style="width:28%" />
            <col style="width:12%" />
          </colgroup>
          <thead>
            <tr>
              <th>Room<br />Name</th>
              <th>Email</th>
              <th>Sensors</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            ${s.form === "room"
              ? `<tr><td class="new-row">${s.draft.id ? esc(s.draft.name) : "Nouvelle …"}</td><td>–</td><td><span class="badge">${s.draft.sensors.length} capteur${s.draft.sensors.length !== 1 ? "s" : ""}</span></td><td>${iconButton("cancel-edit", "eye", "Close room form")}</td></tr><tr><td class="details-cell" colspan="4">${roomForm(s, store)}</td></tr>`
              : ""}${paginate(s, rows)
              .map(
                (r) =>
                  `<tr><td title="${esc(r.name)}">${esc(r.name)}</td><td class="contact-cell">${CST.icon("users")}${esc(r.contacts[0] || "–")}</td><td><span class="badge">${r.sensors.length} capteur${r.sensors.length !== 1 ? "s" : ""}</span></td><td>${iconButton("edit-room", "eye", "Room details " + r.name, r.id)}</td></tr>`,
              )
              .join("")}${!rows.length
              ? '<tr><td colspan="4" class="table-empty">No rooms found.</td></tr>'
              : ""}
          </tbody>
        </table>
        ${pager(rows.length, s.page, s.pageSize)}
      </div>
    </section>`;
  }
  CST.screens.rooms = rooms;
})();
