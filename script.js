/* ---------- Edit these ---------- */
const NAME = "Rei Senka";
const SKILLS = ["HTML","CSS","JavaScript","Responsive design","Motion design","UI design","Teamwork","Photography"];
const PROJECTS = [
  {t:"AsimVokshi", c:"web", tag:"Website", d:"A Website That is Made For A School in Tirana.", tech:["HTML","CSS","JavaScript"], a:"#C8FF2E", b:"#1B2A6B", link:"https://keshillimikarrieresasimvokshi.vercel.app"},
  {t:"Lantern", c:"design", tag:"Design", d:"Logo and colour system for a student-run night café.", tech:["Branding","Figma"], a:"#1B2A6B", b:"#C8FF2E", link:"#"},
  {t:"City at dusk", c:"photo", tag:"Photography", d:"Twelve photos of streets in the hour after sunset.", tech:["Photography","Lightroom"], a:"#0A1030", b:"#F3EEE2", link:"#"},
  {t:"Passport", c:"web", tag:"Website", d:"A travel journal site built with my international team.", tech:["Teamwork","CSS","JavaScript"], a:"#F3EEE2", b:"#1B2A6B", link:"#"},
  {t:"Fold", c:"design", tag:"Design", d:"A series of paper-folded posters about languages.", tech:["Print","Illustration"], a:"#C8FF2E", b:"#0A1030", link:"#"}
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Hero name */
const nameEl = $("#name");
nameEl.textContent = "";
let idx = 0;
NAME.split(" ").forEach(w => {
  const word = document.createElement("span");
  word.className = "word"; word.setAttribute("aria-hidden", "true");
  [...w].forEach(c => { const ch = document.createElement("span"); ch.className = "ch"; ch.textContent = c; ch.style.setProperty("--i", idx++); word.appendChild(ch); });
  nameEl.appendChild(word);
});
const letters = $$(".ch"), hero = $(".hero");
hero.addEventListener("pointermove", e => letters.forEach(l => {
  const r = l.getBoundingClientRect();
  l.style.setProperty("--p", Math.max(0, 1 - Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) / 190).toFixed(3));
}));
hero.addEventListener("pointerleave", () => letters.forEach(l => l.style.setProperty("--p", 0)));

/* Marquee */
const row = SKILLS.map(s => `<span>${s}</span>`).join("");
$("#track").innerHTML = row + row + row + row;

/* Menu */
const nav = $("#nav"), burger = $("#burger"), menu = $("#workMenu"), subBtn = $(".sub-btn", menu);
let closeTimer;
const setMenu = open => { menu.classList.toggle("open", open); subBtn.setAttribute("aria-expanded", open); };
subBtn.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
if (matchMedia("(hover:hover) and (min-width:761px)").matches) {
  menu.addEventListener("mouseenter", () => { clearTimeout(closeTimer); setMenu(true); });
  menu.addEventListener("mouseleave", () => { closeTimer = setTimeout(() => setMenu(false), 160); });
}
document.addEventListener("click", e => { if (!menu.contains(e.target)) setMenu(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { setMenu(false); subBtn.focus(); } });
burger.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
$$(".links a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", false); }));

/* ---------- 3D project gallery ---------- */
const stage = $("#stage"), scene = $("#scene"), ring = $("#ring"), win = $("#win");
const labels = { all: "all projects", web: "websites", design: "design", photo: "photography" };
let list = [], cards = [], n = 0, step = 360, R = 0, rot = 0, target = null, vel = 0;
let dragging = false, moved = 0, lastX = 0, hovering = false, active = -1, tx = 0, ty = 0, cx = 0, cy = 0;

function build(filter) {
  list = PROJECTS.filter(p => filter === "all" || p.c === filter);
  n = list.length; step = 360 / n; rot = 0; target = null; active = -1;
  ring.innerHTML = "";
  cards = list.map((p, i) => {
    const el = document.createElement("article");
    el.className = "c";
    el.innerHTML = `<div class="face" style="--a:${p.a};--b:${p.b}"><div class="art"><i></i><i></i></div><div class="txt"><h3>${p.t}</h3><span class="tag">${p.tag}</span></div></div>`;
    el.addEventListener("click", () => { if (moved < 6) goTo(i); });
    ring.appendChild(el);
    return el;
  });
  layout();
}
function layout() {
  const w = Math.min(300, stage.clientWidth * .62);
  stage.style.setProperty("--w", w + "px");
  R = n === 1 ? 0 : n < 3 ? w * .62 : Math.round((w / 2 + 34) / Math.tan(Math.PI / n));
  cards.forEach((c, i) => c.style.transform = `rotateY(${i * step}deg) translateZ(${R}px)`);
}
function goTo(i) {
  const want = -i * step;
  let d = (want - rot) % 360; if (d > 180) d -= 360; if (d < -180) d += 360;
  target = rot + d;
}
const snapped = () => Math.round(rot / step) * step;
const go = dir => { target = (target ?? snapped()) + dir * step; };
function detail() {
  const i = ((Math.round(-rot / step) % n) + n) % n;
  if (i === active) return;
  active = i;
  const p = list[i];
  cards.forEach((c, k) => c.classList.toggle("on", k === i));
  $("#info").classList.remove("swap"); void $("#info").offsetWidth; $("#info").classList.add("swap");
  $("#dTitle").textContent = p.t; $("#dDesc").textContent = p.d; $("#dLink").href = p.link;
  $("#dTech").innerHTML = p.tech.map(t => `<span>${t}</span>`).join("");
  $("#count").textContent = `${i + 1} / ${n}`;
}
function frame() {
  if (!dragging) {
    if (target !== null) { rot += (target - rot) * .09; if (Math.abs(target - rot) < .05) { rot = target; target = null; } }
    else if (Math.abs(vel) > .01) { rot += vel; vel *= .94; if (Math.abs(vel) <= .01) target = snapped(); }
  }
  cx += (tx - cx) * .08; cy += (ty - cy) * .08;
  ring.style.transform = `translateZ(${-R}px) rotateY(${rot}deg)`;
  scene.style.transform = `rotateX(${-6 + cy * -7}deg) rotateY(${cx * 6}deg)`;
  detail();
  requestAnimationFrame(frame);
}
stage.addEventListener("pointerdown", e => { dragging = true; moved = 0; vel = 0; target = null; lastX = e.clientX; stage.setPointerCapture(e.pointerId); stage.classList.add("grab"); });
stage.addEventListener("pointermove", e => {
  const r = stage.getBoundingClientRect();
  tx = (e.clientX - r.left) / r.width * 2 - 1; ty = (e.clientY - r.top) / r.height * 2 - 1;
  if (!dragging) return;
  const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx);
  rot += dx * .4; vel = dx * .4;
});
const release = () => { if (!dragging) return; dragging = false; stage.classList.remove("grab"); target = Math.round((rot + vel * 8) / step) * step; vel = 0; };
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);
stage.addEventListener("pointerenter", () => hovering = true);
stage.addEventListener("pointerleave", () => { hovering = false; tx = ty = 0; });
stage.addEventListener("keydown", e => { if (e.key === "ArrowRight") go(-1); if (e.key === "ArrowLeft") go(1); });
$("#next").addEventListener("click", () => go(-1));
$("#prev").addEventListener("click", () => go(1));
addEventListener("resize", layout);
if (!reduce) setInterval(() => { if (!dragging && !hovering && target === null && !document.hidden) go(-1); }, 4200);

const status = $("#status");
function setFilter(f) {
  $$("[data-filter]").forEach(b => b.setAttribute("aria-pressed", b.dataset.filter === f));
  status.textContent = "Showing " + labels[f];
  build(f);
}
$$("[data-filter]").forEach(btn => btn.addEventListener("click", () => {
  setFilter(btn.dataset.filter);
  if (btn.closest(".sub")) {
    setMenu(false); nav.classList.remove("is-open");
    $("#work").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
}));
build("all"); frame();

/* Reveal + counters */
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (!en.isIntersecting) return;
  en.target.classList.add("in");
  const c = $("[data-count]", en.target); if (c) countUp(c);
  io.unobserve(en.target);
}), { threshold: .18 });
$$(".reveal").forEach(el => io.observe(el));
function countUp(el) {
  const to = +el.dataset.count, suf = el.dataset.suffix || "", t0 = performance.now(), dur = reduce ? 1 : 1500;
  (function tick(t) {
    const k = Math.min(1, (t - t0) / dur);
    el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + suf;
    if (k < 1) requestAnimationFrame(tick);
  })(t0);
}

/* Progress bar */
const bar = $("#progress");
addEventListener("scroll", () => { const h = document.documentElement; bar.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`; }, { passive: true });

/* Cursor */
const dot = $("#dot");
if (matchMedia("(hover:hover) and (pointer:fine)").matches && !reduce) {
  let x = 0, y = 0, dx = 0, dy = 0;
  addEventListener("pointermove", e => { x = e.clientX; y = e.clientY; });
  (function loop() { dx += (x - dx) * .18; dy += (y - dy) * .18; dot.style.left = dx + "px"; dot.style.top = dy + "px"; requestAnimationFrame(loop); })();
  document.addEventListener("pointerover", e => dot.classList.toggle("big", !!e.target.closest("a,button,.c,.stat")));
}