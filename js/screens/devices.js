(function () {
  "use strict";
  const { esc, button, iconButton, field, pager, search } = CST.ui;
  const { filtered, paginate } = CST.list;
  function sensorCard(sensor, index, errors) {
    const f = (key, label, options = {}) =>
      field("sensors." + index + "." + key, label, {
        value: sensor[key],
        error: errors["sensors." + index + "." + key],
        ...options,
      });
    return /* HTML */ `<section class="sensor-card" id="sensor-${index}">
      <div class="sensor-header">
        <h4>Sensor #${index + 1}</h4>
        ${index
          ? iconButton(
              "remove-sensor",
              "close",
              "Remove sensor " + (index + 1),
              index,
            )
          : ""}
      </div>
      ${f("name", "Sensor Name", { symbol: "sensor", required: true })}${f(
        "type",
        "Type Measure",
        {
          options: ["Gas concentration", "Temperature", "Humidity"],
          required: true,
        },
      )}${f("unit", "Unit", { symbol: "unit", required: true })}${f(
        "minGauge",
        "Min Gauge",
        { symbol: "minus", type: "number", step: "any", required: true },
      )}${f("maxGauge", "Max Gauge", {
        symbol: "plus",
        type: "number",
        step: "any",
        required: true,
      })}${f("label", "Gauge Label", { symbol: "layers", required: true })}${f(
        "step",
        "Gauge step",
        { symbol: "layers", type: "number", step: "any", required: true },
      )}${f("minThreshold", "Min Consigne", {
        symbol: "settings",
        type: "number",
        step: "any",
      })}${f("maxThreshold", "Max Consigne", {
        symbol: "settings",
        type: "number",
        step: "any",
      })}
    </section>`;
  }
  function deviceForm(s) {
    const d = s.draft,
      e = s.errors;
    return /* HTML */ `<form class="device-form" data-form="device" novalidate>
      ${field("code", "ID_Device", {
        value: d.code,
        symbol: "chip",
        required: true,
        error: e.code,
      })}${field("name", "Device Name", {
        value: d.name,
        symbol: "chip",
        required: true,
        error: e.name,
      })}${button(
        "choose-location",
        d.location ? "Change Location" : "Choose Location",
        { style: "ghost location-button", symbol: "pin" },
      )}${d.location
        ? '<p class="location-selected">✓ Location selected</p>'
        : ""}
      <div class="sensor-section" id="sensor-section">
        <h3>Sensor</h3>
        ${button("add-sensor", "", {
          style: "dark sensor-add",
          symbol: "plus",
          extra: 'aria-label="Add sensor"',
        })}${d.sensors.map((sensor, i) => sensorCard(sensor, i, e)).join("")}
      </div>
      <div class="form-actions">
        ${button("cancel-edit", "Cancel", { style: "ghost" })}<button
          class="btn blue save-device"
          type="submit"
        >
          ${CST.icon("save")}Save device
        </button>
      </div>
    </form>`;
  }
  function devices(s, store) {
    const rows = filtered(s, store.get("devices"), ["code", "name"]);
    return /* HTML */ `<section class="page device-page">
      <h1 class="page-heading">Device</h1>
      <div class="list-tools">
        ${search(s.search)}${button("add-device", "Add", { symbol: "plus" })}
      </div>
      <div class="card table-card" data-search-results>
        <table class="data-table">
          <colgroup>
            <col style="width:38%" />
            <col style="width:39%" />
            <col style="width:23%" />
          </colgroup>
          <thead>
            <tr>
              <th>ID_Device</th>
              <th>Device Name</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            ${s.form === "device"
              ? `<tr><td class="details-cell" colspan="3">${deviceForm(s)}</td></tr>`
              : ""}${paginate(s, rows)
              .map(
                (r) =>
                  `<tr><td>${esc(r.code)}</td><td title="${esc(r.name)}">${esc(r.name)}</td><td class="details-cell"><div class="row-icons">${iconButton("inspect-device", "eye", "Inspect device " + r.name, r.id)}${iconButton("edit-device", "edit", "Edit device " + r.name, r.id)}${iconButton("remove", "trash", "Delete device " + r.name, r.id)}</div></td></tr>`,
              )
              .join("")}${!rows.length
              ? '<tr><td colspan="3" class="table-empty">No devices found.</td></tr>'
              : ""}
          </tbody>
        </table>
        ${pager(rows.length, s.page, s.pageSize)}
      </div>
    </section>`;
  }
  CST.screens.devices = devices;
})();
