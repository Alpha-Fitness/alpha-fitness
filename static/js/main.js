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

  // Enhanced AOS scroll animations
  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.aosDelay || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        aosObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  const animatedElements = document.querySelectorAll('[data-aos]');
  animatedElements.forEach(el => aosObserver.observe(el));

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
  const galleryItems = document.querySelectorAll('.gallery-item, .home-gallery-item');
  
  let currentImageIndex = 0;
  const images = [];
  
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      images.push({
        src: img.src,
        alt: img.alt
      });
      item.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox();
      });
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

  // Touch swipe support for lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) showNext();
        else showPrev();
      }
    }, { passive: true });
  }

  // Gallery Scroll-Snap Navigation
  const galleryScroller = document.getElementById('galleryScroller');
  const galleryTrack = document.getElementById('galleryTrack');
  const galleryDots = document.getElementById('galleryDots');
  const galleryPrevBtn = document.querySelector('.gallery-prev');
  const galleryNextBtn = document.querySelector('.gallery-next');

  if (galleryScroller && galleryTrack && galleryDots) {
    const items = galleryTrack.querySelectorAll('.gallery-item');
    const itemCount = items.length;

    function getItemWidth() {
      if (items.length === 0) return 0;
      const first = items[0];
      return first.offsetWidth + 20;
    }

    function scrollToIndex(index) {
      const scrollTarget = index * getItemWidth();
      galleryScroller.scrollTo({ left: scrollTarget, behavior: 'smooth' });
    }

    function updateActiveDot() {
      const dots = galleryDots.querySelectorAll('.gallery-scroll-dot');
      const scrollLeft = galleryScroller.scrollLeft;
      const itemW = getItemWidth();
      const activeIndex = itemW > 0 ? Math.round(scrollLeft / itemW) : 0;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === Math.min(activeIndex, itemCount - 1));
      });
    }

    // Build dots
    for (let i = 0; i < itemCount; i++) {
      const dot = document.createElement('button');
      dot.className = 'gallery-scroll-dot';
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => scrollToIndex(i));
      galleryDots.appendChild(dot);
    }

    // Prev/Next buttons
    if (galleryPrevBtn) {
      galleryPrevBtn.addEventListener('click', () => {
        const currentIndex = galleryScroller.scrollLeft > 0
          ? Math.round(galleryScroller.scrollLeft / getItemWidth())
          : 0;
        scrollToIndex(Math.max(0, currentIndex - 1));
      });
    }

    if (galleryNextBtn) {
      galleryNextBtn.addEventListener('click', () => {
        const currentIndex = Math.round(galleryScroller.scrollLeft / getItemWidth());
        scrollToIndex(Math.min(itemCount - 1, currentIndex + 1));
      });
    }

    // Update dots on scroll
    galleryScroller.addEventListener('scroll', updateActiveDot);

    // Touch swipe - update dots on end
    galleryScroller.addEventListener('touchend', updateActiveDot);
  }
});

/* ============================================
   ALPHA FITNESS — UPGRADE JAVASCRIPT ADDITIONS
   ============================================ */

// 1. LOADING SCREEN
(function() {
  const loadingScreen = document.querySelector('.loading-screen');
  
  if (loadingScreen) {
    document.body.style.overflow = 'hidden';
    window.addEventListener('load', function() {
      setTimeout(function() {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = '';
      }, 2000);
    });
  }
})();

// 2. STICKY HEADER SCROLL EFFECT
(function() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
})();

// 3. MOBILE MENU OVERLAY TOGGLE
(function() {
  const menuToggle = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-menu-overlay a');
  
  if (!menuToggle || !mobileMenu) return;
  
  menuToggle.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });
  
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      menuToggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
})();

// 4. SERVICE CARDS — 3D TILT EFFECT
(function() {
  const cards = document.querySelectorAll('.service-card');
  if (!cards.length) return;
  
  cards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.setProperty('--rotate-x', `${rotateX}deg`);
      card.style.setProperty('--rotate-y', `${rotateY}deg`);
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
    
    card.addEventListener('mouseleave', function() {
      card.style.setProperty('--rotate-x', '0deg');
      card.style.setProperty('--rotate-y', '0deg');
    });
  });
})();

// 5. GALLERY — PARALLAX SCROLL
(function() {
  const galleryItems = document.querySelectorAll('.gallery-masonry .gallery-item[data-parallax]');
  if (!galleryItems.length) return;
  
  let ticking = false;
  
  const updateParallax = () => {
    galleryItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      const rate = scrolled * 0.1;
      
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        item.style.setProperty('--parallax-offset', `${rate}px`);
      }
    });
    ticking = false;
  };
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
})();

// 6. TESTIMONIALS CAROUSEL
(function() {
  const carousel = document.querySelector('.testimonials-carousel');
  if (!carousel) return;
  
  const track = carousel.querySelector('.testimonials-track');
  const slides = carousel.querySelectorAll('.testimonial-slide');
  const prevBtn = carousel.querySelector('.testimonial-nav-btn.prev');
  const nextBtn = carousel.querySelector('.testimonial-nav-btn.next');
  const dotsContainer = carousel.querySelector('.testimonials-dots');
  
  if (!slides.length) return;
  
  let currentSlide = 0;
  let autoplayInterval;
  const autoplayDelay = 6000;
  
  if (dotsContainer) {
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('testimonial-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }
  
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.testimonial-dot') : [];
  
  const updateSlide = () => {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentSlide);
    });
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  };
  
  const goToSlide = (index) => {
    currentSlide = index;
    updateSlide();
    resetAutoplay();
  };
  
  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide();
  };
  
  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlide();
  };
  
  const startAutoplay = () => {
    autoplayInterval = setInterval(nextSlide, autoplayDelay);
  };
  
  const resetAutoplay = () => {
    clearInterval(autoplayInterval);
    startAutoplay();
  };
  
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  
  let touchStartX = 0;
  
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  carousel.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      resetAutoplay();
    }
  }, { passive: true });
  
  updateSlide();
  startAutoplay();
  
  carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  carousel.addEventListener('mouseleave', startAutoplay);
})();

// 7. EDUCATION CARDS — FLIP ON TAP (MOBILE)
(function() {
  const cards = document.querySelectorAll('.education-card');
  if (!cards.length) return;
  
  if ('ontouchstart' in window) {
    cards.forEach(card => {
      card.addEventListener('click', function(e) {
        cards.forEach(c => {
          if (c !== card) c.classList.remove('flipped');
        });
        card.classList.toggle('flipped');
      });
    });
  }
})();

// 8. EDUCATION TABS FILTERING
(function() {
  const tabs = document.querySelectorAll('.education-tab');
  const cards = document.querySelectorAll('.education-card');
  
  if (!tabs.length || !cards.length) return;
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const category = this.dataset.category;
      
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
          card.classList.remove('flipped');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

// 9. STICKY MOBILE CTA BAR
(function() {
  const ctaBar = document.querySelector('.mobile-cta-bar');
  if (!ctaBar) return;
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 500) {
      ctaBar.classList.add('visible');
    } else {
      ctaBar.classList.remove('visible');
    }
  }, { passive: true });
})();

// 10. SMOOTH SCROLL FOR ANCHOR LINKS
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
})();

// 11. BUTTON RIPPLE EFFECT
(function() {
  const buttons = document.querySelectorAll('.cta');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement('span');
      
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        left: ${e.clientX - rect.left}px;
        top: ${e.clientY - rect.top}px;
        width: 100px;
        height: 100px;
        margin-left: -50px;
        margin-top: -50px;
      `;
      
      button.style.position = 'relative';
      button.style.overflow = 'hidden';
      button.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
  
  if (!document.querySelector('#ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();

console.log('Alpha Fitness — Upgrades Loaded');
