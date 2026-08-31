(function (root) {
  "use strict";
  const copy = (value) => JSON.parse(JSON.stringify(value));
  function createStore(seed) {
    let data = copy(seed),
      counter = 0;
    return {
      get: (collection) => copy(data[collection]),
      find: (collection, id) =>
        copy(data[collection].find((row) => row.id === id) || null),
      save(collection, record) {
        const rows = data[collection];
        if (!Array.isArray(rows)) throw Error("Unknown collection");
        const index = record.id
          ? rows.findIndex((row) => row.id === record.id)
          : -1;
        const saved = {
          ...copy(record),
          id: index >= 0 ? record.id : "demo-" + ++counter,
        };
        if (index >= 0) rows[index] = saved;
        else if (collection === "users")
          rows.splice(Math.min(5, rows.length), 0, saved);
        else rows.push(saved);
        return copy(saved);
      },
      remove(collection, id) {
        const index = data[collection].findIndex((row) => row.id === id);
        return index < 0 ? null : data[collection].splice(index, 1)[0];
      },
      reset() {
        data = copy(seed);
        counter = 0;
      },
    };
  }
  function validateRequired(record, fields) {
    return Object.fromEntries(
      fields
        .filter(
          (key) =>
            record[key] === undefined || String(record[key]).trim() === "",
        )
        .map((key) => [key, "This field is required."]),
    );
  }
  function validate(kind, record) {
    const required = {
      login: ["email", "password"],
      user: ["username", "name", "firstName", "email", "role"],
      company: ["name", "customerType", "activity", "email", "phone", "fax"],
      room: ["name"],
      device: ["code", "name"],
      sensor: ["name", "type", "unit", "minGauge", "maxGauge", "label", "step"],
    };
    const errors = validateRequired(record, required[kind] || []);
    if (kind === "company") {
      const labels = {
        name: "Company name",
        customerType: "Type Client",
        activity: "Activity",
        email: "E-mail",
        phone: "Phone",
        fax: "Fax",
      };
      Object.keys(errors).forEach(
        (key) => (errors[key] = labels[key] + " is required!"),
      );
    }
    if (
      ["login", "user", "company"].includes(kind) &&
      record.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)
    )
      errors.email = "Enter a valid email address.";
    if (kind === "login" && record.password && record.password.length < 4)
      errors.password = "Use at least four characters for this demo.";
    if (kind === "sensor") {
      ["minGauge", "maxGauge", "step", "minThreshold", "maxThreshold"].forEach(
        (key) => {
          if (
            record[key] !== undefined &&
            record[key] !== "" &&
            !Number.isFinite(Number(record[key]))
          )
            errors[key] = "Enter a number.";
        },
      );
      if (
        record.minGauge !== "" &&
        record.maxGauge !== "" &&
        Number(record.maxGauge) <= Number(record.minGauge)
      )
        errors.maxGauge = "Maximum must be greater than minimum.";
      if (record.step !== "" && Number(record.step) <= 0)
        errors.step = "Step must be greater than zero.";
      if (
        record.minThreshold !== "" &&
        record.maxThreshold !== "" &&
        Number(record.maxThreshold) < Number(record.minThreshold)
      )
        errors.maxThreshold = "Maximum threshold must not be below minimum.";
    }
    return errors;
  }
  function gaugeAngle(value, min, max) {
    if (![value, min, max].every(Number.isFinite) || max <= min) return -135;
    return -135 + Math.max(0, Math.min(1, (value - min) / (max - min))) * 270;
  }
  const exports = { createStore, validate, gaugeAngle, copy };
  if (typeof module !== "undefined") module.exports = exports;
  else (root.CST ||= {}).core = exports;
})(typeof window !== "undefined" ? window : globalThis);
