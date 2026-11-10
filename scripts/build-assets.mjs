/**
 * Builds the animated SVG artwork used in README.md, styled to match the portfolio
 * (https://www.magdyaboelnour.me): banner (dark + light), the classified
 * "Project Ignition" card, and the "Shipped with" quality strip.
 *
 *   node scripts/build-assets.mjs
 *
 * Edit the CONTENT block below, then re-run and commit the files in assets/.
 */
import { mkdir, writeFile } from "node:fs/promises"

const CONTENT = {
  first: "Magdy",
  last: "Abu El-nour",
  title: "Full-Stack Web Developer",
  stack: ["React", "Next.js", "TypeScript", "Laravel", "WordPress"],
  status: "AVAILABLE FOR NEW PROJECTS",
  current: { label: "CURRENTLY", role: "Frontend & WordPress Developer", company: "Neea Studios Ltd · UK", note: "Building Polimapper, a geospatial SaaS" },
  next: { label: "NEXT", name: "Project Ignition", note: "Automotive · Egypt · classified" },
}

const THEMES = {
  dark: {
    bg: "#07090d", bg2: "#0b1017", grid: "#ffffff", gridOpacity: 0.05, text: "#f3f6fa", muted: "#94a3b8",
    brand: "#34d399", brand2: "#38bdf8", card: "#ffffff", cardOpacity: 0.04, cardStroke: "#ffffff", cardStrokeOpacity: 0.1,
    amber: "#fbbf24",
  },
  light: {
    bg: "#fbfaf8", bg2: "#f1f5f4", grid: "#0f172a", gridOpacity: 0.05, text: "#0f172a", muted: "#5b6472",
    brand: "#059669", brand2: "#0284c7", card: "#ffffff", cardOpacity: 0.85, cardStroke: "#0f172a", cardStrokeOpacity: 0.1,
    amber: "#d97706",
  },
}

const FONT = `-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif`
const MONO = `ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

function banner(t) {
  let x = 80
  const chips = CONTENT.stack
    .map((s) => {
      const w = s.length * 8.4 + 28
      const chip = `<g class="fade d5"><rect x="${x}" y="294" width="${w}" height="30" rx="15" fill="${t.card}" fill-opacity="${t.cardOpacity}" stroke="${t.cardStroke}" stroke-opacity="${t.cardStrokeOpacity}"/><text x="${x + w / 2}" y="314" text-anchor="middle" class="chip">${esc(s)}</text></g>`
      x += w + 10
      return chip
    })
    .join("\n  ")

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="360" viewBox="0 0 1200 360" fill="none" role="img" aria-labelledby="t d">
  <title id="t">${esc(CONTENT.first)} ${esc(CONTENT.last)}: ${esc(CONTENT.title)}</title>
  <desc id="d">${esc(CONTENT.title)} working with ${esc(CONTENT.stack.join(", "))}. Currently ${esc(CONTENT.current.role)} at ${esc(CONTENT.current.company)}.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="360" gradientUnits="userSpaceOnUse"><stop stop-color="${t.bg}"/><stop offset="1" stop-color="${t.bg2}"/></linearGradient>
    <linearGradient id="brand" x1="80" y1="0" x2="560" y2="0" gradientUnits="userSpaceOnUse">
      <stop stop-color="${t.brand}"><animate attributeName="stop-color" values="${t.brand};${t.brand2};${t.brand}" dur="8s" repeatCount="indefinite"/></stop>
      <stop offset="1" stop-color="${t.brand2}"><animate attributeName="stop-color" values="${t.brand2};${t.brand};${t.brand2}" dur="8s" repeatCount="indefinite"/></stop>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" stroke="${t.grid}" stroke-opacity="${t.gridOpacity}"/></pattern>
    <radialGradient id="fade" cx="0.7" cy="0" r="1"><stop stop-color="#fff"/><stop offset="0.75" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <mask id="gridMask"><rect width="1200" height="360" fill="url(#fade)"/></mask>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="60"/></filter>
    <clipPath id="clip"><rect width="1200" height="360" rx="28"/></clipPath>
  </defs>
  <style>
    text { font-family: ${FONT}; }
    .mono { font-family: ${MONO}; letter-spacing: 2.4px; font-size: 12px; fill: ${t.muted}; }
    .name { font-size: 76px; font-weight: 800; letter-spacing: -2px; fill: ${t.text}; }
    .grad { fill: url(#brand); }
    .title { font-size: 22px; font-weight: 600; fill: ${t.text}; opacity: .82; }
    .chip { font-size: 13px; font-weight: 600; fill: ${t.text}; }
    .role { font-size: 17px; font-weight: 700; fill: ${t.text}; }
    .note { font-size: 13px; fill: ${t.muted}; }
    .fade { opacity: 0; animation: up .9s cubic-bezier(.22,1,.36,1) forwards; }
    .d1 { animation-delay: .1s } .d2 { animation-delay: .25s } .d3 { animation-delay: .4s } .d4 { animation-delay: .55s } .d5 { animation-delay: .7s } .d6 { animation-delay: .85s }
    @keyframes up { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
    .ping { transform-origin: 98px 66px; animation: ping 1.8s cubic-bezier(0,0,.2,1) infinite; }
    @keyframes ping { 0% { transform: scale(1); opacity: .7 } 75%, 100% { transform: scale(2.6); opacity: 0 } }
    .float { animation: float 6s ease-in-out infinite; }
    @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
    .redact { animation: shimmer 2.4s ease-in-out infinite; }
    @keyframes shimmer { 0%,100% { opacity: .35 } 50% { opacity: .7 } }
    @media (prefers-reduced-motion: reduce) { .fade, .ping, .float, .redact { animation: none; opacity: 1 } }
  </style>

  <g clip-path="url(#clip)">
    <rect width="1200" height="360" fill="url(#bg)"/>
    <rect width="1200" height="360" fill="url(#grid)" mask="url(#gridMask)"/>
    <circle cx="980" cy="-10" r="190" fill="${t.brand}" fill-opacity=".22" filter="url(#blur)"/>
    <circle cx="1160" cy="330" r="160" fill="${t.brand2}" fill-opacity=".16" filter="url(#blur)"/>
  </g>
  <rect x=".5" y=".5" width="1199" height="359" rx="27.5" stroke="${t.cardStroke}" stroke-opacity="${t.cardStrokeOpacity}"/>

  <g class="fade d1">
    <rect x="80" y="50" width="${CONTENT.status.length * 8.6 + 52}" height="32" rx="16" fill="${t.brand}" fill-opacity=".12" stroke="${t.brand}" stroke-opacity=".35"/>
    <circle class="ping" cx="98" cy="66" r="4" fill="${t.brand}"/>
    <circle cx="98" cy="66" r="4" fill="${t.brand}"/>
    <text x="112" y="70.5" class="mono" style="fill:${t.brand};font-size:11px;font-weight:700">${esc(CONTENT.status)}</text>
  </g>
  <text x="76" y="156" class="name fade d2">${esc(CONTENT.first)}</text>
  <text x="76" y="230" class="name grad fade d3">${esc(CONTENT.last)}</text>
  <text x="80" y="274" class="title fade d4">${esc(CONTENT.title)}</text>
  ${chips}

  <g class="float">
    <g class="fade d5">
      <rect x="770" y="58" width="376" height="128" rx="20" fill="${t.card}" fill-opacity="${t.cardOpacity}" stroke="${t.cardStroke}" stroke-opacity="${t.cardStrokeOpacity}"/>
      <rect x="794" y="84" width="44" height="44" rx="12" fill="#ffffff" stroke="#0f172a" stroke-opacity=".08"/>
      <path d="M806 120v-12a10 10 0 0 1 20 0v12h-5v-12a5 5 0 0 0-10 0v12z M804 123h24v2.5h-24z" fill="#1b4a6b"/>
      <text x="856" y="96" class="mono" style="font-size:10.5px">${esc(CONTENT.current.label)}</text>
      <text x="856" y="118" class="role">${esc(CONTENT.current.role)}</text>
      <text x="856" y="138" class="note">${esc(CONTENT.current.company)}</text>
      <text x="794" y="166" class="note">${esc(CONTENT.current.note)}</text>
    </g>
    <g class="fade d6">
      <rect x="770" y="202" width="376" height="96" rx="20" fill="${t.amber}" fill-opacity=".07" stroke="${t.amber}" stroke-opacity=".4" stroke-dasharray="6 5"/>
      <text x="794" y="232" class="mono" style="fill:${t.amber};font-size:10.5px;font-weight:700">● ${esc(CONTENT.next.label)} · CLASSIFIED</text>
      <text x="794" y="257" class="role">${esc(CONTENT.next.name)}</text>
      <rect class="redact" x="960" y="244" width="130" height="16" rx="4" fill="${t.muted}"/>
      <text x="794" y="280" class="note">${esc(CONTENT.next.note)}</text>
    </g>
  </g>
</svg>
`
}

function ignition() {
  const t = THEMES.dark
  const amber = "#fbbf24"
  const milestones = [
    ["Accounts & security", true],
    ["Verified listings & media", true],
    ["Search engine", true],
    ["Publishing & discovery", true],
    [null, false],
  ]
  const rows = milestones
    .map(([label, done], i) => {
      const y = 132 + i * 30
      const icon = done
        ? `<circle cx="760" cy="${y - 4}" r="9" fill="#34d399" fill-opacity=".15"/><path d="M755.5 ${y - 4}l3 3 5.5-6" stroke="#6ee7b7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
        : `<circle cx="760" cy="${y - 4}" r="9" stroke="${amber}" stroke-opacity=".6" stroke-dasharray="3 2.5" fill="none"/>`
      const text = done
        ? `<text x="780" y="${y + 1}" class="row">${esc(label)}</text>`
        : `<rect class="redact" x="780" y="${y - 11}" width="150" height="13" rx="3" fill="#ffffff"/>`
      return `<g class="fade" style="animation-delay:${0.5 + i * 0.12}s">${icon}${text}</g>`
    })
    .join("\n    ")

  const stack = ["Next.js", "NestJS", "PostgreSQL", "OpenSearch", "BullMQ"]
  let sx = 140
  const stackChips = stack
    .map((s) => {
      const w = s.length * 7.6 + 18
      const c = `<rect x="${sx}" y="262" width="${w}" height="24" rx="5" stroke="#ffffff" stroke-opacity=".18"/><text x="${sx + w / 2}" y="278.5" text-anchor="middle" class="code">${esc(s)}</text>`
      sx += w + 8
      return c
    })
    .join("")

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="360" viewBox="0 0 1200 360" fill="none" role="img" aria-labelledby="t d">
  <title id="t">Project Ignition: classified</title>
  <desc id="d">A stealth-mode platform set to change how Egypt buys and sells cars. Brand and launch date are under wraps. Four of five milestones are complete.</desc>
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" stroke="#fff" stroke-opacity=".06"/></pattern>
    <radialGradient id="m" cx="1" cy="0" r="1"><stop stop-color="#fff"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <mask id="gm"><rect width="1200" height="360" fill="url(#m)"/></mask>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="70"/></filter>
    <linearGradient id="bar" x1="0" x2="1"><stop stop-color="#34d399"/><stop offset="1" stop-color="${amber}"/></linearGradient>
    <linearGradient id="scan" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <clipPath id="clip"><rect width="1200" height="360" rx="28"/></clipPath>
  </defs>
  <style>
    text { font-family: ${FONT}; }
    .mono { font-family: ${MONO}; font-size: 11px; letter-spacing: 2.2px; }
    .code { font-family: ${MONO}; font-size: 11.5px; fill: #e2e8f0; }
    .h { font-size: 34px; font-weight: 800; fill: #fff; letter-spacing: -.8px; }
    .p { font-size: 15px; fill: #ffffff; fill-opacity: .62; }
    .k { font-family: ${MONO}; font-size: 11.5px; fill: #ffffff; fill-opacity: .4; letter-spacing: 1px; }
    .v { font-family: ${MONO}; font-size: 12px; fill: #ffffff; fill-opacity: .85; }
    .row { font-size: 14px; fill: #ffffff; fill-opacity: .82; }
    .fade { opacity: 0; animation: up .8s cubic-bezier(.22,1,.36,1) forwards; }
    @keyframes up { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
    .redact { animation: shimmer 2.2s ease-in-out infinite; }
    @keyframes shimmer { 0%,100% { opacity: .12 } 50% { opacity: .3 } }
    .ping { transform-origin: 98px 62px; animation: ping 1.6s cubic-bezier(0,0,.2,1) infinite; }
    @keyframes ping { 0% { transform: scale(1); opacity: .8 } 75%,100% { transform: scale(2.8); opacity: 0 } }
    .scan { animation: scan 6s linear infinite; }
    @keyframes scan { from { transform: translateY(-120px) } to { transform: translateY(380px) } }
    .grow { transform-origin: 740px 0; animation: grow 1.6s .4s cubic-bezier(.22,1,.36,1) both; }
    @keyframes grow { from { transform: scaleX(0) } to { transform: scaleX(1) } }
    @media (prefers-reduced-motion: reduce) { .fade, .redact, .ping, .scan, .grow { animation: none; opacity: 1 } }
  </style>
  <g clip-path="url(#clip)">
    <rect width="1200" height="360" fill="${t.bg}"/>
    <rect width="1200" height="360" fill="url(#grid)" mask="url(#gm)"/>
    <circle cx="1120" cy="-20" r="200" fill="${amber}" fill-opacity=".22" filter="url(#blur)"/>
    <circle cx="160" cy="400" r="170" fill="#34d399" fill-opacity=".12" filter="url(#blur)"/>
    <rect class="scan" width="1200" height="110" fill="url(#scan)"/>
  </g>
  <rect x=".5" y=".5" width="1199" height="359" rx="27.5" stroke="#fff" stroke-opacity=".1"/>

  <g class="fade">
    <rect x="80" y="46" width="126" height="30" rx="15" fill="${amber}" fill-opacity=".1" stroke="${amber}" stroke-opacity=".45"/>
    <circle class="ping" cx="98" cy="62" r="3.5" fill="${amber}"/><circle cx="98" cy="62" r="3.5" fill="${amber}"/>
    <text x="110" y="65.5" class="mono" style="fill:#fcd34d;font-weight:700">CLASSIFIED</text>
    <rect x="216" y="46" width="186" height="30" rx="15" stroke="#fff" stroke-opacity=".16"/>
    <text x="309" y="65.5" text-anchor="middle" class="mono" style="fill:#fff;fill-opacity:.6">AUTOMOTIVE · EGYPT</text>
  </g>
  <text x="80" y="112" class="mono fade" style="fill:#fff;fill-opacity:.45;letter-spacing:1px;font-size:13px;animation-delay:.1s">// Project Ignition</text>
  <g class="fade" style="animation-delay:.2s">
    <text x="80" y="154" class="h">Something big is coming to how</text>
    <text x="80" y="194" class="h">Egypt buys and sells cars.</text>
  </g>
  <g class="fade" style="animation-delay:.35s">
    <text x="80" y="236" class="k">BRAND</text><rect class="redact" x="140" y="225" width="160" height="14" rx="3" fill="#fff"/>
    <text x="330" y="236" class="k">LAUNCH</text><rect class="redact" x="396" y="225" width="96" height="14" rx="3" fill="#fff"/>
    <text x="80" y="279" class="k">STACK</text>${stackChips}<rect class="redact" x="${sx}" y="267" width="56" height="14" rx="3" fill="#fff"/>
    <text x="80" y="318" class="p">Built end to end: web, API, search engine and admin. Details under NDA until launch.</text>
  </g>

  <g class="fade" style="animation-delay:.3s">
    <rect x="720" y="46" width="400" height="272" rx="20" fill="#fff" fill-opacity=".03" stroke="#fff" stroke-opacity=".1"/>
    <text x="744" y="78" class="mono" style="fill:#fff;fill-opacity:.5">BUILD LOG</text>
    <text x="1096" y="78" text-anchor="end" class="code" style="fill-opacity:.6">4/5</text>
    <rect x="744" y="92" width="352" height="6" rx="3" fill="#fff" fill-opacity=".1"/>
    <rect class="grow" x="744" y="92" width="${352 * 0.8}" height="6" rx="3" fill="url(#bar)"/>
  </g>
    ${rows}
</svg>
`
}

function quality(t, theme) {
  const items = ["Performance", "Accessibility", "Best Practices", "SEO"]
  const r = 34
  const c = 2 * Math.PI * r
  const ring = theme === "dark" ? "#34d399" : "#059669"
  const gauges = items
    .map((label, i) => {
      const cx = 150 + i * 300
      return `<g class="fade" style="animation-delay:${i * 0.15}s">
    <circle cx="${cx}" cy="78" r="${r}" stroke="${ring}" stroke-opacity=".14" stroke-width="7"/>
    <circle class="draw" style="animation-delay:${0.2 + i * 0.15}s" cx="${cx}" cy="78" r="${r}" stroke="${ring}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${c.toFixed(1)}" transform="rotate(-90 ${cx} 78)"/>
    <path d="M${cx - 12} 78l8 8 16-17" stroke="${ring}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="${cx}" y="146" text-anchor="middle" class="l">${label}</text>
  </g>`
    })
    .join("\n  ")
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="176" viewBox="0 0 1200 176" fill="none" role="img" aria-labelledby="t">
  <title id="t">Every project ships with performance, accessibility, best-practice and SEO work</title>
  <style>
    text { font-family: ${FONT}; }
    .l { font-size: 17px; font-weight: 700; fill: ${t.text}; }
    .fade { opacity: 0; animation: up .7s cubic-bezier(.22,1,.36,1) forwards; }
    @keyframes up { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
    .draw { animation: draw 1.4s cubic-bezier(.22,1,.36,1) forwards; }
    @keyframes draw { to { stroke-dashoffset: 0 } }
    @media (prefers-reduced-motion: reduce) { .fade { animation: none; opacity: 1 } .draw { animation: none; stroke-dashoffset: 0 } }
  </style>
  ${gauges}
</svg>
`
}

const out = new URL("../assets/", import.meta.url)
await mkdir(out, { recursive: true })
await writeFile(new URL("banner-dark.svg", out), banner(THEMES.dark))
await writeFile(new URL("banner-light.svg", out), banner(THEMES.light))
await writeFile(new URL("project-ignition.svg", out), ignition())
await writeFile(new URL("quality-dark.svg", out), quality(THEMES.dark, "dark"))
await writeFile(new URL("quality-light.svg", out), quality(THEMES.light, "light"))
console.log("Built banner-dark/light, project-ignition, quality-dark/light")
