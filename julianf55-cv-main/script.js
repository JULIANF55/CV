document.addEventListener('DOMContentLoaded', function () {
  // Variables básicas
  const btnVolverArriba = document.getElementById('btn-volver-arriba');
  const themeSwitch = document.getElementById('theme-switch');
  const botonesCertificados = document.querySelectorAll('.btn-certificado');
  const modal = document.getElementById('certificado-modal');
  const modalClose = document.querySelector('.modal-close');
  const modalTitle = document.querySelector('.modal-title');
  const typingEffect = document.querySelector('.typing-effect');
  
  // Inicializar funciones básicas
  initBasicFunctions();
  
  // Función para inicializar funciones básicas
  function initBasicFunctions() {
    // Activar animación de tipeo para el nombre
    if (typingEffect) {
      setTimeout(() => {
        typingEffect.classList.add('animate');
      }, 500);
    }
    
    // Activar funciones al hacer scroll
    window.addEventListener('scroll', function() {
      toggleScrollTopButton();
    });
  }
  
  // Función para mostrar/ocultar el botón de volver arriba
  function toggleScrollTopButton() {
    if (window.scrollY > 300) {
      btnVolverArriba.classList.add('visible');
    } else {
      btnVolverArriba.classList.remove('visible');
    }
  }
  
  // Manejo de certificados y modal
  botonesCertificados.forEach(boton => {
    boton.addEventListener('click', function (e) {
      e.preventDefault();
      const rutaCertificado = this.getAttribute('data-certificado');
      const certificadoNombre = this.querySelector('.sr-only')?.textContent || 'Certificado';
      
      // Actualizar título del modal
      modalTitle.textContent = certificadoNombre;
      
      // Mostrar modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Cargar el certificado PDF
      const modalBody = modal.querySelector('.modal-body');
      modalBody.innerHTML = '<div class="certificado-placeholder"><i class="fas fa-spinner fa-spin"></i><p>Cargando certificado...</p></div>';
      
      // Crear iframe para mostrar el PDF
      setTimeout(() => {
        modalBody.innerHTML = `
          <div class="pdf-container">
            <iframe src="${rutaCertificado}" 
                    type="application/pdf" 
                    width="100%" 
                    height="600px"
                    style="border: none; border-radius: 8px;">
              <p>Tu navegador no puede mostrar PDFs. 
                 <a href="${rutaCertificado}" target="_blank">Haz clic aquí para descargar el certificado</a>
              </p>
            </iframe>
            <div class="pdf-actions">
              <a href="${rutaCertificado}" download class="btn-download">
                <i class="fas fa-download"></i> Descargar PDF
              </a>
              <a href="${rutaCertificado}" target="_blank" class="btn-open">
                <i class="fas fa-external-link-alt"></i> Abrir en nueva pestaña
              </a>
            </div>
          </div>
        `;
      }, 500);
    });
  });
  
  // Cerrar modal
  modalClose.addEventListener('click', function() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Cerrar modal con tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Cambiar tema (claro/oscuro)
  themeSwitch.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    
    // Cambiar icono
    const icon = this.querySelector('i');
    if (document.body.classList.contains('dark-theme')) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  });
  
  // Botón volver arriba
  btnVolverArriba.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Descargar CV
  const btnDescargarCV = document.getElementById('btn-descargar-cv');
  if (btnDescargarCV) {
    btnDescargarCV.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Crear un enlace temporal para descargar el CV
      const link = document.createElement('a');
      link.href = 'certificados/CV.pdf';
      link.download = 'CV_Julian_Forero.pdf';
      link.style.display = 'none';
      
      // Agregar al DOM, hacer clic y remover
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Mostrar mensaje de confirmación
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i> ¡Descargado!';
      this.style.backgroundColor = '#28a745';
      
      setTimeout(() => {
        this.innerHTML = originalText;
        this.style.backgroundColor = '';
      }, 2000);
    });
  }
});

