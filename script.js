(function () {
  'use strict';

  var body = document.body;
  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Opening gate ---------- */
  var gate = document.getElementById('gate');
  var card = document.getElementById('card');
  var opened = false;

  function openGate() {
    if (opened) return;
    opened = true;
    gate.classList.add('opening');

    setTimeout(function () {
      body.classList.add('opened');
      body.classList.remove('locked');
      startPetals();
    }, reduceMotion ? 200 : 900);

    setTimeout(function () {
      gate.classList.add('gone');
      gate.setAttribute('aria-hidden', 'true');
    }, reduceMotion ? 700 : 2100);
  }

  gate.addEventListener('click', openGate);

  /* ---------- Falling petals: a shower as the doors open, then they stop ---------- */
  var petalLayer = document.getElementById('petals');
  var colors = [
    'linear-gradient(135deg, #e8667d, #9c1c33)',
    'linear-gradient(135deg, #f08a9b, #b8283f)',
    'linear-gradient(135deg, #d94b63, #7a1a2b)',
    'linear-gradient(135deg, #f7c6cf, #e0526a)',
    'linear-gradient(135deg, #f7e3a3, #c9a24a)'
  ];

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function spawnPetal(fromTop) {
    var wrap = document.createElement('span');
    wrap.className = 'petal';
    var shape = document.createElement('span');
    shape.className = 'petal-shape';
    shape.style.setProperty('--w', rand(10, 20).toFixed(1) + 'px');
    shape.style.setProperty('--c', colors[Math.random() < 0.12 ? 4 : Math.floor(rand(0, 4))]);
    shape.style.setProperty('--sway', rand(1.6, 3.4).toFixed(2) + 's');
    wrap.appendChild(shape);
    petalLayer.appendChild(wrap);

    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var x = rand(-20, vw + 20);
    var y = fromTop ? rand(-60, -20) : rand(-vh * 0.3, vh * 0.4);
    var anim = wrap.animate([
      { transform: 'translate(' + x + 'px,' + y + 'px) rotate(0deg)', opacity: 0 },
      { opacity: 1, offset: 0.08 },
      { opacity: 1, offset: 0.85 },
      { transform: 'translate(' + (x + rand(-160, 160)) + 'px,' + (vh + 40) + 'px) rotate(' + rand(-540, 540) + 'deg)', opacity: 0 }
    ], { duration: rand(7000, 13000) * (fromTop ? 1 : 0.7), easing: 'linear', fill: 'forwards' });
    anim.onfinish = function () { wrap.remove(); };
  }

  function startPetals() {
    if (reduceMotion || !('animate' in Element.prototype)) return;
    for (var i = 0; i < 26; i++) {
      setTimeout(function () { spawnPetal(false); }, i * 60);
    }
    var drift = setInterval(function () { spawnPetal(true); }, 650);
    setTimeout(function () { clearInterval(drift); }, 5000);
  }

  /* ---------- Card flip ---------- */
  var front = card.querySelector('.face--front');
  var back = card.querySelector('.face--back');

  function toggleCard() {
    var open = card.classList.toggle('is-open');
    card.setAttribute('aria-expanded', String(open));
    card.setAttribute('aria-label', open ? 'Show the front of the invitation' : 'Show invitation details');
    front.inert = open;
    back.inert = !open;
  }

  card.addEventListener('click', function (e) {
    if (e.target.closest('a')) return;
    toggleCard();
  });
  card.addEventListener('keydown', function (e) {
    if (e.target !== card || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    toggleCard();
  });

  /* ---------- Countdown ---------- */
  var target = new Date('2026-10-07T11:30:00+05:30').getTime();
  var elDays = document.getElementById('cd-days');
  var elHours = document.getElementById('cd-hours');
  var elMins = document.getElementById('cd-mins');

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      document.getElementById('timer').hidden = true;
      document.getElementById('cdDone').hidden = false;
      return false;
    }
    var m = Math.floor(diff / 60000);
    elDays.textContent = pad(Math.floor(m / 1440));
    elHours.textContent = pad(Math.floor((m % 1440) / 60));
    elMins.textContent = pad(m % 60);
    return true;
  }
  if (tick()) {
    var cd = setInterval(function () { if (!tick()) clearInterval(cd); }, 15000);
  }
})();
