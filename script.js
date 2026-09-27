(function () {
  'use strict';

  /* ---------- Envelope: opens once, then the letter is an ordinary page ---------- */
  var card = document.getElementById('card');
  var letter = document.getElementById('letter');

  function openEnvelope() {
    if (card.classList.contains('is-open')) return;
    card.classList.add('is-open');
    ['role', 'tabindex', 'aria-label', 'aria-expanded'].forEach(function (a) { card.removeAttribute(a); });
    letter.inert = false;
  }

  card.addEventListener('click', openEnvelope);
  card.addEventListener('keydown', function (e) {
    if (e.target !== card || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    openEnvelope();
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
