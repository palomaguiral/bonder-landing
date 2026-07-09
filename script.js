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
