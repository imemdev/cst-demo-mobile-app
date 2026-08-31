const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const base = path.join(__dirname, "..");
const context = vm.createContext({});
context.window = context;
for (const file of [
  "data.js",
  "store.js",
  "icons.js",
  "ui.js",
  "screens/auth.js",
  "screens/lists.js",
  "screens/users.js",
  "screens/companies.js",
  "screens/rooms.js",
  "screens/devices.js",
  "screens/monitoring.js",
]) {
  vm.runInContext(
    fs.readFileSync(path.join(base, "js", file), "utf8"),
    context,
    { filename: file },
  );
}
const { CST } = context;
const store = CST.core.createStore(CST.data.seed);
function state() {
  return {
    route: "login",
    draft: {
      email: "",
      password: "",
      name: "",
      sensors: [],
      contacts: [],
      establishments: [],
    },
    errors: {},
    search: "",
    monitorSearch: "NOVOGEL",
    page: 1,
    pageSize: 10,
    form: null,
    roomOpen: null,
    showPassword: false,
    map: { x: 0, y: 0, zoom: 1 },
    mapPopup: false,
    statusFilters: { inRange: true, range: true, service: true },
    alertFilters: { range: true, service: true },
    reading: 31.06,
    gauge: { min: -100, max: -40 },
    simulating: false,
  };
}
test("all 17 report states have renderable screens with no screenshot backgrounds", () => {
  assert.equal(CST.data.scenes.length, 17);
  for (const scene of CST.data.scenes) {
    assert.equal(typeof CST.screens[scene.route], "function");
    const html = CST.screens[scene.route](state(), store);
    assert.doesNotMatch(
      html,
      /phone pfe|monitor-overview\.png|monitor-live\.png|data:image|<canvas/i,
    );
    if (scene.route !== "login") assert.doesNotMatch(html, /<img\b/);
  }
});
test("authentication controls contain real editable input elements", () => {
  const html = CST.screens.login(state());
  assert.match(html, /<input[^>]+name="email"[^>]+type="email"/);
  assert.match(html, /<input[^>]+name="password"[^>]+type="password"/);
  assert.match(html, /<button[^>]+type="submit"/);
});
test("management renderers escape edited values before inserting HTML", () => {
  const s = state();
  s.draft.name = '"><script>alert(1)</script>';
  const form = CST.screens["company-form"](s);
  assert.doesNotMatch(form, /<script>/);
  assert.match(form, /&lt;script&gt;/);
});
test("out-of-range, out-of-service and empty alert filters affect actual list content", () => {
  const s = state();
  const count = () =>
    (CST.screens.alerts(s, store).match(/class="alert-item"/g) || []).length;
  assert.equal(count(), 14);
  s.alertFilters.service = false;
  assert.equal(count(), 1);
  s.alertFilters.range = false;
  assert.equal(count(), 0);
  s.alertFilters.service = true;
  assert.equal(count(), 13);
  s.monitorSearch = "unmatched";
  assert.equal(count(), 0);
});
test("site filtering removes both the map marker and device count", () => {
  const s = state();
  s.monitorSearch = "unmatched";
  const html = CST.screens.overview(s, store);
  assert.match(html, /0\s+Devices/);
  assert.doesNotMatch(html, /class="map-marker"/);
});
test("map marker follows the same pan and zoom transformation as the vector streets", () => {
  const a = CST.monitoring.markerPosition({ zoom: 1, x: 0, y: 0 });
  const b = CST.monitoring.markerPosition({ zoom: 1, x: 32.4, y: 20.6 });
  assert.ok(Math.abs(b.x - a.x - 10) < 0.0001);
  assert.ok(Math.abs(b.y - a.y - 10) < 0.0001);
  const c = CST.monitoring.markerPosition({ zoom: 2, x: 0, y: 0 });
  assert.ok(c.x > a.x);
});
test("sensor forms create separately named fields for multiple sensors", () => {
  const s = state();
  s.form = "device";
  s.draft = { code: "", name: "", sensors: [{}, {}] };
  const html = CST.screens.devices(s, store);
  assert.match(html, /name="sensors\.0\.name"/);
  assert.match(html, /name="sensors\.1\.name"/);
  assert.match(html, /data-action="remove-sensor"/);
});
