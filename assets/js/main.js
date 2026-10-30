/**
 * LIVES THE WORLD - Main Interactive Script
 * Header scroll state, Popular Destinations & Interactive Controls
 */

// --- 0. CLEAN URLS: REMOVE .html EXTENSION FROM ADDRESS BAR ---
(function cleanUrlExtension() {
  try {
    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
      var path = window.location.pathname;
      var search = window.location.search || '';
      var hash = window.location.hash || '';

      if (path.endsWith('/index.html')) {
        var clean = path.slice(0, -10) || '/';
        window.history.replaceState(null, '', clean + search + hash);
      } else if (path === '/index.html' || path === 'index.html') {
        window.history.replaceState(null, '', '/' + search + hash);
      } else if (path.endsWith('.html')) {
        var clean = path.slice(0, -5);
        window.history.replaceState(null, '', clean + search + hash);
      }
    }
  } catch (err) {
    // Graceful fallback for any strict security sandbox
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const siteHeader = document.getElementById('siteHeader');

  // --- 1. NAVBAR TRANSFORMATION ON SCROLL (EXACT AS SCREENSHOT) ---
  function handleScroll() {
    if (window.scrollY > 50) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Trigger initial check

  // --- 3. NAV ACTIVE STATE ON CLICK ---
  const navLinks = document.querySelectorAll('.main-nav .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
  // --- 4. MOBILE NAVIGATION DRAWER CONTROLLER ---
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileClose = document.getElementById('mobileNavClose');
  const mainNav = document.getElementById('mainNav');
  const mobileBackdrop = document.getElementById('mobileNavBackdrop');

  function openMobileNav() {
    mainNav?.classList.add('mobile-open');
    mobileToggle?.classList.add('is-active');
    mobileToggle?.setAttribute('aria-expanded', 'true');
    mobileBackdrop?.classList.add('show');
    document.body.classList.add('nav-drawer-open');
  }

  function closeMobileNav() {
    mainNav?.classList.remove('mobile-open');
    mobileToggle?.classList.remove('is-active');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    mobileBackdrop?.classList.remove('show');
    document.body.classList.remove('nav-drawer-open');
  }

  mobileToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mainNav?.classList.contains('mobile-open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  mobileClose?.addEventListener('click', closeMobileNav);
  mobileBackdrop?.addEventListener('click', closeMobileNav);

  // Close when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileNav();
    }
  });

  // --- 6. ADVENTURE VIDEO PLAY / PAUSE CONTROLLER ---
  const video = document.getElementById('adventureHeroVideo');
  const playBtn = document.getElementById('videoPlayPauseBtn');
  const videoCard = document.getElementById('videoBannerCard');
  const controlIcon = document.getElementById('videoControlIcon');

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      const isCurrentlyPlaying = videoCard?.classList.contains('is-playing');

      if (!isCurrentlyPlaying) {
        // Start playback
        if (video) {
          video.play().catch(() => {
            // Audio/autoplay policy catch - mute and retry
            video.muted = true;
            video.play().catch(() => { });
          });
        }
        videoCard?.classList.add('is-playing');
        playBtn.classList.add('is-playing');
        playBtn.setAttribute('aria-label', 'Pause Video');
        playBtn.setAttribute('title', 'Pause Video');
        if (controlIcon) {
          controlIcon.className = 'fa-solid fa-pause play-icon';
        }
        showToast('Playing Adventure Video: Lives The World');
      } else {
        // Pause playback
        if (video) {
          video.pause();
        }
        videoCard?.classList.remove('is-playing');
        playBtn.classList.remove('is-playing');
        playBtn.setAttribute('aria-label', 'Play Video');
        playBtn.setAttribute('title', 'Play Video');
        if (controlIcon) {
          controlIcon.className = 'fa-solid fa-play play-icon';
        }
        showToast('Video Paused');
      }
    });
  }

  // --- 7. TOAST NOTIFICATION UTILITY ---
  function showToast(msg) {
    let toast = document.getElementById('toastNotice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-mountain" style="color: var(--color-ltw-gold); font-size: 1.3rem;"></i> <span>${msg}</span>`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  // --- 8. HERO BANNER HORIZONTAL SLIDER (RIGHT TO LEFT) ---
  const heroTrack = document.getElementById('heroSliderTrack');
  const heroSliderWrap = document.getElementById('heroSlider');
  const totalUniqueSlides = 3; // Manali, Shimla, Parvati Valley (+ clone Manali)
  let currentIndex = 0;
  let heroAutoTimer = null;
  let isSliding = false;

  function moveToSlide(index, animate = true) {
    if (!heroTrack) return;
    if (animate) {
      heroTrack.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.35, 1)';
    } else {
      heroTrack.style.transition = 'none';
    }
    heroTrack.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
  }

  function nextSlide() {
    if (!heroTrack) return;
    if (isSliding) return;
    isSliding = true;
    currentIndex++;
    moveToSlide(currentIndex, true);

    // If reached the cloned first slide (index 3), seamlessly reset to index 0
    if (currentIndex >= totalUniqueSlides) {
      setTimeout(() => {
        moveToSlide(0, false);
        void heroTrack.offsetWidth; // force browser layout recalculation
        isSliding = false;
      }, 420);
    } else {
      setTimeout(() => {
        isSliding = false;
      }, 420);
    }
  }

  function prevSlide() {
    if (!heroTrack) return;
    if (isSliding) return;
    isSliding = true;
    if (currentIndex <= 0) {
      moveToSlide(totalUniqueSlides, false);
      void heroTrack.offsetWidth;
      currentIndex = totalUniqueSlides - 1;
      moveToSlide(currentIndex, true);
    } else {
      currentIndex--;
      moveToSlide(currentIndex, true);
    }
    setTimeout(() => {
      isSliding = false;
    }, 420);
  }

  function startHeroAutoPlay() {
    stopHeroAutoPlay();
    // Fast and continuous 1.8s auto-slider interval
    heroAutoTimer = setInterval(nextSlide, 1800);
  }

  function stopHeroAutoPlay() {
    if (heroAutoTimer) {
      clearInterval(heroAutoTimer);
      heroAutoTimer = null;
    }
  }

  if (heroTrack) {
    // Start hero auto sliding immediately and continuously
    startHeroAutoPlay();

    // Auto-restart when browser tab is focused again
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopHeroAutoPlay();
      } else {
        startHeroAutoPlay();
      }
    });

    // Touch swipe support for mobile viewports
    let touchStartX = 0;
    let touchEndX = 0;

    heroSliderWrap?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSliderWrap?.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextSlide();
        startHeroAutoPlay();
      } else if (touchEndX - touchStartX > 50) {
        prevSlide();
        startHeroAutoPlay();
      }
    }, { passive: true });
  }

  // --- 9. TOUR PACKAGES FILTER BUTTONS INTERACTION ---
  const tourFilterBtns = document.querySelectorAll('.tour-filter-btn');
  const tourCards = document.querySelectorAll('.tour-card-pkg');
  const tourCountDisplay = document.getElementById('tourCountDisplay');

  tourFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tourFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter || 'all';
      let visibleCount = 0;

      tourCards.forEach(card => {
        const cat = card.dataset.category || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = '';
          setTimeout(() => { card.style.opacity = '1'; }, 20);
          visibleCount++;
        } else {
          card.style.opacity = '0';
          card.style.display = 'none';
        }
      });

      if (tourCountDisplay) {
        tourCountDisplay.textContent = filter === 'all'
          ? `Showing all 6 Premium Itineraries`
          : `Showing ${visibleCount} Matching Itinerar${visibleCount === 1 ? 'y' : 'ies'}`;
      }
    });
  });

  // --- 9A. DESTINATIONS FILTER CONTROLLER ---
  const destFilterBtns = document.querySelectorAll('.dest-filter-btn');
  const destCards = document.querySelectorAll('.dest-card');

  destFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      destFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.dest || 'all';

      destCards.forEach(card => {
        const destCat = card.dataset.dest || '';
        if (filter === 'all' || destCat === filter) {
          card.style.display = '';
          setTimeout(() => { card.style.opacity = '1'; }, 20);
        } else {
          card.style.opacity = '0';
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 9B. CONTACT FORM SUBMISSION FEEDBACK ---
  const contactForm = document.querySelector('.contact-main-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! Your trip inquiry has been sent. Our team will contact your mobile number shortly.');
      contactForm.reset();
    });
  }

  // --- 10. TESTIMONIAL SHOWCASE CONTROLLER ---
  const testimonials = [
    {
      name: 'Kevin Martin',
      role: 'Customer',
      photo: 'assets/images/testimonial-reviewer-main.jpg',
      quote: 'Lives The World curated the most unforgettable trip for our family to Manali and Parvati Valley! From cozy wooden cottages to picturesque riverside trails and expert local mountain guides, every single detail was handled with care.'
    },
    {
      name: 'Rohit Verma',
      role: 'Customer',
      photo: 'assets/images/testimonial-thumb-2.jpg',
      quote: 'Climbing the snowline ridge of Triund and watching the sunset above the clouds was an ethereal experience. The Lives The World team provided top-notch camping gear, warm mountain meals, and safe certified guides!'
    },
    {
      name: 'Zeynep Kaya',
      role: 'Customer',
      photo: 'assets/images/testimonial-thumb-3.jpg',
      quote: 'The Himachal winter expedition was beyond words! The hot sulfur springs of Manikaran, pine trails in Tosh, and paragliding above Solang Valley made this my favorite trip of all time. Truly 5-star service!'
    },
    {
      name: 'Vikram & Priya Sharma',
      role: 'Customer',
      photo: 'assets/images/reviewer-vikram-priya.jpg',
      quote: 'Our Shimla and Manali vacation felt straight out of a fairy tale! The team arranged a luxury private Innova Crysta, scenic riverside dining in Kasol, and exhilarating tandem paragliding at Solang. Exceptional hospitality throughout!'
    },
    {
      name: 'Ananya Iyer',
      role: 'Customer',
      photo: 'assets/images/reviewer-ananya.jpg',
      quote: 'Booking the Spiti Valley circuit with Lives The World was the best travel decision! From high-altitude homestays in Langza to visiting the world’s highest post office in Hikkim, everything was smooth and safe. Our mountain driver was courteous and highly experienced!'
    },
    {
      name: 'Rajesh Patel',
      role: 'Customer',
      photo: 'assets/images/reviewer-rajesh.jpg',
      quote: 'Traveling with elderly parents can be challenging, but Lives The World took care of every single comfort on our 7-day Himachal family holiday. Clean tempo traveller, prompt chauffeurs, and great hotel selections with snow-peak views. Highly recommended!'
    }
  ];

  let activeTIndex = 0;
  const tPhoto = document.getElementById('mainReviewerPhoto');
  const tName = document.getElementById('tAuthorName');
  const tRole = document.getElementById('tAuthorRole');
  const tText = document.getElementById('tReviewText');
  const tThumbs = document.querySelectorAll('.thumb-avatar-item');
  const tPrev = document.getElementById('tPrevBtn');
  const tNext = document.getElementById('tNextBtn');

  function updateTestimonial(index) {
    if (index < 0) index = testimonials.length - 1;
    if (index >= testimonials.length) index = 0;
    activeTIndex = index;
    const item = testimonials[activeTIndex];

    if (tPhoto) {
      tPhoto.style.opacity = '0';
      setTimeout(() => {
        tPhoto.src = item.photo;
        tPhoto.style.opacity = '1';
      }, 150);
    }

    if (tText) {
      tText.style.opacity = '0';
      setTimeout(() => {
        tText.textContent = item.quote;
        tText.style.opacity = '1';
      }, 150);
    }

    if (tName) tName.textContent = item.name;
    if (tRole) tRole.textContent = item.role;

    tThumbs.forEach((thumb, i) => {
      if (i === activeTIndex) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });
  }

  tPrev?.addEventListener('click', () => updateTestimonial(activeTIndex - 1));
  tNext?.addEventListener('click', () => updateTestimonial(activeTIndex + 1));

  tThumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => updateTestimonial(i));
  });

  // --- 11. FLEET VEHICLE ENQUIRY & TRIP SEARCH HANDLER ---
  const bookVehicleBtns = document.querySelectorAll('[data-book-vehicle]');
  bookVehicleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const vehicle = btn.dataset.bookVehicle || '';
      const driverSelectId = btn.dataset.driverId;
      const driverSelect = driverSelectId ? document.getElementById(driverSelectId) : null;
      const driver = driverSelect ? driverSelect.value : 'With driver';

      try {
        sessionStorage.setItem('preferredVehicle', vehicle);
        sessionStorage.setItem('preferredDriver', driver);
      } catch (err) { }

      window.location.href = `contact.html?vehicle=${encodeURIComponent(vehicle)}&driver=${encodeURIComponent(driver)}#contactForm`;
    });
  });

  const tripSearchFleet = document.getElementById('trip-search-fleet');
  if (tripSearchFleet) {
    tripSearchFleet.addEventListener('submit', (e) => {
      e.preventDefault();
      const dest = document.getElementById('fleet-where')?.value || 'Parvati Valley';
      const when = document.getElementById('fleet-when')?.value || '';
      const travelers = document.getElementById('fleet-travelers')?.value || '2 travellers';
      const msg = `Destination: ${dest}\nTravel Date: ${when}\nTravellers: ${travelers}`;

      try {
        sessionStorage.setItem('tripSearchMsg', msg);
      } catch (err) { }

      window.location.href = `contact.html?search=1#contactForm`;
    });
  }

  // Pre-fill contact form on contact.html if coming from Fleet or Trip Search
  const contactMsgField = document.querySelector('textarea[name="message"]');
  if (contactMsgField) {
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleParam = urlParams.get('vehicle');
    const driverParam = urlParams.get('driver');
    let prepopulated = '';

    if (vehicleParam) {
      prepopulated = `Vehicle Preference: ${vehicleParam}\nDriver Preference: ${driverParam || 'With driver'}\n`;
    } else {
      try {
        const storedMsg = sessionStorage.getItem('tripSearchMsg');
        if (storedMsg) {
          prepopulated = storedMsg + '\n';
          sessionStorage.removeItem('tripSearchMsg');
        }
      } catch (err) { }
    }

    if (prepopulated) {
      contactMsgField.value = prepopulated;
      const contactFormEl = document.getElementById('contactForm');
      if (contactFormEl) {
        setTimeout(() => {
          contactFormEl.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }

  // --- 12. GALLERY FULL IMAGE LIGHTBOX MODAL ---
  const lightboxModal = document.getElementById('galleryLightbox');
  if (lightboxModal) {
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxSub = document.getElementById('lightboxSub');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const closeBtn = document.getElementById('lightboxCloseBtn');
    const backdrop = document.getElementById('lightboxBackdrop');
    const prevBtn = document.getElementById('lightboxPrevBtn');
    const nextBtn = document.getElementById('lightboxNextBtn');

    // Collect all gallery items in the primary collage grid and sliders
    const galleryItems = Array.from(document.querySelectorAll('.gallery-collage-grid .gallery-item, .gallery-dual-slider-section .slider-strip-item:not([aria-hidden="true"])'));

    let currentIndex = 0;

    function openLightbox(index) {
      if (index < 0 || index >= galleryItems.length) return;
      currentIndex = index;
      const item = galleryItems[currentIndex];
      const img = item.querySelector('img');
      const title = item.querySelector('h4')?.textContent || item.querySelector('.slider-photo-caption')?.textContent || item.getAttribute('data-title') || 'Himalayan Expedition';
      const sub = item.querySelector('span:not(.slider-photo-caption)')?.textContent || 'Lives The World Memories';

      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || title;
      }
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxSub) lightboxSub.textContent = sub;
      if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;

      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lightboxImg) lightboxImg.src = '';
    }

    function showPrev() {
      const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      openLightbox(newIndex);
    }

    function showNext() {
      const newIndex = (currentIndex + 1) % galleryItems.length;
      openLightbox(newIndex);
    }

    galleryItems.forEach((item, idx) => {
      // Clicking the card or golden expand button
      item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(idx);
      });

      const expandBtn = item.querySelector('.gallery-expand-icon');
      if (expandBtn) {
        expandBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          openLightbox(idx);
        });
      }
    });

    closeBtn?.addEventListener('click', closeLightbox);
    backdrop?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  }

});
