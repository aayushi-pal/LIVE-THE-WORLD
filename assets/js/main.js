/**
 * LIVE THE WORLD - Main Interactive Script
 * Header scroll state, Popular Destinations & Interactive Controls
 */

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
        showToast('Playing Adventure Video: Live The World');
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
    toast.innerHTML = `<i class="fa-solid fa-mountain" style="color: var(--color-travlla-lime); font-size: 1.3rem;"></i> <span>${msg}</span>`;
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
      heroTrack.style.transition = 'transform 0.9s cubic-bezier(0.25, 1, 0.35, 1)';
    } else {
      heroTrack.style.transition = 'none';
    }
    heroTrack.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
  }

  function nextSlide() {
    if (isSliding || !heroTrack) return;
    isSliding = true;
    currentIndex++;
    moveToSlide(currentIndex, true);

    // If reached the cloned first slide (index 3)
    if (currentIndex >= totalUniqueSlides) {
      setTimeout(() => {
        // Instant reset back to original first slide without visual stutter
        moveToSlide(0, false);
        void heroTrack.offsetWidth; // force browser layout recalculation
        isSliding = false;
      }, 920);
    } else {
      setTimeout(() => {
        isSliding = false;
      }, 920);
    }
  }

  function prevSlide() {
    if (isSliding || !heroTrack) return;
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
    }, 920);
  }

  function startHeroAutoPlay() {
    stopHeroAutoPlay();
    // Continuous right-to-left movement every 2.8 seconds, never pausing
    heroAutoTimer = setInterval(nextSlide, 2800);
  }

  function stopHeroAutoPlay() {
    if (heroAutoTimer) {
      clearInterval(heroAutoTimer);
      heroAutoTimer = null;
    }
  }

  if (heroSliderWrap && heroTrack) {
    // Touch swipe support for mobile viewports
    let touchStartX = 0;
    let touchEndX = 0;

    heroSliderWrap.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSliderWrap.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextSlide();
        startHeroAutoPlay();
      } else if (touchEndX - touchStartX > 50) {
        prevSlide();
        startHeroAutoPlay();
      }
    }, { passive: true });

    // Start hero auto sliding continuously right to left without pausing
    startHeroAutoPlay();
  }

  // --- 9. TOUR PACKAGES FILTER BUTTONS INTERACTION ---
  const tourFilterBtns = document.querySelectorAll('.tour-filter-btn');
  tourFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tourFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});

