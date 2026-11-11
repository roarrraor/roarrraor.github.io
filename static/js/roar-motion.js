// RoarrraoR motion — vanilla JS, no library, no build step.
// Scroll-triggered reveal + a little cover parallax, so the animation
// is felt on every scroll, not just on first load.
(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Reveal targets: posts on the list, and the single-post pieces.
  var targets = document.querySelectorAll('.post, .post-cover, .post-content h2, .post-content h3, .post-content p, .post-content ul');
  targets.forEach(function (el, i) {
    el.classList.add('reveal');
    // Small stagger inside a post, capped so it never feels slow.
    var delay = Math.min((i % 6) * 70, 350);
    el.style.transitionDelay = delay + 'ms';
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(function (el) { io.observe(el); });

  // Cover parallax: a gentle drift while scrolling, desktop only.
  var covers = document.querySelectorAll('.post-cover img');
  if (covers.length && window.matchMedia('(min-width: 900px)').matches) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var vh = window.innerHeight;
        covers.forEach(function (img) {
          var rect = img.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > vh) return;
          var progress = (rect.top + rect.height / 2 - vh / 2) / vh;
          img.style.translate = '0 ' + (progress * -14).toFixed(1) + 'px';
        });
        ticking = false;
      });
    }, { passive: true });
  }
})();
