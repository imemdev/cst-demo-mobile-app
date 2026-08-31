const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// Minimal DOM adapter: these tests exercise the real app click handlers and
// state transitions, not browser rendering or geometry.
function setup() {
  const elements = new Map();
  const listeners = new Map();
  function element(id) {
    if (!elements.has(id)) {
      const classes = new Set();
      elements.set(id, {
        innerHTML: "",
        get firstElementChild() {
          return this.innerHTML ? {} : null;
        },
        style: { setProperty() {} },
        classList: {
          add: (value) => classes.add(value),
          remove: (value) => classes.delete(value),
          contains: (value) => classes.has(value),
        },
        querySelector: (selector) =>
          selector === ".app-scroll" ? element("scroll") : null,
        addEventListener() {},
        offsetWidth: 424,
        offsetHeight: 894,
        clientWidth: 500,
        scrollTop: 0,
      });
    }
    return elements.get(id);
  }
  const document = {
    getElementById: element,
    querySelector: (selector) =>
      selector === ".device-stage" ? element("stage") : null,
    querySelectorAll: () => [],
    addEventListener: (type, callback) => listeners.set(type, callback),
    documentElement: element("html"),
  };
  const context = vm.createContext({
    document,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
  });
  context.window = context;
  context.innerWidth = 1440;
  context.innerHeight = 1000;
  context.addEventListener = () => {};
  const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
  for (const [, file] of html.matchAll(/<script[^>]+src="([^"]+)"/g)) {
    if (file === "js/tour.js") continue;
    vm.runInContext(
      fs.readFileSync(path.join(__dirname, "..", file), "utf8"),
      context,
      { filename: file },
    );
  }
  let stops = 0;
  context.CST.tour = {
    stop() {
      stops++;
    },
  };
  return {
    app: context.CST.app,
    modal: element("modal-root"),
    get stops() {
      return stops;
    },
    click(action) {
      listeners.get("click")({
        target: { closest: () => ({ dataset: { action } }) },
      });
    },
  };
}

test("phone Back dismisses overlays before leaving an edit form", () => {
  const { app, modal, click } = setup();
  app.navigate("rooms");
  click("add-room");
  app.state.drawer = true;
  app.state.roomOpen = "sensors";
  modal.innerHTML = "<section>Dialog</section>";
  click("device-back");
  assert.equal(modal.innerHTML, "");
  assert.equal(app.state.drawer, true);
  click("device-back");
  assert.equal(app.state.drawer, false);
  assert.equal(app.state.roomOpen, "sensors");
  click("device-back");
  assert.equal(app.state.roomOpen, null);
  assert.equal(app.state.form, "room");
  click("device-back");
  assert.equal(app.state.form, null);
  assert.equal(app.state.route, "rooms");
});

test("phone Back returns through monitoring and company parent screens", () => {
  const { app, click } = setup();
  app.navigate("live");
  click("device-back");
  assert.equal(app.state.route, "alerts");
  click("device-back");
  assert.equal(app.state.route, "overview");
  click("device-back");
  assert.equal(app.state.route, "overview");
  app.navigate("company-form");
  click("device-back");
  assert.equal(app.state.route, "companies");
});

test("phone controls stop playback, preserve saved data, and reuse app navigation", () => {
  const session = setup();
  const { app, click, modal } = session;
  app.navigate("users");
  const saved = app.store.save("users", app.sampleUser());
  const dataBefore = JSON.stringify(app.store.get("users"));
  click("device-home");
  assert.equal(app.state.route, "overview");
  assert.equal(JSON.stringify(app.store.get("users")), dataBefore);
  assert.equal(app.store.find("users", saved.id).username, "imem");
  modal.innerHTML = "<section>Dialog</section>";
  click("device-menu");
  assert.equal(modal.innerHTML, "");
  assert.equal(app.state.drawer, true);
  click("device-menu");
  assert.equal(app.state.drawer, false);
  assert.equal(session.stops, 3);
});

test("phone navigation cannot skip login or leave the local demo", () => {
  const { app, click } = setup();
  for (const action of ["device-back", "device-home", "device-menu"]) {
    click(action);
    assert.equal(app.state.route, "login");
    assert.equal(app.state.drawer, false);
  }
});
