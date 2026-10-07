/* Battery Core Card — standalone Home Assistant Lovelace card
 * No dependency on button-card, power-flow-card or other custom cards.
 */

const BATTERY_CORE_STYLE = `battery-core-card {
  display: block;
  width: 100%;
  --bc-bg: #020b18;
  --bc-blue: #00d9ff;
  --bc-blue2: #1689ff;
  --bc-green: #55ff8a;
  --bc-text: #eaf8ff;
  --bc-muted: #80b7d2;
}

battery-core-card .battery-card {
  overflow: hidden;
  background: transparent !important;
  box-shadow: none !important;
  border: 0 !important;
}

battery-core-card .shell {
  position: relative;
  min-height: 760px;
  padding: 22px;
  color: var(--bc-text);
  background:
    radial-gradient(circle at 50% 44%, rgba(0, 150, 255, .13), transparent 26%),
    radial-gradient(circle at 50% 100%, rgba(0, 110, 255, .11), transparent 34%),
    linear-gradient(150deg, #020914 0%, #041529 48%, #020812 100%);
  border: 1px solid rgba(0, 193, 255, .65);
  border-radius: 22px;
  box-sizing: border-box;
  overflow: hidden;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

battery-core-card .shell::before {
  content:"";
  position:absolute; inset:0;
  background:
    linear-gradient(rgba(0,170,255,.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,170,255,.035) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: linear-gradient(to bottom, black, transparent 85%);
  pointer-events:none;
}

battery-core-card .top-corner {
  position:absolute; right:-70px; top:-70px;
  width:190px; height:190px;
  border:1px solid rgba(0,180,255,.5);
  border-radius: 0 0 0 90px;
  transform: rotate(45deg);
  opacity:.45;
}

battery-core-card .header {
  position:relative;
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  z-index:2;
}

battery-core-card .brand { display:flex; gap:14px; align-items:center; }
battery-core-card .eyebrow { font-size:16px; letter-spacing:3px; font-weight:800; }
battery-core-card .model { font-size:26px; font-weight:800; color:var(--bc-blue); letter-spacing:1px; }
battery-core-card .capacity { color:#8dc6e7; font-size:17px; margin-top:2px; }
battery-core-card .bolt { font-size:34px; color:#10d8ff; filter:drop-shadow(0 0 10px #00d9ff); }

battery-core-card .battery-icon {
  width:42px; height:62px; border:5px solid var(--bc-blue); border-radius:8px;
  position:relative; box-sizing:border-box; box-shadow:0 0 15px rgba(0,217,255,.6), inset 0 0 12px rgba(0,217,255,.25);
}
battery-core-card .battery-icon::before {
  content:""; position:absolute; left:10px; right:10px; top:-11px; height:8px;
  border-radius:3px; background:var(--bc-blue);
}
battery-core-card .battery-icon span {
  position:absolute; left:7px; right:7px; bottom:7px; height:62%;
  background:linear-gradient(#00e7ff,#147cff);
  box-shadow:0 0 10px #00d9ff;
}

battery-core-card .main-grid {
  position:relative; z-index:2;
  display:grid;
  grid-template-columns: minmax(190px,1fr) minmax(360px,1.7fr) minmax(190px,1fr);
  gap:16px;
  align-items:center;
  min-height:515px;
}

battery-core-card .side { z-index:5; }
battery-core-card .metric {
  border-bottom:1px solid rgba(40,153,220,.25);
  padding:17px 8px;
}
battery-core-card .metric-title { color:#9ed0e9; font-size:13px; letter-spacing:1px; margin-bottom:10px; }
battery-core-card .soc-line { display:flex; align-items:center; gap:10px; }
battery-core-card .soc-line strong { font-size:38px; letter-spacing:-1px; }
battery-core-card .mini-battery {
  width:38px; height:38px; border:2px solid var(--bc-blue); border-radius:50%;
  display:grid; place-items:center; color:var(--bc-blue); box-shadow:0 0 10px rgba(0,217,255,.4);
}
battery-core-card .bar, battery-core-card .power-bar {
  height:9px; border-radius:10px; overflow:hidden; background:#0b2943; margin-top:12px;
  border:1px solid rgba(0,217,255,.4);
}
battery-core-card .bar div, battery-core-card .power-bar div {
  height:100%; width:0; transition:width .8s ease;
  background:linear-gradient(90deg,#00bfff,#55ff8a);
  box-shadow:0 0 12px #00d9ff;
}
battery-core-card .big-value { font-size:24px; font-weight:700; }
battery-core-card .big-value small { font-size:14px; color:#9cc4d8; }
battery-core-card .metric-symbol { color:var(--bc-blue); margin-right:7px; }
battery-core-card .subvalue { color:#7ea8bf; font-size:13px; margin-top:4px; }
battery-core-card .power-value { font-size:30px; font-weight:800; color:#a8f4ff; text-shadow:0 0 12px rgba(0,217,255,.45); }
battery-core-card .state-label { color:var(--bc-green); font-weight:800; margin-top:4px; letter-spacing:1px; }
battery-core-card .time-value { font-size:34px; font-weight:700; margin-top:5px; }
battery-core-card .mini-grid { display:grid; gap:12px; }
battery-core-card .mini-grid > div {
  display:grid; grid-template-columns:26px 1fr auto; gap:5px; align-items:center;
  color:#9ed0e9;
}
battery-core-card .mini-grid span { color:var(--bc-blue); font-size:20px; }
battery-core-card .mini-grid label { font-size:12px; }
battery-core-card .mini-grid b { color:white; font-size:14px; }

battery-core-card .core-wrap {
  position:relative; height:500px; display:grid; place-items:center;
}
battery-core-card .ring {
  position:absolute; border-radius:50%; pointer-events:none;
}
battery-core-card .ring-outer {
  width:430px; height:430px;
  border:10px solid rgba(0,155,255,.15);
  border-top-color:#00d9ff;
  border-right-color:#1689ff;
  box-shadow:0 0 20px rgba(0,217,255,.35), inset 0 0 20px rgba(0,120,255,.15);
  animation: bcSpin 16s linear infinite;
}
battery-core-card .ring-mid {
  width:365px; height:365px;
  border:2px dashed rgba(0,205,255,.42);
  box-shadow:0 0 25px rgba(0,160,255,.18);
  animation: bcSpinReverse 22s linear infinite;
}
battery-core-card .ticks {
  position:absolute; width:455px; height:455px; border-radius:50%;
  background:repeating-conic-gradient(from 0deg, rgba(70,190,255,.5) 0deg 1deg, transparent 1deg 9deg);
  mask-image:radial-gradient(circle, transparent 66%, black 67%, black 68%, transparent 69%);
  opacity:.65;
}
battery-core-card .orbit {
  position:absolute; width:445px; height:170px; border:1px solid rgba(0,195,255,.4); border-radius:50%;
  transform:rotate(25deg); box-shadow:0 0 8px rgba(0,180,255,.2);
}
battery-core-card .orbit-b { transform:rotate(-35deg); opacity:.5; }

battery-core-card .battery-core {
  position:relative; z-index:8; width:145px; height:330px; margin-top:-5px;
  filter:drop-shadow(0 0 25px rgba(0,204,255,.6));
}
battery-core-card .cap, battery-core-card .base {
  position:absolute; left:7px; right:7px; height:36px; border-radius:24px;
  background:linear-gradient(#d8fbff,#3981a4 35%,#082d49 60%,#77dfff);
  border:2px solid #63e8ff; z-index:4;
}
battery-core-card .cap { top:0; }
battery-core-card .base { bottom:0; }
battery-core-card .glass {
  position:absolute; left:15px; right:15px; top:24px; bottom:24px;
  border:2px solid rgba(91,231,255,.85); border-radius:28px;
  overflow:hidden; background:linear-gradient(90deg, rgba(0,180,255,.06), rgba(255,255,255,.08), rgba(0,180,255,.03));
  box-shadow:inset 0 0 22px rgba(0,205,255,.25);
}
battery-core-card .liquid {
  position:absolute; left:0; right:0; bottom:0; height:0%;
  background:linear-gradient(to top, rgba(0,91,255,.95), rgba(0,216,255,.7));
  box-shadow:0 -8px 30px rgba(0,225,255,.8);
  transition:height 1s cubic-bezier(.2,.8,.2,1);
  overflow:hidden;
}
battery-core-card .wave {
  position:absolute; left:-30%; width:160%; height:35px; top:-15px;
  border-radius:50%; border-top:3px solid rgba(130,250,255,.9);
  animation:bcWave 4s ease-in-out infinite;
}
battery-core-card .wave2 { top:-10px; opacity:.35; animation-delay:-2s; }
battery-core-card .particles {
  position:absolute; inset:0;
  background-image:
    radial-gradient(circle, rgba(170,255,255,.9) 0 1px, transparent 2px),
    radial-gradient(circle, rgba(255,255,255,.6) 0 1px, transparent 2px);
  background-size:29px 41px, 43px 57px;
  animation:bcRise 5s linear infinite;
  opacity:.8;
}
battery-core-card .core-readout {
  position:absolute; inset:0; display:grid; place-items:center; z-index:4;
  font-size:35px; font-weight:800; text-shadow:0 0 15px #00d9ff;
}
battery-core-card .energy-streams {
  position:absolute; bottom:18px; width:240px; height:130px; z-index:2;
  display:flex; justify-content:center; gap:30px; overflow:hidden;
}
battery-core-card .energy-streams i {
  width:5px; height:125px; border-radius:50%;
  background:linear-gradient(transparent,#00eaff,transparent);
  box-shadow:0 0 12px #00d9ff;
  animation:bcStream 1.25s linear infinite;
  opacity:.85;
}
battery-core-card .energy-streams i:nth-child(2){animation-delay:-.25s;height:90px}
battery-core-card .energy-streams i:nth-child(3){animation-delay:-.5s;height:115px}
battery-core-card .energy-streams i:nth-child(4){animation-delay:-.75s;height:75px}
battery-core-card .energy-streams i:nth-child(5){animation-delay:-1s;height:105px}
battery-core-card .energy-streams i:nth-child(6){animation-delay:-.4s;height:65px}

battery-core-card .status-pill {
  position:absolute; bottom:4px; color:#58ff92; font-size:11px; letter-spacing:2px;
  padding:5px 11px; border:1px solid rgba(70,255,145,.35); border-radius:20px;
  background:rgba(0,35,28,.45);
}

battery-core-card .flow {
  position:relative; z-index:4; display:flex; align-items:center; justify-content:space-around;
  gap:8px; padding:18px 20px; border:1px solid rgba(0,170,255,.4); border-radius:18px;
  background:rgba(1,18,36,.72); box-shadow:inset 0 0 25px rgba(0,120,255,.08);
}
battery-core-card .flow-node { display:flex; gap:9px; align-items:center; min-width:130px; }
battery-core-card .flow-node > span { font-size:28px; color:#5edfff; }
battery-core-card .flow-node small { display:block; color:#8dbbd0; font-size:10px; letter-spacing:1px; }
battery-core-card .flow-node b { font-size:18px; }
battery-core-card .solar .sun { color:#ffd74a; }
battery-core-card .flow-arrows { color:#1769b8; font-size:28px; letter-spacing:-6px; transition:.3s; }
battery-core-card .flow-arrows.active { color:#00d9ff; text-shadow:0 0 14px #00d9ff; animation:bcArrow 1s linear infinite; }

battery-core-card .footer {
  position:relative; z-index:4; display:flex; justify-content:space-around; flex-wrap:wrap;
  gap:12px; padding:17px 5px 2px; color:#82b5cf; font-size:12px;
}
battery-core-card .footer b { color:#bceeff; }
battery-core-card .footer .clean b { color:#4dff89; }
battery-core-card .dot { display:inline-block; width:9px; height:9px; background:#4dff89; border-radius:50%; box-shadow:0 0 10px #4dff89; margin-right:6px; }

battery-core-card.discharging .liquid { background:linear-gradient(to top, rgba(255,116,0,.75), rgba(255,210,50,.7)); }
battery-core-card.discharging .ring-outer { border-top-color:#ffb52e; border-right-color:#ff6b35; }
battery-core-card.discharging .energy-streams i { animation-direction:reverse; background:linear-gradient(transparent,#ffb52e,transparent); box-shadow:0 0 12px #ff9d00; }
battery-core-card.discharging .state-label,
battery-core-card.discharging .status-pill { color:#ffc44c; border-color:rgba(255,180,40,.4); }

battery-core-card.full .ring-outer { animation-duration:5s; box-shadow:0 0 35px rgba(0,230,255,.8), inset 0 0 30px rgba(0,190,255,.35); }
battery-core-card.empty .liquid { box-shadow:none; }

@keyframes bcSpin { to { transform:rotate(360deg); } }
@keyframes bcSpinReverse { to { transform:rotate(-360deg); } }
@keyframes bcWave { 0%,100%{transform:translateX(-2%) rotate(0deg)}50%{transform:translateX(2%) rotate(1deg)} }
@keyframes bcRise { from{background-position:0 0,0 0} to{background-position:0 -220px,0 -300px} }
@keyframes bcStream { from{transform:translateY(120px);opacity:0} 20%{opacity:1} 100%{transform:translateY(-30px);opacity:0} }
@keyframes bcArrow { 50% { transform:translateX(6px); } }

@media (max-width: 900px) {
  battery-core-card .shell { min-height:0; }
  battery-core-card .main-grid { grid-template-columns:1fr; }
  battery-core-card .core-wrap { order:-1; height:480px; }
  battery-core-card .side.left, battery-core-card .side.right { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  battery-core-card .metric { padding:12px 6px; }
}
@media (max-width: 560px) {
  battery-core-card .shell { padding:12px; border-radius:16px; }
  battery-core-card .ring-outer { width:320px;height:320px; }
  battery-core-card .ring-mid { width:275px;height:275px; }
  battery-core-card .ticks { width:345px;height:345px; }
  battery-core-card .orbit { width:330px; }
  battery-core-card .core-wrap { height:400px; }
  battery-core-card .side.left, battery-core-card .side.right { grid-template-columns:1fr; }
  battery-core-card .flow { flex-wrap:wrap; }
  battery-core-card .flow-arrows { display:none; }
}
`;
if (!document.head.querySelector('style[data-battery-core-card]')) {
  const style = document.createElement('style');
  style.dataset.batteryCoreCard = 'true';
  style.textContent = BATTERY_CORE_STYLE;
  document.head.appendChild(style);
}

class BatteryCoreCard extends HTMLElement {
  static getStubConfig() {
    return {
      type: "custom:battery-core-card",
      battery_soc: "sensor.onduleur_soc_batterie_1",
      battery_power: "sensor.onduleur_puissance_batterie_1",
      time_remaining: "sensor.temps_de_charge_restant_batterie",
      capacity: 29,
      title: "BATTERIE",
      model: "HYPO 4"
    };
  }

  setConfig(config) {
    if (!config || !config.battery_soc || !config.battery_power) {
      throw new Error("Battery Core Card: battery_soc and battery_power are required");
    }
    this.config = {
      title: "BATTERIE",
      model: "HYPO 4",
      capacity: 29,
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

  getCardSize() { return this.config?.compact ? 6 : 10; }

  _state(entity, fallback = "—") {
    if (!entity || !this._hass?.states?.[entity]) return fallback;
    return this._hass.states[entity].state;
  }

  _num(entity, fallback = 0) {
    const n = parseFloat(this._state(entity, ""));
    return Number.isFinite(n) ? n : fallback;
  }

  _esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[c]));
  }

  _render() {
    this.innerHTML = `
      <ha-card class="battery-card">
        <div class="shell">
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
    `;
  }

  _update() {
    const c = this.config;
    const soc = Math.max(0, Math.min(100, this._num(c.battery_soc)));
    const power = this._num(c.battery_power);
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

    const liquid = this.querySelector("#liquid");
    if (liquid) liquid.style.height = `${soc}%`;
    const bar = this.querySelector("#socBar");
    if (bar) bar.style.width = `${soc}%`;

    const pbar = this.querySelector("#powerBar");
    if (pbar) pbar.style.width = `${Math.min(100, powerAbs / 10 * 100)}%`;

    const left = this.querySelector("#flowLeft");
    const right = this.querySelector("#flowRight");
    if (left) left.classList.toggle("active", charging);
    if (right) right.classList.toggle("active", discharging);
  }
}

customElements.define("battery-core-card", BatteryCoreCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "battery-core-card",
  name: "Battery Core Card",
  description: "Standalone futuristic animated battery visualization.",
  preview: true
});
