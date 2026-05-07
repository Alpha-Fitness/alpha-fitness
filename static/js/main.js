document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const floatingCta = document.querySelector('.floating-cta');
  const backToTop = document.querySelector('.back-to-top');
  const hero = document.querySelector('.hero');
  const contactForm = document.getElementById('contactForm');

  // Mobile menu toggle
  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    mobileNavOverlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }
  
  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu when clicking a link
  const mobileLinks = document.querySelectorAll('.mobile-nav a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // Floating CTA and Back to Top visibility
  function handleScroll() {
    const scrollY = window.scrollY;
    const heroHeight = hero ? hero.offsetHeight : 0;

    // Show floating CTA after scrolling past hero
    if (floatingCta) {
      if (scrollY > heroHeight - 100) {
        floatingCta.classList.add('visible');
      } else {
        floatingCta.classList.remove('visible');
      }
    }

    // Show back to top after scrolling 300px
    if (backToTop) {
      if (scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll);

  // Back to top click
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Animated counters using Intersection Observer
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };

        updateCounter();
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  statNumbers.forEach(counter => counterObserver.observe(counter));

  // AOS-like scroll animations using Intersection Observer
  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        animateObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  const animatedElements = document.querySelectorAll('[data-aos]');
  animatedElements.forEach(el => animateObserver.observe(el));

  // Contact form handling
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('.form-submit');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
      
      // Simulate form submission (replace with actual API call)
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = '#28a745';
        
        setTimeout(() => {
          contactForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 2000);
      }, 1500);
    });
  }

  // Navbar active link highlighting
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav a, .mobile-nav a');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.style.background = 'rgba(229,9,14,.7)';
    }
  });

  // Lightbox functionality
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const galleryItems = document.querySelectorAll('.gallery-item, .home-gallery-item, .coverflow-item');
  
  let currentImageIndex = 0;
  const images = [];
  
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      images.push({
        src: img.src,
        alt: img.alt
      });
      // Coverflow items handle their own clicks; others open lightbox directly
      if (!item.classList.contains('coverflow-item')) {
        item.addEventListener('click', () => {
          currentImageIndex = index;
          openLightbox();
        });
      }
    }
  });
  
  function openLightbox() {
    lightbox.classList.add('active');
    lightboxImg.src = images[currentImageIndex].src;
    lightboxCaption.textContent = images[currentImageIndex].alt;
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function showPrev() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentImageIndex].src;
    lightboxCaption.textContent = images[currentImageIndex].alt;
  }
  
  function showNext() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    lightboxImg.src = images[currentImageIndex].src;
    lightboxCaption.textContent = images[currentImageIndex].alt;
  }
  
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', showPrev);
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', showNext);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }
  
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Gallery filter functionality
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItemsPage = document.querySelectorAll('.gallery-item');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      
      galleryItemsPage.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ========== COVERFLOW 3D CAROUSEL ==========
  function initCoverflow(container) {
    const track = container.querySelector('.coverflow-track');
    const items = Array.from(track.querySelectorAll('.coverflow-item'));
    const prevBtn = container.querySelector('.coverflow-prev');
    const nextBtn = container.querySelector('.coverflow-next');
    const dotsContainer = container.querySelector('.coverflow-dots');

    if (items.length === 0) return;

    let current = 0;
    const total = items.length;
    let autoplayTimer = null;

    function render() {
      const containerW = container.offsetWidth;
      const isMobile = containerW < 500;
      const itemW = isMobile
        ? Math.min(180, containerW * 0.55)
        : Math.min(320, containerW * 0.3);
      const itemH = itemW * 0.75;
      const centerX = containerW / 2;
      const containerH = container.offsetHeight;

      items.forEach((item, i) => {
        const offset = i - current;
        const absOff = Math.abs(offset);

        if (absOff > 3) {
          item.style.display = 'none';
          return;
        }
        item.style.display = 'block';

        const translateX = offset * (itemW * 0.6);
        const translateZ = -absOff * 70;
        const rotateY = offset * -40;
        const scale = 1 - absOff * 0.12;
        const opacity = Math.max(1 - absOff * 0.28, 0.15);
        const zIndex = 100 - absOff * 10;

        item.classList.toggle('active', i === current);

        if (item.style.width !== `${itemW}px`) {
          item.style.width = `${itemW}px`;
        }
        item.style.height = `${itemH}px`;
        item.style.left = `${centerX - itemW / 2}px`;
        item.style.top = `${(containerH - itemH) / 2}px`;
        item.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
        item.style.zIndex = Math.max(zIndex, 1);
        item.style.opacity = opacity;
      });

      // Update dots
      const dots = dotsContainer.querySelectorAll('.coverflow-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });

      // Update button states
      prevBtn.style.opacity = current === 0 ? '0.3' : '1';
      prevBtn.style.pointerEvents = current === 0 ? 'none' : 'auto';
      nextBtn.style.opacity = current === total - 1 ? '0.3' : '1';
      nextBtn.style.pointerEvents = current === total - 1 ? 'none' : 'auto';
    }

    function goTo(index) {
      if (index < 0 || index >= total) return;
      current = index;
      render();
    }

    function prev() { goTo(current - 1); }
    function next() { goTo(current + 1); }

    // Events
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    // Build dots
    if (dotsContainer) {
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'coverflow-dot';
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    // Item clicks — navigate or open lightbox
    items.forEach((item, i) => {
      item.addEventListener('click', () => {
        if (i === current) {
          currentImageIndex = i;
          openLightbox();
        } else {
          goTo(i);
        }
      });
    });

    // Autoplay
    function startAutoplay() {
      if (total <= 1) return;
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        goTo(current < total - 1 ? current + 1 : 0);
      }, 4000);
    }

    function stopAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }

    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(render, 150);
    });

    render();
    startAutoplay();
  }

  // Initialize coverflows
  const galleryCoverflow = document.getElementById('coverflowGallery');
  const homeCoverflow = document.getElementById('coverflowHome');
  if (galleryCoverflow) initCoverflow(galleryCoverflow);
  if (homeCoverflow) initCoverflow(homeCoverflow);
});
