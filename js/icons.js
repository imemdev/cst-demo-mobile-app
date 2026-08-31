(function () {
  const paths = {
    menu: "M4 6h16M4 12h16M4 18h16",
    search: "M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
    user: "M20 21a8 8 0 0 0-16 0 M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
    users:
      "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M20 21v-2a4 4 0 0 0-3-4 M16 3a4 4 0 0 1 0 8",
    mail: "M3 4h18v16H3z M3 5l9 7 9-7",
    lock: "M5 10h14v11H5z M8 10V6a4 4 0 0 1 8 0v4",
    eye: "M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12 M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
    plus: "M12 4v16M4 12h16",
    minus: "M4 12h16",
    close: "M5 5l14 14M19 5L5 19",
    chevron: "M5 9l7 7 7-7",
    back: "M20 12H4m7-7-7 7 7 7",
    save: "M4 3h13l4 4v14H3V3z M7 3v6h10V3 M7 21v-8h10v8",
    edit: "M14 4H4v17h17V11 M19 2l3 3-10 10-4 1 1-4z",
    trash: "M3 5h18M9 5V2h6v3M5 5l1 17h12l1-17M10 9v9M14 9v9",
    building:
      "M4 21V3h10v18M14 9h6v12M2 21h20M7 7h1m2 0h1M7 11h1m2 0h1M7 15h1m2 0h1M17 13h1m-1 4h1",
    phone: "M6 3l4 5-3 3a15 15 0 0 0 6 6l3-3 5 4c-1 5-4 5-8 3C7 18 2 12 2 6z",
    fax: "M6 3v6m12-6v6M4 8H2v13h20V8h-4M6 13h12v5H6zM12 2v9m-3-3 3 3 3-3",
    home: "M2 11l10-9 10 9M5 9v13h14V9M10 22v-8h4v8",
    sensor:
      "M3 7a9 9 0 0 0 0 10M6 9a5 5 0 0 0 0 6M21 7a9 9 0 0 1 0 10M18 9a5 5 0 0 1 0 6M13 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0",
    chip: "M6 6h12v12H6zM9 9h6v6H9zM9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4M18 9h4m-4 6h4",
    pin: "M20 9c0 6-8 13-8 13S4 15 4 9a8 8 0 1 1 16 0 M15 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
    globe:
      "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M2 12h20M12 2c6 6 6 14 0 20-6-6-6-14 0-20",
    alert: "M12 2L1 21h22z M12 8v6m0 3v1",
    refresh:
      "M20 7a9 9 0 0 0-15-2L2 8m0-6v6h6M4 17a9 9 0 0 0 15 2l3-3m0 6v-6h-6",
    check: "M4 12l5 5L20 6",
    clock: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M12 6v6l4 3",
    calendar: "M3 5h18v17H3zM7 2v6m10-6v6M3 10h18",
    settings:
      "M3 6h5m4 0h9M3 12h11m4 0h3M3 18h3m4 0h11M8 3h4v6H8zM14 9h4v6h-4zM6 15h4v6H6z",
    moon: "M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10",
    logout: "M10 3H3v18h7M14 7l5 5-5 5M8 12h13",
    bars: "M4 5h3v14H4zM10 5h3v14h-3zM16 5h3v14h-3z",
    unit: "M3 7h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4z",
    layers: "M12 3l10 5-10 5L2 8zM2 12l10 5 10-5M2 17l10 5 10-5",
  };
  window.CST.icon = (name) =>
    `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.chip}"/></svg>`;
})();
