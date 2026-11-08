import './style.css';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const soundToggle = $('#soundToggle');
const langToggle = $('#langToggle');
const themeToggle = $('#themeToggle');
const ambient = $('#ambientAudio');
let soundOn = false;
let audioCtx;
let lang = localStorage.getItem('moamen-lang') || 'ar';

const copy = {
  ar: {
    nav: ['الأعمال', 'عن مؤمن', 'تواصل'],
    heroEyebrow: '<span class="eyebrow-line"></span> مصمم بصري بالذكاء الاصطناعي',
    heroTitle: 'أحوّل الفكرة<br /><em>إلى أثر بصري.</em>',
    heroLead: 'صور، فيديو، وحكايات بصرية تُصنع من تقاطع الخيال مع التكنولوجيا — لتترك انطباعًا لا يُنسى.',
    heroPrimary: 'استكشف الأعمال <span>↙</span>', heroSecondary: 'اكتشف المنهج <span>←</span>',
    availability: 'متاح لمشاريع مختارة',
    workEyebrow: '<span class="eyebrow-line"></span> معرض مختار', workTitle: 'الأعمال،<br /><em>كما تراها.</em>',
    workNote: 'من داخل مجلدات مؤمن — مساحة مفتوحة للتجريب، حيث لكل ملف حكاية ولكل تاريخ اتجاه.',
    filters: ['الكل', 'صور وتجارب', 'فيديو', 'تسويق رقمي', 'صوت'],
    aboutEyebrow: '<span class="eyebrow-line"></span> عن مؤمن', aboutTitle: 'أصنع مساحة<br /><em>بين الحلم والآلة.</em>',
    aboutP1: 'أنا مؤمن، مصمم بصري أستخدم الذكاء الاصطناعي كامتداد للخيال — لا كبديل عنه. أبحث عن الصورة التي تحمل إحساسًا، والفيديو الذي يبقى في الذاكرة، والفكرة التي تتطور كلما اقتربنا منها.',
    aboutP2: 'كل مشروع يبدأ بسؤال بسيط: <strong>ماذا لو؟</strong> ثم نترك للصورة أن تجيب.',
    contactEyebrow: '<span class="eyebrow-line"></span> لنصنع شيئًا', contactTitle: 'فكرة تستحق<br /><em>أن تُرى.</em>',
    location: 'الرياض / عن بُعد', socials: 'Instagram&nbsp;&nbsp; Behance&nbsp;&nbsp; LinkedIn',
    footerTag: 'مصنوع بالفضول، لا بالقوالب.', backTop: 'العودة للأعلى ↑',
    sound: soundOn ? 'كتم الصوت' : 'الصوت', soundAria: soundOn ? 'تشغيل الصوت' : 'كتم الصوت',
    modalProject: 'مشروع', modalOpen: 'فتح مجلد Drive ↗', close: 'إغلاق',
    themeLight: 'تفعيل الوضع الفاتح', themeDark: 'تفعيل الوضع الليلي', langLabel: 'Switch to English'
  },
  en: {
    nav: ['Work', 'About Moamen', 'Contact'],
    heroEyebrow: '<span class="eyebrow-line"></span> AI visual designer',
    heroTitle: 'I turn ideas<br /><em>into visual impact.</em>',
    heroLead: 'Images, motion, and visual stories made where imagination meets technology — built to stay with you.',
    heroPrimary: 'Explore the work <span>↙</span>', heroSecondary: 'Discover the approach <span>←</span>',
    availability: 'Available for selected projects',
    workEyebrow: '<span class="eyebrow-line"></span> Selected work', workTitle: 'The work,<br /><em>as you see it.</em>',
    workNote: 'From Moamen’s folders — an open space for experiments, where every file has a story and every date has a direction.',
    filters: ['All', 'Image / Experiments', 'Video', 'Digital marketing', 'Audio'],
    aboutEyebrow: '<span class="eyebrow-line"></span> About Moamen', aboutTitle: 'I make space<br /><em>between dream and machine.</em>',
    aboutP1: 'I’m Moamen, a visual designer using AI as an extension of imagination — never a replacement for it. I look for images with feeling, motion that stays in memory, and ideas that evolve as we get closer.',
    aboutP2: 'Every project begins with one simple question: <strong>what if?</strong> Then we let the image answer.',
    contactEyebrow: '<span class="eyebrow-line"></span> Let’s make something', contactTitle: 'An idea worth<br /><em>being seen.</em>',
    location: 'Riyadh / Remote', socials: 'Instagram&nbsp;&nbsp; Behance&nbsp;&nbsp; LinkedIn',
    footerTag: 'Made with curiosity, not templates.', backTop: 'Back to top ↑',
    sound: soundOn ? 'Mute sound' : 'Sound', soundAria: soundOn ? 'Turn sound on' : 'Mute sound',
    modalProject: 'Project', modalOpen: 'Open Drive folder ↗', close: 'Close',
    themeLight: 'Enable light mode', themeDark: 'Enable dark mode', langLabel: 'التبديل إلى العربية'
  }
};

const projectCopy = {
  ar: [
    ['صورة / تجربة', '3-11-2060', 'سلسلة تجارب بصرية مولّدة بالذكاء الاصطناعي ضمن أرشيف المشاريع.'],
    ['حملة / محتوى', 'التسويق الرقمي', 'أفكار لحملات ومحتوى بصري مخصص لمنصات التواصل.'],
    ['صورة / تجريد', '26-10-2026', 'اتجاهات تجريدية ولحظات مولّدة من الضوء والملمس.'],
    ['صورة / يوميات بصرية', '25-10-2026', 'دفتر بصري سريع الإيقاع، يلتقط الاحتمالات الأولى للفكرة.'],
    ['فيديو / حركة', '2026-10-28', 'مشاهد فيديو قصيرة وتجارب حركة من أرشيف مؤمن.'],
    ['فيديو / سرد بصري', '2026-10-26', 'تجارب انتقال وإيقاع بصري مصممة للفيديو.'],
    ['صوت / موسيقى مولّدة', 'gemini music (3)', 'مقطع صوتي من أرشيف أصوات الذكاء الاصطناعي.']
  ],
  en: [
    ['Image / Experiment', '3-11-2060', 'A series of AI-generated visual experiments from the project archive.'],
    ['Campaign / Content', 'Digital marketing', 'Campaign ideas and visual content made for social platforms.'],
    ['Image / Abstract', '26-10-2026', 'Abstract directions and moments generated from light and texture.'],
    ['Image / Visual diary', '25-10-2026', 'A fast-paced visual diary capturing the first possibilities of an idea.'],
    ['Video / Motion', '2026-10-28', 'Short video scenes and motion experiments from Moamen’s archive.'],
    ['Video / Visual narrative', '2026-10-26', 'Transitions and visual rhythm experiments designed for video.'],
    ['Audio / Generated music', 'gemini music (3)', 'An audio piece from the AI sounds archive.']
  ]
};

function interactionSound() {
  if (!soundOn) return;
  audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine'; osc.frequency.setValueAtTime(520, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(860, audioCtx.currentTime + .12);
  gain.gain.setValueAtTime(.0001, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(.045, audioCtx.currentTime + .015); gain.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + .18);
  osc.connect(gain).connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + .2);
}

const modal = $('#projectModal');
const modalTitle = $('#modalTitle'); const modalDesc = $('#modalDescription'); const modalLink = $('#modalLink'); const modalType = $('#modalType');

function setLanguage(nextLang) {
  lang = nextLang; localStorage.setItem('moamen-lang', lang);
  const t = copy[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  $('.brand .brand-mark').textContent = lang === 'ar' ? 'م' : 'M';
  $('.brand > span:last-child').innerHTML = lang === 'ar' ? 'مؤمن<span class="brand-dot">.</span>' : 'Moamen<span class="brand-dot">.</span>';
  $$('.main-nav a').forEach((link, i) => { link.textContent = t.nav[i]; });
  $('.hero-copy .eyebrow').innerHTML = t.heroEyebrow; $('.hero h1').innerHTML = t.heroTitle; $('.hero-lede').textContent = t.heroLead;
  $('.hero-actions .button').innerHTML = t.heroPrimary; $('.hero-actions .text-link').innerHTML = t.heroSecondary; $('.hero-meta span:first-child').textContent = t.availability;
  $('.section-heading .eyebrow').innerHTML = t.workEyebrow; $('.section-heading h2').innerHTML = t.workTitle; $('.section-note').textContent = t.workNote;
  $$('.filter-btn').forEach((btn, i) => { const count = btn.querySelector('small').textContent; btn.innerHTML = `${t.filters[i]} <small>${count}</small>`; });
  $('.about-copy .eyebrow').innerHTML = t.aboutEyebrow; $('.about-copy h2').innerHTML = t.aboutTitle; $('.about-copy p:nth-of-type(2)').textContent = t.aboutP1; $('.about-copy p:nth-of-type(3)').innerHTML = t.aboutP2;
  $('.contact .eyebrow').innerHTML = t.contactEyebrow; $('.contact h2').innerHTML = t.contactTitle; $('.contact-foot span:first-child').textContent = t.location; $('.contact-foot span:nth-child(2)').innerHTML = t.socials;
  $('.site-footer span:nth-child(2)').textContent = t.footerTag; $('.site-footer a').textContent = t.backTop;
  soundToggle.querySelector('span:last-child').textContent = t.sound; soundToggle.setAttribute('aria-label', t.soundAria);
  langToggle.textContent = lang === 'ar' ? 'EN' : 'عربي'; langToggle.setAttribute('aria-label', t.langLabel);
  themeToggle.setAttribute('aria-label', document.documentElement.dataset.theme === 'dark' ? t.themeLight : t.themeDark);
  $('.modal-close').setAttribute('aria-label', t.close); modalLink.textContent = t.modalOpen;
  $$('.project-card').forEach((card, i) => { const [type, title, description] = projectCopy[lang][i]; card.querySelector('.project-type').textContent = type; card.querySelector('h3').textContent = title; card.dataset.title = title; card.dataset.description = description; });
  if (modal.classList.contains('open')) { modalType.textContent = t.modalProject; }
  document.title = lang === 'ar' ? 'مؤمن — مصمم بصري بالذكاء الاصطناعي' : 'Moamen — AI Visual Designer';
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme; localStorage.setItem('moamen-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☼' : '◐';
  themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
  themeToggle.setAttribute('aria-label', theme === 'dark' ? copy[lang].themeLight : copy[lang].themeDark);
}

const savedTheme = localStorage.getItem('moamen-theme') || 'dark';
setTheme(savedTheme);
setLanguage(lang);

langToggle.addEventListener('click', () => { setLanguage(lang === 'ar' ? 'en' : 'ar'); interactionSound(); });
themeToggle.addEventListener('click', () => { setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); interactionSound(); });
soundToggle.addEventListener('click', async () => {
  soundOn = !soundOn; soundToggle.setAttribute('aria-pressed', String(soundOn)); setLanguage(lang); interactionSound();
  if (soundOn) { try { await ambient.play(); } catch { /* autoplay may be blocked */ } } else ambient.pause();
});

$$('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
  $$('.filter-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active');
  const filter = btn.dataset.filter;
  $$('.project-card').forEach(card => card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.type !== filter));
  interactionSound();
}));

function openProject(card) {
  modalTitle.textContent = card.dataset.title; modalDesc.textContent = card.dataset.description; modalType.textContent = card.querySelector('.project-type').textContent;
  modalLink.href = card.querySelector('a').href; modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; interactionSound();
}
$$('.project-card').forEach(card => {
  card.tabIndex = 0; card.setAttribute('role', 'button');
  card.addEventListener('click', event => { if (!event.target.closest('a')) openProject(card); });
  card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProject(card); } });
});
function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
$$('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Open Drive files and all portfolio links in the same tab.
$$('a[target="_blank"]').forEach(link => { link.removeAttribute('target'); link.removeAttribute('rel'); });

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
$$('.reveal').forEach(el => observer.observe(el));

const glow = $('.cursor-glow');
window.addEventListener('pointermove', e => { glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`; });
$$('.magnetic').forEach(el => el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .12}px, ${(e.clientY - r.top - r.height / 2) * .12}px)`; }));
$$('.magnetic').forEach(el => el.addEventListener('pointerleave', () => { el.style.transform = ''; }));
$$('a[href^="#"]').forEach(link => link.addEventListener('click', () => interactionSound()));
