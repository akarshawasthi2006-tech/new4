/* ==========================================================================
   DENTAL WEBSITE INTERACTIVE SCRIPT - OPTIMIZED FOR MOBILE
   SmileArc Dental Studio — Dr. Aryan Mehta
   Mobile-First Performance Improvements
   ========================================================================== */

// UTILITY: Throttle function to reduce scroll event calls
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// UTILITY: Debounce function for immediate response
const debounce = (func, delay) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

// UTILITY: Check if device is mobile
const isMobileDevice = () => {
  return window.matchMedia('(max-width: 768px)').matches;
};

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. STICKY NAVIGATION SCROLL STATE & ACTIVE LINK TRIGGER (OPTIMIZED)
  const mainHeader = document.getElementById('mainHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  
  // Cache for scroll position
  let lastScrollY = 0;

  const handleHeaderScroll = () => {
    lastScrollY = window.scrollY;
    if (lastScrollY > 80) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  };

  const highlightNavLink = () => {
    let scrollPos = lastScrollY + 120;
    let found = false;
    
    sections.forEach(section => {
      if (found) return; // Stop checking once we find current section
      
      const sectionId = section.getAttribute('id');
      if (!sectionId) return;

      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
        found = true;
      }
    });

    if (lastScrollY < 80) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#') {
          link.classList.add('active');
        }
      });
    }
  };

  // Throttle scroll event (reduce from continuous to every 100ms)
  const throttledScroll = throttle(() => {
    handleHeaderScroll();
    highlightNavLink();
  }, 100);

  window.addEventListener('scroll', throttledScroll, { passive: true });
  
  handleHeaderScroll();
  highlightNavLink();

  // 2. MOBILE DRAWER NAVIGATION MENU (OPTIMIZED)
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  let isDrawerOpen = false;

  const toggleMobileMenu = () => {
    isDrawerOpen = !isDrawerOpen;
    mobileMenuToggle.classList.toggle('active');
    mobileDrawer.classList.toggle('open');
    mobileDrawer.setAttribute('aria-hidden', isDrawerOpen ? 'false' : 'true');
    mobileMenuToggle.setAttribute('aria-expanded', isDrawerOpen);
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
    
    // Prevent body scroll on mobile when drawer is open
    if (isDrawerOpen && isMobileDevice()) {
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.position = '';
      document.body.style.width = '';
    }
  };

  mobileMenuToggle?.addEventListener('click', toggleMobileMenu);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isDrawerOpen) {
        toggleMobileMenu();
      }
    });
  });

  // 3. HERO PARALLAX (MOBILE OPTIMIZED - DISABLED ON MOBILE)
  const heroImg = document.querySelector('.hero-img');
  let parallelAnimationId;
  
  if (heroImg && window.matchMedia('(min-width: 769px)').matches) {
    const updateParallax = throttle(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const scrollPos = window.scrollY;
      const yOffset = scrollPos * 0.3;
      heroImg.style.transform = `translateY(${yOffset}px) scale(1.02)`;
    }, 50);

    window.addEventListener('scroll', updateParallax, { passive: true });
  }

  // 4. SMOOTH SCROLL HANDLERS
  const heroSecBtn = document.getElementById('heroSecBtn');
  const heroScrollBtn = document.querySelector('.hero-scroll-btn');

  const smoothScrollToSection = (targetId) => {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const offset = isMobileDevice() ? 40 : 70;
      const targetPos = targetElement.offsetTop - offset;
      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    }
  };

  heroSecBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    smoothScrollToSection('#gallery');
  });

  heroScrollBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    smoothScrollToSection('#stats');
  });

  // 5. TRUST STATISTICS BAR COUNT-UP ANIMATION (OPTIMIZED)
  const statCards = document.querySelectorAll('.stat-card');
  const easeOutQuad = (t) => t * (2 - t);

  const startCounter = (card) => {
    const counterSpan = card.querySelector('.counter');
    if (!counterSpan) return;
    
    const targetVal = parseFloat(card.getAttribute('data-stat-target'));
    const isDecimal = card.getAttribute('data-stat-decimal') === 'true';
    
    // Reduce animation duration on mobile
    const baseDuration = isMobileDevice() ? 800 : 1200;
    const duration = targetVal > 100 ? baseDuration * 1.5 : targetVal > 20 ? baseDuration : baseDuration * 0.8;
    
    let startTime = null;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const fraction = Math.min(progress / duration, 1);
      const currentVal = targetVal * easeOutQuad(fraction);
      
      counterSpan.textContent = isDecimal 
        ? currentVal.toFixed(1) 
        : Math.floor(currentVal).toLocaleString();

      if (fraction < 1) {
        requestAnimationFrame(animateCount);
      } else {
        counterSpan.textContent = isDecimal 
          ? targetVal.toFixed(1) 
          : targetVal.toLocaleString();
      }
    };

    requestAnimationFrame(animateCount);
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          statCards.forEach(card => {
            const targetVal = card.getAttribute('data-stat-target');
            const counterSpan = card.querySelector('.counter');
            if (counterSpan) counterSpan.textContent = targetVal;
          });
        } else {
          statCards.forEach(card => startCounter(card));
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // 6. SERVICES 3D TILT CARDS (DESKTOP ONLY)
  const serviceCards = document.querySelectorAll('.service-card');

  if (window.matchMedia('(min-width: 1025px)').matches) {
    serviceCards.forEach(card => {
      const cardInner = card.querySelector('.card-inner');
      if (!cardInner) return;
      
      card.addEventListener('mousemove', (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const rect = card.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const cardWidth = rect.width;
        const cardHeight = rect.height;
        const cardCenterX = cardWidth / 2;
        const cardCenterY = cardHeight / 2;
        
        const rotateY = ((mouseX - cardCenterX) / cardWidth) * 12;
        const rotateX = -((mouseY - cardCenterY) / cardHeight) * 12;
        
        cardInner.style.transition = 'transform 0.1s ease';
        cardInner.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        cardInner.style.transition = 'transform 0.5s ease';
        cardInner.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      });
    });
  } else {
    // Mobile: disable tilt, just add subtle shadow on touch
    serviceCards.forEach(card => {
      card.addEventListener('touchstart', () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
      });
      card.addEventListener('touchend', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }

  // 7. BEFORE/AFTER SLIDER COMPARISON WIDGETS (MOBILE OPTIMIZED)
  const comparisonSliders = document.querySelectorAll('.comparison-slider');

  comparisonSliders.forEach(slider => {
    let isDragging = false;

    const updateSliderPosition = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      let percentage = (relativeX / rect.width) * 100;
      percentage = Math.max(5, Math.min(95, percentage));
      
      slider.style.setProperty('--slider-pct', `${percentage}%`);
      
      const handle = slider.querySelector('.slider-handle');
      if (handle) {
        handle.setAttribute('aria-valuenow', Math.round(percentage));
      }
    };

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      slider.classList.add('dragging');
      updateSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) updateSliderPosition(e.clientX);
    }, { passive: true });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      slider.classList.remove('dragging');
    });

    // Touch events with better mobile support
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      slider.classList.add('dragging');
      updateSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches[0]) {
        updateSliderPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
      slider.classList.remove('dragging');
    });
  });

  // 8. APPOINTMENT FORM VALIDATION (OPTIMIZED)
  const appointmentForm = document.getElementById('appointmentForm');
  if (!appointmentForm) return; // Exit if form doesn't exist
  
  const successCard = document.getElementById('successCard');
  const formContainer = document.getElementById('formContainer');
  const preferredDateInput = document.getElementById('preferredDate');

  if (preferredDateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    preferredDateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  const validateField = (inputElement) => {
    const wrapper = inputElement.closest('.input-wrapper');
    if (!wrapper) return true;

    let isValid = true;
    
    if (inputElement.hasAttribute('required') && !inputElement.value.trim()) {
      isValid = false;
    }

    if (isValid && inputElement.id === 'phoneNumber') {
      const phoneVal = inputElement.value.replace(/\D/g, '');
      if (phoneVal.length !== 10) {
        isValid = false;
      }
    }

    if (isValid && inputElement.id === 'emailAddress' && inputElement.value.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputElement.value.trim())) {
        isValid = false;
      }
    }

    if (isValid && inputElement.id === 'preferredDate') {
      const selectedDate = new Date(inputElement.value);
      selectedDate.setHours(0,0,0,0);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (selectedDate < today) {
        isValid = false;
      }
    }

    wrapper.classList.toggle('invalid', !isValid);
    return isValid;
  };

  const inputs = appointmentForm.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      const wrapper = input.closest('.input-wrapper');
      if (wrapper?.classList.contains('invalid')) {
        validateField(input);
      }
    });
  });

  appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    if (isFormValid && formContainer && successCard) {
      const clientName = document.getElementById('fullName')?.value || '';
      const clientService = document.getElementById('serviceSelect')?.options[document.getElementById('serviceSelect').selectedIndex]?.text || '';
      const clientDateStr = document.getElementById('preferredDate')?.value || '';
      
      formContainer.style.display = 'none';
      successCard.style.display = 'flex';

      const calendarBtn = document.getElementById('calendarBtn');
      if (calendarBtn) {
        calendarBtn.addEventListener('click', () => {
          const title = encodeURIComponent(`SmileArc Dental Studio Appointment - ${clientService}`);
          const details = encodeURIComponent(`Free Dental Consultation for ${clientName} with Dr. Aryan Mehta.`);
          const locationStr = encodeURIComponent("123 Civil Lines, Bhopal MP 462001");
          const formattedDate = clientDateStr.replace(/-/g, '');
          const dateSpan = `${formattedDate}T100000Z/${formattedDate}T110000Z`;

          const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${locationStr}&dates=${dateSpan}`;
          window.open(gCalUrl, '_blank');
        });
      }
    }
  });

  // 9. FAQ ACCORDION ACTIONS
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const faqItem = header.closest('.faq-item');
      const faqContent = faqItem?.querySelector('.faq-content');
      if (!faqContent) return;
      
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      faqHeaders.forEach(otherHeader => {
        if (otherHeader !== header) {
          otherHeader.setAttribute('aria-expanded', 'false');
          const otherContent = otherHeader.closest('.faq-item')?.querySelector('.faq-content');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      if (isExpanded) {
        header.setAttribute('aria-expanded', 'false');
        faqContent.style.maxHeight = null;
      } else {
        header.setAttribute('aria-expanded', 'true');
        faqContent.style.maxHeight = `${faqContent.scrollHeight}px`;
      }
    });
  });

  // 10. LIVE INDIAN STANDARD TIME OPEN HOURS STATUS
  const updateLiveHoursStatus = () => {
    const liveStatusText = document.getElementById('liveStatusText');
    const liveStatusContainer = document.getElementById('liveStatusContainer');
    if (!liveStatusText || !liveStatusContainer) return;

    const statusDot = liveStatusContainer.querySelector('.status-dot');
    if (!statusDot) return;

    const options = { timeZone: 'Asia/Kolkata', hour12: false };
    const formatter = new Intl.DateTimeFormat('en-US', {
      ...options,
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric'
    });

    const parts = formatter.formatToParts(new Date());
    let weekday = '';
    let hour = 0;
    let minute = 0;

    parts.forEach(part => {
      if (part.type === 'weekday') weekday = part.value;
      if (part.type === 'hour') hour = parseInt(part.value, 10);
      if (part.type === 'minute') minute = parseInt(part.value, 10);
    });

    const currentMinuteOfDay = hour * 60 + minute;
    let isOpen = false;
    let nextOpenMsg = '';

    if (weekday === 'Sunday') {
      const openStart = 10 * 60;
      const openEnd = 15 * 60;
      if (currentMinuteOfDay >= openStart && currentMinuteOfDay < openEnd) {
        isOpen = true;
      } else if (currentMinuteOfDay < openStart) {
        nextOpenMsg = 'Opens at 10:00 AM today';
      } else {
        nextOpenMsg = 'Opens tomorrow at 9:00 AM';
      }
    } else {
      const openStart = 9 * 60;
      const openEnd = 20 * 60;
      if (currentMinuteOfDay >= openStart && currentMinuteOfDay < openEnd) {
        isOpen = true;
      } else if (currentMinuteOfDay < openStart) {
        nextOpenMsg = 'Opens at 9:00 AM today';
      } else {
        nextOpenMsg = weekday === 'Saturday' ? 'Opens tomorrow at 10:00 AM' : 'Opens tomorrow at 9:00 AM';
      }
    }

    statusDot.classList.toggle('closed', !isOpen);
    liveStatusText.textContent = isOpen ? 'Open Now' : (nextOpenMsg || 'Closed Now');
  };

  updateLiveHoursStatus();
  setInterval(updateLiveHoursStatus, 30000);

  // 11. SCROLL-TO-TOP BUTTON (OPTIMIZED)
  const scrollToTopBtn = document.getElementById('scrollToTop');
  
  const updateScrollTopVisibility = throttle(() => {
    if (scrollToTopBtn) {
      scrollToTopBtn.classList.toggle('visible', window.scrollY > 500);
    }
  }, 100);

  window.addEventListener('scroll', updateScrollTopVisibility, { passive: true });

  scrollToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 12. COOKIE CONSENT BANNER
  const cookieConsent = document.getElementById('cookieConsent');
  const cookieAcceptBtn = document.getElementById('cookieAcceptBtn');
  const cookieManageBtn = document.getElementById('cookieManageBtn');

  const cookiesAccepted = localStorage.getItem('cookies-accepted');
  if (!cookiesAccepted && cookieConsent) {
    setTimeout(() => {
      cookieConsent.classList.add('visible');
      cookieConsent.setAttribute('aria-hidden', 'false');
    }, 100);
  }

  const dismissCookieConsent = () => {
    if (cookieConsent) {
      cookieConsent.classList.remove('visible');
      cookieConsent.setAttribute('aria-hidden', 'true');
      localStorage.setItem('cookies-accepted', 'true');
    }
  };

  cookieAcceptBtn?.addEventListener('click', dismissCookieConsent);
  cookieManageBtn?.addEventListener('click', dismissCookieConsent);

});
