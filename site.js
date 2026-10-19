const nav = document.getElementById("nav");
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 8);
}, { passive: true });

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

const acceptBtn = document.getElementById("acceptBtn");
const reqChip = document.getElementById("reqChip");
if (acceptBtn && reqChip) {
  acceptBtn.addEventListener("click", () => {
    reqChip.classList.add("booked");
    reqChip.querySelector("span").textContent = "Noah · Sat 10:00 · booked";
    acceptBtn.textContent = "Booked";
  });
}

function checklist(state) {
  const items = [
    { title: "Be 16 for the road test", sub: "Most states test at 16" },
    { title: `Hold the permit ${state.holdDays} days`, sub: state.permitHold },
  ];
  if (state.practiceHours > 0) {
    items.push({ title: `Log ${state.practiceHours} practice hours`, sub: state.practiceLabel });
  }
  if (state.nightHours > 0) {
    items.push({ title: `Log ${state.nightHours} night hours`, sub: state.nightLabel });
  }
  items.push({
    title: state.driverEdRequired ? "Finish driver ed" : "Driver ed",
    sub: state.driverEdRequired ? "Required in this state" : "Not required for the license path",
  });
  items.push({ title: "Pass the written test", sub: "Confirm with the DMV" });
  items.push({ title: "Bring the documents", sub: "Birth record, permit, parent signature — varies" });
  return items;
}

function renderState(state) {
  document.getElementById("stPractice").textContent = state.practiceHours || "—";
  document.getElementById("stNight").textContent = state.nightHours || "—";
  document.getElementById("stHold").textContent = state.holdDays || "—";
  document.getElementById("stEd").textContent = state.driverEdRequired ? "Yes" : "No";
  document.getElementById("stHoldNote").textContent = state.permitHold || "";
  const ul = document.getElementById("stCheck");
  ul.innerHTML = checklist(state).map((item) => (
    `<li><span>${item.title}<br><small>${item.sub}</small></span></li>`
  )).join("");

  const circ = 2 * Math.PI * 88;
  const nightCirc = 2 * Math.PI * 66;
  const p = state.practiceHours > 0 ? Math.min(0.35, 12.4 / state.practiceHours) : 0;
  const n = state.nightHours > 0 ? Math.min(0.4, 3 / state.nightHours) : 0;
  const arcP = document.getElementById("arcPractice");
  const arcN = document.getElementById("arcNight");
  if (arcP) arcP.setAttribute("stroke-dasharray", `${(p * circ).toFixed(1)} ${circ.toFixed(1)}`);
  if (arcN) {
    arcN.style.display = state.nightHours > 0 ? "block" : "none";
    arcN.setAttribute("stroke-dasharray", `${(n * nightCirc).toFixed(1)} ${nightCirc.toFixed(1)}`);
  }
}

async function loadStates() {
  const select = document.getElementById("stateSelect");
  if (!select) return;
  const res = await fetch("states.json");
  const states = await res.json();
  select.innerHTML = states.map((s) => (
    `<option value="${s.abbr}" ${s.abbr === "TX" ? "selected" : ""}>${s.name}</option>`
  )).join("");
  const byAbbr = Object.fromEntries(states.map((s) => [s.abbr, s]));
  renderState(byAbbr.TX);
  select.addEventListener("change", () => renderState(byAbbr[select.value]));
}

loadStates().catch(() => {});
