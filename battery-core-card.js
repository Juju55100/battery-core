/* Battery Core Card v0.8.1 — standalone Home Assistant Lovelace card
 * Futuristic battery core with visual editor, adjustable scale and SOC ring.
 */

const BATTERY_CORE_STYLE = `
/* V0.8: visual styling is maintained in battery-core-card.css.
   This tiny fallback only prevents an unstyled flash if the CSS resource is late. */
battery-core-card { display:block; width:100%; }
battery-core-card .battery-card { background:transparent!important; box-shadow:none!important; border:0!important; }
`;
if (!document.head.querySelector('style[data-battery-core-card]')) {
  const style = document.createElement('style');
  style.dataset.batteryCoreCard = 'true';
  style.textContent = BATTERY_CORE_STYLE;
  document.head.appendChild(style);
}


function batteryCoreEnsureCss() {
  if (document.querySelector('link[data-battery-core-css="v0.8"]')) return;
  try {
    const scripts = [...document.querySelectorAll('script[src]')];
    const own = scripts.find(s => /battery-core-card(?:-v[\d.]+)?\.js(?:\?|$)/.test(s.src));
    const href = own
      ? new URL("battery-core-card.css", own.src).href
      : "/local/community/battery-core/battery-core-card.css";
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.batteryCoreCss = "v0.8";
    document.head.appendChild(link);
  } catch (e) {
    console.warn("Battery Core Card: impossible de charger battery-core-card.css", e);
  }
}
batteryCoreEnsureCss();

class BatteryCoreCard extends HTMLElement {
  static getStubConfig() {
    return {
      type: "custom:battery-core-card",
      battery_soc: "sensor.onduleur_soc_batterie_1",
      battery_power: "sensor.onduleur_puissance_batterie_1",
      time_remaining: "sensor.temps_de_charge_restant_batterie",
      capacity: 29,
      title: "BATTERIE",
      model: "LIFEPO4",
      size: "compact",
      scale_percent: 75
    };
  }

  static getConfigElement() {
    return document.createElement("battery-core-card-editor");
  }

  setConfig(config) {
    if (!config || !config.battery_soc || !config.battery_power) {
      throw new Error("Battery Core Card: battery_soc and battery_power are required");
    }
    this.config = {
      title: "BATTERIE",
      model: "LIFEPO4",
      capacity: 29,
      size: "compact",
      scale_percent: 75,
      battery_soc: config.battery_soc,
      battery_power: config.battery_power,
      time_remaining: config.time_remaining,
      voltage: config.voltage,
      temperature: config.temperature,
      current: config.current,
      solar_power: config.solar_power,
      house_power: config.house_power,
      grid_power: config.grid_power,
      compact: false,
      ...config
    };
    this._rendered = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._rendered) {
      this._render();
      this._rendered = true;
    }
    this._update();
  }

  getCardSize() {
    const sizes = { compact: 6, normal: 8, large: 10, fullscreen: 12 };
    return sizes[this.config?.size] || 8;
  }

  _state(entity, fallback = "—") {
    if (!entity || !this._hass?.states?.[entity]) return fallback;
    return this._hass.states[entity].state;
  }

  _num(entity, fallback = 0) {
    const n = parseFloat(this._state(entity, ""));
    return Number.isFinite(n) ? n : fallback;
  }

  _powerNum(entity, fallback = 0) {
    const stateObj = entity ? this._hass?.states?.[entity] : null;
    const n = parseFloat(stateObj?.state);
    if (!Number.isFinite(n)) return fallback;

    // V0.7: use Home Assistant's declared unit instead of guessing.
    const unit = String(stateObj?.attributes?.unit_of_measurement || "").trim().toLowerCase();
    if (unit === "w" || unit === "watt" || unit === "watts") return n / 1000;
    if (unit === "mw") return n / 1000000;
    if (unit === "kw") return n;

    // Fallback only for entities that do not expose a unit.
    return Math.abs(n) > 100 ? n / 1000 : n;
  }

  _render() {
    this.innerHTML = `
      <style>
        ${BATTERY_CORE_STYLE}
      
/* =========================================================
   V0.5 HARD LAYOUT FIX
   Percentage columns prevent the right panel from being pushed
   outside the Lovelace preview/card.
   ========================================================= */
battery-core-card .shell {
  width:100% !important;
  max-width:100% !important;
  box-sizing:border-box !important;
  overflow:hidden !important;
}
battery-core-card .main-grid,
battery-core-card .shell.size-compact .main-grid,
battery-core-card .shell.size-normal .main-grid,
battery-core-card .shell.size-large .main-grid,
battery-core-card .shell.size-fullscreen .main-grid {
  width:100% !important;
  max-width:100% !important;
  box-sizing:border-box !important;
  display:grid !important;
  grid-template-columns:28% 44% 28% !important;
  gap:0 !important;
  overflow:hidden !important;
}
battery-core-card .main-grid > section {
  width:100% !important;
  max-width:100% !important;
  min-width:0 !important;
  box-sizing:border-box !important;
}
battery-core-card .side.left {
  padding-right:8px;
}
battery-core-card .side.right {
  padding-left:8px;
  overflow:hidden !important;
}
battery-core-card .side.right .metric,
battery-core-card .side.left .metric {
  width:100% !important;
  max-width:100% !important;
  box-sizing:border-box !important;
}
battery-core-card .core-wrap {
  width:100% !important;
  max-width:100% !important;
  justify-self:center !important;
  overflow:visible !important;
}
battery-core-card .ring,
battery-core-card .ticks,
battery-core-card .orbit,
battery-core-card .battery-core,
battery-core-card .energy-streams {
  left:50% !important;
  right:auto !important;
  margin-left:0 !important;
  transform:translateX(-50%) !important;
}
battery-core-card .ring-mid {
  transform:translateX(-50%) !important;
}
battery-core-card .ticks {
  transform:translateX(-50%) !important;
}
battery-core-card .orbit {
  transform:translateX(-50%) rotate(25deg) !important;
}
battery-core-card .orbit-b {
  transform:translateX(-50%) rotate(-35deg) !important;
}
battery-core-card .battery-core {
  position:absolute !important;
  top:50% !important;
  transform:translate(-50%,-50%) !important;
}
battery-core-card .energy-streams {
  transform:translateX(-50%) scale(var(--bc-scale)) !important;
}
battery-core-card .status-pill {
  left:50% !important;
  right:auto !important;
  transform:translateX(-50%) !important;
  white-space:nowrap;
}
battery-core-card .power-value,
battery-core-card .time-value,
battery-core-card .big-value,
battery-core-card .mini-grid b {
  max-width:100% !important;
  overflow:hidden !important;
  text-overflow:ellipsis !important;
  white-space:nowrap !important;
}
battery-core-card .flow {
  width:100% !important;
  max-width:100% !important;
  box-sizing:border-box !important;
  overflow:hidden !important;
}
battery-core-card .flow-node {
  min-width:0 !important;
  flex:1 1 0 !important;
}
battery-core-card .footer {
  width:100% !important;
  max-width:100% !important;
  box-sizing:border-box !important;
  overflow:hidden !important;
}

/* On genuinely narrow cards, stack the information panels below the core. */
@media (max-width: 700px) {
  battery-core-card .main-grid,
  battery-core-card .shell.size-compact .main-grid,
  battery-core-card .shell.size-normal .main-grid,
  battery-core-card .shell.size-large .main-grid,
  battery-core-card .shell.size-fullscreen .main-grid {
    grid-template-columns:1fr 1fr !important;
  }
  battery-core-card .core-wrap {
    grid-column:1 / -1 !important;
    grid-row:1 !important;
  }
  battery-core-card .side.left {
    grid-column:1 !important;
    grid-row:2 !important;
  }
  battery-core-card .side.right {
    grid-column:2 !important;
    grid-row:2 !important;
  }
}


/* =========================================================
   V0.6 — LANDSCAPE + ENERGY FLOW
   ========================================================= */
battery-core-card .shell {
  min-height:0 !important;
}

/* Real landscape: SOC | CORE | POWER */
battery-core-card .main-grid,
battery-core-card .shell.size-compact .main-grid,
battery-core-card .shell.size-normal .main-grid,
battery-core-card .shell.size-large .main-grid,
battery-core-card .shell.size-fullscreen .main-grid {
  display:grid !important;
  grid-template-columns:30% 40% 30% !important;
  align-items:center !important;
  gap:0 !important;
  min-height:0 !important;
}
battery-core-card .side.left { grid-column:1 !important; grid-row:1 !important; }
battery-core-card .core-wrap { grid-column:2 !important; grid-row:1 !important; }
battery-core-card .side.right { grid-column:3 !important; grid-row:1 !important; }

battery-core-card .core-wrap {
  min-height:280px !important;
  height:calc(430px * var(--bc-scale)) !important;
}
battery-core-card .side.left,
battery-core-card .side.right {
  align-self:center !important;
}

/* Strong, visible horizontal floating energy surface exactly at SOC level */
battery-core-card .liquid {
  overflow:visible !important;
}
battery-core-card .wave {
  top:-13px !important;
  left:-35% !important;
  width:170% !important;
  height:28px !important;
  border:0 !important;
  border-radius:50% !important;
  background:transparent !important;
  box-shadow:none !important;
}
battery-core-card .wave::before {
  content:"";
  position:absolute;
  left:0; right:0; top:10px;
  height:7px;
  border-radius:50%;
  background:linear-gradient(90deg,
    transparent 0%,
    rgba(120,250,255,.55) 12%,
    rgba(225,255,255,1) 45%,
    rgba(80,235,255,.9) 72%,
    transparent 100%);
  box-shadow:
    0 0 7px rgba(150,255,255,.95),
    0 0 15px rgba(0,225,255,.8);
  transform:rotate(-2deg);
}
battery-core-card .wave1 { animation:bcSurfaceA 2.8s ease-in-out infinite !important; }
battery-core-card .wave2 { animation:bcSurfaceB 3.4s ease-in-out infinite !important; opacity:.55 !important; }

/* Upward energy arrows inside battery when charging */
battery-core-card .charge-arrows {
  position:absolute;
  inset:18px 0;
  z-index:3;
  pointer-events:none;
  overflow:hidden;
}
battery-core-card .charge-arrows span {
  position:absolute;
  left:50%;
  bottom:-28px;
  width:22px;
  height:22px;
  margin-left:-11px;
  border-left:5px solid rgba(125,255,255,.92);
  border-top:5px solid rgba(125,255,255,.92);
  transform:rotate(45deg);
  filter:drop-shadow(0 0 6px #00eaff);
  opacity:0;
  animation:bcArrowRise 2.1s linear infinite;
}
battery-core-card .charge-arrows span:nth-child(2){animation-delay:-.7s}
battery-core-card .charge-arrows span:nth-child(3){animation-delay:-1.4s}

battery-core-card.discharging .charge-arrows span {
  border-color:rgba(255,190,70,.95);
  filter:drop-shadow(0 0 6px #ff9d00);
  animation-name:bcArrowFall;
}
battery-core-card:not(.charging):not(.discharging) .charge-arrows span {
  animation-play-state:paused;
  opacity:0;
}

/* External bottom-to-top energy injection */
battery-core-card.charging .energy-streams i {
  animation-direction:normal !important;
}
battery-core-card.discharging .energy-streams i {
  animation-direction:reverse !important;
}

@keyframes bcSurfaceA {
  0%,100% { transform:translateX(-3%) translateY(1px) rotate(-1deg); }
  50% { transform:translateX(3%) translateY(-3px) rotate(1deg); }
}
@keyframes bcSurfaceB {
  0%,100% { transform:translateX(3%) translateY(-2px) rotate(1deg); }
  50% { transform:translateX(-3%) translateY(2px) rotate(-1deg); }
}
@keyframes bcArrowRise {
  0% { bottom:-28px; opacity:0; }
  18% { opacity:.95; }
  78% { opacity:.8; }
  100% { bottom:92%; opacity:0; }
}
@keyframes bcArrowFall {
  0% { bottom:92%; opacity:0; }
  18% { opacity:.95; }
  78% { opacity:.8; }
  100% { bottom:-28px; opacity:0; }
}

/* Only stack on genuinely phone-sized cards. */
@media (max-width:520px) {
  battery-core-card .main-grid,
  battery-core-card .shell.size-compact .main-grid,
  battery-core-card .shell.size-normal .main-grid,
  battery-core-card .shell.size-large .main-grid,
  battery-core-card .shell.size-fullscreen .main-grid {
    grid-template-columns:1fr !important;
  }
  battery-core-card .core-wrap { grid-column:1 !important; grid-row:1 !important; }
  battery-core-card .side.left { grid-column:1 !important; grid-row:2 !important; }
  battery-core-card .side.right { grid-column:1 !important; grid-row:3 !important; }
}


/* V0.7 — clearer SOC surface and fine vertical energy particles */
battery-core-card .glass { overflow:hidden !important; }
battery-core-card .liquid {
  overflow:visible !important;
  transition:height .8s cubic-bezier(.2,.8,.2,1) !important;
}
battery-core-card .wave {
  position:absolute !important;
  left:-30% !important;
  top:-10px !important;
  width:160% !important;
  height:22px !important;
  border:0 !important;
  border-radius:50% !important;
  background:transparent !important;
  box-shadow:none !important;
}
battery-core-card .wave::before {
  content:"";
  position:absolute;
  left:0; top:7px; width:100%; height:5px;
  border-radius:50%;
  background:linear-gradient(90deg,transparent,rgba(185,255,255,.9),#fff,rgba(90,240,255,.9),transparent);
  box-shadow:0 0 5px #fff,0 0 12px #00eaff,0 0 22px rgba(0,170,255,.6);
}
battery-core-card .wave1 { animation:bcWaveSurface1 2.7s ease-in-out infinite !important; }
battery-core-card .wave2 { top:-7px !important; opacity:.45 !important; animation:bcWaveSurface2 3.3s ease-in-out infinite !important; }

battery-core-card .energy-particles {
  position:absolute;
  inset:22px 10px;
  z-index:3;
  overflow:hidden;
  pointer-events:none;
  border-radius:20px;
}
battery-core-card .energy-particles i {
  position:absolute;
  bottom:-14px;
  width:4px;
  height:14px;
  border-radius:999px;
  opacity:0;
  background:linear-gradient(to top,rgba(0,190,255,0),rgba(110,250,255,.95),#fff);
  box-shadow:0 0 5px #fff,0 0 10px #00e1ff;
  animation:bcParticleRise 2s linear infinite;
}
battery-core-card .energy-particles i:nth-child(1){left:16%}
battery-core-card .energy-particles i:nth-child(2){left:31%;height:9px}
battery-core-card .energy-particles i:nth-child(3){left:46%;height:17px}
battery-core-card .energy-particles i:nth-child(4){left:60%;height:11px}
battery-core-card .energy-particles i:nth-child(5){left:74%;height:14px}
battery-core-card .energy-particles i:nth-child(6){left:86%;height:8px}
battery-core-card.discharging .energy-particles i {
  top:-14px; bottom:auto;
  background:linear-gradient(to bottom,rgba(255,190,70,0),rgba(255,195,70,.95),#fff3b0);
  box-shadow:0 0 5px #fff3b0,0 0 10px #ff911e;
  animation-name:bcParticleFall;
}
battery-core-card:not(.charging):not(.discharging) .energy-particles i { opacity:0; animation-play-state:paused; }
battery-core-card .charge-arrows { display:none !important; }

@keyframes bcWaveSurface1 {
  0%,100%{transform:translateX(-4%) translateY(1px) scaleY(.85)}
  50%{transform:translateX(4%) translateY(-2px) scaleY(1.15)}
}
@keyframes bcWaveSurface2 {
  0%,100%{transform:translateX(5%) translateY(-1px)}
  50%{transform:translateX(-5%) translateY(2px)}
}
@keyframes bcParticleRise {
  0%{transform:translateY(0) scale(.65);opacity:0}
  12%{opacity:.9} 72%{opacity:.7}
  100%{transform:translateY(-190px) scale(1.05);opacity:0}
}
@keyframes bcParticleFall {
  0%{transform:translateY(0) scale(.65);opacity:0}
  12%{opacity:.9} 72%{opacity:.7}
  100%{transform:translateY(190px) scale(1.05);opacity:0}
}

</style>

      <div class="scale-stage">
        <div class="scale-target">
      <ha-card class="battery-card">
        <div class="shell size-${this.config.size || "compact"}">
          <div class="top-corner"></div>

          <header class="header">
            <div class="brand">
              <div class="battery-icon">
                <span></span>
              </div>
              <div>
                <div class="eyebrow" id="title"></div>
                <div class="model" id="model"></div>
                <div class="capacity"><span id="capacity"></span> kWh</div>
              </div>
            </div>
            <div class="bolt">⚡</div>
          </header>

          <main class="main-grid">
            <section class="side left">
              <div class="metric">
                <div class="metric-title">ÉTAT DE CHARGE</div>
                <div class="soc-line">
                  <div class="mini-battery">⚡</div>
                  <strong id="socText">0%</strong>
                </div>
                <div class="bar"><div id="socBar"></div></div>
              </div>

              <div class="metric">
                <div class="metric-title">ÉNERGIE DISPONIBLE</div>
                <div class="big-value"><span class="metric-symbol">ϟ</span><span id="energy"></span> <small>kWh</small></div>
                <div class="subvalue">(sur <span id="capacity2"></span> kWh)</div>
              </div>

              <div class="metric">
                <div class="metric-title">CAPACITÉ TOTALE</div>
                <div class="big-value"><span class="metric-symbol">◉</span><span id="capacity3"></span> <small>kWh</small></div>
              </div>
            </section>

            <section class="core-wrap">
              <div class="ring ring-outer"></div>
              <div class="ring ring-mid"></div>
              <div class="ticks"></div>
              <div class="orbit orbit-a"></div>
              <div class="orbit orbit-b"></div>

              <div class="battery-core">
                <div class="cap"></div>
                <div class="glass">
                  <div class="liquid" id="liquid">
                    <div class="wave wave1"></div>
                    <div class="wave wave2"></div>
                    <div class="particles"></div>
                  </div>
                  <div class="energy-particles" aria-hidden="true">
                    <i></i><i></i><i></i><i></i><i></i><i></i>
                  </div>
                  <div class="core-readout">
                    <span id="coreSoc">0%</span>
                  </div>
                </div>
                <div class="base"></div>
              </div>

              <div class="energy-streams">
                <i></i><i></i><i></i><i></i><i></i><i></i>
              </div>

              <div class="status-pill" id="status">STANDBY</div>
            </section>

            <section class="side right">
              <div class="metric power-card">
                <div class="metric-title">PUISSANCE BATTERIE</div>
                <div class="power-value" id="power">0 kW</div>
                <div class="state-label" id="stateLabel">STANDBY</div>
                <div class="power-bar"><div id="powerBar"></div></div>
              </div>

              <div class="metric time-card">
                <div class="metric-title">TEMPS JUSQU'À 100%</div>
                <div class="time-value" id="time">—</div>
                <div class="subvalue">estimation</div>
              </div>

              <div class="metric mini-grid">
                <div><span>▣</span><label>Tension</label><b id="voltage">—</b></div>
                <div><span>♨</span><label>Température</label><b id="temperature">—</b></div>
                <div><span>ϟ</span><label>Courant</label><b id="current">—</b></div>
              </div>
            </section>
          </main>

          <section class="flow">
            <div class="flow-node solar">
              <span class="sun">☀</span>
              <div><small>SOLAIRE</small><b id="solar">—</b></div>
            </div>
            <div class="flow-arrows" id="flowLeft">››››</div>
            <div class="flow-node battery-node">
              <span>▣</span>
              <div><small>BATTERIE</small><b id="flowBattery">0 kW</b></div>
            </div>
            <div class="flow-arrows" id="flowRight">››</div>
            <div class="flow-node house">
              <span>⌂</span>
              <div><small>MAISON</small><b id="house">—</b></div>
            </div>
          </section>

          <footer class="footer">
            <div><i class="dot"></i> Mode : <b id="mode">STANDBY</b></div>
            <div>◉ <b>BMS OK</b></div>
            <div>⌁ <b>EN LIGNE</b></div>
            <div class="clean">♧ <b>ÉNERGIE PROPRE</b></div>
          </footer>
        </div>
      </ha-card>
        </div>
      </div>
    `;
  }

  _update() {
    const c = this.config;
    const soc = Math.max(0, Math.min(100, this._num(c.battery_soc)));
    const power = this._powerNum(c.battery_power);
    const capacity = Number(c.capacity) || 29;
    const energy = capacity * soc / 100;
    const charging = power > 0.05;
    const discharging = power < -0.05;

    this.classList.toggle("charging", charging);
    this.classList.toggle("discharging", discharging);
    this.classList.toggle("full", soc >= 99.5);
    this.classList.toggle("empty", soc <= 0.5);

    const set = (id, value) => {
      const el = this.querySelector("#" + id);
      if (el) el.textContent = value;
    };

    set("title", c.title);
    set("model", c.model);
    set("capacity", capacity);
    set("capacity2", capacity);
    set("capacity3", capacity);
    set("socText", `${soc.toFixed(0)}%`);
    set("coreSoc", `${soc.toFixed(0)}%`);
    set("energy", energy.toFixed(1));

    const powerAbs = Math.abs(power);
    const powerText = `${power >= 0 ? "+" : "−"}${powerAbs.toFixed(2)} kW`;
    set("power", powerText);
    set("flowBattery", powerText);

    const state = charging ? "CHARGE" : discharging ? "DÉCHARGE" : "STANDBY";
    set("stateLabel", state);
    set("status", state);
    set("mode", state);

    const time = this._state(c.time_remaining, "—");
    set("time", time);

    const voltage = this._state(c.voltage, "—");
    const temperature = this._state(c.temperature, "—");
    const current = this._state(c.current, "—");
    set("voltage", voltage === "—" ? "—" : `${voltage} V`);
    set("temperature", temperature === "—" ? "—" : `${temperature} °C`);
    set("current", current === "—" ? "—" : `${current} A`);

    const solar = this._state(c.solar_power, "—");
    const house = this._state(c.house_power, "—");
    set("solar", solar === "—" ? "—" : `${solar} kW`);
    set("house", house === "—" ? "—" : `${house} kW`);

    const shell = this.querySelector(".shell");
    if (shell) {
      shell.style.setProperty("--bc-soc-angle", `${soc * 3.6}deg`);
      const scalePct = Math.max(50, Math.min(100, Number(this.config.scale_percent) || 75));
      shell.style.setProperty("--bc-scale", String(scalePct / 100));
    }

    const liquid = this.querySelector("#liquid");
    if (liquid) liquid.style.height = `${soc}%`;
    const bar = this.querySelector("#socBar");
    if (bar) bar.style.width = `${soc}%`;

    const pbar = this.querySelector("#powerBar");
    if (pbar) pbar.style.width = `${Math.min(100, powerAbs / 10 * 100)}%`;

    // Energy animation speed follows battery power:
    // low power = calm, high power = fast.
    const speed = Math.max(0.55, Math.min(2.4, 2.25 - powerAbs * 0.16));
    this.querySelectorAll(".energy-particles i").forEach((el, i) => {
      el.style.animationDuration = `${speed}s`;
      el.style.animationDelay = `${-(speed / 6) * i}s`;
    });
    this.querySelectorAll(".energy-streams i").forEach(el => {
      el.style.animationDuration = `${Math.max(0.45, speed * 0.72)}s`;
    });

    const left = this.querySelector("#flowLeft");
    const right = this.querySelector("#flowRight");
    if (left) left.classList.toggle("active", charging);
    if (right) right.classList.toggle("active", discharging);
  }
}

class BatteryCoreCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    // Home Assistant can inject hass after setConfig().
    // Refresh only the native entity pickers instead of rebuilding the editor.
    this.querySelectorAll("ha-entity-picker").forEach((picker) => {
      picker.hass = hass;
    });
  }

  _entityRow(label, id) {
    return `
      <div class="bc-editor-field">
        <div class="bc-editor-label">${label}</div>
        <ha-entity-picker
          id="${id}"
          allow-custom-entity
          style="width:100%;">
        </ha-entity-picker>
      </div>
    `;
  }

  _render() {
    if (!this._config) return;

    this.innerHTML = `
      <style>
        .bc-editor {
          display:grid;
          gap:16px;
          padding:10px 2px;
        }
        .bc-editor-field {
          display:grid;
          gap:6px;
        }
        .bc-editor-label {
          font-size:16px;
          font-weight:500;
          color:var(--primary-text-color);
        }
        .bc-editor input,
        .bc-editor select {
          width:100%;
          min-height:40px;
          box-sizing:border-box;
        }
        .bc-editor-section {
          margin-top:4px;
          padding-top:14px;
          border-top:1px solid var(--divider-color);
        }
        .bc-editor-section-title {
          margin-bottom:12px;
          font-size:13px;
          font-weight:700;
          letter-spacing:.12em;
          text-transform:uppercase;
          color:var(--secondary-text-color);
        }
      </style>

      <div class="bc-editor">
        <label class="bc-editor-field">
          <span class="bc-editor-label">Titre</span>
          <input type="text" id="title" value="${this._config.title || ''}">
        </label>

        <label class="bc-editor-field">
          <span class="bc-editor-label">Modèle</span>
          <input type="text" id="model" value="${this._config.model || ''}">
        </label>

        <label class="bc-editor-field">
          <span class="bc-editor-label">Capacité (kWh)</span>
          <input type="number" id="capacity" value="${this._config.capacity || 29}">
        </label>

        <label class="bc-editor-field">
          <span class="bc-editor-label">Taille de la carte</span>
          <select id="size">
            <option value="compact" ${(this._config.size || "compact") === "compact" ? "selected" : ""}>Compacte</option>
            <option value="normal" ${this._config.size === "normal" ? "selected" : ""}>Normale</option>
            <option value="large" ${this._config.size === "large" ? "selected" : ""}>Grande</option>
            <option value="fullscreen" ${this._config.size === "fullscreen" ? "selected" : ""}>Plein écran</option>
          </select>
        </label>

        <label class="bc-editor-field">
          <span class="bc-editor-label">
            Taille graphique : <strong id="scaleValue">${this._config.scale_percent || 75}%</strong>
          </span>
          <input type="range" id="scale_percent" min="50" max="100" step="5"
                 value="${this._config.scale_percent || 75}"
                 style="accent-color:#00d9ff;">
          <small style="opacity:.7;">Réduit le noyau et les éléments sans rétrécir la largeur de la carte.</small>
        </label>

        <div class="bc-editor-section">
          <div class="bc-editor-section-title">Entités Home Assistant</div>

          ${this._entityRow("Batterie : niveau de charge (%)", "battery_soc")}
          <div style="height:14px"></div>

          ${this._entityRow("Batterie : puissance", "battery_power")}
          <div style="height:14px"></div>

          ${this._entityRow("Batterie : temps restant", "time_remaining")}
        </div>
      </div>
    `;

    // Configure Home Assistant's native entity pickers.
    const pickerIds = ["battery_soc", "battery_power", "time_remaining"];
    pickerIds.forEach((id) => {
      const picker = this.querySelector(`#${id}`);
      if (!picker) return;
      picker.hass = this._hass;
      picker.value = this._config[id] || "";
      picker.includeDomains = ["sensor"];
      picker.addEventListener("value-changed", (ev) => {
        const value = ev.detail?.value ?? "";
        this._setConfigValue(id, value);
      });
    });

    this.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', (e) => {
        if (e.target.id === "scale_percent") {
          const label = this.querySelector("#scaleValue");
          if (label) label.textContent = `${e.target.value}%`;
        }
        this._valueChanged(e);
      });
    });

    this.querySelectorAll('select').forEach((select) => {
      select.addEventListener('change', (e) => this._valueChanged(e));
    });
  }

  _setConfigValue(key, value) {
    if (!this._config) return;
    this._config = { ...this._config, [key]: value };

    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    }));
  }

  _valueChanged(e) {
    if (!this._config) return;
    const target = e.target;
    const value = target.type === 'number' ? Number(target.value) : target.value;
    this._setConfigValue(target.id, value);
  }
}

customElements.define("battery-core-card", BatteryCoreCard);
customElements.define("battery-core-card-editor", BatteryCoreCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "battery-core-card",
  name: "Battery Core Card",
  description: "Futuristic animated battery visualization with native Home Assistant entity selectors.",
  preview: true
});