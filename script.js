// Fades each section in as it scrolls into view.
(function () {
  if (!('IntersectionObserver' in window)) return; // old browsers: everything simply stays visible

  document.documentElement.classList.add('js');

  var targets = document.querySelectorAll('.reveal, .reveal-line');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

  targets.forEach(function (el) { observer.observe(el); });
})();
