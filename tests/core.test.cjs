const test = require("node:test");
const assert = require("node:assert/strict");
const { seed } = require("../js/data.js");
const { createStore, validate, gaugeAngle } = require("../js/store.js");

test("create, edit and reset a user without mutating the report fixtures", () => {
  const store = createStore(seed);
  const initial = store.get("users").length;
  const saved = store.save("users", {
    username: "demo",
    firstName: "A",
    name: "B",
    email: "demo@example.test",
    role: "User",
  });
  assert.equal(store.get("users").length, initial + 1);
  store.save("users", { ...saved, firstName: "Updated" });
  assert.equal(store.get("users").length, initial + 1);
  assert.equal(store.find("users", saved.id).firstName, "Updated");
  const snapshot = store.get("users");
  snapshot[0].username = "external mutation";
  assert.notEqual(store.get("users")[0].username, "external mutation");
  store.reset();
  assert.deepEqual(store.get("users"), seed.users);
});

test("device and sensor creation preserves the whole nested record", () => {
  const store = createStore(seed);
  const d = store.save("devices", {
    code: "DEMO-1",
    name: "Demo gateway",
    sensors: [
      { name: "Probe", unit: "°C" },
      { name: "Humidity", unit: "%" },
    ],
  });
  d.sensors[0].unit = "changed outside store";
  assert.equal(store.find("devices", d.id).sensors[0].unit, "°C");
  assert.equal(store.find("devices", d.id).sensors.length, 2);
  assert.equal(store.remove("devices", d.id).id, d.id);
  assert.equal(store.find("devices", d.id), null);
});

test("room selection saves independent contact and sensor arrays", () => {
  const store = createStore(seed);
  const room = store.save("rooms", {
    name: "Demo",
    contacts: ["Contact A", "Contact B"],
    sensors: ["Azot_3"],
  });
  assert.deepEqual(store.find("rooms", room.id).sensors, ["Azot_3"]);
  assert.equal(store.find("rooms", room.id).contacts.length, 2);
  store.save("rooms", { ...room, sensors: [] });
  assert.deepEqual(store.find("rooms", room.id).sensors, []);
});

test("login rejects missing, malformed and too-short values", () => {
  assert.deepEqual(Object.keys(validate("login", {})).sort(), [
    "email",
    "password",
  ]);
  assert.ok(validate("login", { email: "no-at-sign", password: "demo" }).email);
  assert.ok(
    validate("login", { email: "demo@example.test", password: "a" }).password,
  );
  assert.deepEqual(
    validate("login", { email: "demo@example.test", password: "demo" }),
    {},
  );
});

test("company empty form produces all six report error states", () => {
  assert.equal(Object.keys(validate("company", {})).length, 6);
  assert.equal(validate("company", {}).name, "Company name is required!");
  assert.ok(validate("company", { name: "   " }).name);
});

test("sensor numeric validation handles zero, reversed ranges and invalid steps", () => {
  const valid = {
    name: "Probe",
    type: "Gas",
    unit: "mg/m3",
    minGauge: 0,
    maxGauge: 40,
    step: 5,
    label: "Gas",
    minThreshold: 0,
    maxThreshold: 35,
  };
  assert.deepEqual(validate("sensor", valid), {});
  assert.ok(validate("sensor", { ...valid, maxGauge: -1 }).maxGauge);
  assert.ok(validate("sensor", { ...valid, step: 0 }).step);
  assert.ok(validate("sensor", { ...valid, minGauge: "NaN" }).minGauge);
  assert.ok(validate("sensor", { ...valid, minThreshold: 40 }).maxThreshold);
});

test("gauge clamps the out-of-scale report reading without inventing a valid scale position", () => {
  assert.equal(gaugeAngle(31.06, -100, -40), 135);
  assert.equal(gaugeAngle(-200, -100, -40), -135);
  assert.equal(gaugeAngle(-70, -100, -40), 0);
  assert.equal(gaugeAngle(20, 0, 40), 0);
  assert.equal(gaugeAngle(20, 10, 10), -135);
  assert.equal(gaugeAngle(NaN, 0, 40), -135);
});
