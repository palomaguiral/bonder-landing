// ===== Bonder — script compartido =====

document.addEventListener('DOMContentLoaded', function () {
  // Menú móvil desplegable
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Carrusel de fotos (auto-avance + flechas + deslizable a mano)
  document.querySelectorAll('.photo-carousel').forEach(function (carousel) {
    var wrap = carousel.closest('.carousel-wrap') || carousel;
    var timer = null;
    function cardStep() {
      var card = carousel.querySelector('img');
      return card ? card.getBoundingClientRect().width + 18 : 260;
    }
    function next() {
      var atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 4;
      carousel.scrollTo({ left: atEnd ? 0 : carousel.scrollLeft + cardStep(), behavior: 'smooth' });
    }
    function prev() {
      carousel.scrollTo({ left: Math.max(0, carousel.scrollLeft - cardStep()), behavior: 'smooth' });
    }
    function start() { timer = setInterval(next, 3200); }
    function stop() { clearInterval(timer); }
    start();
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('touchstart', stop, { passive: true });

    var prevBtn = wrap.querySelector('.carousel-arrow--prev');
    var nextBtn = wrap.querySelector('.carousel-arrow--next');
    if (prevBtn) prevBtn.addEventListener('click', function () { stop(); prev(); start(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { stop(); next(); start(); });
  });

  // Animación de aparición al hacer scroll
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  // Formulario de interés
  var form = document.querySelector('form.interest');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var button = form.querySelector('button[type=submit]');
      var success = document.querySelector('.form-success');

      // NOTA: sustituye SCRIPT_URL por la URL de tu Google Apps Script (termina en /exec)
      // para que cada envío se guarde en tu Google Sheet.
      var SCRIPT_URL = '';

      var data = {
        name: form.querySelector('#name').value,
        email: form.querySelector('#email').value
      };

      if (!SCRIPT_URL) {
        // Sin backend conectado todavía: solo mostramos confirmación visual.
        showSuccess();
        return;
      }

      button.disabled = true;
      fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(function () {
        showSuccess();
      }).catch(function () {
        button.disabled = false;
        alert('No se pudo enviar. Inténtalo de nuevo en unos segundos.');
      });

      function showSuccess() {
        if (success) {
          form.style.display = 'none';
          success.style.display = 'block';
        }
      }
    });
  }
});
