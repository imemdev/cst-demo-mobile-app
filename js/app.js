(function () {
  "use strict";
  const { esc, field, button, iconButton } = CST.ui;
  const store = CST.core.createStore(CST.data.seed);
  const root = document.getElementById("app"),
    phone = document.getElementById("phone-screen"),
    modalRoot = document.getElementById("modal-root");
  let toastTimer,
    refreshTimer,
    epoch = 0,
    undoAction = null;
  const blankSensor = () => ({
    name: "",
    type: "",
    unit: "",
    minGauge: "",
    maxGauge: "",
    label: "",
    step: "",
    minThreshold: 0,
    maxThreshold: 0,
  });
  const emptyCompany = () => ({
    name: "",
    customerType: "",
    activity: "",
    email: "",
    phone: "",
    fax: "",
    establishments: [],
  });
  const sampleUser = () => ({
    username: "imem",
    name: "hamdi",
    firstName: "hamdi",
    email: "medim@example.test",
    role: "User",
    password: "demo1234",
    company: "NOVOGEL",
    active: true,
  });
  const sampleCompany = () => ({
    name: "ASTRO MAX",
    customerType: "contractuelle",
    activity: "Selles|Buying",
    email: "medimemhamdi18@gmail.com",
    phone: "015510946998",
    fax: "015510946998",
    establishments: [],
  });
  const initial = () => ({
    route: "login",
    scene: "login",
    drawer: false,
    search: "",
    monitorSearch: "NOVOGEL",
    page: 1,
    pageSize: 10,
    form: null,
    draft: { email: "", password: "" },
    errors: {},
    roomOpen: null,
    showPassword: false,
    alertFilters: { range: true, service: true },
    statusFilters: { inRange: true, range: true, service: true },
    map: { zoom: 1, x: 0, y: 0 },
    mapPopup: false,
    locationDraft: null,
    reading: 31.06,
    gauge: { min: -100, max: -40 },
    simulating: false,
    simulationIndex: 0,
  });
  let state = initial();
  const navItems = [
    ["users", "users", "User"],
    ["companies", "building", "Company"],
    ["rooms", "home", "Room"],
    ["devices", "chip", "Device"],
    ["overview", "globe", "Analytics Dashboard"],
    ["alerts", "alert", "Live Alerts"],
    ["live", "sensor", "Live Monitoring"],
  ];
  function toolbar() {
    return /* HTML */ `<header class="topbar">
      ${iconButton("menu", "menu", "Open navigation")}<button
        class="icon-button moon-toggle"
        data-action="theme"
        aria-label="Toggle dark theme"
      >
        ${CST.icon("moon")}</button
      ><span class="flag-icon" role="img" aria-label="English interface"
        >🇬🇧</span
      >${iconButton(
        "global-search",
        "search",
        "Search application",
      )}${iconButton("profile", "user", "Your profile")}
    </header>`;
  }
  function drawer() {
    return /* HTML */ `<div class="drawer-shade" data-action="close-menu"></div>
      <aside class="drawer" aria-label="Application navigation">
        <img src="assets/cst-logo.svg" alt="Canadian System Technology" />
        <nav>
          ${navItems
            .map(
              ([id, symbol, label]) =>
                `<button type="button" class="${state.route === id ? "active" : ""}" data-action="navigate" data-id="${id}">${CST.icon(symbol)}${label}</button>`,
            )
            .join("")}<button type="button" data-action="sign-out">
            ${CST.icon("logout")}Sign out
          </button>
        </nav>
        <small>Presentation demo · local data only</small>
      </aside>`;
  }
  function render({ keepScroll = false } = {}) {
    const oldScroll = root.querySelector(".app-scroll")?.scrollTop || 0;
    const view = CST.screens[state.route](state, store);
    root.innerHTML =
      state.route === "login"
        ? view
        : `<div class="app-shell">${state.route === "alerts" ? "" : toolbar()}<main class="app-scroll" tabindex="-1" aria-label="${esc(state.route)} screen">${state.route === "alerts" ? toolbar() : ""}${view}</main>${state.drawer ? drawer() : ""}</div>`;
    if (keepScroll && root.querySelector(".app-scroll"))
      root.querySelector(".app-scroll").scrollTop = oldScroll;
    else if (state.route === "alerts")
      root.querySelector(".app-scroll").scrollTop = 62;
    root
      .querySelector(".eye-toggle")
      ?.setAttribute("aria-pressed", String(state.showPassword));
    // Mark the eye after rendering without changing any form value or focus.
    root
      .querySelector('[data-action="password-toggle"]')
      ?.classList.add("eye-toggle");
    updateDirector();
  }
  function updateDirector() {
    const scene =
      CST.data.scenes.find((s) => s.id === state.scene) ||
      CST.data.scenes.find((s) => s.route === state.route);
    document.getElementById("screen-caption").textContent =
      scene.group + " · " + scene.label.slice(5);
    document.getElementById("chapter-title").textContent = scene.title;
    document.getElementById("chapter-description").textContent =
      scene.description;
    document.getElementById("interaction-hint").textContent = scene.hint;
    document.getElementById("source-note").textContent = scene.source;
    document
      .querySelectorAll(".scene-entry")
      .forEach((el) =>
        el.setAttribute("aria-current", String(el.dataset.scene === scene.id)),
      );
    const active = document.querySelector('.scene-entry[aria-current="true"]');
    if (active) active.closest("details").open = true;
  }
  function toast(text, undo = null) {
    clearTimeout(toastTimer);
    undoAction = undo;
    const el = document.getElementById("toast");
    el.innerHTML = `<span>${esc(text)}</span>${undo ? '<button type="button" data-action="undo">Undo</button>' : ""}`;
    el.classList.add("visible");
    toastTimer = setTimeout(() => {
      el.classList.remove("visible");
      undoAction = null;
    }, 4200);
  }
  function hideToast() {
    clearTimeout(toastTimer);
    document.getElementById("toast").classList.remove("visible");
    undoAction = null;
  }
  function stopSimulation() {
    clearInterval(refreshTimer);
    state.simulating = false;
  }
  function navigate(route, sceneId) {
    epoch++;
    stopSimulation();
    hideToast();
    modalRoot.innerHTML = "";
    Object.assign(state, {
      route,
      scene:
        sceneId || CST.data.scenes.find((s) => s.route === route)?.id || route,
      drawer: false,
      form: null,
      draft: route === "login" ? { email: "", password: "" } : {},
      errors: {},
      search: "",
      page: 1,
      roomOpen: null,
      mapPopup: false,
    });
    render();
  }
  function openEdit(kind, record = null) {
    epoch++;
    const defaults = {
      user: () => ({
        username: "",
        name: "",
        firstName: "",
        email: "",
        role: "User",
        company: "NOVOGEL",
        active: true,
        password: "",
      }),
      room: () => ({ name: "", contacts: [], sensors: [] }),
      device: () => ({
        code: "",
        name: "",
        location: null,
        sensors: [blankSensor()],
      }),
    };
    state.form = kind;
    state.draft = record ? CST.core.copy(record) : defaults[kind]();
    state.errors = {};
    state.roomOpen = null;
    state.scene =
      kind === "user"
        ? "user-form"
        : kind === "room"
          ? "room-sensors"
          : "device-form";
    render();
  }
  function showScene(id) {
    const scene = CST.data.scenes.find((s) => s.id === id);
    if (!scene) return;
    CST.tour?.stop();
    navigate(scene.route, id);
    if (id === "login-filled") {
      state.draft = { email: "cst@gmail.com", password: "demo1234" };
      render();
      root.querySelector('[name="email"]').focus();
    }
    if (id === "user-form") {
      openEdit("user");
      state.draft = sampleUser();
      render();
    }
    if (id === "user-saved") {
      if (!store.get("users").some((r) => r.username === "imem")) {
        const { password, ...user } = sampleUser();
        store.save("users", user);
      }
      state.scene = id;
      render();
      toast("Enregistré avec succès.");
    }
    if (id.startsWith("company-")) {
      state.draft = id === "company-filled" ? sampleCompany() : emptyCompany();
      state.errors =
        id === "company-errors"
          ? CST.core.validate("company", state.draft)
          : {};
      state.scene = id;
      render();
    }
    if (id === "room-sensors" || id === "room-contacts") {
      openEdit("room");
      state.roomOpen = id === "room-sensors" ? "sensors" : "contacts";
      state.scene = id;
      render();
    }
    if (id === "device-form" || id === "sensor-form") {
      openEdit("device");
      state.errors = {
        code: "ID_Device is required!",
        name: "Device Name is required!",
      };
      state.scene = id;
      render();
      if (id === "sensor-form")
        root
          .querySelector("#sensor-section")
          .scrollIntoView({ block: "start" });
    }
  }
  function modal(title, content) {
    modalRoot.innerHTML = `<div class="dialog-shade"><section class="dialog" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="dialog-header"><h2>${esc(title)}</h2>${iconButton("close-modal", "close", "Close dialog")}</div>${content}</section></div>`;
    modalRoot.querySelector("input,button")?.focus();
  }
  function collect(form) {
    const result = Object.fromEntries(new FormData(form));
    const kind = form.dataset.form;
    if (kind === "device") {
      const d = CST.core.copy(state.draft);
      for (const [key, value] of Object.entries(result)) {
        if (key.startsWith("sensors.")) {
          const [, index, name] = key.split(".");
          d.sensors[Number(index)][name] = value;
        } else d[key] = value;
      }
      return d;
    }
    if (kind === "room")
      return {
        ...state.draft,
        ...result,
        sensors: new FormData(form).getAll("sensors"),
        contacts: new FormData(form).getAll("contacts"),
      };
    if (kind === "user")
      return {
        ...state.draft,
        ...result,
        active: form.elements.active.checked,
      };
    return { ...state.draft, ...result };
  }
  async function submit(form) {
    if (form.dataset.pending) return;
    const kind = form.dataset.form,
      record = collect(form);
    state.draft = record;
    const errors = CST.core.validate(kind, record);
    if (kind === "device") {
      record.sensors.forEach((sensor, i) =>
        Object.entries(CST.core.validate("sensor", sensor)).forEach(
          ([key, value]) => (errors["sensors." + i + "." + key] = value),
        ),
      );
      if (
        store
          .get("devices")
          .some((d) => d.code === record.code && d.id !== record.id)
      )
        errors.code = "This device ID already exists.";
    }
    if (
      kind === "user" &&
      store
        .get("users")
        .some((d) => d.username === record.username && d.id !== record.id)
    )
      errors.username = "This username already exists.";
    state.errors = errors;
    if (Object.keys(errors).length) {
      render({ keepScroll: true });
      root.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const submitButton = form.querySelector('[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML =
      '<span class="loading-spinner"></span>' +
      (kind === "login" ? "Signing in…" : "Saving…");
    form.dataset.pending = "true";
    form
      .querySelectorAll("input, select, button")
      .forEach((control) => (control.disabled = true));
    const requestEpoch = epoch;
    await new Promise((resolve) =>
      setTimeout(resolve, kind === "login" ? 1000 : 650),
    );
    if (requestEpoch !== epoch) return;
    if (kind === "login") {
      state.draft = {};
      navigate("overview");
      toast("Welcome back. Demo session started.");
      return;
    }
    if (kind === "user") {
      const { password, ...savedUser } = record;
      store.save("users", savedUser);
      state.form = null;
      state.draft = {};
      state.scene = "user-saved";
      render();
    }
    if (kind === "company") {
      store.save("companies", record);
      navigate("companies");
    }
    if (kind === "room") {
      store.save("rooms", record);
      state.form = null;
      state.draft = {};
      state.roomOpen = null;
      state.scene = "rooms";
      render();
    }
    if (kind === "device") {
      store.save("devices", record);
      state.form = null;
      state.draft = {};
      state.scene = "devices";
      render();
    }
    toast("Enregistré avec succès.");
  }
  function refreshReading() {
    const sequence = [30.84, 31.22, 30.97, 31.45, 31.06];
    state.reading = sequence[state.simulationIndex++ % sequence.length];
    const out = document.getElementById("live-reading");
    if (!out) return;
    out.textContent = state.reading.toFixed(2);
    out.classList.remove("measurement-update");
    void out.offsetWidth;
    out.classList.add("measurement-update");
    root.querySelector(".gauge-needle").style.transform =
      `rotate(${CST.core.gaugeAngle(state.reading, state.gauge.min, state.gauge.max)}deg)`;
    root
      .querySelector(".gauge-svg")
      .setAttribute(
        "aria-label",
        `Simulated gauge reading ${state.reading.toFixed(2)} mg per cubic meter`,
      );
  }
  function toggleSimulation() {
    state.simulating = !state.simulating;
    clearInterval(refreshTimer);
    render({ keepScroll: true });
    if (state.simulating) {
      refreshReading();
      refreshTimer = setInterval(refreshReading, 1600);
      toast("Simulating local sensor readings.");
    }
  }
  function showGaugeSettings() {
    modal(
      "Live gauge settings",
      `<p>Local presentation controls. The original report uses −100 to −40 with a 31.06 reading, outside that scale.</p><form data-modal-form="gauge" novalidate>${field("min", "Min Gauge", { value: state.gauge.min, type: "number", step: "any" })}${field("max", "Max Gauge", { value: state.gauge.max, type: "number", step: "any" })}<p class="error" id="modal-error"></p><button class="btn blue" type="submit">Apply range</button></form><div class="form-actions">${button("simulate-toggle", state.simulating ? "Pause simulation" : "Simulate readings", { style: "ghost" })}</div>`,
    );
  }
  const actions = {
    "device-back"() {
      CST.tour?.stop();
      if (modalRoot.firstElementChild) actions["close-modal"]();
      else if (state.drawer) actions["close-menu"]();
      else if (state.roomOpen) {
        state.roomOpen = null;
        render({ keepScroll: true });
      } else if (state.form) actions["cancel-edit"]();
      else if (state.route !== "login" && state.route !== "overview") {
        const parent = {
          "company-form": "companies",
          live: "alerts",
          alerts: "overview",
        };
        navigate(parent[state.route] || "overview");
      }
    },
    "device-home"() {
      CST.tour?.stop();
      if (state.route !== "login") navigate("overview");
    },
    "device-menu"() {
      CST.tour?.stop();
      if (state.route === "login") return;
      actions["close-modal"]();
      state.drawer = !state.drawer;
      render({ keepScroll: true });
    },
    menu() {
      state.drawer = true;
      render({ keepScroll: true });
    },
    "close-menu"() {
      state.drawer = false;
      render({ keepScroll: true });
    },
    navigate(el) {
      navigate(el.dataset.id);
    },
    "sign-out"() {
      navigate("login");
    },
    theme() {
      phone.classList.toggle("dark-app");
    },
    "password-toggle"() {
      const input = root.querySelector('[name="password"]');
      state.showPassword = !state.showPassword;
      input.type = state.showPassword ? "text" : "password";
      const eye = root.querySelector('[data-action="password-toggle"]');
      eye.setAttribute(
        "aria-label",
        state.showPassword ? "Hide password" : "Show password",
      );
      eye.setAttribute("aria-pressed", String(state.showPassword));
    },
    "add-user"() {
      openEdit("user");
    },
    "edit-user"(el) {
      openEdit("user", store.find("users", el.dataset.id));
    },
    "add-company"() {
      navigate("company-form", "company-filled");
      state.draft = emptyCompany();
      render();
    },
    "back-company"() {
      navigate("companies");
    },
    "edit-company"(el) {
      const record = store.find("companies", el.dataset.id);
      navigate("company-form", "company-filled");
      state.draft = record;
      render();
    },
    "add-room"() {
      openEdit("room");
    },
    "edit-room"(el) {
      openEdit("room", store.find("rooms", el.dataset.id));
    },
    "add-device"() {
      openEdit("device");
    },
    "edit-device"(el) {
      openEdit("device", store.find("devices", el.dataset.id));
    },
    "cancel-edit"() {
      epoch++;
      state.form = null;
      state.draft = {};
      state.errors = {};
      state.roomOpen = null;
      state.scene = CST.data.scenes.find((s) => s.route === state.route).id;
      render();
    },
    "add-sensor"() {
      state.draft.sensors.push(blankSensor());
      render({ keepScroll: true });
      root
        .querySelector("#sensor-" + (state.draft.sensors.length - 1))
        .scrollIntoView({ behavior: "smooth", block: "start" });
    },
    "remove-sensor"(el) {
      state.draft.sensors.splice(Number(el.dataset.id), 1);
      state.errors = {};
      render({ keepScroll: true });
    },
    "inspect-device"(el) {
      const d = store.find("devices", el.dataset.id);
      modal(
        d.name,
        `<dl><dt>ID_Device</dt><dd>${esc(d.code)}</dd><dt>Sensors</dt><dd>${d.sensors.map((s) => esc(s.name) + " · " + esc(s.unit)).join("<br>")}</dd></dl><div class="form-actions">${button("modal-edit-device", "Edit device", { id: d.id, style: "blue", symbol: "edit" })}</div>`,
      );
    },
    "modal-edit-device"(el) {
      modalRoot.innerHTML = "";
      openEdit("device", store.find("devices", el.dataset.id));
    },
    "add-establishment"() {
      modal(
        "New Establishment",
        `<form data-modal-form="establishment">${field("name", "Establishment name", { required: true, symbol: "building" })}${field("address", "Address", { symbol: "pin" })}<div class="form-actions"><button class="btn blue" type="submit">Add establishment</button></div></form>`,
      );
    },
    "choose-location"() {
      state.locationDraft = state.draft.location || { x: 64, y: 44 };
      modal(
        "Choose Location",
        `<p>Click the schematic map to position this demo device.</p>${CST.monitoring.map(state, { location: true })}<div class="form-actions">${button("location-confirm", "Use this location", { style: "blue", symbol: "pin" })}</div>`,
      );
    },
    "location-place"() {},
    "location-confirm"() {
      state.draft.location = { ...state.locationDraft };
      modalRoot.innerHTML = "";
      render({ keepScroll: true });
    },
    "close-modal"() {
      modalRoot.innerHTML = "";
    },
    remove(el) {
      const collection = state.route,
        id = el.dataset.id;
      const record = store.find(collection, id);
      modal(
        "Remove " + (record.name || record.username) + "?",
        `<p>This only removes a local demo record. You can undo it or reset the demo.</p><div class="form-actions">${button("close-modal", "Cancel", { style: "ghost" })}${button("confirm-remove", "Remove", { style: "remove-confirm", id, extra: `data-collection="${collection}"` })}</div>`,
      );
    },
    "confirm-remove"(el) {
      const collection = el.dataset.collection;
      const record = store.remove(collection, el.dataset.id);
      modalRoot.innerHTML = "";
      state.page = 1;
      render();
      toast("Demo record removed.", () => {
        store.save(collection, record);
        render();
        toast("Record restored.");
      });
    },
    undo() {
      undoAction?.();
    },
    "page-prev"() {
      state.page = Math.max(1, state.page - 1);
      render({ keepScroll: true });
    },
    "page-next"() {
      state.page++;
      render({ keepScroll: true });
    },
    "open-alerts"() {
      navigate("alerts");
    },
    "open-live"() {
      navigate("live");
    },
    "alert-detail"(el) {
      const alert = store.find("alerts", el.dataset.id);
      if (alert.type === "range") navigate("live");
      else
        modal(
          alert.name,
          `<p>Out of Service</p><p>The report has no current reading for this sensor. Restore communication before interpreting new measurements.</p>${button("locate", "Locate on map", { style: "blue", id: alert.id, symbol: "pin" })}`,
        );
    },
    locate() {
      navigate("overview");
      state.mapPopup = true;
      state.map.zoom = 1.35;
      render();
      toast("Map centered on Novogel_Sfax.");
    },
    "map-inspect"() {
      state.mapPopup = !state.mapPopup;
      render({ keepScroll: true });
    },
    "map-zoom-in"() {
      state.map.zoom = Math.min(2.8, state.map.zoom + 0.25);
      updateMap();
    },
    "map-zoom-out"() {
      state.map.zoom = Math.max(0.75, state.map.zoom - 0.25);
      updateMap();
    },
    "refresh-dashboard"(el) {
      el.classList.add("is-loading");
      el.innerHTML =
        '<span class="loading-spinner" style="border-top-color:var(--blue)"></span>';
      const ticket = epoch;
      setTimeout(() => {
        if (ticket === epoch) {
          render({ keepScroll: true });
          toast("Local monitoring data refreshed.");
        }
      }, 700);
    },
    "gauge-settings": showGaugeSettings,
    "simulate-toggle"() {
      modalRoot.innerHTML = "";
      toggleSimulation();
    },
    "global-search"() {
      modal(
        "Search application",
        `<form data-modal-form="search">${field("query", "Device or company", { placeholder: "Try Azot or NOVOGEL", symbol: "search" })}<button type="submit" class="btn blue">Search</button></form>`,
      );
    },
    profile() {
      modal(
        "Demo profile",
        "<p><strong>CST Administrator</strong></p><p>This is an offline presentation session. It does not authenticate against the production system.</p>" +
          button("sign-out", "Sign out", { style: "ghost", symbol: "logout" }),
      );
    },
  };
  function updateMap() {
    document
      .querySelectorAll("[data-map-geometry]")
      .forEach((el) =>
        el.setAttribute(
          "transform",
          `translate(${state.map.x} ${state.map.y}) translate(162 103) scale(${state.map.zoom}) translate(-162 -103)`,
        ),
      );
    document
      .querySelectorAll('[data-map="overview"] .map-marker')
      .forEach((el) => {
        const p = CST.monitoring.markerPosition(state.map);
        el.style.left = p.x + "%";
        el.style.top = p.y + "%";
      });
  }
  document.addEventListener("click", (event) => {
    const el = event.target.closest("[data-action]");
    if (!el || el.disabled) return;
    actions[el.dataset.action]?.(el);
  });
  root.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-form]");
    if (form) {
      event.preventDefault();
      submit(form);
    }
  });
  root.addEventListener("input", (event) => {
    const input = event.target;
    if (!input.name) return;
    if (input.name === "search" || input.name === "monitor-search") {
      const position = input.selectionStart,
        key = input.name === "search" ? "search" : "monitorSearch";
      state[key] = input.value;
      state.page = 1;
      render({ keepScroll: true });
      const fresh = root.querySelector(`[name="${input.name}"]`);
      fresh.focus();
      if (input.type === "search") fresh.setSelectionRange(position, position);
      return;
    }
    if (input.name.startsWith("sensors.")) {
      const [, i, key] = input.name.split(".");
      state.draft.sensors[Number(i)][key] = input.value;
    } else if (input.type !== "checkbox") state.draft[input.name] = input.value;
    const fieldEl = input.closest(".field");
    if (fieldEl?.classList.contains("invalid")) {
      fieldEl.classList.remove("invalid");
      fieldEl.querySelector(".error")?.remove();
      input.removeAttribute("aria-invalid");
      delete state.errors[input.name];
    }
  });
  root.addEventListener("change", (event) => {
    const input = event.target,
      name = input.name;
    if (name === "page-size") {
      state.pageSize = Number(input.value);
      state.page = 1;
      render({ keepScroll: true });
      return;
    }
    if (name?.startsWith("alert-")) {
      state.alertFilters[name.slice(6)] = input.checked;
      render({ keepScroll: true });
      return;
    }
    if (name?.startsWith("status-")) {
      state.statusFilters[name.slice(7)] = input.checked;
      render({ keepScroll: true });
      return;
    }
    if (name === "contacts" || name === "sensors") {
      state.draft[name] = [
        ...root.querySelectorAll(`input[name="${name}"]:checked`),
      ].map((el) => el.value);
      const text = input.closest("details").querySelector(".selection-label");
      text.textContent = state.draft[name].join(", ");
      return;
    }
    if (name === "active") {
      state.draft.active = input.checked;
      return;
    }
    if (input.tagName === "SELECT") {
      if (name.startsWith("sensors.")) {
        const [, i, key] = name.split(".");
        state.draft.sensors[+i][key] = input.value;
      } else state.draft[name] = input.value;
    }
  });
  root.addEventListener(
    "toggle",
    (event) => {
      if (event.target.matches("details[data-multi]"))
        state.roomOpen = event.target.open ? event.target.dataset.multi : null;
    },
    true,
  );
  modalRoot.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-modal-form]");
    if (!form) return;
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    if (form.dataset.modalForm === "establishment") {
      if (!values.name.trim()) return;
      state.draft.establishments.push(values);
      modalRoot.innerHTML = "";
      render({ keepScroll: true });
    }
    if (form.dataset.modalForm === "gauge") {
      const min = Number(values.min),
        max = Number(values.max);
      if (
        values.min === "" ||
        values.max === "" ||
        !Number.isFinite(min) ||
        !Number.isFinite(max) ||
        max <= min
      ) {
        document.getElementById("modal-error").textContent =
          "Maximum must be greater than minimum.";
        return;
      }
      state.gauge = { min, max };
      modalRoot.innerHTML = "";
      render({ keepScroll: true });
      toast("Gauge range updated.");
    }
    if (form.dataset.modalForm === "search") {
      const q = values.query.trim();
      navigate(q.toLowerCase().includes("novo") ? "companies" : "devices");
      state.search = q;
      render();
    }
  });
  let drag = null;
  phone.addEventListener("pointerdown", (e) => {
    const map = e.target.closest(".port-map");
    if (!map || e.target.closest("button,.map-tooltip")) return;
    drag = {
      map,
      startX: e.clientX,
      startY: e.clientY,
      x: state.map.x,
      y: state.map.y,
      moved: false,
    };
    map.setPointerCapture(e.pointerId);
  });
  phone.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const ratio = 324 / drag.map.getBoundingClientRect().width;
    const dx = (e.clientX - drag.startX) * ratio,
      dy = (e.clientY - drag.startY) * ratio;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
    state.map.x = Math.max(-180, Math.min(180, drag.x + dx));
    state.map.y = Math.max(-120, Math.min(120, drag.y + dy));
    updateMap();
  });
  phone.addEventListener("pointerup", (e) => {
    if (!drag) return;
    if (drag.map.dataset.map === "location" && !drag.moved) {
      const rect = drag.map.getBoundingClientRect();
      state.locationDraft = {
        x: Math.max(
          5,
          Math.min(95, ((e.clientX - rect.left) / rect.width) * 100),
        ),
        y: Math.max(
          5,
          Math.min(95, ((e.clientY - rect.top) / rect.height) * 100),
        ),
      };
      const marker = drag.map.querySelector(".map-marker");
      marker.style.left = state.locationDraft.x + "%";
      marker.style.top = state.locationDraft.y + "%";
    }
    drag = null;
  });
  phone.addEventListener("pointercancel", () => {
    drag = null;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      modalRoot.innerHTML = "";
      if (state.drawer) {
        state.drawer = false;
        render({ keepScroll: true });
      }
    }
    if (event.key === "Tab" && modalRoot.firstElementChild) {
      const focusable = [
        ...modalRoot.querySelectorAll("button,input,select,summary"),
      ].filter((el) => !el.disabled);
      const first = focusable[0],
        last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  const groups = [...new Set(CST.data.scenes.map((s) => s.group))];
  document.getElementById("scene-nav").innerHTML = groups
    .map(
      (group, i) =>
        `<details class="scene-group" ${i === 0 ? "open" : ""}><summary>${group}<span>${CST.data.scenes.filter((s) => s.group === group).length}</span></summary><div class="scene-entries">${CST.data.scenes
          .filter((s) => s.group === group)
          .map(
            (s) =>
              `<button type="button" class="scene-entry" data-scene="${s.id}">${s.label}</button>`,
          )
          .join("")}</div></details>`,
    )
    .join("");
  document.getElementById("scene-nav").addEventListener("click", (event) => {
    const el = event.target.closest("[data-scene]");
    if (el) showScene(el.dataset.scene);
  });
  function fitPhone() {
    const stage = document.querySelector(".device-stage");
    const frame = document.getElementById("phone");
    const narrow = window.innerWidth < 560;
    const available = Math.min(
      stage.clientWidth || 400,
      window.innerWidth - 32,
    );
    const scale = Math.min(
      1,
      (narrow ? 760 : Math.max(440, window.innerHeight - 155)) /
        frame.offsetHeight,
      available / (frame.offsetWidth + 10),
    );
    document.documentElement.style.setProperty(
      "--phone-scale",
      String(Math.max(0.4, scale)),
    );
  }
  document.getElementById("focus-toggle").addEventListener("click", () => {
    document.body.classList.toggle("focus-mode");
    document.getElementById("focus-toggle").textContent =
      document.body.classList.contains("focus-mode")
        ? "Exit focus"
        : "Focus mode";
    fitPhone();
  });
  window.addEventListener("resize", fitPhone);
  function reset() {
    epoch++;
    CST.tour?.stop();
    stopSimulation();
    store.reset();
    state = initial();
    modalRoot.innerHTML = "";
    hideToast();
    phone.classList.remove("dark-app");
    render();
  }
  document.getElementById("reset").addEventListener("click", reset);
  CST.app = {
    store,
    get state() {
      return state;
    },
    render,
    navigate,
    showScene,
    reset,
    toast,
    blankSensor,
    sampleUser,
    sampleCompany,
    updateDirector,
    cancelPending() {
      epoch++;
      render({ keepScroll: true });
    },
  };
  render();
  fitPhone();
})();
