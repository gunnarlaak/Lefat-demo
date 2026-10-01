const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    const select = document.getElementById('service');
    select.value = link.dataset.service;
  });
});

const dateInput = document.getElementById('date');
const today = new Date();
const y = today.getFullYear();
const m = String(today.getMonth()+1).padStart(2,'0');
const d = String(today.getDate()).padStart(2,'0');
dateInput.min = `${y}-${m}-${d}`;

document.getElementById('yearNow').textContent = new Date().getFullYear();

const form = document.getElementById('bookingForm');
const msg = document.getElementById('formMessage');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.className = 'form-message';
  msg.textContent = 'Saadan…';
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    // Kui backend on seadistatud, saadab broneeringu /api/book endpointi.
    // Kui serverit pole, salvestame demo brauserisse, et vorm oleks testitav.
    const res = await fetch('/api/book', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('backend unavailable');
    msg.className = 'form-message ok';
    msg.textContent = 'Broneering saadetud. Võtame sinuga ühendust.';
    form.reset();
  } catch (_) {
    const demo = JSON.parse(localStorage.getItem('lefat_demo_bookings') || '[]');
    demo.push({...data, createdAt: new Date().toISOString()});
    localStorage.setItem('lefat_demo_bookings', JSON.stringify(demo));
    msg.className = 'form-message ok';
    msg.textContent = 'Demobroneering salvestatud selles brauseris. Google Calendari jaoks tuleb backend aktiveerida.';
  }
});

// Service-card anchor navigation: account for the sticky header so the
// beginning of each article is never hidden behind it.
document.querySelectorAll('.service-card a[href^="#"]').forEach(link => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const extraGap = window.innerWidth <= 700 ? 18 : 28;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - extraGap;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    history.replaceState(null, '', link.getAttribute('href'));
  });
});

// Home navigation must always return to the real top of the page.
// Using #avaleht directly with a sticky header can position the hero under the header.
document.querySelectorAll('a[href="#avaleht"]').forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    nav?.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', window.location.pathname + window.location.search);
  });
});

// If an old/bookmarked URL is opened with #avaleht, normalize it to page top.
if (window.location.hash === '#avaleht') {
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
    history.replaceState(null, '', window.location.pathname + window.location.search);
  });
}
