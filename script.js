let activeFilter = null;
let composeType = "note";
const isAdmin = new URLSearchParams(window.location.search).has("admin");

/* ── SCROLL REVEAL ── */
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* ── SCROLL LISTENER ── */
function updateDockActive() {
  const sections = ["portfolio", "blog"];
  const scrollY = window.scrollY + 120;
  let active = "home";

  for (const id of sections) {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) active = id;
  }

  document.querySelectorAll(".nav-dock-link").forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (
      (active === "home" && href === "#") ||
      (active === "portfolio" && href === "/#portfolio") ||
      (active === "blog" && href === "/#blog")
    ) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateDockActive);

/* ── VIEWS ── */
let heroRendered = false;

async function showHome() {
  if (!heroRendered) {
    setRoot(homeTpl());
    heroRendered = true;
    loadBlogFeed();
    setTimeout(initReveal, 50);
    setTimeout(initProjectsLoop, 100);
  }
}

/* ── HOME TEMPLATE ── */
function homeTpl() {
  return `
    <!-- HERO -->
    <section class="hero">
    <div class="hero-photo">
        <img src="assets/homepage.JPG" style="width:100%;height:100%;object-fit:cover;display:block;"/>
        </div>
    </div>
    <div class="hero-text">
        <p class="hero-eyebrow reveal">welcome to my personal space</p>
        <h1 class="hero-heading reveal reveal-delay-1">Hi, I'm <em>Chezter Vargas</em></h1>
        <p class="hero-body reveal reveal-delay-2">This is my digital footprint on the internet and a place where I can showcase my skills, achievements, and the projects that I am working on.<br>I also have a blog and some notes to share from time to time so stay tuned!</p>
        <div class="social-links reveal reveal-delay-3">
        <a href="https://www.youtube.com/@LeCaseus" target="_blank" class="social-btn"><i class="fa-brands fa-youtube"></i></a>
        <a href="https://github.com/LeCaseus" target="_blank" class="social-btn"><i class="fa-brands fa-github"></i></a>
        <a href="https://www.linkedin.com/in/lecaseus" target="_blank" class="social-btn"><i class="fa-brands fa-linkedin"></i></a>
        <a href="https://www.instagram.com/cheeshire_/" target="_blank" class="social-btn"><i class="fa-brands fa-instagram"></i></a>
        </div>
        <div class="hero-actions reveal reveal-delay-4">
        <a href="/#blog" class="btn-hero-primary" style="text-decoration:none;">read my blog</a>
        <a href="/#portfolio" class="btn-hero-ghost" style="text-decoration: none;">view my work</a>
        </div>
        <div class="scroll-hint reveal reveal-delay-4">
        <span class="scroll-arrow">↓</span>
        <span>scroll to see stuff</span>
        </div>
    </div>
    </section>

    <!-- PORTFOLIO SECTION -->
    <section class="portfolio-section" id="portfolio">
      <div class="section-header">
        <div>
          <h2 class="section-heading">My <em>Projects</em></h2>
          <p class="section-sub">A few things I've built</p>
        </div>
      </div>
      <div class="proj-bento">

        <a href="/portfolio/em-brace" class="pb-card pb-wide" style="text-decoration:none">
          <div class="pb-bg"><img src="assets/portfolio-covers/em-brace-snapshot.png" alt="eM-Brace"/></div>
          <div class="pb-overlay">
            <span class="project-cat project-cat-biomed">biomedical</span>
            <h3 class="pb-title">eM-Brace</h3>
            <p class="pb-desc">Autonomous wrist splint with massage system for Carpal Tunnel Syndrome. Final year thesis.</p>
            <div class="project-tags"><span class="project-tag">Arduino</span><span class="project-tag">Sensors</span><span class="project-tag">3D Printing</span><span class="project-tag">C++</span></div>
          </div>
        </a>

        <a href="/portfolio/ch3sh1re" class="pb-card pb-tall" style="text-decoration:none">
          <div class="pb-bg pb-bg-emoji">🐱</div>
          <div class="pb-overlay">
            <span class="project-cat project-cat-ai">AI / Python</span>
            <h3 class="pb-title">CH3SH1RE</h3>
            <p class="pb-desc">A local AI assistant I'm building for fun — early experiments and notes on the repo.</p>
            <div class="project-tags"><span class="project-tag">Python</span><span class="project-tag">SQLite</span><span class="project-tag">LLM</span></div>
          </div>
        </a>

        <a href="/portfolio/personal-website" class="pb-card pb-small" style="text-decoration:none">
          <div class="pb-bg"><img src="assets/portfolio-covers/website-snapshot.png" alt="Personal Website"/></div>
          <div class="pb-overlay">
            <span class="project-cat project-cat-web">web</span>
            <h3 class="pb-title">Personal Website</h3>
            <p class="pb-desc">You're looking at it. Vanilla stack, hosted on Vercel.</p>
            <div class="project-tags"><span class="project-tag">HTML</span><span class="project-tag">CSS</span><span class="project-tag">JS</span></div>
          </div>
        </a>

        <a href="#" class="pb-card pb-small" style="text-decoration:none">
          <div class="pb-bg pb-bg-emoji">🖨️</div>
          <div class="pb-overlay">
            <span class="project-cat project-cat-cad">CAD / 3D design</span>
            <h3 class="pb-title">3D Models</h3>
            <p class="pb-desc">Prototype components designed and printed for personal and thesis use.</p>
            <div class="project-tags"><span class="project-tag">CAD</span><span class="project-tag">3D Printing</span></div>
          </div>
        </a>

      </div>
    </section>

    <!-- BLOG SECTION -->
    <section class="blog-section" id="blog">
      <div class="section-header">
        <div>
          <h2 class="section-heading">The <em>Blog</em></h2>
          <p class="section-sub">Pick a tag and explore</p>
        </div>
      </div>
      <div class="tag-cloud" id="tag-cloud">
        <div class="tag-bubble active" onclick="setBlogFilter(null,this)">✦ all</div>
        <div class="tag-bubble" onclick="setBlogFilter('personal',this)">personal</div>
        <div class="tag-bubble" onclick="setBlogFilter('gaming',this)">gaming</div>
        <div class="tag-bubble" onclick="setBlogFilter('career',this)">career</div>
        <div class="tag-bubble" onclick="setBlogFilter('fitness',this)">fitness</div>
        <div class="tag-bubble" onclick="setBlogFilter('letter',this)">letters</div>
      </div>
      <div class="blog-scroll-wrap">
        <div id="blog-feed" class="blog-scroll"></div>
        <button class="blog-scroll-btn blog-scroll-prev" onclick="scrollBlog(-1)">←</button>
        <button class="blog-scroll-btn blog-scroll-next" onclick="scrollBlog(1)">→</button>
      </div>
    </section>`;
}

let activeBlogFilter = null;

async function loadBlogFeed() {
  const [postsRes, entriesRes] = await Promise.all([
    fetch("/api/posts"),
    fetch("/api/entries"),
  ]);
  const posts = await postsRes.json();
  const entries = await entriesRes.json();

  // tag each item with its source so we know how to open it
  const tagged = [
    ...posts.map((p) => ({ ...p, _source: "post" })),
    ...entries.map((e) => ({ ...e, _source: "entry", category: e.type })),
  ];

  // sort by date descending — assumes "Mon DD, YYYY" format
  tagged.sort((a, b) => new Date(b.date) - new Date(a.date));

  window._blogItems = tagged;
  renderBlogFeed(tagged);
}

function setBlogFilter(filter, el) {
  activeBlogFilter = filter;
  document
    .querySelectorAll("#blog .tag-bubble")
    .forEach((p) => p.classList.remove("active"));
  el.classList.add("active");

  const filtered = filter
    ? window._blogItems.filter((i) => (i.category || i.type) === filter)
    : window._blogItems;

  renderBlogFeed(filtered);
}

const isEntryType = (t) => t === "letter";

function renderBlogFeed(items) {
  const feed = document.getElementById("blog-feed");
  if (!feed) return;

  if (!items.length) {
    feed.innerHTML = `<div class="empty" style="padding:3rem 1rem">
      <div class="empty-glyph">✦</div>
      <h3>Nothing here yet</h3>
    </div>`;
    return;
  }

  feed.innerHTML = items.map((item, i) => renderBlogCard(item, i)).join("");
}

function renderBlogCard(item, i) {
  const isEntry = item._source === "entry";
  const cat = item.category || item.type;
  const title = item.title || item.type;
  const excerpt = item.excerpt || clip(item.body, 120);
  const isLetter = cat === "letter";

  const tintClass = isLetter ? "bsc-letter" : "";

  const bgHtml =
    !isLetter && item.cover_url
      ? `<div class="bsc-bg"><img src="${item.cover_url}" alt="${title}"/></div>`
      : `<div class="bsc-bg bsc-bg-plain"></div>`;

  return `<div class="bsc ${tintClass}" onclick="${isEntry ? `openEntry(${item.id})` : `openPost(${item.id})`}" style="animation-delay:${i * 0.06}s">
    ${bgHtml}
    <div class="bsc-overlay">
      <span class="cat-tag cat-${cat}" style="margin-bottom:0.6rem;display:inline-block">${cat}</span>
      <h3 class="bsc-title">${title}</h3>
      <p class="bsc-excerpt">${excerpt}</p>
      <span class="bsc-date">${item.date}</span>
    </div>
  </div>`;
}

function renderPostCard(item, i) {
  const isEntry = item._source === "entry";
  const cover = item.cover_url
    ? `<img src="${item.cover_url}" alt="${item.title || ""}"/>`
    : item.emoji || "✦";
  const title = item.title || item.type;
  const excerpt = item.excerpt || clip(item.body, 120);
  const cat = item.category || item.type;

  return `<div class="post-card" onclick="${isEntry ? `openEntry(${item.id})` : `openPost(${item.id})`}" style="animation-delay:${i * 0.06}s">
    <div class="post-card-image">${cover}</div>
    <div class="post-card-body">
      <div class="post-meta" style="margin-bottom:0.6rem">
        <span class="cat-tag cat-${cat}">${cat}</span>
        ${item.read_time ? `<span class="post-meta-dot"></span><span>${item.read_time}</span>` : ""}
      </div>
      <h3 class="post-card-title">${title}</h3>
      <p class="post-card-excerpt">${excerpt}</p>
      <div class="post-meta"><span>${item.date}</span></div>
    </div>
  </div>`;
}

async function setFilter(filter, el) {
  activeFilter = filter;
  document
    .querySelectorAll(".fpill")
    .forEach((p) => p.classList.remove("active"));
  el.classList.add("active");
  await refreshNotes();
  // re-render just the masonry
  const section = document.getElementById("notes-anchor");
  if (!section) {
    await showHome();
    return;
  }
  const url = filter ? `/api/entries?type=${filter}` : "/api/entries";
  const res = await fetch(url);
  const list = await res.json();
  const label = filter ? filter + "s" : "everything";

  section.querySelector(".section-sub").textContent =
    `${list.length} entr${list.length === 1 ? "y" : "ies"} · ${label}`;

  let cards = "";
  if (!list.length) {
    cards = `<div class="empty">
        <div class="empty-glyph">✦</div>
        <h3>Nothing here yet</h3>
        <p>No ${filter || ""}s written yet.</p>
        ${isAdmin ? `<button class="btn btn-primary" onclick="showCompose()">write one</button>` : ""}        </div>`;
  } else {
    list.forEach((e, i) => {
      const isL = e.type === "letter";
      cards += `<div class="sticky is-${e.type} sticky-${e.type}" onclick="openEntry(${e.id})" style="animation-delay:${i * 0.05}s">
            <div class="sticky-tag">
            <span>${e.type}</span>
            <span class="sticky-date">${e.date}</span>
            </div>
            ${isL && e.title ? `<div class="sticky-title">${e.title}</div>` : ""}
            <div class="sticky-body">${isL ? clip(e.body, 220) : e.body}</div>
            ${isL ? `<span class="sticky-more">read more →</span>` : ""}
        </div>`;
    });
  }
  section.querySelector(".masonry").innerHTML = cards;
}

/* ── SINGLE ENTRY ── */
async function openEntry(id) {
  const res = await fetch(`/api/entries/${id}`);
  const e = await res.json();

  if (!e) return;
  const isL = e.type === "letter";
  const bodyHtml = e.body
    .split("\n\n")
    .map((p) => `<p>${p}</p>`)
    .join("");
  setRoot(`<div class="post-page">
        <span class="post-back" id="back-top">← back to notes</span>
        <div class="post-tag-row">
        <span class="post-tag post-tag-${e.type}">${e.type}</span>
        <span class="post-date">${e.date}</span>
        </div>
        ${isL && e.title ? `<h1 class="post-title">${e.title}</h1>` : ""}
        <div class="${isL ? "post-body-letter" : "post-body-note"}">${bodyHtml}</div>
        <div class="post-rule"></div>
        <div class="post-foot">
        <span class="post-back" id="back-bottom">← back</span>
        ${isAdmin ? `<button class="btn btn-del" id="btn-del">delete</button>` : ""}
        </div>
    </div>`);

  document.getElementById("back-top").addEventListener("click", () => {
    heroRendered = false;
    showHome();
  });
  document.getElementById("back-bottom").addEventListener("click", () => {
    heroRendered = false;
    showHome();
  });
  const delBtn = document.getElementById("btn-del");
  if (delBtn) delBtn.addEventListener("click", () => confirmDelete(e.id));
  window.scrollTo(0, 0);
}

async function confirmDelete(id) {
  if (!confirm("Delete this entry?")) return;
  await fetch(`/api/entries/${id}`, { method: "DELETE" });
  toast("Deleted.");
  heroRendered = false; // to re-render hero with new entry
  showHome();
}

/* ── COMPOSE ── */
function showCompose() {
  composeType = "note";
  renderCompose();
  window.scrollTo(0, 0);
}

function renderCompose() {
  const isL = composeType === "letter";
  setRoot(`<div class="compose-page">
    <h2>New entry</h2>
    <p class="sub">What's on your mind?</p>
    <div class="type-row">
    <div class="tchip ${composeType === "note" ? "on-note" : ""}"    onclick="setType('note')">📌 note</div>
    <div class="tchip ${composeType === "letter" ? "on-letter" : ""}"  onclick="setType('letter')">✉️ letter</div>
    <div class="tchip ${composeType === "thought" ? "on-thought" : ""}" onclick="setType('thought')">💭 thought</div>
    </div>
    ${isL ? `<div class="cfield"><label>title</label><input id="f-title" type="text" placeholder="Give it a title…" autocomplete="off"/></div>` : ""}
    <div class="cfield">
    <label>${isL ? "body" : composeType === "note" ? "what's on your mind?" : "the thought"}</label>
    <textarea id="f-body" class="${composeType !== "letter" ? "short-ta" : ""}"
        placeholder="${isL ? "Write something longer…" : composeType === "note" ? "Just start writing…" : "One sharp observation…"}"
        oninput="updateChar()"></textarea>
    ${composeType !== "letter" ? `<div class="char-hint" id="char-hint">0 chars</div>` : ""}
    </div>
    <div class="cactions">
    <button class="btn btn-primary" onclick="publish()">publish</button>
    <button class="btn btn-outline" onclick="showHome()">cancel</button>
    </div>
</div>`);
}

function setType(t) {
  composeType = t;
  renderCompose();
}

function updateChar() {
  const el = document.getElementById("char-hint"),
    b = document.getElementById("f-body");
  if (!el || !b) return;
  const n = b.value.length;
  el.textContent = n + " chars";
  el.className = "char-hint" + (n > 300 ? " over" : "");
}

async function publish() {
  const body = document.getElementById("f-body")?.value?.trim();
  const title = document.getElementById("f-title")?.value?.trim() || "";
  if (!body) {
    toast("write something first ✏️");
    return;
  }
  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  await fetch("/api/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: composeType, title, body, date }),
  });
  toast("published ✓");
  heroRendered = false; // to re-render hero with new entry
  showHome();
}

function toggleMenu() {
  const btn = document.getElementById("nav-hamburger");
  const menu = document.getElementById("nav-mobile");
  const open = menu.classList.toggle("open");
  btn.classList.toggle("open", open);
}

document.querySelectorAll(".nav-mobile a").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("nav-mobile").classList.remove("open");
    document.getElementById("nav-hamburger").classList.remove("open");
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest("nav") && !e.target.closest(".nav-mobile")) {
    document.getElementById("nav-mobile").classList.remove("open");
    document.getElementById("nav-hamburger").classList.remove("open");
  }
});

/* ── PORTFOLIO SCROLL ── */
function scrollBlog(dir) {
  const el = document.getElementById("blog-feed");
  if (!el) return;
  const cardWidth = el.querySelector(".bsc")?.offsetWidth + 20 || 340;
  el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
}

function scrollProjects(dir) {
  const el = document.getElementById("projects-scroll");
  if (!el) return;
  const cardWidth = el.querySelector(".pscroll-card")?.offsetWidth + 20 || 320;
  const totalWidth = el.scrollWidth / 2; // half because cards are cloned

  el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });

  // after scroll settles, check if we need to loop
  setTimeout(() => {
    if (el.scrollLeft <= 0) {
      el.scrollLeft = totalWidth;
    } else if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
      el.scrollLeft = totalWidth - el.clientWidth;
    }
  }, 350);
}

function initProjectsLoop() {
  const el = document.getElementById("projects-scroll");
  if (!el) return;
  // clone all cards and append to create seamless loop
  const cards = Array.from(el.querySelectorAll(".pscroll-card"));
  cards.forEach((card) => el.appendChild(card.cloneNode(true)));
  // start in the middle
  el.scrollLeft = el.scrollWidth / 2 - el.clientWidth / 2;

  // also handle manual scroll looping
  el.addEventListener("scroll", () => {
    const total = el.scrollWidth / 2;
    if (el.scrollLeft <= 0) el.scrollLeft = total;
    else if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
      el.scrollLeft = total - el.clientWidth;
  });
}

/* ── UTILS ── */
const clip = (s, n) => (s.length > n ? s.slice(0, n) + "…" : s);
const setRoot = (html) => {
  document.getElementById("root").innerHTML = html;
};

function updateFooter(n) {
  document.getElementById("footer-count").textContent =
    `${n} entr${n === 1 ? "y" : "ies"}`;
}

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

/* ── INIT ── */
showHome();
document.getElementById("copyright").textContent =
  `Chezter Vargas © ${new Date().getFullYear()}`;
