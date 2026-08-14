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
