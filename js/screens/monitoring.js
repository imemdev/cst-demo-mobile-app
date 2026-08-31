(function () {
  const { esc, iconButton, search, switchControl, button } = CST.ui;
  const markerPosition = ({ zoom, x, y }) => ({
    x: (((207.36 - 162) * zoom + 162 + x) / 324) * 100,
    y: (((90.64 - 103) * zoom + 103 + y) / 206) * 100,
  });
  function map(s, { location = false } = {}) {
    const { zoom, x, y } = s.map;
    return /* HTML */ `<div
      class="port-map"
      data-map="${location ? "location" : "overview"}"
      aria-label="Sfax port demo map. Drag to pan; use plus and minus to zoom."
    >
      <svg
        class="map-drawing"
        viewBox="0 0 324 206"
        role="img"
        aria-label="Schematic map of Sfax port"
      >
        <defs>
          <pattern
            id="map-grid"
            width="54"
            height="54"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M54 0H0V54"
              fill="none"
              stroke="#ffffff66"
              stroke-width="1"
            />
          </pattern>
          <pattern
            id="port-buildings"
            width="18"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <rect
              x="3"
              y="3"
              width="10"
              height="15"
              fill="#d6ced9"
              stroke="#b3a7b2"
              stroke-width=".8"
            />
          </pattern>
        </defs>
        <rect width="324" height="206" fill="#a8d3df" />
        <g
          data-map-geometry
          transform="translate(${x} ${y}) translate(162 103) scale(${zoom}) translate(-162 -103)"
        >
          <path
            d="M0 0H324V39L303 42 282 21 260 16 255 54 301 66 297 176 227 192 129 188 122 157 94 140 96 104 69 75 53 36 20 47 0 34Z"
            fill="#ecdfea"
            stroke="#a995ac"
            stroke-width="3"
          />
          <path
            d="M0 0H135L125 40 101 61 81 52 64 20 26 30 9 19Z"
            fill="#f1eee8"
            stroke="#c7beca"
            stroke-width="2"
          />
          <path
            d="M151-5 146 66 139 107 154 168 245 169 251 77 283 71"
            fill="none"
            stroke="#fbfbf5"
            stroke-width="11"
          />
          <path
            d="M151-5 146 66 139 107 154 168 245 169 251 77 283 71"
            fill="none"
            stroke="#cac3cb"
            stroke-width="1.5"
          />
          <path d="M162 5H218V161H159Z" fill="url(#port-buildings)" />
          <path
            d="M158 54h93M156 85h93M152 115h97M155 142h91M179 3v161M207 1v165M233 68v98"
            fill="none"
            stroke="#fafafa"
            stroke-width="5"
          />
          <path
            d="M132 193h129l5-32h-10v21H142l-8-45-9 2Z"
            fill="#e8dfe6"
            stroke="#a795a9"
            stroke-width="2"
          />
          <path
            d="M157 173v39m14-39v39m14-39v39m14-39v39m14-39v39m14-39v39"
            stroke="#f4f2e9"
            stroke-width="2"
          />
          <path
            d="M299 121l45-47m-48 79 44-29"
            fill="none"
            stroke="#b3a4b5"
            stroke-width="4"
          />
          <text
            x="247"
            y="58"
            fill="#998596"
            font-size="12"
            text-anchor="middle"
            font-family="Arial"
          >
            ميناء الصيد
          </text>
          <text
            x="249"
            y="74"
            fill="#998596"
            font-size="12"
            text-anchor="middle"
            font-family="Arial"
          >
            البحري بصفاقس
          </text>
          <text
            x="149"
            y="55"
            fill="#85818a"
            font-size="6"
            transform="rotate(-90 149 55)"
          >
            BOULEVARD
          </text>
        </g>
        <rect
          width="324"
          height="206"
          fill="url(#map-grid)"
          pointer-events="none"
        />
      </svg>
      <div class="map-controls">
        <button type="button" data-action="map-zoom-in" aria-label="Zoom in">
          +</button
        ><button type="button" data-action="map-zoom-out" aria-label="Zoom out">
          −
        </button>
      </div>
      ${((s.statusFilters.range || s.statusFilters.service) &&
        (!s.monitorSearch ||
          "NOVOGEL SFAX".includes(s.monitorSearch.toUpperCase()))) ||
      location
        ? `<button class="map-marker" data-action="${location ? "location-place" : "map-inspect"}" aria-label="${location ? "Select this location" : "Inspect Sfax sensor cluster"}" style="left:${location ? s.locationDraft?.x || 64 : markerPosition(s.map).x}%;top:${location ? s.locationDraft?.y || 44 : markerPosition(s.map).y}%">${CST.icon("chip")}</button>`
        : ""}${s.mapPopup && !location
        ? `<div class="map-tooltip"><strong>Novogel_Sfax · Azot_4</strong><span>31.06 mg/m3 · Out of Range</span>${button("open-live", "Open live monitoring", { style: "ghost" })}</div>`
        : ""}<span class="map-attribution">Sfax port · schematic demo map</span>
    </div>`;
  }
  function alertsCard(s, store, standalone = false) {
    const alerts = store
      .get("alerts")
      .filter(
        (a) =>
          s.alertFilters[a.type] &&
          (!s.monitorSearch ||
            ("NOVOGEL " + a.name)
              .toLowerCase()
              .includes(s.monitorSearch.toLowerCase())),
      );
    return /* HTML */ `<section class="alerts-card">
      <div class="alerts-title-row">
        <button
          type="button"
          data-action="open-alerts"
          aria-label="Open all live alerts"
        >
          ${CST.icon("alert")}Live Alerts</button
        ><span class="alert-count">${alerts.length} active</span>
      </div>
      <p class="alerts-description">
        Click locate to center on the affected site.
      </p>
      <div class="alert-filters">
        ${switchControl(
          "alert-range",
          "Out of Range",
          s.alertFilters.range,
          "red",
        )}${switchControl(
          "alert-service",
          "Out of Service",
          s.alertFilters.service,
          "orange",
        )}
      </div>
      <div class="alert-list">
        ${alerts
          .map(
            (a) =>
              `<article class="alert-item"><div class="alert-item-header"><button type="button" class="alert-link" data-action="alert-detail" data-id="${a.id}" aria-label="Open alert ${esc(a.name)}">${esc(a.site)} - ${esc(a.name)}</button>${a.type === "range" ? `<span class="alert-value">${a.value.toFixed(2)}mg/m3</span>` : '<span class="alert-service">Out of Service</span>'}</div>${a.type === "range" ? '<div class="alert-range">Allowed Range: <strong>ø → 0mg/m3</strong></div>' : ""}<div class="alert-meta">${CST.icon("calendar")}<span>${a.type === "range" ? "31/10/2024 14:23" : "–"}</span><span class="elapsed" ${a.type === "service" ? 'style="color:var(--orange)"' : ""}>${CST.icon("clock")}${a.type === "range" ? "557d 02:14" : "–"}</span><button class="locate" type="button" data-action="locate" data-id="${a.id}" aria-label="Locate ${esc(a.name)}">${CST.icon("pin")}Locate</button></div></article>`,
          )
          .join("") ||
        '<p class="no-results">No alerts match these filters.</p>'}
      </div>
    </section>`;
  }
  function overview(s, store) {
    const n =
      (s.statusFilters.range ? 1 : 0) + (s.statusFilters.service ? 7 : 0);
    return /* HTML */ `<section class="overview-page">
      <h1 class="page-heading">Analytics Dashboard</h1>
      <p class="monitor-subtitle">Real-time monitoring &amp; insights</p>
      <div class="monitor-search">
        <div class="search-box">
          ${CST.icon("search")}<input
            name="monitor-search"
            aria-label="Search monitoring sites"
            value="${esc(s.monitorSearch)}"
            placeholder="Search sites"
          />
        </div>
        ${iconButton("refresh-dashboard", "refresh", "Refresh dashboard")}
      </div>
      <section class="card distribution">
        <h2 class="section-title">${CST.icon("globe")}Distribution Overview</h2>
        <div class="distribution-filters">
          ${switchControl(
            "status-inRange",
            "In Range",
            s.statusFilters.inRange,
            "green",
          )}${switchControl(
            "status-range",
            "Out of Range",
            s.statusFilters.range,
            "red",
          )}${switchControl(
            "status-service",
            "Out of Service",
            s.statusFilters.service,
            "orange",
          )}
        </div>
        <div class="device-count">
          ${CST.icon("sensor")}<span
            >${s.monitorSearch &&
            !"NOVOGEL SFAX".includes(s.monitorSearch.toUpperCase())
              ? 0
              : n}
            Devices</span
          >
        </div>
        ${map(s)}
      </section>
      ${alertsCard(s, store)}
    </section>`;
  }
  function alerts(s, store) {
    return /* HTML */ `<section class="alerts-page">
      ${alertsCard(s, store, true)}
    </section>`;
  }
  function gauge(s) {
    const angle = CST.core.gaugeAngle(s.reading, s.gauge.min, s.gauge.max);
    const labels = Array.from({ length: 7 }, (_, i) => {
      const a = ((-135 + i * 45) * Math.PI) / 180;
      const x = 125 + 119 * Math.sin(a),
        y = 130 - 119 * Math.cos(a);
      const tx1 = 125 + 92 * Math.sin(a),
        ty1 = 130 - 92 * Math.cos(a);
      const tx2 = 125 + 100 * Math.sin(a),
        ty2 = 130 - 100 * Math.cos(a);
      return /* HTML */ `<line
          x1="${tx1}"
          y1="${ty1}"
          x2="${tx2}"
          y2="${ty2}"
          stroke="#fff"
          stroke-width="2"
        /><text x="${x}" y="${y + 4}" text-anchor="middle"
          >${Math.round(
            s.gauge.min + ((s.gauge.max - s.gauge.min) * i) / 6,
          )}</text
        >`;
    }).join("");
    return /* HTML */ `<svg
      class="gauge-svg"
      viewBox="0 0 250 260"
      role="img"
      aria-label="Gauge reading ${s.reading.toFixed(
        2,
      )} mg per cubic meter; range ${s.gauge.min} to ${s.gauge.max}"
    >
      <path
        d="M54.29 200.71A100 100 0 1 1 195.71 200.71"
        fill="none"
        stroke="#1cc655"
        stroke-width="8"
      />
      ${labels}
      <path
        d="M48 194l14-5-5 14Z M189 189l14 5-5 9Z"
        fill="#92aab1"
        stroke="white"
        stroke-width="2"
      />
      <g class="gauge-needle" style="transform:rotate(${angle}deg)">
        <path d="M125 130V48" stroke="#3d4b60" stroke-width="2" />
      </g>
      <circle
        cx="125"
        cy="130"
        r="6"
        fill="white"
        stroke="#3d4b60"
        stroke-width="2"
      />
    </svg>`;
  }
  function live(s) {
    return /* HTML */ `<section class="live-page">
      <div class="live-banner">
        <div>
          <h1>Live Monitoring</h1>
          <p>Real-time temperature tracking and analysis</p>
        </div>
        <span class="live-badge"
          ><span class="live-dot ${s.simulating ? "simulating" : ""}"></span
          >LIVE<br />SYSTEM</span
        >
      </div>
      <article class="gauge-card">
        <div class="gauge-label">
          <span>AZOT_4</span>${iconButton(
            "gauge-settings",
            "settings",
            "Live gauge settings",
          )}
        </div>
        ${gauge(s)}
        <div class="measurement">
          <output id="live-reading">${s.reading.toFixed(2)}</output
          ><span class="measure-unit">mg/m3</span>
        </div>
        <p class="gauge-sensor-name">Azot_4</p>
        <span class="device-chip">DEVICE</span>
        <div class="range-bar-wrap">
          <div class="range-limits">
            <span>${s.gauge.min}mg/m3</span><span>${s.gauge.max}mg/m3</span>
          </div>
          <div class="range-bar"></div>
          <div class="range-current">0</div>
          <div class="minmax-labels"><span>MIN</span><span>MAX</span></div>
        </div>
      </article>
      <div class="live-controls">
        ${button(
          "simulate-toggle",
          s.simulating ? "Pause simulation" : "Simulate readings",
          { style: "blue", symbol: "refresh" },
        )}${button("open-alerts", "Back to alerts", {
          style: "ghost",
          symbol: "back",
        })}<small class="gauge-warning"
          >${s.reading > s.gauge.max || s.reading < s.gauge.min
            ? "Reading outside configured gauge range; needle clamped."
            : "Reading is within the gauge scale."}
          Simulated locally.</small
        >
      </div>
    </section>`;
  }
  Object.assign(CST.screens, { overview, alerts, live });
  CST.monitoring = { map, gauge, markerPosition };
})();
