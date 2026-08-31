/* The tour uses the same DOM inputs, submissions and click handlers as a person. */
(function () {
  "use strict";
  const app = CST.app,
    phone = document.getElementById("phone-screen"),
    pointer = document.getElementById("tour-pointer");
  const run = document.getElementById("tour-run"),
    pauseButton = document.getElementById("tour-pause"),
    stopButton = document.getElementById("tour-stop"),
    status = document.getElementById("tour-status");
  let controller = null,
    paused = false;
  const speed = () => Number(document.getElementById("tour-speed").value);
  function wait(ms, signal) {
    return new Promise((resolve, reject) => {
      let remaining = ms,
        previous = performance.now();
      const tick = () => {
        if (signal.aborted) {
          reject(new DOMException("Tour stopped", "AbortError"));
          return;
        }
        const now = performance.now();
        if (!paused) remaining -= (now - previous) * speed();
        previous = now;
        if (remaining <= 0) resolve();
        else setTimeout(tick, 40);
      };
      tick();
    });
  }
  function element(selector) {
    const el = document.querySelector(selector);
    if (!el) throw new Error("Tour control missing: " + selector);
    return el;
  }
  async function tap(selector, signal) {
    await wait(60, signal);
    const el = element(selector);
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    await wait(320, signal);
    const p = phone.getBoundingClientRect(),
      r = el.getBoundingClientRect(),
      scale = p.width / 400;
    pointer.style.left = (r.left + r.width / 2 - p.left) / scale - 14 + "px";
    pointer.style.top = (r.top + r.height / 2 - p.top) / scale - 14 + "px";
    pointer.classList.add("visible");
    await wait(430, signal);
    el.click();
    pointer.classList.remove("visible");
    await wait(180, signal);
  }
  async function type(name, value, signal) {
    const input = element(`#phone-screen [name="${name}"]`);
    input.scrollIntoView({ behavior: "smooth", block: "nearest" });
    input.focus();
    input.value = "";
    for (const char of String(value)) {
      await wait(28, signal);
      input.value += char;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }
  async function select(name, value, signal) {
    await wait(250, signal);
    const el = element(`#phone-screen [name="${name}"]`);
    el.value = value;
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }
  async function go(route, signal) {
    await tap('[data-action="menu"]', signal);
    await tap(`.drawer [data-id="${route}"]`, signal);
  }
  async function saved(signal) {
    let remaining = 3000;
    while (document.querySelector("[data-pending]")) {
      await wait(100, signal);
      remaining -= 100;
      if (remaining <= 0) throw Error("Save did not finish.");
    }
    await wait(350, signal);
  }
  const steps = [
    {
      label: "01 · Authentication — empty form",
      scene: "login",
      run: async (signal) => {
        await wait(1500, signal);
      },
    },
    {
      label: "02 · Entering sample credentials",
      scene: "login-filled",
      run: async (signal) => {
        await type("email", "cst@gmail.com", signal);
        await type("password", "demo1234", signal);
        await wait(700, signal);
        await tap(".sign-in", signal);
        await saved(signal);
      },
    },
    {
      label: "03 · Consult users",
      scene: "users",
      run: async (signal) => {
        await go("users", signal);
        await wait(1400, signal);
      },
    },
    {
      label: "04 · Create a user",
      scene: "user-form",
      run: async (signal) => {
        await tap('[data-action="add-user"]', signal);
        for (const [key, value] of Object.entries(app.sampleUser())) {
          if (key === "active") continue;
          if (key === "role") await select(key, value, signal);
          else await type(key, value, signal);
        }
        await wait(700, signal);
      },
    },
    {
      label: "05 · Save and refresh the user table",
      scene: "user-saved",
      run: async (signal) => {
        await tap('[data-form="user"] [type="submit"]', signal);
        await saved(signal);
        await wait(1100, signal);
      },
    },
    {
      label: "06 · Consult companies",
      scene: "companies",
      run: async (signal) => {
        await go("companies", signal);
        await wait(1300, signal);
      },
    },
    {
      label: "07 · Validate required company fields",
      scene: "company-errors",
      run: async (signal) => {
        await tap('[data-action="add-company"]', signal);
        await tap('[data-form="company"] [type="submit"]', signal);
        await wait(1600, signal);
      },
    },
    {
      label: "08 · Complete and save the company",
      scene: "company-filled",
      run: async (signal) => {
        for (const [key, value] of Object.entries(app.sampleCompany())) {
          if (key === "establishments") continue;
          if (key === "activity" || key === "customerType")
            await select(key, value, signal);
          else await type(key, value, signal);
        }
        await wait(1000, signal);
        await tap('[data-form="company"] [type="submit"]', signal);
        await saved(signal);
      },
    },
    {
      label: "09 · Consult rooms",
      scene: "rooms",
      run: async (signal) => {
        await go("rooms", signal);
        await wait(1200, signal);
      },
    },
    {
      label: "10 · Assign a sensor to a new room",
      scene: "room-sensors",
      run: async (signal) => {
        await tap('[data-action="add-room"]', signal);
        await type("name", "Demo cold room", signal);
        await tap('[data-multi="sensors"] summary', signal);
        await wait(700, signal);
        await tap('input[name="sensors"]', signal);
        await tap('[data-multi="sensors"] summary', signal);
      },
    },
    {
      label: "11 · Select the alert contact",
      scene: "room-contacts",
      run: async (signal) => {
        await tap('[data-multi="contacts"] summary', signal);
        await wait(1000, signal);
        await tap('input[name="contacts"]', signal);
        await tap('[data-multi="contacts"] summary', signal);
        await tap('[data-form="room"] [type="submit"]', signal);
        await saved(signal);
      },
    },
    {
      label: "12 · Consult devices",
      scene: "devices",
      run: async (signal) => {
        await go("devices", signal);
        await wait(1200, signal);
      },
    },
    {
      label: "13 · Configure device identity and location",
      scene: "device-form",
      run: async (signal) => {
        await tap('[data-action="add-device"]', signal);
        await tap('[data-form="device"] [type="submit"]', signal);
        await wait(750, signal);
        await type("code", "DEMO-1042", signal);
        await type("name", "Demo Sensor Gateway", signal);
        await tap('[data-action="choose-location"]', signal);
        await wait(700, signal);
        await tap('[data-action="location-confirm"]', signal);
      },
    },
    {
      label: "14 · Configure and save the sensor",
      scene: "sensor-form",
      run: async (signal) => {
        const values = {
          name: "Demo probe",
          unit: "mg/m3",
          minGauge: "0",
          maxGauge: "40",
          label: "Gas",
          step: "5",
        };
        await select("sensors.0.type", "Gas concentration", signal);
        for (const [key, value] of Object.entries(values))
          await type("sensors.0." + key, value, signal);
        await wait(900, signal);
        await tap('[data-form="device"] [type="submit"]', signal);
        await saved(signal);
      },
    },
    {
      label: "15 · Explore the geographic dashboard",
      scene: "overview",
      run: async (signal) => {
        await go("overview", signal);
        await wait(1000, signal);
        await tap('[data-action="map-zoom-in"]', signal);
        await tap('[data-action="map-inspect"]', signal);
        await wait(1500, signal);
      },
    },
    {
      label: "16 · Inspect active alerts",
      scene: "alerts",
      run: async (signal) => {
        await tap('[data-action="open-alerts"]', signal);
        await wait(1600, signal);
      },
    },
    {
      label: "17 · Open the live measurement",
      scene: "live",
      run: async (signal) => {
        await tap('[data-action="alert-detail"][data-id="a0"]', signal);
        await wait(2000, signal);
      },
    },
    {
      label: "Demo extension · animate local readings",
      scene: "live",
      run: async (signal) => {
        await tap('[data-action="gauge-settings"]', signal);
        await type("min", "0", signal);
        await type("max", "40", signal);
        await tap('[data-modal-form="gauge"] [type="submit"]', signal);
        await tap('[data-action="gauge-settings"]', signal);
        await tap('#modal-root [data-action="simulate-toggle"]', signal);
        await wait(2500, signal);
      },
    },
  ];
  function controls(playing) {
    run.disabled = playing;
    pauseButton.disabled = !playing;
    stopButton.disabled = !playing;
    run.textContent = playing ? "● Demo running" : "▶ Run full demo";
    phone.classList.toggle("tour-playing", playing);
  }
  function stop() {
    if (controller) {
      controller.abort();
      controller = null;
      app.cancelPending();
      status.textContent = "Tour stopped · explore the app freely";
    }
    paused = false;
    pauseButton.textContent = "Pause";
    pointer.classList.remove("visible");
    controls(false);
  }
  async function start() {
    stop();
    app.reset();
    controller = new AbortController();
    const active = controller,
      signal = controller.signal;
    controls(true);
    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        status.textContent = step.label;
        document.getElementById("tour-progress-bar").style.width =
          (i / steps.length) * 100 + "%";
        app.state.scene = step.scene;
        await step.run(signal);
        app.state.scene = step.scene;
        app.updateDirector();
        await wait(300, signal);
      }
      status.textContent = "Tour complete · all 17 report states covered";
      document.getElementById("tour-progress-bar").style.width = "100%";
    } catch (error) {
      if (error.name !== "AbortError") {
        status.textContent = "Tour paused: " + error.message;
        console.error(error);
      }
    } finally {
      if (controller === active) {
        controller = null;
        paused = false;
        pauseButton.textContent = "Pause";
        controls(false);
        pointer.classList.remove("visible");
      }
    }
  }
  run.addEventListener("click", start);
  pauseButton.addEventListener("click", () => {
    paused = !paused;
    pauseButton.textContent = paused ? "Resume" : "Pause";
  });
  stopButton.addEventListener("click", stop);
  CST.tour = { start, stop };
})();
