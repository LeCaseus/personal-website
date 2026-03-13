const isAdmin = new URLSearchParams(window.location.search).has("admin");

/* ── SCROLL REVEAL ── */
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
    { threshold: 0.15 },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* ── NAV DOCK ACTIVE STATE ── */
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
      (active === "home" && (href === "#" || href === "/")) ||
      (active === "portfolio" && href === "#portfolio") ||
      (active === "blog" && href === "#blog")
    )
      link.classList.add("active");
  });
}
window.addEventListener("scroll", updateDockActive);

/* ── HOME ── */
let heroRendered = false;

async function showHome() {
  if (!heroRendered) {
    setRoot(homeTpl());
    heroRendered = true;
    loadBlogFeed();
    setTimeout(initReveal, 50);
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
      <div class="hero-text">
        <p class="hero-eyebrow reveal">welcome to my personal space</p>
        <h1 class="hero-heading reveal reveal-delay-1">Hi, I'm <em>Chezter Vargas</em></h1>
        <p class="hero-body reveal reveal-delay-2">I'm stepping back from all the noise, not because I'm antisocial but because social media has stopped being social. It's just an algorithm selling your attention now. I'd rather show up here, on my own terms.</p>
        <div class="social-links reveal reveal-delay-3">
          <a href="https://www.youtube.com/@LeCaseus" target="_blank" class="social-btn"><i class="fa-brands fa-youtube"></i></a>
          <a href="https://github.com/LeCaseus" target="_blank" class="social-btn"><i class="fa-brands fa-github"></i></a>
          <a href="https://www.linkedin.com/in/lecaseus" target="_blank" class="social-btn"><i class="fa-brands fa-linkedin"></i></a>
          <a href="https://www.instagram.com/cheeshire_/" target="_blank" class="social-btn"><i class="fa-brands fa-instagram"></i></a>
        </div>
        <div class="hero-actions reveal reveal-delay-4">
          <a href="#blog" class="btn-hero-primary" style="text-decoration:none;">read my blog</a>
          <a href="/about" class="btn-hero-ghost" style="text-decoration:none;">who am I?</a>
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
          <h2 class="section-heading">Awesome <em>Projects</em></h2>
          <p class="section-sub"><em>This is honestly just a portfolio of the things that I did</em></p>
        </div>
      </div>
      <div class="proj-bento">
        <a href="/portfolio/em-brace" class="pb-card pb-wide" style="text-decoration:none">
          <div class="pb-bg"><img src="assets/portfolio-covers/em-brace-snapshot.jpeg" alt="eM-Brace"/></div>
          <div class="pb-overlay">
            <span class="project-cat project-cat-biomed">biomedical</span>
            <h3 class="pb-title">eM-Brace</h3>
            <p class="pb-desc">Autonomous wrist splint with massage system for Carpal Tunnel Syndrome. Final year thesis.</p>
            <div class="project-tags"><span class="project-tag">Arduino</span><span class="project-tag">Sensors</span><span class="project-tag">3D Printing</span><span class="project-tag">C++</span></div>
          </div>
        </a>
        <a href="/portfolio/ch3sh1re" class="pb-card pb-tall pb-emoji-card" style="text-decoration:none">
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
        <a href="#" class="pb-card pb-small pb-emoji-card" style="text-decoration:none">
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
          <p class="section-sub"><em>Read em and Weep or whatever</em></p>
        </div>
        ${
          isAdmin
            ? `
          <div style="display:flex;gap:0.5rem">
            <button class="btn btn-outline" onclick="showCompose()">+ letter</button>
            <button class="btn btn-primary" onclick="showWritePost()">+ post</button>
          </div>`
            : ""
        }
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

/* ── BLOG FEED ── */
let activeBlogFilter = null;

async function loadBlogFeed() {
  const [postsRes, entriesRes] = await Promise.all([
    fetch("/api/posts"),
    fetch("/api/entries"),
  ]);
  const posts = await postsRes.json();
  const entries = await entriesRes.json();

  const tagged = [
    ...posts.map((p) => ({ ...p, _source: "post" })),
    ...entries.map((e) => ({ ...e, _source: "entry", category: e.type })),
  ];
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

function renderBlogFeed(items) {
  const feed = document.getElementById("blog-feed");
  if (!feed) return;
  if (!items.length) {
    feed.innerHTML = `<div class="empty" style="padding:3rem 1rem;text-align:center;width:100%">
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

/* ── OPEN ENTRY (letters, notes, thoughts) ── */
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
    <span class="post-back" id="back-top">← back</span>
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

  const goBack = () => {
    heroRendered = false;
    showHome();
  };
  document.getElementById("back-top").addEventListener("click", goBack);
  document.getElementById("back-bottom").addEventListener("click", goBack);
  const delBtn = document.getElementById("btn-del");
  if (delBtn)
    delBtn.addEventListener("click", () => confirmDelete(e.id, "entry"));
  window.scrollTo(0, 0);
}

/* ── OPEN POST ── */
async function openPost(id) {
  const res = await fetch(`/api/posts/${id}`);
  const p = await res.json();
  if (!p) return;
  const bodyHtml = p.body
    .split("\n\n")
    .map((para) => `<p>${para}</p>`)
    .join("");

  setRoot(`<div class="single-wrap">
    <span class="post-back" id="back-top">← back to blog</span>
    <div class="single-cover">
      ${p.cover_url ? `<img src="${p.cover_url}" alt="${p.title}"/>` : p.emoji || "✦"}
    </div>
    <div class="post-meta" style="margin-bottom:1rem">
      <span class="cat-tag cat-${p.category}">${p.category}</span>
      <span class="post-meta-dot"></span>
      <span>${p.date}</span>
      <span class="post-meta-dot"></span>
      <span>${p.read_time}</span>
    </div>
    <h1 class="single-title">${p.title}</h1>
    <div class="single-body">${bodyHtml}</div>
    <div class="post-rule"></div>
    <div class="post-foot">
      <span class="post-back" id="back-bottom">← back</span>
      ${isAdmin ? `<button class="btn btn-del" id="btn-del-post">delete</button>` : ""}
    </div>
  </div>`);

  const goBack = () => {
    heroRendered = false;
    showHome();
  };
  document.getElementById("back-top").addEventListener("click", goBack);
  document.getElementById("back-bottom").addEventListener("click", goBack);
  const delBtn = document.getElementById("btn-del-post");
  if (delBtn)
    delBtn.addEventListener("click", () => confirmDelete(p.id, "post"));
  window.scrollTo(0, 0);
}

/* ── DELETE (unified) ── */
async function confirmDelete(id, type) {
  if (!confirm(`Delete this ${type}?`)) return;
  const url = type === "post" ? `/api/posts/${id}` : `/api/entries/${id}`;
  await fetch(url, { method: "DELETE" });
  toast("Deleted.");
  heroRendered = false;
  showHome();
}

/* ── COMPOSE LETTER ── */
function showCompose() {
  setRoot(`<div class="compose-page">
    <h2>New letter</h2>
    <p class="sub">Write something worth sending.</p>
    <div class="cfield">
      <label>title</label>
      <input id="f-title" type="text" placeholder="Give it a title…" autocomplete="off"/>
    </div>
    <div class="cfield">
      <label>body</label>
      <textarea id="f-body" placeholder="Write something longer…"></textarea>
    </div>
    <div class="cactions">
      <button class="btn btn-primary" onclick="publishEntry()">publish</button>
      <button class="btn btn-outline" onclick="heroRendered = false; showHome();">cancel</button>
    </div>
  </div>`);
  window.scrollTo(0, 0);
}

async function publishEntry() {
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
    body: JSON.stringify({ type: "letter", title, body, date }),
  });
  toast("published ✓");
  heroRendered = false;
  showHome();
}

/* ── WRITE POST ── */
function showWritePost() {
  setRoot(`<div class="compose-page">
    <h2>New post</h2>
    <p class="sub">Write something worth reading.</p>
    <div class="cfield-row">
      <div class="cfield">
        <label>category</label>
        <select id="f-cat">
          <option value="personal">Personal</option>
          <option value="gaming">Gaming</option>
          <option value="career">Career</option>
          <option value="fitness">Fitness</option>
        </select>
      </div>
      <div class="cfield">
        <label>cover image</label>
        <input id="f-image" type="file" accept="image/*" onchange="previewImage(this)"/>
        <div id="image-preview" style="margin-top:0.75rem;border-radius:8px;overflow:hidden;display:none;">
          <img id="preview-img" style="width:100%;height:180px;object-fit:cover;display:block;"/>
        </div>
      </div>
    </div>
    <div class="cfield">
      <label>title</label>
      <input id="f-title" type="text" placeholder="Give it a great title…" autocomplete="off"/>
    </div>
    <div class="cfield">
      <label>excerpt</label>
      <input id="f-excerpt" type="text" placeholder="One sentence summary…" autocomplete="off"/>
    </div>
    <div class="cfield">
      <label>body</label>
      <textarea id="f-body" placeholder="Write your post… (separate paragraphs with a blank line)"></textarea>
    </div>
    <div class="cactions">
      <button class="btn btn-primary" onclick="publishPost()">publish</button>
      <button class="btn btn-outline" onclick="heroRendered = false; showHome();">cancel</button>
    </div>
  </div>`);
  window.scrollTo(0, 0);
}

async function publishPost() {
  const title = document.getElementById("f-title")?.value?.trim();
  const body = document.getElementById("f-body")?.value?.trim();
  const excerpt = document.getElementById("f-excerpt")?.value?.trim();
  const cat = document.getElementById("f-cat")?.value;
  const imageFile = document.getElementById("f-image")?.files[0];

  if (!title || !body) {
    toast("title and body are required ✏️");
    return;
  }

  let cover_url = "";
  if (imageFile) {
    toast("uploading image...");
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      cover_url = data.url || "";
    } catch {
      toast("image upload failed, publishing without image");
    }
  }

  const words = body.split(/\s+/).length;
  const read_time = `${Math.max(1, Math.ceil(words / 200))} min read`;
  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category: cat,
      emoji: "✦",
      title,
      excerpt: excerpt || body.slice(0, 120) + "…",
      body,
      date,
      read_time,
      cover_url,
    }),
  });
  toast("published ✓");
  heroRendered = false;
  showHome();
}

function previewImage(input) {
  const preview = document.getElementById("image-preview");
  const img = document.getElementById("preview-img");
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(input.files[0]);
  }
}

/* ── SCROLL ── */
function scrollBlog(dir) {
  const el = document.getElementById("blog-feed");
  if (!el) return;
  const cardWidth = (el.querySelector(".bsc")?.offsetWidth || 340) + 20;
  el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
}

/* ── UTILS ── */
const clip = (s, n) => (s.length > n ? s.slice(0, n) + "…" : s);
const setRoot = (html) => {
  document.getElementById("root").innerHTML = html;
};

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

/* ── CLEAN URL HASH ── */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const id = link.getAttribute("href").slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", "/");
  });
});

window.addEventListener("load", () => {
  const hash = window.location.hash;
  if (hash) {
    const id = hash.slice(1);
    setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
    history.replaceState(null, "", "/");
  }
});

/* ── INIT ── */
showHome();
document.getElementById("copyright").textContent =
  `Chezter Vargas © ${new Date().getFullYear()}`;
