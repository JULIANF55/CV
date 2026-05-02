document.addEventListener('DOMContentLoaded', function () {

  // ─── REFERENCIAS ───
  const btnVolverArriba   = document.getElementById('btn-volver-arriba');
  const themeSwitch       = document.getElementById('theme-switch');
  const botonesCertificados = document.querySelectorAll('.btn-certificado');
  const modal             = document.getElementById('certificado-modal');
  const modalClose        = document.querySelector('.modal-close');
  const modalTitle        = document.querySelector('.modal-title');
  const typingEffect      = document.querySelector('.typing-effect');
  const scrollProgress    = document.getElementById('scroll-progress');
  const scrollAnimations  = document.querySelectorAll('.scroll-animation');
  const progressBars      = document.querySelectorAll('.progress-bar');
  const statNumbers       = document.querySelectorAll('.stat-number');

  // ─── INICIALIZAR ───
  init();

  function init() {
    // Efecto de tipeo
    if (typingEffect) {
      setTimeout(() => typingEffect.classList.add('animate'), 600);
    }

    // Scroll listeners
    window.addEventListener('scroll', onScroll, { passive: true });

    // Ejecutar una vez al cargar (por si el usuario ya está scrolleado)
    onScroll();

    // Intersection Observer para animaciones de entrada
    initScrollAnimations();

    // Inicializar progress bars y stats cuando sean visibles
    initProgressObserver();
  }

  // ─── SCROLL HANDLER ───
  function onScroll() {
    updateScrollProgress();
    toggleScrollTopButton();
  }

  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  function toggleScrollTopButton() {
    if (window.scrollY > 300) {
      btnVolverArriba.classList.add('visible');
    } else {
      btnVolverArriba.classList.remove('visible');
    }
  }

  // ─── SCROLL ANIMATIONS (Intersection Observer) ───
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    scrollAnimations.forEach(el => observer.observe(el));
  }

  // ─── PROGRESS BARS Y STATS COUNTER ───
  function initProgressObserver() {
    let statsAnimated = false;
    let barsAnimated  = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        // Progress bars de habilidades
        if (entry.target.classList.contains('grupo-imagenes') && !barsAnimated) {
          barsAnimated = true;
          progressBars.forEach(bar => {
            const target = parseInt(bar.getAttribute('data-progress')) || 0;
            bar.style.width = target + '%';
          });
        }

        // Contador de stats
        if (entry.target.classList.contains('stats-container') && !statsAnimated) {
          statsAnimated = true;
          statNumbers.forEach(el => {
            const target = parseInt(el.getAttribute('data-target')) || 0;
            animateCounter(el, 0, target, 1200);
          });
        }

        observer.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    const grupoImagenes = document.querySelector('.grupo-imagenes');
    const statsContainer = document.querySelector('.stats-container');
    if (grupoImagenes)  observer.observe(grupoImagenes);
    if (statsContainer) observer.observe(statsContainer);
  }

  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ─── MODAL CERTIFICADOS ───
  botonesCertificados.forEach(boton => {
    boton.addEventListener('click', function (e) {
      e.preventDefault();
      const ruta   = this.getAttribute('data-certificado');
      const nombre = this.querySelector('.sr-only')?.textContent || 'Certificado';

      modalTitle.textContent = nombre;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      const modalBody = modal.querySelector('.modal-body');
      modalBody.innerHTML = `
        <div class="certificado-placeholder">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Cargando certificado...</p>
        </div>`;

      setTimeout(() => {
        modalBody.innerHTML = `
          <div class="pdf-container">
            <iframe src="${ruta}" type="application/pdf" width="100%" height="600px"
                    style="border:none;border-radius:8px;">
              <p>Tu navegador no puede mostrar PDFs.
                 <a href="${ruta}" target="_blank">Haz clic aquí para abrirlo</a>
              </p>
            </iframe>
            <div class="pdf-actions">
              <a href="${ruta}" download class="btn-download">
                <i class="fas fa-download"></i> Descargar PDF
              </a>
              <a href="${ruta}" target="_blank" class="btn-open">
                <i class="fas fa-external-link-alt"></i> Abrir en nueva pestaña
              </a>
            </div>
          </div>`;
      }, 400);
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  // ─── TEMA OSCURO/CLARO ───
  themeSwitch.addEventListener('click', function () {
    document.body.classList.toggle('dark-theme');
    const icon = this.querySelector('i');
    const isDark = document.body.classList.contains('dark-theme');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    // Persistir preferencia
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Restaurar tema guardado
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    const icon = themeSwitch.querySelector('i');
    if (icon) icon.className = 'fas fa-sun';
  }

  // ─── BOTÓN VOLVER ARRIBA ───
  btnVolverArriba.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── DESCARGAR CV ───
  const btnDescargarCV = document.getElementById('btn-descargar-cv');
  if (btnDescargarCV) {
    btnDescargarCV.addEventListener('click', function (e) {
      e.preventDefault();
      const link = document.createElement('a');
      link.href     = 'certificados/CV.pdf';
      link.download = 'CV_Julian_Forero.pdf';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const original = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i> ¡Descargado!';
      this.style.background = 'linear-gradient(135deg,#27ae60,#2ecc71)';
      setTimeout(() => {
        this.innerHTML = original;
        this.style.background = '';
      }, 2500);
    });
  }

});
