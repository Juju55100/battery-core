/* Battery Core Card v0.9.4 — standalone Home Assistant Lovelace card
 * Futuristic battery core with visual editor, adjustable scale and SOC ring.
 */

const BATTERY_CORE_STYLE = `
battery-core-card {
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
  width: 100%;
  min-height: 520px;
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
  position: relative;
  z-index: 2;

  display: grid;
  grid-template-columns: 150px minmax(220px, 1fr) 150px;

  gap: 8px;
  align-items: center;

  min-height: 380px;
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

battery-core-card .ring-outer {
  width: 320px;
  height: 320px;

  border: 8px solid rgba(0,155,255,.15);
  border-top-color: #00d9ff;
  border-right-color: #1689ff;

  box-shadow:
    0 0 20px rgba(0,217,255,.35),
    inset 0 0 20px rgba(0,120,255,.15);

  animation: bcSpin 16s linear infinite;
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
battery-core-card .ticks {
  position: absolute;

  width: 340px;
  height: 340px;

  border-radius: 50%;

  background:
    repeating-conic-gradient(
      from 0deg,
      rgba(70,190,255,.5) 0deg 1deg,
      transparent 1deg 9deg
    );

  mask-image:
    radial-gradient(
      circle,
      transparent 66%,
      black 67%,
      black 68%,
      transparent 69%
    );

  opacity: .65;
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

battery-core-card .core-readout {
  position: absolute;
  inset: 0;

  display: grid;
  place-items: center;

  z-index: 4;

  font-size: 27px;
  font-weight: 800;

  text-shadow:
    0 0 15px #00d9ff;
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


/* ========================================================================
   BATTERY CORE CARD V0.8
   External authoritative overrides
   ======================================================================== */

/* Landscape architecture: SOC | CORE | POWER */
battery-core-card .shell {
  width:100%;
  max-width:100%;
  min-height:0;
  box-sizing:border-box;
  overflow:hidden;
}
battery-core-card .main-grid {
  width:100%;
  max-width:100%;
  display:grid;
  grid-template-columns:30% 40% 30%;
  align-items:center;
  gap:0;
  min-height:0;
  box-sizing:border-box;
}
battery-core-card .main-grid > * { min-width:0; }
battery-core-card .side.left { grid-column:1; grid-row:1; padding-right:8px; }
battery-core-card .core-wrap {
  grid-column:2; grid-row:1;
  position:relative;
  width:100%;
  min-width:0;
  min-height:280px;
  height:calc(430px * var(--bc-scale, .75));
  display:grid;
  place-items:center;
  overflow:visible;
}
battery-core-card .side.right { grid-column:3; grid-row:1; padding-left:8px; overflow:hidden; }

/* Core geometry: single definitions only */
battery-core-card .ring {
  position:absolute;
  left:50%;
  border-radius:50%;
  pointer-events:none;
  transform:translateX(-50%);
}
battery-core-card .ring-outer {
  width:calc(350px * var(--bc-scale, .75));
  height:calc(350px * var(--bc-scale, .75));
  border:0;
  padding:9px;
  box-sizing:border-box;
  background:conic-gradient(
    from -90deg,
    #00eaff 0deg,
    #1689ff var(--bc-soc-angle,0deg),
    rgba(0,155,255,.12) var(--bc-soc-angle,0deg),
    rgba(0,155,255,.12) 360deg
  );
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;
  mask-composite:exclude;
  box-shadow:0 0 20px rgba(0,217,255,.35);
}
battery-core-card .ring-mid {
  width:calc(295px * var(--bc-scale, .75));
  height:calc(295px * var(--bc-scale, .75));
  border:2px dashed rgba(0,205,255,.42);
  box-shadow:0 0 25px rgba(0,160,255,.18);
}
battery-core-card .ticks {
  position:absolute;
  left:50%;
  width:calc(372px * var(--bc-scale, .75));
  height:calc(372px * var(--bc-scale, .75));
  transform:translateX(-50%);
  border-radius:50%;
  background:repeating-conic-gradient(from 0deg,rgba(70,190,255,.5) 0deg 1deg,transparent 1deg 9deg);
  mask-image:radial-gradient(circle,transparent 66%,black 67%,black 68%,transparent 69%);
  opacity:.65;
}
battery-core-card .orbit {
  position:absolute;
  left:50%;
  width:calc(360px * var(--bc-scale, .75));
  height:calc(140px * var(--bc-scale, .75));
  border:1px solid rgba(0,195,255,.4);
  border-radius:50%;
  transform:translateX(-50%) rotate(25deg);
  box-shadow:0 0 8px rgba(0,180,255,.2);
}
battery-core-card .orbit-b { transform:translateX(-50%) rotate(-35deg); opacity:.5; }

battery-core-card .battery-core {
  position:absolute;
  left:50%;
  top:50%;
  width:calc(118px * var(--bc-scale, .75));
  height:calc(270px * var(--bc-scale, .75));
  transform:translate(-50%,-50%);
  z-index:8;
  filter:drop-shadow(0 0 20px rgba(0,204,255,.6));
}
battery-core-card .cap,
battery-core-card .base {
  position:absolute;
  left:7px; right:7px;
  height:36px;
  border-radius:24px;
  background:linear-gradient(#d8fbff,#3981a4 35%,#082d49 60%,#77dfff);
  border:2px solid #63e8ff;
  z-index:6;
}
battery-core-card .cap { top:0; }
battery-core-card .base { bottom:0; }

/* Liquid reservoir */
battery-core-card .glass {
  position:absolute;
  left:15px; right:15px; top:24px; bottom:24px;
  border:2px solid rgba(91,231,255,.85);
  border-radius:28px;
  overflow:hidden;
  background:linear-gradient(90deg,rgba(0,180,255,.05),rgba(255,255,255,.10),rgba(0,180,255,.03));
  box-shadow:inset 0 0 22px rgba(0,205,255,.25);
}
battery-core-card .liquid {
  position:absolute;
  left:0; right:0; bottom:0;
  height:0%;
  overflow:visible;
  background:linear-gradient(to top,rgba(0,91,255,.94),rgba(0,216,255,.62));
  box-shadow:0 -4px 22px rgba(0,225,255,.62);
  transition:height .8s cubic-bezier(.2,.8,.2,1);
}

/* The floating water line follows the liquid top, therefore the exact SOC. */
battery-core-card .wave {
  position:absolute;
  left:-32%;
  top:-11px;
  width:164%;
  height:24px;
  border:0;
  border-radius:50%;
  background:transparent;
  box-shadow:none;
  pointer-events:none;
}
battery-core-card .wave::before {
  content:"";
  position:absolute;
  left:0; top:8px;
  width:100%; height:5px;
  border-radius:50%;
  background:linear-gradient(90deg,
    transparent 0%,
    rgba(90,235,255,.35) 10%,
    rgba(190,255,255,.95) 30%,
    #fff 50%,
    rgba(105,245,255,.95) 70%,
    rgba(40,210,255,.3) 90%,
    transparent 100%);
  box-shadow:0 0 5px #fff,0 0 12px #00eaff,0 0 20px rgba(0,170,255,.65);
}
battery-core-card .wave::after {
  content:"";
  position:absolute;
  left:5%; top:12px;
  width:90%; height:7px;
  border-radius:50%;
  background:rgba(55,225,255,.16);
  filter:blur(2px);
}
battery-core-card .wave1 { animation:bcV08WaveA 2.7s ease-in-out infinite; }
battery-core-card .wave2 { top:-7px; opacity:.45; animation:bcV08WaveB 3.3s ease-in-out infinite; }

/* Old chunky visuals disabled */
battery-core-card .charge-arrows { display:none !important; }

/* Fine vertical energy flow inside the battery */
battery-core-card .energy-particles {
  position:absolute;
  inset:25px 12px;
  z-index:3;
  overflow:hidden;
  pointer-events:none;
  border-radius:20px;
}
battery-core-card .energy-particles i {
  position:absolute;
  bottom:-16px;
  width:4px;
  height:13px;
  border-radius:999px;
  opacity:0;
  background:linear-gradient(to top,rgba(0,190,255,0),rgba(110,250,255,.95),#fff);
  box-shadow:0 0 5px #fff,0 0 10px #00e1ff;
  animation:bcV08Rise 2s linear infinite;
}
battery-core-card .energy-particles i:nth-child(1){left:14%}
battery-core-card .energy-particles i:nth-child(2){left:29%;height:9px}
battery-core-card .energy-particles i:nth-child(3){left:44%;height:17px}
battery-core-card .energy-particles i:nth-child(4){left:59%;height:11px}
battery-core-card .energy-particles i:nth-child(5){left:73%;height:14px}
battery-core-card .energy-particles i:nth-child(6){left:86%;height:8px}

/* Existing dotted particles become subtle background bubbles only */
battery-core-card .particles {
  opacity:.34;
  animation:bcV08Bubbles 7s linear infinite;
}

/* Discharge reverses the internal flow and changes its temperature */
battery-core-card.discharging .liquid {
  background:linear-gradient(to top,rgba(255,105,0,.74),rgba(255,205,45,.62));
  box-shadow:0 -4px 22px rgba(255,150,20,.55);
}
battery-core-card.discharging .ring-outer {
  background:conic-gradient(
    from -90deg,
    #ffd84a 0deg,
    #ff7138 var(--bc-soc-angle,0deg),
    rgba(255,130,40,.12) var(--bc-soc-angle,0deg),
    rgba(255,130,40,.12) 360deg
  );
}
battery-core-card.discharging .wave::before {
  background:linear-gradient(90deg,transparent,rgba(255,220,110,.85),#fff4c8,rgba(255,155,45,.9),transparent);
  box-shadow:0 0 5px #fff2c0,0 0 12px #ff9d00,0 0 20px rgba(255,110,20,.6);
}
battery-core-card.discharging .energy-particles i {
  top:-16px;
  bottom:auto;
  background:linear-gradient(to bottom,rgba(255,190,70,0),rgba(255,195,70,.95),#fff3b0);
  box-shadow:0 0 5px #fff3b0,0 0 10px #ff911e;
  animation-name:bcV08Fall;
}
battery-core-card:not(.charging):not(.discharging) .energy-particles i {
  opacity:0;
  animation-play-state:paused;
}

/* Readout stays above the flow */
battery-core-card .core-readout {
  position:absolute;
  inset:0;
  z-index:5;
  display:grid;
  place-items:center;
  font-size:calc(29px * var(--bc-scale,.75));
  font-weight:800;
  text-shadow:0 0 15px #00d9ff;
}

/* Don't truncate charge-time text in landscape. */
battery-core-card .time-value {
  font-size:clamp(18px,calc(30px * var(--bc-scale,.75)),30px);
  white-space:normal;
  overflow:visible;
  text-overflow:clip;
  line-height:1.08;
}

/* Bottom external energy streams remain centered. */
battery-core-card .energy-streams {
  position:absolute;
  left:50%;
  bottom:18px;
  width:calc(240px * var(--bc-scale,.75));
  height:calc(130px * var(--bc-scale,.75));
  transform:translateX(-50%);
}

/* Size presets now alter density, while scale_percent alters --bc-scale. */
battery-core-card .shell.size-compact { padding:14px; }
battery-core-card .shell.size-normal { padding:18px; }
battery-core-card .shell.size-large { padding:22px; }
battery-core-card .shell.size-fullscreen { padding:28px; }

@keyframes bcV08WaveA {
  0%,100%{transform:translateX(-4%) translateY(1px) scaleY(.85)}
  50%{transform:translateX(4%) translateY(-2px) scaleY(1.18)}
}
@keyframes bcV08WaveB {
  0%,100%{transform:translateX(5%) translateY(-1px)}
  50%{transform:translateX(-5%) translateY(2px)}
}
@keyframes bcV08Rise {
  0%{transform:translateY(0) scale(.65);opacity:0}
  12%{opacity:.9}
  72%{opacity:.72}
  100%{transform:translateY(-210px) scale(1.05);opacity:0}
}
@keyframes bcV08Fall {
  0%{transform:translateY(0) scale(.65);opacity:0}
  12%{opacity:.9}
  72%{opacity:.72}
  100%{transform:translateY(210px) scale(1.05);opacity:0}
}
@keyframes bcV08Bubbles {
  from{background-position:0 0,0 0}
  to{background-position:0 -250px,0 -330px}
}

/* Only stack on genuinely narrow phone cards. */
@media (max-width:520px) {
  battery-core-card .main-grid {
    grid-template-columns:1fr;
  }
  battery-core-card .core-wrap { grid-column:1; grid-row:1; }
  battery-core-card .side.left { grid-column:1; grid-row:2; padding:0; }
  battery-core-card .side.right { grid-column:1; grid-row:3; padding:0; }
}


/* === V0.9 : cœur lithium cylindrique inspiré du concept initial === */
battery-core-card .side.right .power-value{
  font-size:clamp(18px,calc(27px * var(--bc-scale,.75)),27px)!important;
  white-space:nowrap!important;overflow:visible!important;text-overflow:clip!important
}
battery-core-card .battery-core.lithium-cylinder{
  width:calc(146px * var(--bc-scale,.75))!important;
  height:calc(300px * var(--bc-scale,.75))!important;
  filter:drop-shadow(0 0 8px rgba(160,250,255,.8)) drop-shadow(0 0 25px rgba(0,150,255,.5))
}
battery-core-card .lithium-cylinder .glass{
  left:18px!important;right:18px!important;top:34px!important;bottom:34px!important;
  border:2px solid rgba(140,244,255,.92)!important;border-radius:19px!important;
  background:linear-gradient(90deg,rgba(255,255,255,.12),rgba(0,55,90,.10) 24%,rgba(0,18,40,.08) 58%,rgba(170,250,255,.12))!important;
  box-shadow:inset 9px 0 17px rgba(180,250,255,.11),inset -8px 0 18px rgba(0,75,155,.15),
             inset 0 0 24px rgba(0,210,255,.18),0 0 17px rgba(0,220,255,.38)!important
}
battery-core-card .lithium-cylinder .glass::before,
battery-core-card .lithium-cylinder .glass::after{
  content:"";position:absolute;z-index:8;top:8px;bottom:8px;width:2px;border-radius:50%;
  background:linear-gradient(transparent,rgba(235,255,255,.8),transparent);pointer-events:none
}
battery-core-card .lithium-cylinder .glass::before{left:9px;opacity:.75}
battery-core-card .lithium-cylinder .glass::after{right:8px;opacity:.35}
battery-core-card .lithium-cylinder .glass-shine{
  position:absolute;z-index:8;left:24%;top:7%;width:13%;height:80%;border-radius:50%;
  background:linear-gradient(transparent,rgba(255,255,255,.22),rgba(255,255,255,.03),transparent);
  filter:blur(2px);pointer-events:none
}
battery-core-card .lithium-cylinder .cap{
  left:8px!important;right:8px!important;height:38px!important;border-radius:50%/38%!important;
  border:2px solid rgba(165,245,255,.95)!important;
  background:linear-gradient(#eaffff 0%,#67c9ea 19%,#153b5d 45%,#07182d 61%,#55b5dc 80%,#dffcff 100%)!important;
  box-shadow:inset 0 3px 6px rgba(255,255,255,.65),inset 0 -5px 8px rgba(0,15,40,.78),0 0 13px rgba(0,218,255,.55)!important;
  z-index:10!important
}
battery-core-card .lithium-cylinder .cap-top{top:16px!important}
battery-core-card .lithium-cylinder .cap-bottom{bottom:16px!important}
battery-core-card .lithium-cylinder .terminal{
  position:absolute;z-index:11;left:50%;transform:translateX(-50%);width:39%;height:15px;
  border-radius:50%/45%;border:1px solid rgba(190,250,255,.9);
  background:linear-gradient(#e6fdff,#4c9fc8 42%,#0a2948 53%,#8deaff);
  box-shadow:0 0 10px rgba(0,215,255,.58)
}
battery-core-card .lithium-cylinder .terminal-top{top:5px}
battery-core-card .lithium-cylinder .terminal-bottom{bottom:5px;opacity:.9}
battery-core-card .lithium-cylinder .liquid{
  background:radial-gradient(circle at 50% 78%,rgba(130,255,255,.35),transparent 28%),
             linear-gradient(to top,rgba(0,78,255,.96),rgba(0,185,255,.84) 55%,rgba(0,247,255,.67))!important;
  box-shadow:inset 0 0 19px rgba(110,250,255,.25),0 -4px 18px rgba(0,242,255,.88)!important
}
battery-core-card .lithium-cylinder .wave{left:-28%!important;width:156%!important;height:26px!important;top:-13px!important}
battery-core-card .lithium-cylinder .wave::before{
  height:6px!important;top:9px!important;
  background:linear-gradient(90deg,transparent,rgba(0,225,255,.45) 10%,#8effff 29%,#fff 50%,#62f8ff 72%,rgba(0,210,255,.42) 90%,transparent)!important;
  box-shadow:0 0 4px #fff,0 0 10px #4fffff,0 0 21px #00cfff,0 0 31px rgba(0,126,255,.72)!important
}
battery-core-card .lithium-cylinder .wave::after{top:12px!important;height:9px!important;background:rgba(75,238,255,.2)!important}
battery-core-card .lithium-cylinder .energy-particles{
  inset:42px 25px!important;z-index:6!important;border-radius:13px!important;overflow:hidden!important
}
battery-core-card .lithium-cylinder .energy-particles i{
  width:3px!important;height:11px!important;background:linear-gradient(to top,transparent,#5ff8ff,#fff)!important;
  box-shadow:0 0 5px #fff,0 0 11px #00eaff!important
}
battery-core-card .lithium-cylinder .core-readout{z-index:9!important;font-size:calc(32px * var(--bc-scale,.75))!important}
battery-core-card .lithium-cylinder .core-readout span{text-shadow:0 0 5px #fff,0 0 15px #00dfff,0 0 25px #007cff}
battery-core-card .energy-streams{
  left:50%!important;bottom:0!important;width:calc(300px * var(--bc-scale,.75))!important;
  height:calc(160px * var(--bc-scale,.75))!important;transform:translateX(-50%)!important;
  filter:drop-shadow(0 0 11px rgba(0,215,255,.58))
}
battery-core-card.discharging .lithium-cylinder .liquid{
  background:radial-gradient(circle at 50% 78%,rgba(255,220,100,.28),transparent 28%),
             linear-gradient(to top,rgba(255,84,10,.9),rgba(255,158,18,.8) 55%,rgba(255,220,62,.7))!important;
  box-shadow:0 -4px 18px rgba(255,167,20,.75)!important
}
battery-core-card.discharging .lithium-cylinder .wave::before{
  background:linear-gradient(90deg,transparent,#ffb52e,#fff2a5,#ffce45,transparent)!important;
  box-shadow:0 0 5px #fff4bc,0 0 13px #ffae1a,0 0 24px rgba(255,91,0,.7)!important
}
battery-core-card .core-wrap{min-height:calc(380px * var(--bc-scale,.75))!important}



/* =====================================================================
   BATTERY CORE V0.9.1 — ORIGINAL CONCEPT EMPHASIS
   Fixed 3-column geometry + luminous SOC wave + energy fountain
   ===================================================================== */

battery-core-card .shell{
  container-type:inline-size;
  overflow:hidden!important;
}

/* Hard separation: information can never be covered by the reactor. */
battery-core-card .main-grid{
  display:grid!important;
  grid-template-columns:minmax(185px,29%) minmax(250px,42%) minmax(185px,29%)!important;
  align-items:center!important;
  width:100%!important;
  overflow:hidden!important;
}
battery-core-card .side{
  position:relative!important;
  z-index:20!important;
  min-width:0!important;
}
battery-core-card .side.left{
  grid-column:1!important;
  padding:0 16px 0 0!important;
}
battery-core-card .side.right{
  grid-column:3!important;
  padding:0 0 0 16px!important;
}
battery-core-card .core-wrap{
  grid-column:2!important;
  position:relative!important;
  z-index:5!important;
  width:100%!important;
  max-width:100%!important;
  min-width:0!important;
  overflow:hidden!important;
  min-height:calc(410px * var(--bc-scale,.75))!important;
  height:calc(520px * var(--bc-scale,.75))!important;
}

/* Scale is capped by the center column. This is what prevents overlap. */
battery-core-card .ring-outer{
  width:min(calc(385px * var(--bc-scale,.75)),94%)!important;
  aspect-ratio:1/1!important;
  height:auto!important;
}
battery-core-card .ring-mid{
  width:min(calc(326px * var(--bc-scale,.75)),80%)!important;
  aspect-ratio:1/1!important;
  height:auto!important;
}
battery-core-card .ticks{
  width:min(calc(405px * var(--bc-scale,.75)),98%)!important;
  aspect-ratio:1/1!important;
  height:auto!important;
}
battery-core-card .orbit{
  width:min(calc(370px * var(--bc-scale,.75)),90%)!important;
}

/* Reactor is larger than V0.9 but remains capped inside its own column. */
battery-core-card .battery-core.lithium-cylinder{
  width:min(calc(172px * var(--bc-scale,.75)),42%)!important;
  height:calc(335px * var(--bc-scale,.75))!important;
  z-index:12!important;
}

/* More metallic, premium lithium cylinder. */
battery-core-card .lithium-cylinder .glass{
  left:17px!important;
  right:17px!important;
  top:37px!important;
  bottom:37px!important;
  border:2px solid rgba(185,250,255,.96)!important;
  border-radius:22px 22px 16px 16px!important;
  background:
    linear-gradient(90deg,
      rgba(225,252,255,.18) 0%,
      rgba(0,75,130,.09) 15%,
      rgba(0,18,42,.03) 45%,
      rgba(0,30,68,.05) 72%,
      rgba(215,252,255,.16) 100%)!important;
  box-shadow:
    inset 12px 0 18px rgba(210,252,255,.13),
    inset -10px 0 18px rgba(0,95,190,.15),
    inset 0 0 28px rgba(0,210,255,.22),
    0 0 8px #7ff7ff,
    0 0 24px rgba(0,195,255,.58)!important;
}
battery-core-card .lithium-cylinder .cap{
  height:43px!important;
  background:
    linear-gradient(to bottom,
      #f2ffff 0%,#93eaff 10%,#2d759f 27%,#071a31 48%,
      #153f65 63%,#67c9ec 82%,#e6fdff 100%)!important;
  box-shadow:
    inset 0 4px 6px rgba(255,255,255,.72),
    inset 0 -6px 9px rgba(0,8,28,.86),
    0 0 7px #a5f9ff,
    0 0 17px rgba(0,215,255,.7)!important;
}

/* Liquid is vivid but transparent enough to read as glass. */
battery-core-card .lithium-cylinder .liquid{
  background:
    radial-gradient(circle at 50% 82%,rgba(255,255,255,.35),transparent 18%),
    radial-gradient(circle at 30% 60%,rgba(100,250,255,.22),transparent 28%),
    linear-gradient(to top,#006eff 0%,rgba(0,132,255,.94) 38%,rgba(0,215,255,.82) 74%,rgba(74,255,255,.70) 100%)!important;
  box-shadow:
    inset 0 0 24px rgba(150,255,255,.32),
    0 -2px 7px #fff,
    0 -4px 18px #00f5ff,
    0 -8px 34px rgba(0,150,255,.78)!important;
}

/* Main feature: a broad, unmistakable animated water surface at exact SOC. */
battery-core-card .lithium-cylinder .wave{
  left:-36%!important;
  width:172%!important;
  height:34px!important;
  top:-17px!important;
  overflow:visible!important;
  opacity:1!important;
}
battery-core-card .lithium-cylinder .wave::before{
  top:12px!important;
  height:7px!important;
  border-radius:50%!important;
  background:
    linear-gradient(90deg,
      transparent 0%,
      rgba(0,229,255,.15) 5%,
      #47f7ff 18%,
      #d9ffff 37%,
      #ffffff 50%,
      #b6ffff 63%,
      #38edff 82%,
      rgba(0,211,255,.15) 95%,
      transparent 100%)!important;
  box-shadow:
    0 0 4px 1px white,
    0 0 10px 3px #4dffff,
    0 0 20px 6px rgba(0,225,255,.82),
    0 0 36px 8px rgba(0,117,255,.58)!important;
}
battery-core-card .lithium-cylinder .wave::after{
  content:""!important;
  position:absolute!important;
  left:8%!important;
  top:15px!important;
  width:84%!important;
  height:11px!important;
  border-radius:50%!important;
  border-top:2px solid rgba(205,255,255,.8)!important;
  background:rgba(0,225,255,.15)!important;
  box-shadow:0 0 12px rgba(0,240,255,.85)!important;
}
battery-core-card .lithium-cylinder .wave1{
  animation:bcV091Wave1 2.15s ease-in-out infinite!important;
}
battery-core-card .lithium-cylinder .wave2{
  top:-12px!important;
  opacity:.62!important;
  transform:scaleX(.88)!important;
  animation:bcV091Wave2 2.8s ease-in-out infinite!important;
}

/* Bubbles / internal energy shimmer. */
battery-core-card .lithium-cylinder .particles{
  opacity:.68!important;
  filter:drop-shadow(0 0 4px #7cffff)!important;
}
battery-core-card .lithium-cylinder .energy-particles i{
  opacity:.9;
  animation-duration:1.55s!important;
}

/* Energy fountain under the battery, echoing the original concept art. */
battery-core-card .core-energy-bed{
  position:absolute;
  z-index:7;
  left:50%;
  bottom:calc(18px * var(--bc-scale,.75));
  width:min(calc(350px * var(--bc-scale,.75)),92%);
  height:calc(180px * var(--bc-scale,.75));
  transform:translateX(-50%);
  pointer-events:none;
  overflow:hidden;
  filter:drop-shadow(0 0 9px rgba(0,225,255,.75));
}
battery-core-card .core-energy-bed::after{
  content:"";
  position:absolute;
  left:14%;right:14%;bottom:4px;height:4px;
  border-radius:50%;
  background:#9fffff;
  box-shadow:0 0 7px #fff,0 0 20px #00eaff,0 0 42px #006eff;
  animation:bcV091FloorPulse 1.8s ease-in-out infinite;
}
battery-core-card .core-energy-bed .beam{
  position:absolute;
  bottom:5px;
  width:4px;
  height:88%;
  border-radius:50%;
  transform-origin:bottom;
  background:linear-gradient(to top,#eaffff,#00eaff 28%,rgba(0,119,255,.35) 75%,transparent);
  box-shadow:0 0 6px #fff,0 0 14px #00dfff;
  opacity:.82;
  animation:bcV091Beam 1.45s ease-in-out infinite;
}
battery-core-card .core-energy-bed .b1{left:29%;transform:rotate(24deg);animation-delay:-.3s}
battery-core-card .core-energy-bed .b2{left:43%;transform:rotate(9deg);animation-delay:-.7s}
battery-core-card .core-energy-bed .b3{right:43%;transform:rotate(-9deg);animation-delay:-.1s}
battery-core-card .core-energy-bed .b4{right:29%;transform:rotate(-24deg);animation-delay:-.9s}
battery-core-card .core-energy-bed .spark{
  position:absolute;
  bottom:10px;width:4px;height:4px;border-radius:50%;
  background:#fff;box-shadow:0 0 5px #fff,0 0 12px #00eaff;
  animation:bcV091Spark 1.9s linear infinite;
}
battery-core-card .core-energy-bed .s1{left:23%;animation-delay:-.2s}
battery-core-card .core-energy-bed .s2{left:39%;animation-delay:-1.1s}
battery-core-card .core-energy-bed .s3{right:37%;animation-delay:-.6s}
battery-core-card .core-energy-bed .s4{right:21%;animation-delay:-1.5s}

/* Existing streams are strengthened, but kept behind the battery. */
battery-core-card .energy-streams{
  z-index:6!important;
  width:min(calc(360px * var(--bc-scale,.75)),94%)!important;
  height:calc(190px * var(--bc-scale,.75))!important;
  bottom:0!important;
  opacity:.9!important;
}

/* Values never ellipsize. */
battery-core-card .side .big,
battery-core-card .side .power-value,
battery-core-card .side .time-value,
battery-core-card .side .energy-value{
  max-width:100%!important;
  overflow:visible!important;
  text-overflow:clip!important;
}
battery-core-card .side.right .power-value{
  font-size:clamp(17px,calc(25px * var(--bc-scale,.75)),25px)!important;
  white-space:nowrap!important;
}
battery-core-card .side.left .energy-value{
  font-size:clamp(17px,calc(24px * var(--bc-scale,.75)),24px)!important;
  white-space:nowrap!important;
}

/* Charge/discharge fountain direction and color. */
battery-core-card.discharging .core-energy-bed{
  filter:drop-shadow(0 0 9px rgba(255,155,25,.72));
}
battery-core-card.discharging .core-energy-bed .beam{
  background:linear-gradient(to bottom,#fff7c7,#ffbf34 28%,rgba(255,76,0,.32) 78%,transparent);
  box-shadow:0 0 6px #fff2aa,0 0 14px #ff9d00;
  animation-name:bcV091BeamDown;
}
battery-core-card.discharging .core-energy-bed::after{
  background:#ffe083;
  box-shadow:0 0 7px #fff7c7,0 0 20px #ffad18,0 0 42px #ff5700;
}
battery-core-card:not(.charging):not(.discharging) .core-energy-bed{
  opacity:.18;
}

/* Responsive: on narrow cards, reduce the reactor before ever overlapping text. */
@container (max-width:760px){
  battery-core-card .main-grid{
    grid-template-columns:minmax(155px,31%) minmax(205px,38%) minmax(155px,31%)!important;
  }
  battery-core-card .battery-core.lithium-cylinder{width:min(calc(150px * var(--bc-scale,.75)),43%)!important}
  battery-core-card .side.left{padding-right:9px!important}
  battery-core-card .side.right{padding-left:9px!important}
}
@container (max-width:590px){
  battery-core-card .main-grid{
    grid-template-columns:1fr!important;
  }
  battery-core-card .core-wrap{grid-column:1!important;grid-row:1!important}
  battery-core-card .side.left{grid-column:1!important;grid-row:2!important;padding:10px 0!important}
  battery-core-card .side.right{grid-column:1!important;grid-row:3!important;padding:10px 0!important}
}

@keyframes bcV091Wave1{
  0%,100%{transform:translateX(-5%) translateY(1px) scaleY(.82) rotate(-.4deg)}
  25%{transform:translateX(0) translateY(-2px) scaleY(1.18) rotate(.3deg)}
  50%{transform:translateX(5%) translateY(1px) scaleY(.9) rotate(-.2deg)}
  75%{transform:translateX(1%) translateY(3px) scaleY(1.12) rotate(.35deg)}
}
@keyframes bcV091Wave2{
  0%,100%{transform:translateX(5%) scaleX(.88) scaleY(1.05)}
  50%{transform:translateX(-5%) scaleX(.92) scaleY(.78)}
}
@keyframes bcV091FloorPulse{
  0%,100%{opacity:.55;transform:scaleX(.72)}
  50%{opacity:1;transform:scaleX(1)}
}
@keyframes bcV091Beam{
  0%,100%{opacity:.28;filter:blur(.7px)}
  50%{opacity:1;filter:blur(0)}
}
@keyframes bcV091BeamDown{
  0%,100%{opacity:.3;filter:blur(.7px)}
  50%{opacity:.95;filter:blur(0)}
}
@keyframes bcV091Spark{
  0%{transform:translateY(0) scale(.6);opacity:0}
  15%{opacity:1}
  100%{transform:translateY(-150px) scale(1.15);opacity:0}
}


/* =====================================================================
   BATTERY CORE V0.9.2 — ORIGINAL CONCEPT / SVG ENERGY REACTOR
   ===================================================================== */

/* The reactor is now shorter, wider and visually closer to the concept. */
battery-core-card .core-wrap{
  height:calc(500px * var(--bc-scale,.75))!important;
  min-height:calc(395px * var(--bc-scale,.75))!important;
  isolation:isolate!important;
}
battery-core-card .battery-core.lithium-cylinder{
  width:min(calc(198px * var(--bc-scale,.75)),48%)!important;
  height:calc(300px * var(--bc-scale,.75))!important;
  transform:translate(-50%,-53%)!important;
  filter:
    drop-shadow(0 0 6px rgba(220,255,255,.95))
    drop-shadow(0 0 18px rgba(0,231,255,.72))
    drop-shadow(0 0 36px rgba(0,105,255,.45))!important;
}
battery-core-card .lithium-cylinder .glass{
  left:22px!important;right:22px!important;top:36px!important;bottom:36px!important;
  border-radius:18px!important;
}
battery-core-card .lithium-cylinder .cap{
  left:8px!important;right:8px!important;height:45px!important;
}
battery-core-card .lithium-cylinder .terminal{
  width:35%!important;height:14px!important;
}

/* The HUD ring is deliberately secondary: larger, darker and behind the cell. */
battery-core-card .ring-outer{
  width:min(calc(420px * var(--bc-scale,.75)),94%)!important;
  opacity:.82!important;
  filter:drop-shadow(0 0 8px rgba(0,196,255,.36))!important;
}
battery-core-card .ring-mid{
  width:min(calc(358px * var(--bc-scale,.75)),82%)!important;
  opacity:.52!important;
}
battery-core-card .ticks{opacity:.36!important}
battery-core-card .orbit{opacity:.34!important}

/* Strong liquid body and an unmistakable SOC surface. */
battery-core-card .lithium-cylinder .liquid{
  overflow:visible!important;
  background:
    radial-gradient(ellipse at 50% 90%,rgba(210,255,255,.42),transparent 25%),
    linear-gradient(to top,#0068ff 0%,#008fff 35%,rgba(0,204,255,.91) 72%,rgba(52,249,255,.76) 100%)!important;
}
battery-core-card .lithium-cylinder .wave{
  display:block!important;
  left:-45%!important;
  width:190%!important;
  height:42px!important;
  top:-21px!important;
  overflow:visible!important;
  transform-origin:center!important;
}
battery-core-card .lithium-cylinder .wave::before{
  content:""!important;
  position:absolute!important;
  left:0!important;right:0!important;top:15px!important;
  height:9px!important;
  border-radius:50%!important;
  background:
    linear-gradient(90deg,transparent 0%,#23eaff 12%,#a9ffff 31%,#fff 49%,#bfffff 66%,#24e8ff 87%,transparent 100%)!important;
  box-shadow:
    0 0 3px 2px #fff,
    0 0 10px 4px #79ffff,
    0 0 22px 8px rgba(0,232,255,.95),
    0 0 42px 11px rgba(0,111,255,.70)!important;
}
battery-core-card .lithium-cylinder .wave::after{
  content:""!important;
  position:absolute!important;
  left:9%!important;width:82%!important;top:18px!important;height:15px!important;
  border-radius:50%!important;
  border-top:3px solid rgba(235,255,255,.92)!important;
  background:radial-gradient(ellipse at center,rgba(91,255,255,.38),rgba(0,181,255,.08) 62%,transparent 70%)!important;
  box-shadow:0 -2px 10px #8effff,0 0 22px rgba(0,219,255,.85)!important;
}
battery-core-card .lithium-cylinder .wave1{animation:bc092WaveA 2.2s ease-in-out infinite!important}
battery-core-card .lithium-cylinder .wave2{
  top:-16px!important;opacity:.48!important;
  animation:bc092WaveB 3.1s ease-in-out infinite!important;
}

/* Bubbles are clipped to the liquid because they live inside #liquid. */
battery-core-card .lithium-cylinder .particles{
  background:
    radial-gradient(circle at 20% 72%,#cfffff 0 2px,transparent 3px),
    radial-gradient(circle at 72% 58%,#b8ffff 0 2px,transparent 3px),
    radial-gradient(circle at 48% 82%,#fff 0 1.5px,transparent 2.5px),
    radial-gradient(circle at 35% 42%,#9dffff 0 1.5px,transparent 2.5px),
    radial-gradient(circle at 80% 30%,#dfffff 0 1.5px,transparent 2.5px)!important;
  background-size:48px 72px,61px 83px,39px 58px,54px 77px,44px 69px!important;
  animation:bc092Bubbles 3.6s linear infinite!important;
}

/* Seven real curved energy veins, converging from the floor. */
battery-core-card .energy-manifold{
  position:absolute!important;
  z-index:8!important;
  left:50%!important;
  bottom:calc(2px * var(--bc-scale,.75))!important;
  width:min(calc(430px * var(--bc-scale,.75)),96%)!important;
  height:calc(220px * var(--bc-scale,.75))!important;
  transform:translateX(-50%)!important;
  overflow:visible!important;
  pointer-events:none!important;
  opacity:var(--bc-flow-opacity,.65)!important;
}
battery-core-card .energy-manifold .energy-veins path{
  fill:none!important;
  stroke:url(#bcBeam092)!important;
  stroke-width:3.5!important;
  stroke-linecap:round!important;
  stroke-dasharray:8 13!important;
  animation:bc092Dash .9s linear infinite!important;
}
battery-core-card .energy-manifold .energy-comets circle{
  fill:#efffff!important;
  stroke:#54f8ff!important;
  stroke-width:2!important;
}
battery-core-card .core-energy-bed{display:none!important}
battery-core-card .energy-streams{opacity:.25!important}

/* Reverse the visual direction in discharge. */
battery-core-card.discharging .energy-manifold .energy-veins path{
  stroke:#ffb52e!important;
  animation-direction:reverse!important;
}
battery-core-card.discharging .energy-manifold .energy-comets circle{
  fill:#fff7bd!important;stroke:#ff9e18!important;
}
battery-core-card.discharging .energy-manifold{
  filter:drop-shadow(0 0 10px rgba(255,139,0,.75))!important;
}

/* Right telemetry: reserve value width instead of ellipsizing it. */
battery-core-card .mini-grid>div{
  display:grid!important;
  grid-template-columns:28px minmax(72px,1fr) minmax(74px,auto)!important;
  column-gap:8px!important;
  align-items:center!important;
  min-width:0!important;
}
battery-core-card .mini-grid label{
  min-width:0!important;
  white-space:nowrap!important;
}
battery-core-card .mini-grid b{
  display:block!important;
  min-width:74px!important;
  max-width:none!important;
  white-space:nowrap!important;
  overflow:visible!important;
  text-overflow:clip!important;
  text-align:right!important;
  font-size:clamp(11px,calc(14px * var(--bc-scale,.75)),14px)!important;
}
battery-core-card .side.right{overflow:visible!important}
battery-core-card .side.right .metric{overflow:visible!important}

/* Keep left and right text intact even with a large graphic setting. */
battery-core-card .main-grid{
  grid-template-columns:minmax(205px,30%) minmax(245px,40%) minmax(205px,30%)!important;
}
battery-core-card .side.left .big-value,
battery-core-card .side.right .power-value,
battery-core-card .side.right .time-value{
  white-space:nowrap!important;
}

/* Extra glass highlights */
battery-core-card .lithium-cylinder .glass-shine{
  left:16%!important;width:12%!important;height:84%!important;opacity:.9!important;
}
battery-core-card .lithium-cylinder .glass::after{
  right:13px!important;opacity:.7!important;
}

/* SOC readout stays centered in the lithium body. */
battery-core-card .lithium-cylinder .core-readout{
  font-size:calc(35px * var(--bc-scale,.75))!important;
  letter-spacing:-1px!important;
}

@keyframes bc092WaveA{
  0%,100%{transform:translateX(-4%) translateY(1px) rotate(-.7deg) scaleY(.84)}
  25%{transform:translateX(1%) translateY(-3px) rotate(.45deg) scaleY(1.18)}
  50%{transform:translateX(5%) translateY(1px) rotate(-.25deg) scaleY(.92)}
  75%{transform:translateX(0) translateY(3px) rotate(.55deg) scaleY(1.13)}
}
@keyframes bc092WaveB{
  0%,100%{transform:translateX(5%) rotate(.5deg) scaleY(.9)}
  50%{transform:translateX(-5%) rotate(-.55deg) scaleY(1.14)}
}
@keyframes bc092Dash{
  to{stroke-dashoffset:-42}
}
@keyframes bc092Bubbles{
  from{background-position:0 70px,0 83px,0 58px,0 77px,0 69px}
  to{background-position:0 -72px,0 -83px,0 -58px,0 -77px,0 -69px}
}


      
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

/* V0.9.3: shared authoritative layout and visible SOC surface. */
battery-core-card .shell[class*="size-"] .main-grid {
  grid-template-columns:minmax(0,30fr) minmax(0,40fr) minmax(0,30fr)!important;
}
battery-core-card .side.left, battery-core-card .side.right { display:block!important; }
battery-core-card .core-wrap { overflow:hidden!important; }
battery-core-card .battery-core.lithium-cylinder {
  width:min(calc(230px * var(--bc-scale,.75)),56%)!important;
  min-height:190px;
}
/* Optical headroom keeps the surface below the metal cap at high SOC.
   The numeric SOC, progress bar and HUD ring keep the exact sensor value. */
battery-core-card .lithium-cylinder .glass {
  --bc-surface-y:clamp(36px,calc(100% - var(--bc-soc,0) * 1%),calc(100% - 32px));
}
battery-core-card .lithium-cylinder .liquid { overflow:hidden!important; }
battery-core-card .soc-surface {
  position:absolute; left:0; width:100%; height:18px;
  top:var(--bc-surface-y); transform:translateY(-50%);
  z-index:9; overflow:visible; pointer-events:none;
  transition:top .8s cubic-bezier(.2,.8,.2,1);
  filter:drop-shadow(0 0 3px #fff) drop-shadow(0 0 7px #00eaff);
}
battery-core-card .soc-surface path {
  fill:none; stroke:#eaffff; stroke-width:2.6;
  vector-effect:non-scaling-stroke;
  animation:bc093Surface 2.5s ease-in-out infinite;
}
battery-core-card .soc-surface path + path {
  stroke:#26edff; stroke-width:2; opacity:.8;
  animation-direction:reverse; animation-duration:3.1s;
}
@keyframes bc093Surface { 50% { transform:translateY(3px); } }
battery-core-card .energy-manifold { filter:drop-shadow(0 0 6px #00dfff)!important; }
battery-core-card .energy-manifold .energy-veins path {
  stroke:#32eaff!important; stroke-width:4.8!important;
  stroke-dasharray:14 7!important;
}
battery-core-card .energy-manifold .energy-comets circle { stroke-width:2.5!important; }
battery-core-card:not(.charging):not(.discharging) .energy-manifold { opacity:.18!important; }
/* Each value gets its own row, so it never competes with the label. */
battery-core-card .side.right .mini-grid > div {
  grid-template-columns:22px minmax(0,1fr)!important; gap:2px 7px!important;
}
battery-core-card .mini-grid > div > span { grid-column:1; grid-row:1 / 3; }
battery-core-card .mini-grid label { grid-column:2; white-space:normal!important; }
battery-core-card .mini-grid b {
  grid-column:2; min-width:0!important; width:100%; max-width:100%!important;
  white-space:normal!important; overflow-wrap:anywhere;
  overflow:visible!important; text-overflow:clip!important; text-align:left!important;
  font-size:14px!important; line-height:1.35;
}
battery-core-card .side.right { overflow:visible!important; }
battery-core-card .side .time-value, battery-core-card .side .power-value,
battery-core-card .side .big-value {
  white-space:normal!important; overflow-wrap:anywhere;
  overflow:visible!important; text-overflow:clip!important;
}
@media (prefers-reduced-motion:reduce) {
  battery-core-card *, battery-core-card *::before, battery-core-card *::after {
    animation:none!important; transition:none!important;
  }
  battery-core-card .energy-comets { display:none; }
}
/* V0.9.4: preserve SOC | reactor | power at every card width.
   These final selectors supersede historical media/container stacking rules. */
battery-core-card .shell[class*="size-"] .main-grid {
  grid-template-columns:minmax(0,30fr) minmax(0,40fr) minmax(0,30fr)!important;
  gap:0!important;
}
battery-core-card .shell[class*="size-"] .side.left {
  grid-column:1!important; grid-row:1!important;
  display:block!important; padding:0 8px 0 0!important;
}
battery-core-card .shell[class*="size-"] .core-wrap {
  grid-column:2!important; grid-row:1!important; order:0!important;
}
battery-core-card .shell[class*="size-"] .side.right {
  grid-column:3!important; grid-row:1!important;
  display:block!important; padding:0 0 0 8px!important;
}
@container (max-width:590px) {
  battery-core-card .shell[class*="size-"] .side.left { padding-right:3px!important; }
  battery-core-card .shell[class*="size-"] .side.right { padding-left:3px!important; }
  battery-core-card .metric { padding:12px 2px!important; }
  battery-core-card .metric-title {
    font-size:clamp(9px,2.5cqw,13px)!important;
    letter-spacing:.3px; overflow-wrap:anywhere;
  }
  battery-core-card .soc-line { gap:4px; flex-wrap:wrap; }
  battery-core-card .soc-line strong { font-size:clamp(20px,5.5cqw,32px)!important; }
  battery-core-card .mini-battery { width:22px; height:22px; flex-shrink:0; }
  battery-core-card .side .big-value,
  battery-core-card .side .power-value,
  battery-core-card .side .time-value { font-size:clamp(12px,3.4cqw,22px)!important; }
  battery-core-card .big-value small,
  battery-core-card .subvalue,
  battery-core-card .state-label { font-size:clamp(9px,2.4cqw,12px)!important; }
  battery-core-card .mini-grid label,
  battery-core-card .mini-grid b { font-size:clamp(10px,2.6cqw,14px)!important; }
  battery-core-card .side.right .mini-grid > div {
    grid-template-columns:12px minmax(0,1fr)!important; column-gap:3px!important;
  }
  battery-core-card .mini-grid span { font-size:15px!important; }
  battery-core-card .metric-symbol { margin-right:3px; }
  battery-core-card .battery-core.lithium-cylinder {
    width:min(calc(230px * var(--bc-scale,.75)),82%)!important;
  }
  battery-core-card .lithium-cylinder .glass { left:10px!important; right:10px!important; }
  battery-core-card .lithium-cylinder .core-readout { font-size:clamp(16px,4.4cqw,28px)!important; }
  battery-core-card .flow { gap:4px; padding:12px 5px; flex-wrap:nowrap; }
  battery-core-card .flow-node { gap:3px; flex:1 1 0!important; }
  battery-core-card .flow-node > span { font-size:18px; }
  battery-core-card .flow-node b { font-size:clamp(10px,2.8cqw,16px); overflow-wrap:anywhere; }
  battery-core-card .flow-node small { font-size:8px; letter-spacing:0; }
  battery-core-card .flow-arrows { display:none; }
}

`;
if (!document.head.querySelector('style[data-battery-core-card]')) {
  const style = document.createElement('style');
  style.dataset.batteryCoreCard = 'true';
  style.textContent = BATTERY_CORE_STYLE;
  document.head.appendChild(style);
}


// V0.8.2: complete CSS is embedded in JS; external CSS remains optional/available.
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
        ${BATTERY_CORE_STYLE}</style>

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

              <div class="battery-core lithium-cylinder">
                <div class="terminal terminal-top"></div>
                <div class="cap cap-top"></div>
                <div class="glass">
                  <div class="liquid" id="liquid">
                    <div class="particles"></div>
                  </div>
                  <svg class="soc-surface" viewBox="0 0 120 18" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M-5 9 Q10 2 25 9 T55 9 T85 9 T115 9 T145 9"/>
                    <path d="M-5 11 Q10 17 25 11 T55 11 T85 11 T115 11 T145 11"/>
                  </svg>
                  <div class="glass-shine"></div>
                  <div class="energy-particles" aria-hidden="true">
                    <i></i><i></i><i></i><i></i><i></i><i></i>
                  </div>
                  <div class="core-readout">
                    <span id="coreSoc">0%</span>
                  </div>
                </div>
                <div class="base cap-bottom"></div>
                <div class="terminal terminal-bottom"></div>
              </div>

              <svg class="energy-manifold" viewBox="0 0 420 210" preserveAspectRatio="none" aria-hidden="true">
                
                <g class="energy-veins">
                  <path d="M22 204 C72 190 105 150 174 87"/>
                  <path d="M76 207 C116 178 139 139 185 83"/>
                  <path d="M132 210 C157 168 174 124 197 78"/>
                  <path d="M210 210 C210 163 210 116 210 72"/>
                  <path d="M288 210 C263 168 246 124 223 78"/>
                  <path d="M344 207 C304 178 281 139 235 83"/>
                  <path d="M398 204 C348 190 315 150 246 87"/>
                </g>
                <g class="energy-comets">
                  <circle r="4"><animateMotion dur="1.8s" repeatCount="indefinite" path="M22 204 C72 190 105 150 174 87"/></circle>
                  <circle r="3"><animateMotion dur="1.45s" begin="-.6s" repeatCount="indefinite" path="M76 207 C116 178 139 139 185 83"/></circle>
                  <circle r="3.5"><animateMotion dur="1.65s" begin="-1s" repeatCount="indefinite" path="M132 210 C157 168 174 124 197 78"/></circle>
                  <circle r="4"><animateMotion dur="1.25s" begin="-.3s" repeatCount="indefinite" path="M210 210 C210 163 210 116 210 72"/></circle>
                  <circle r="3.5"><animateMotion dur="1.6s" begin="-.8s" repeatCount="indefinite" path="M288 210 C263 168 246 124 223 78"/></circle>
                  <circle r="3"><animateMotion dur="1.5s" begin="-1.2s" repeatCount="indefinite" path="M344 207 C304 178 281 139 235 83"/></circle>
                  <circle r="4"><animateMotion dur="1.85s" begin="-.45s" repeatCount="indefinite" path="M398 204 C348 190 315 150 246 87"/></circle>
                
                  <circle r="4"><animateMotion begin="-.95s" dur="1.8s" repeatCount="indefinite" path="M22 204 C72 190 105 150 174 87"/></circle>
                  <circle r="3"><animateMotion begin="-.95s" dur="1.45s"  repeatCount="indefinite" path="M76 207 C116 178 139 139 185 83"/></circle>
                  <circle r="3.5"><animateMotion begin="-.95s" dur="1.65s"  repeatCount="indefinite" path="M132 210 C157 168 174 124 197 78"/></circle>
                  <circle r="4"><animateMotion begin="-.95s" dur="1.25s"  repeatCount="indefinite" path="M210 210 C210 163 210 116 210 72"/></circle>
                  <circle r="3.5"><animateMotion begin="-.95s" dur="1.6s"  repeatCount="indefinite" path="M288 210 C263 168 246 124 223 78"/></circle>
                  <circle r="3"><animateMotion begin="-.95s" dur="1.5s"  repeatCount="indefinite" path="M344 207 C304 178 281 139 235 83"/></circle>
                  <circle r="4"><animateMotion begin="-.95s" dur="1.85s"  repeatCount="indefinite" path="M398 204 C348 190 315 150 246 87"/></circle>
                </g>
              </svg>
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
      shell.style.setProperty("--bc-soc", String(soc));
      shell.style.setProperty("--bc-flow-opacity", String(Math.max(.8, Math.min(1, .8 + powerAbs / 5))));
      const scalePct = Math.max(50, Math.min(100, Number(this.config.scale_percent) || 75));
      shell.style.setProperty("--bc-scale", String(scalePct / 100));
    }

    const liquid = this.querySelector("#liquid");
    if (liquid) liquid.style.height = soc <= 0 ? "0%" : "calc(100% - var(--bc-surface-y))";
    const surface = this.querySelector(".soc-surface");
    if (surface) surface.style.display = soc <= 0 ? "none" : "block";
    const direction = discharging ? "1;0" : "0;1";
    this.querySelectorAll(".energy-comets animateMotion").forEach(motion => {
      if (motion.getAttribute("keyPoints") !== direction) {
        motion.setAttribute("keyPoints", direction);
        motion.setAttribute("keyTimes", "0;1");
        motion.setAttribute("calcMode", "linear");
      }
    });
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
          <div style="height:14px"></div>
          ${this._entityRow("Batterie : tension", "voltage")}
          <div style="height:14px"></div>
          ${this._entityRow("Batterie : température", "temperature")}
          <div style="height:14px"></div>
          ${this._entityRow("Batterie : courant", "current")}
        </div>
      </div>
    `;

    // Configure Home Assistant's native entity pickers.
    const pickerIds = ["battery_soc", "battery_power", "time_remaining", "voltage", "temperature", "current"];
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

