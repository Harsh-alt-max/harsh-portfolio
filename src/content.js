// ============================================================
//  EDIT ME — every word on the site lives in this one file.
//  To change text: edit only what's between the quotes " ".
//  Don't touch anything else (no commas, brackets or code).
//  Save, and the site rebuilds itself in 2–3 minutes.
//
//  PROJECTS: paste your Behance link into "url" when it's live.
//  Leave url as "" and the card shows "Behance — dropping soon".
// ============================================================

export const site = {
  // Big hero name, one word per line. Keep style/depth as they are.
  nameLines: [
    { text: "HARSH", style: "solid", depth: 26 },
    { text: "KUMAR", style: "stroke", depth: 48 },
    { text: "SINGH", style: "solid", depth: 70 },
  ],
  folioMark: "FOLIO — 2026",
  behanceUrl: "https://www.behance.net/harsh19_",
  // little "currently" status line in the footer
  status: "Currently crafting motion at Inshorts",
};

export const hero = {
  role: "Motion Designer",
  tagline: "I design movement for screens — currently at Inshorts, Noida.",
};

export const marquee = {
  text: "Available for freelance & fulltime",
};

// The little 3D guide in the corner. Rename him anytime.
// (Send your own character file and he'll swap in for the built-in one.)
export const guide = {
  name: "Pixel",
  // Mascot look — tweak the hex colors anytime, no 3D code needed.
  // skin: skin tone · hair: hair color · hairStyle: reserved ("wavy" for now)
  // outfit: shirt · pants: trousers · accent: collar + shoes · earbuds: ear buds
  mascot: {
    skin: "#9c6a47",
    hair: "#141316",
    hairStyle: "wavy",
    outfit: "#232a3a",
    pants: "#17171b",
    accent: "#d7ff3e",
    earbuds: "#101014",
  },
  messages: {
    top: "Hey — I'm Pixel, Harsh's 3D buddy. Scroll, I'll show you around.",
    work: "The work section. 4 projects dropping soon — the good stuff.",
    sculpture: "A little form study. Distortion is a design tool too.",
    playground: "Easing curves. This is my love language.",
    about: "Self-taught. Motion-obsessed. That's the whole story.",
    contact: "Like what you see? Let's make something move.",
  },
  // shown when you click him
  tips: [
    "Pro tip: hover the work cards — they move.",
    "The easing playground uses real GSAP math. Try Elastic.",
    "Harsh animates UI at Inshorts — millions see it daily.",
    "This whole site rebuilds itself when Harsh edits one file.",
    "Click me again. I don't mind.",
    "Motion design rule #1: everything eases. Nothing teleports.",
  ],
};

// interstitial 3D moment between Work and Playground
export const sculpture = {
  kicker: "Form study",
  caption: "Distortion as a design tool — drag through the scroll, watch it breathe.",
};

export const work = {
  kicker: "01 — Work",
  titleLines: ["Selected", "Work"],
  hint: "MORE DROPPING SOON",
  comingSoon: "On Behance soon",
  projects: [
    {
      index: "01",
      title: "Documentary of Vietnam",
      desc: "A travel documentary cut — Vietnam shot and edited as a cinematic motion piece.",
      tags: ["Documentary", "Edit"],
      tools: ["Premiere Pro", "After Effects"],
      cover: "",
      motion: "",
      url: "",
      theme: "sunset",
    },
    {
      index: "02",
      title: "Motion Portfolio 2026",
      desc: "A year's worth of motion — brand pieces, micro-interactions and experiments.",
      tags: ["Motion Design", "Advertising"],
      tools: ["After Effects", "Photoshop", "Illustrator"],
      cover:
        "https://mir-s3-cdn-cf.behance.net/project_modules/max_632_webp/08dfbe231756993.68a1bb3d00cbf.png",
      motion:
        "https://mir-s3-cdn-cf.behance.net/project_modules/source/d2a8e0231756993.68a1c2561c620.gif",
      url: "https://www.behance.net/gallery/231756993/Portfolio-2026",
      theme: "lime",
    },
    {
      index: "03",
      title: "AI Shortfilm with Free Tools",
      desc: "A short film built entirely with free AI tools — zero budget, full imagination.",
      tags: ["AI Film", "Direction"],
      tools: ["AI Tools", "After Effects", "Premiere Pro"],
      cover: "",
      motion: "",
      url: "",
      theme: "violet",
    },
    {
      index: "04",
      title: "Visual Product Design",
      desc: "Product thinking meets motion — interfaces designed to move.",
      tags: ["Product", "UI Motion"],
      tools: ["Figma", "After Effects"],
      cover: "",
      motion: "",
      url: "",
      theme: "mono",
    },
  ],
};

export const playground = {
  kicker: "02 — Playground",
  titleLines: ["Easing", "Playground"],
  desc: "Motion is in the details. Pick a curve — the same math behind every animation on this page — and watch it play.",
};

export const about = {
  kicker: "03 — About",
  titleLines: ["Behind", "the motion"],
  intro:
    "Visual storyteller and motion designer. I blend media, design and motion to turn ideas into stories — with an eye for minimalism.",
  body: "Currently designing movement at Inshorts, Noida — where millions of people feel my work every day, one tap at a time.",
  toolsTitle: "Tools of the trade",
  tools: ["After Effects", "Photoshop", "Illustrator", "Figma"],
};

export const contact = {
  kicker: "04 — Contact",
  titleA: "Let's make",
  titleB: "something",
  titleAccent: "move.",
  button: "Say hello — Behance",
  name: "Harsh Kumar Singh",
  location: "Noida, India",
  copyright: "© 2026",
  footerNote: "Designed in motion",
  timeNote: "Noida",
};

export const preloader = {
  mark: "PORTFOLIO © 2026",
};
