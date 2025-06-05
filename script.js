document.addEventListener('DOMContentLoaded', function() {
  // --- Navbar Scroll Effect ---
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Mobile Menu Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isExpanded = navLinks.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
      if (isExpanded) {
        menuToggle.innerHTML = '&times;'; // Change to "X" icon
        menuToggle.setAttribute('aria-label', 'Fechar menu');
      } else {
        menuToggle.innerHTML = '&#9776;'; // Change back to hamburger
        menuToggle.setAttribute('aria-label', 'Abrir menu');
      }
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.innerHTML = '&#9776;';
          menuToggle.setAttribute('aria-label', 'Abrir menu');
        }
      });
    });
  }

  // --- Carousel ---
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(track ? track.children : []);
  const nextButton = document.querySelector('.carousel-button.next');
  const prevButton = document.querySelector('.carousel-button.prev');
  const dotsNav = document.querySelector('.carousel-dots');

  if (track && slides.length > 0) {
    const slideWidth = slides[0].getBoundingClientRect().width;
    let currentSlideIndex = 0;
    const visibleSlides = 3; // Ajuste conforme o CSS inicial (.carousel-slide min-width)

    // Create dots
    slides.forEach((slide, index) => {
        if (index <= slides.length - visibleSlides) { // Only create dots for valid starting positions
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                moveToSlide(index);
            });
            if (dotsNav) dotsNav.appendChild(dot);
        }
    });
    const dots = Array.from(dotsNav ? dotsNav.children : []);

    const setSlidePosition = (slide, index) => {
      // Não é mais necessário se o track está sendo movido
    };

    const moveToSlide = (targetIndex) => {
      if (targetIndex < 0) targetIndex = 0;
      if (targetIndex > slides.length - visibleSlides) targetIndex = slides.length - visibleSlides;

      track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
      currentSlideIndex = targetIndex;
      updateDots(targetIndex);
      updateNavButtons();
    };
    
    const updateDots = (targetIndex) => {
        if (!dotsNav) return;
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[targetIndex]) {
            dots[targetIndex].classList.add('active');
        }
    };

    const updateNavButtons = () => {
        if (!prevButton || !nextButton) return;
        prevButton.disabled = currentSlideIndex === 0;
        nextButton.disabled = currentSlideIndex >= slides.length - visibleSlides;
    };


    // Event Listeners para os botões
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        moveToSlide(currentSlideIndex + 1);
      });
    }
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        moveToSlide(currentSlideIndex - 1);
      });
    }

    // Ajustar slideWidth em resize (simplificado, pode precisar de debounce/throttle)
    window.addEventListener('resize', () => {
        if (slides.length > 0) {
            const newSlideWidth = slides[0].getBoundingClientRect().width;
            // Recalcular a posição, se necessário, ou a largura do track
            // Por simplicidade, apenas atualizamos a posição do track para o slide atual
            // Isso pode não ser perfeito para todos os casos de carrossel responsivo.
            track.style.transition = 'none'; // Desabilita transição para ajuste imediato
            track.style.transform = 'translateX(-' + newSlideWidth * currentSlideIndex + 'px)';
            // Reabilita a transição após um pequeno delay
            setTimeout(() => {
                track.style.transition = 'transform 0.5s ease-in-out';
            }, 50);
        }
    });
    
    // Initial state for nav buttons
    updateNavButtons();
    if (dots.length > 0) updateDots(0);
  }


  // --- Atualizar ano no footer ---
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});