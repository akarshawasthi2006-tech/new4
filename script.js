/* ==========================================================================
   DENTAL WEBSITE INTERACTIVE SCRIPT
   SmileArc Dental Studio — Dr. Aryan Mehta
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. STICKY NAVIGATION SCROLL STATE & ACTIVE LINK TRIGGER
  const mainHeader = document.getElementById('mainHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  const handleHeaderScroll = () => {
    if (window.scrollY > 80) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  };

  const highlightNavLink = () => {
    let scrollPos = window.scrollY + 120; // offset for sticky nav
    
    sections.forEach(section => {
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
      }
    });

    // Special case for top of the page
    if (window.scrollY < 80) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#') {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', () => {
    handleHeaderScroll();
    highlightNavLink();
  });
  // Trigger on load once
  handleHeaderScroll();
  highlightNavLink();

  // 2. MOBILE DRAWER NAVIGATION MENU
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const toggleMobileMenu = () => {
    const isOpen = mobileDrawer.classList.contains('open');
    mobileMenuToggle.classList.toggle('active');
    mobileDrawer.classList.toggle('open');
    mobileDrawer.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    document.body.style.overflow = isOpen ? '' : 'hidden'; // Lock body scroll when drawer open
  };

  mobileMenuToggle.addEventListener('click', toggleMobileMenu);

  // Close drawer when a mobile nav link is clicked
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // 3. HERO HERO COLUMN SCROLL PARALLAX
  const heroImg = document.querySelector('.hero-img');
  
  if (heroImg && window.matchMedia('(min-width: 769px)').matches) {
    window.addEventListener('scroll', () => {
      // Check if reduced motion is preferred
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const scrollPos = window.scrollY;
      // Parallax translateY factor of 0.3
      const yOffset = scrollPos * 0.3;
      // Slight scale to prevent edge revealing
      heroImg.style.transform = `translateY(${yOffset}px) scale(1.02)`;
    });
  }

  // Smooth scroll for See Transformations and Scroll Chevron
  const heroSecBtn = document.getElementById('heroSecBtn');
  const heroScrollBtn = document.querySelector('.hero-scroll-btn');

  const smoothScrollToSection = (targetId) => {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const targetPos = targetElement.offsetTop - 70; // Header offset
      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    }
  };

  if (heroSecBtn) {
    heroSecBtn.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollToSection('#gallery');
    });
  }

  if (heroScrollBtn) {
    heroScrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollToSection('#stats');
    });
  }

  // 4. TRUST STATISTICS BAR COUNT-UP ANIMATION
  const statCards = document.querySelectorAll('.stat-card');
  
  // easeOutQuad animation function
  const easeOutQuad = (t) => t * (2 - t);

  const startCounter = (card) => {
    const counterSpan = card.querySelector('.counter');
    const targetVal = parseFloat(card.getAttribute('data-stat-target'));
    const isDecimal = card.getAttribute('data-stat-decimal') === 'true';
    const duration = targetVal > 100 ? 2000 : targetVal > 20 ? 1500 : 1000;
    
    let startTime = null;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const fraction = Math.min(progress / duration, 1);
      
      const currentVal = targetVal * easeOutQuad(fraction);
      
      if (isDecimal) {
        counterSpan.textContent = currentVal.toFixed(1);
      } else {
        counterSpan.textContent = Math.floor(currentVal).toLocaleString();
      }

      if (fraction < 1) {
        requestAnimationFrame(animateCount);
      } else {
        // Force exact end value
        if (isDecimal) {
          counterSpan.textContent = targetVal.toFixed(1);
        } else {
          counterSpan.textContent = targetVal.toLocaleString();
        }
      }
    };

    requestAnimationFrame(animateCount);
  };

  // Observe statistics grid for scroll in view
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // If reduced motion is preferred, just show numbers instantly
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          statCards.forEach(card => {
            const targetVal = card.getAttribute('data-stat-target');
            card.querySelector('.counter').textContent = targetVal;
          });
        } else {
          statCards.forEach(card => startCounter(card));
        }
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // 5. SERVICES 3D TILT CARDS
  const serviceCards = document.querySelectorAll('.service-card');

  if (window.matchMedia('(min-width: 1025px)').matches) {
    serviceCards.forEach(card => {
      const cardInner = card.querySelector('.card-inner');
      
      card.addEventListener('mousemove', (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const rect = card.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const cardWidth = rect.width;
        const cardHeight = rect.height;
        
        const cardCenterX = cardWidth / 2;
        const cardCenterY = cardHeight / 2;
        
        // Max tilt of 12 degrees
        const rotateY = ((mouseX - cardCenterX) / cardWidth) * 12;
        const rotateX = -((mouseY - cardCenterY) / cardHeight) * 12;
        
        cardInner.style.transition = 'transform 0.1s ease'; // Fast response during movement
        cardInner.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        cardInner.style.transition = 'transform 0.5s ease'; // Smooth slow reset
        cardInner.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }

  // 6. BEFORE/AFTER SLIDER COMPARISON WIDGETS
  const comparisonSliders = document.querySelectorAll('.comparison-slider');

  comparisonSliders.forEach(slider => {
    let isDragging = false;

    const updateSliderPosition = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      let percentage = (relativeX / rect.width) * 100;
      
      // Clamp values between 5% and 95%
      percentage = Math.max(5, Math.min(95, percentage));
      
      slider.style.setProperty('--slider-pct', `${percentage}%`);
      
      // Accessibility update aria-valuenow
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
      if (!isDragging) return;
      updateSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        slider.classList.remove('dragging');
      }
    });

    // Touch events for mobile screens
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      slider.classList.add('dragging');
      updateSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      updateSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        slider.classList.remove('dragging');
      }
    });
  });

  // 7. APPOINTMENT FORM APIS AND FLOATING LABELS VALIDATION
  const appointmentForm = document.getElementById('appointmentForm');
  const successCard = document.getElementById('successCard');
  const formContainer = document.getElementById('formContainer');
  const preferredDateInput = document.getElementById('preferredDate');

  // Set min date constraint for Preferred Date to today
  if (preferredDateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    preferredDateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  // Live validator checks input focus out
  const validateField = (inputElement) => {
    const wrapper = inputElement.closest('.input-wrapper');
    if (!wrapper) return true;

    let isValid = true;
    
    // Required check
    if (inputElement.hasAttribute('required')) {
      if (!inputElement.value.trim()) {
        isValid = false;
      }
    }

    // Phone 10 digits check
    if (isValid && inputElement.id === 'phoneNumber') {
      const phoneVal = inputElement.value.replace(/\D/g, ''); // strip formats
      if (phoneVal.length !== 10) {
        isValid = false;
      }
    }

    // Email regex validation
    if (isValid && inputElement.id === 'emailAddress' && inputElement.value.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputElement.value.trim())) {
        isValid = false;
      }
    }

    // Date today or future check
    if (isValid && inputElement.id === 'preferredDate') {
      const selectedDate = new Date(inputElement.value);
      selectedDate.setHours(0,0,0,0);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (selectedDate < today) {
        isValid = false;
      }
    }

    if (!isValid) {
      wrapper.classList.add('invalid');
    } else {
      wrapper.classList.remove('invalid');
    }

    return isValid;
  };

  const inputs = appointmentForm.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });

    input.addEventListener('input', () => {
      // Remove invalid class instantly if they start correcting details
      const wrapper = input.closest('.input-wrapper');
      if (wrapper && wrapper.classList.contains('invalid')) {
        validateField(input);
      }
    });
  });

  // Handle Form submit
  appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;
    inputs.forEach(input => {
      const isFieldValid = validateField(input);
      if (!isFieldValid) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      // Collect values for calendar add option
      const clientName = document.getElementById('fullName').value;
      const clientService = document.getElementById('serviceSelect').options[document.getElementById('serviceSelect').selectedIndex].text;
      const clientDateStr = document.getElementById('preferredDate').value;
      
      // Transite layouts to success
      formContainer.style.display = 'none';
      successCard.style.display = 'flex';

      // Setup Add to Calendar handler
      const calendarBtn = document.getElementById('calendarBtn');
      calendarBtn.addEventListener('click', () => {
        const title = encodeURIComponent(`SmileArc Dental Studio Appointment - ${clientService}`);
        const details = encodeURIComponent(`Free Dental Consultation for ${clientName} with Dr. Aryan Mehta.`);
        const locationStr = encodeURIComponent("123 Civil Lines, Bhopal MP 462001");
        
        // Convert YYYY-MM-DD to YYYYMMDD
        const formattedDate = clientDateStr.replace(/-/g, '');
        const dateSpan = `${formattedDate}T100000Z/${formattedDate}T110000Z`; // Default 10 AM to 11 AM UTC

        const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${locationStr}&dates=${dateSpan}`;
        window.open(gCalUrl, '_blank');
      });
    }
  });

  // 8. FAQ ACCORDION ACTIONS
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const faqItem = header.closest('.faq-item');
      const faqContent = faqItem.querySelector('.faq-content');
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // Accordion mode: close other items first
      faqHeaders.forEach(otherHeader => {
        if (otherHeader !== header) {
          otherHeader.setAttribute('aria-expanded', 'false');
          otherHeader.closest('.faq-item').querySelector('.faq-content').style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isExpanded) {
        header.setAttribute('aria-expanded', 'false');
        faqContent.style.maxHeight = null;
      } else {
        header.setAttribute('aria-expanded', 'true');
        faqContent.style.maxHeight = `${faqContent.scrollHeight}px`;
      }
    });
  });

  // 9. LIVE INDIAN STANDARD TIME OPEN HOURS STATUS
  const updateLiveHoursStatus = () => {
    const liveStatusText = document.getElementById('liveStatusText');
    const liveStatusContainer = document.getElementById('liveStatusContainer');
    if (!liveStatusText || !liveStatusContainer) return;

    const statusDot = liveStatusContainer.querySelector('.status-dot');

    // Fetch Date and Time in Indian Standard Time (IST - Asia/Kolkata)
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
      const openStart = 10 * 60; // 10:00 AM
      const openEnd = 15 * 60;   // 3:00 PM
      if (currentMinuteOfDay >= openStart && currentMinuteOfDay < openEnd) {
        isOpen = true;
      } else if (currentMinuteOfDay < openStart) {
        nextOpenMsg = 'Opens at 10:00 AM today';
      } else {
        nextOpenMsg = 'Opens tomorrow at 9:00 AM';
      }
    } else {
      // Monday - Saturday
      const openStart = 9 * 60;  // 9:00 AM
      const openEnd = 20 * 60;   // 8:00 PM
      if (currentMinuteOfDay >= openStart && currentMinuteOfDay < openEnd) {
        isOpen = true;
      } else if (currentMinuteOfDay < openStart) {
        nextOpenMsg = 'Opens at 9:00 AM today';
      } else {
        // After 8:00 PM
        if (weekday === 'Saturday') {
          nextOpenMsg = 'Opens tomorrow at 10:00 AM';
        } else {
          nextOpenMsg = 'Opens tomorrow at 9:00 AM';
        }
      }
    }

    if (isOpen) {
      statusDot.classList.remove('closed');
      liveStatusText.textContent = 'Open Now';
    } else {
      statusDot.classList.add('closed');
      liveStatusText.textContent = nextOpenMsg || 'Closed Now';
    }
  };

  updateLiveHoursStatus();
  // Refresh status check every 30 seconds
  setInterval(updateLiveHoursStatus, 30000);

  // 10. SCROLL-TO-TOP BUTTON
  const scrollToTopBtn = document.getElementById('scrollToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 11. COOKIE CONSENT BANNER INTERACTION
  const cookieConsent = document.getElementById('cookieConsent');
  const cookieAcceptBtn = document.getElementById('cookieAcceptBtn');
  const cookieManageBtn = document.getElementById('cookieManageBtn');

  // Verify accepted flag in localStorage
  const cookiesAccepted = localStorage.getItem('cookies-accepted');
  if (!cookiesAccepted) {
    // Show banner after 100ms delay
    setTimeout(() => {
      cookieConsent.classList.add('visible');
      cookieConsent.setAttribute('aria-hidden', 'false');
    }, 100);
  }

  const dismissCookieConsent = () => {
    cookieConsent.classList.remove('visible');
    cookieConsent.setAttribute('aria-hidden', 'true');
    localStorage.setItem('cookies-accepted', 'true');
  };

  if (cookieAcceptBtn) {
    cookieAcceptBtn.addEventListener('click', dismissCookieConsent);
  }

  if (cookieManageBtn) {
    cookieManageBtn.addEventListener('click', dismissCookieConsent); // Accept all in simple mock mode
  }

});

