const KEY = 'anote_v1';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)||'[]'); } catch { return []; } };
const save = d => localStorage.setItem(KEY, JSON.stringify(d));

let entries = load();
if (!entries.length) {
entries = [
    { id:1, type:'note', title:'', body:"can't stop thinking about how we've outsourced our boredom. waiting for coffee used to be a moment of just... existing. now it's a scroll. wonder what we're losing by never being bored anymore.", date:'Mar 10, 2026' },
    { id:2, type:'letter', title:'on starting things you might not finish', body:"I've started and abandoned more projects than I can count. A half-built app, a blog that got three posts, a language learning streak I broke in week two.\n\nFor a long time I treated this as evidence of some character flaw. A lack of follow-through. Proof that I wasn't the kind of person who finished things.\n\nBut I've been rethinking that. What if starting is the point? Not every project needs a destination. Some things teach you what you needed to know in the first week and then it's right to put them down.\n\nFinishing is overrated. Starting, again and again, might be the whole thing.", date:'Mar 8, 2026' },
    { id:3, type:'thought', title:'', body:"the best conversations happen when both people are slightly lost. not experts, just genuinely curious. expertise kills a certain kind of openness.", date:'Mar 6, 2026' },
    { id:4, type:'note', title:'', body:"made pasta from scratch for the first time. it took an hour and tasted exactly like the boxed kind. 10/10 would do again.", date:'Mar 3, 2026' },
    { id:5, type:'letter', title:'why I deleted the news apps', body:"Not because the news is bad (though it often is). Not as some wellness experiment. Just because I noticed that reading it first thing in the morning was changing the texture of my whole day.\n\nI'd wake up with a clear head. Then I'd open the app. And suddenly I was carrying things I had no ability to affect — political decisions, disasters, controversies.\n\nI still read the news. I check it once in the afternoon, on a browser, deliberately. That small shift — from passive notification to active choice — made it feel less like something happening to me.", date:'Feb 28, 2026' }
];
save(entries);
}

let activeFilter = null;
let composeType = 'note';

function showFeed(filter, pillEl) {
activeFilter = filter;
if (pillEl) {
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    pillEl.classList.add('active');
} else {
    document.querySelectorAll('.filter-pill').forEach((p,i) => p.classList.toggle('active', i===0));
}
entries = load();
const list = filter ? entries.filter(e => e.type===filter) : entries;
const label = filter ? filter+'s' : 'all entries';
let html = `
    <div class="feed-intro">
    <div class="feed-intro-label">Personal space</div>
    <h1>Notes, <em>letters</em> &amp; thoughts</h1>
    <p>A place for things too long for a chat and too short for an essay. Unpolished, on purpose.</p>
    </div>
    <div class="section-bar">
    <span class="section-label">${label}</span>
    <span class="entry-count">${list.length} entr${list.length===1?'y':'ies'}</span>
    </div>
    <div class="feed">`;

if (!list.length) {
    html += `<div class="empty"><h3>Nothing here yet</h3><p>Your ${filter||'first'} entry is waiting to be written.</p><button class="btn btn-primary" onclick="showCompose()">Write something</button></div>`;
} else {
    list.forEach((e,i) => {
    const isL = e.type==='letter';
    html += `<div class="entry is-${e.type}" onclick="openEntry(${e.id})" style="animation-delay:${i*0.05}s">
        <div class="entry-meta">
        <span class="entry-type type-${e.type}">${e.type}</span>
        <span class="entry-date">${e.date}</span>
        </div>
        ${isL && e.title ? `<div class="entry-title">${e.title}</div>` : ''}
        <div class="entry-body">${isL ? clip(e.body,200) : e.body}</div>
        ${isL ? `<span class="read-more">Read more →</span>` : ''}
    </div>`;
    });
}
html += `</div>`;
document.getElementById('page').innerHTML = html;
window.scrollTo(0,0);
}

function openEntry(id) {
entries = load();
const e = entries.find(x => x.id===id);
if (!e) return;
const isL = e.type==='letter';
const bodyHtml = e.body.split('\n\n').map(p=>`<p>${p}</p>`).join('');
document.getElementById('page').innerHTML = `
    <div class="single-view">
    <div class="back-link" onclick="showFeed(activeFilter)">← Back</div>
    <div class="entry-meta">
        <span class="entry-type type-${e.type}">${e.type}</span>
        <span class="entry-date">${e.date}</span>
    </div>
    ${isL && e.title ? `<h1 class="single-title">${e.title}</h1>` : ''}
    <div class="${isL?'single-body':'single-body-note'}">${bodyHtml}</div>
    <div class="rule"></div>
    <div class="single-actions">
        <button class="btn btn-danger" onclick="deleteEntry(${e.id})">Delete entry</button>
    </div>
    </div>`;
window.scrollTo(0,0);
}

function showCompose() {
composeType = 'note';
renderCompose();
}

function renderCompose() {
const isL = composeType==='letter';
document.getElementById('page').innerHTML = `
    <div class="compose-view">
    <div class="compose-header">
        <h2>New entry</h2>
        <p>What's on your mind today?</p>
    </div>
    <div class="type-toggle">
        <div class="type-opt ${composeType==='note'?'sel-note':''}" onclick="setType('note')">Note</div>
        <div class="type-opt ${composeType==='letter'?'sel-letter':''}" onclick="setType('letter')">Letter</div>
        <div class="type-opt ${composeType==='thought'?'sel-thought':''}" onclick="setType('thought')">Thought</div>
    </div>
    ${isL?`<div class="field"><label>Title</label><input id="f-title" type="text" placeholder="Give it a title…" autocomplete="off"/></div>`:''}
    <div class="field">
        <label>${isL?'Body':composeType==='note'?"What's on your mind?":'The thought'}</label>
        <textarea id="f-body" class="${composeType!=='letter'?'short-ta':''}"
        placeholder="${isL?'Write something longer…':composeType==='note'?'Just start writing…':'One sharp observation…'}"
        oninput="updateChar()"></textarea>
        ${composeType!=='letter'?`<div class="char-hint" id="char-hint">0 chars</div>`:''}
    </div>
    <div class="compose-actions">
        <button class="btn btn-primary" onclick="publish()">Publish</button>
        <button class="btn btn-outline" onclick="showFeed(activeFilter)">Cancel</button>
    </div>
    </div>`;
}

function setType(t) { composeType=t; renderCompose(); }

function updateChar() {
const el=document.getElementById('char-hint'), b=document.getElementById('f-body');
if (!el||!b) return;
const n=b.value.length;
el.textContent=n+' chars';
el.className='char-hint'+(n>300?' over':'');
}

function publish() {
const body=(document.getElementById('f-body')||{}).value?.trim();
const title=(document.getElementById('f-title')||{}).value?.trim()||'';
if (!body) { toast('Write something first ✏️'); return; }
entries=load();
const date=new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
entries.unshift({id:Date.now(),type:composeType,title,body,date});
save(entries);
toast('Published ✓');
showFeed(null);
}

function deleteEntry(id) {
if (!confirm('Delete this entry?')) return;
save(load().filter(e=>e.id!==id));
toast('Deleted.');
showFeed(activeFilter);
}

const clip=(s,n)=>s.length>n?s.slice(0,n)+'…':s;

function toast(msg) {
const t=document.getElementById('toast');
t.textContent=msg; t.classList.add('show');
setTimeout(()=>t.classList.remove('show'),2500);
}

showFeed(null);