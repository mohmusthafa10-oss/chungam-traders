/**
 * THE HUB CHUNGAM TRADERS - SECTIONS 1 TO 7 FRONTEND LOGIC
 */

// Configurable WhatsApp parameter (Keep as REPLACE_AFTER_CONFIRMATION until confirmed)
const WHATSAPP_NUMBER = "REPLACE_AFTER_CONFIRMATION";

document.addEventListener('DOMContentLoaded', () => {
  initMobileHeaderNav();
  initHeaderScroll();
  initCustomCursor();
  initHeroMaterialSwitcher();
  initScrollObserver();
  initImageFallbacks();
  initEnquiryButtons();
  initBrickVariantSelector();
  initContactCtaForm();
});

/**
 * Global Image Fallback System (Guarantees zero broken image icons or white boxes)
 */
function initImageFallbacks() {
  const fallbackSVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><rect width="100%" height="100%" fill="%23151515"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23C7A45B" font-family="sans-serif" font-size="16" letter-spacing="2">THE HUB CHUNGAM TRADERS</text></svg>';

  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      if (this.src !== fallbackSVG) {
        this.onerror = null;
        this.src = fallbackSVG;
        this.classList.add('img-fallback-active');
      }
    });
  });
}

/**
 * IntersectionObserver Section & Card Reveal System
 */
function initScrollObserver() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-group, .reveal-card').forEach(el => el.classList.add('revealed'));
    return;
  }

  // Tag headers and cards for observation
  document.querySelectorAll('.categories-header, .featured-header, .about-content-column, .contact-cta-info, .location-details-card, .location-map-panel').forEach(el => {
    el.classList.add('reveal-group');
  });

  document.querySelectorAll('.category-card, .product-card').forEach(el => {
    el.classList.add('reveal-card');
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal-group, .reveal-card').forEach(el => {
    observer.observe(el);
  });
}

function initMobileHeaderNav() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileNavPanel = document.getElementById('mobileNavPanel');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const mobileNavActions = document.querySelectorAll('.mobile-nav-actions a');

  if (!menuToggle || !mobileNavPanel) return;

  function toggleMobileMenu(forceState) {
    const isCurrentlyOpen = mobileNavPanel.classList.contains('open');
    const newState = forceState !== undefined ? forceState : !isCurrentlyOpen;

    mobileNavPanel.classList.toggle('open', newState);
    menuToggle.setAttribute('aria-expanded', newState ? 'true' : 'false');
    document.body.style.overflow = newState ? 'hidden' : '';
  }

  menuToggle.addEventListener('click', () => toggleMobileMenu());

  [...mobileNavLinks, ...mobileNavActions].forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavPanel.classList.contains('open')) {
      toggleMobileMenu(false);
      menuToggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && mobileNavPanel.classList.contains('open')) {
      toggleMobileMenu(false);
    }
  });
}

/**
 * Handle Header Scroll Styling (Changes background opacity/blur without height jump)
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Desktop Custom Cursor Indicator
 */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor || window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let isVisible = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isVisible) {
      isVisible = true;
      cursor.classList.add('visible');
    }
  });

  document.addEventListener('mouseleave', () => {
    isVisible = false;
    cursor.classList.remove('visible');
  });

  // Smooth movement loop
  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover state for interactive targets
  const interactiveSelectors = 'a, button, input, select, textarea, [role="button"]';
  document.querySelectorAll(interactiveSelectors).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

/**
 * Handle Catalogue ENQUIRE Button Click Actions
 */
function initEnquiryButtons() {
  const enquireButtons = document.querySelectorAll('.btn-enquire, .btn-brick-enquire');

  enquireButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productTitle = btn.getAttribute('data-product-title') || 'Decorative Material';
      const productCode = btn.getAttribute('data-product-code') || '';

      const fullProductName = productCode ? `${productCode} ${productTitle}` : productTitle;

      if (WHATSAPP_NUMBER !== "REPLACE_AFTER_CONFIRMATION" && WHATSAPP_NUMBER.trim() !== "") {
        const messageText = `Hello The Hub Chungam Traders,\n\nI would like to enquire about:\n\nProduct/Category: ${fullProductName}\n\nThank you.`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageText)}`, '_blank');
      } else {
        // Fallback to showroom email inquiry action
        const enquiryMail = `mailto:chungamtraders2018@gmail.com?subject=${encodeURIComponent('Enquiry for ' + fullProductName)}&body=${encodeURIComponent('Hello THE HUB CHUNGAM TRADERS,\n\nI am interested in inquiring about ' + fullProductName + '.\n\nPlease contact me with details.\n\nThank you.')}`;
        window.location.href = enquiryMail;
      }
    });
  });
}

/**
 * Handle Section 5 Decorative MDF Brick Variant Switching
 */
function initBrickVariantSelector() {
  const swatchButtons = document.querySelectorAll('.variant-swatch-btn');
  const previewFrame = document.getElementById('brickPreviewFrame');
  const previewName = document.getElementById('brickPreviewName');
  const brickEnquireBtn = document.getElementById('brickEnquireBtn');

  if (!swatchButtons.length || !previewFrame || !previewName || !brickEnquireBtn) return;

  const variantStyles = {
    'Red Brick': 'linear-gradient(135deg, #7A281B 0%, #42120B 100%)',
    'Rustic Brick': 'linear-gradient(135deg, #5C3224 0%, #30170F 100%)',
    'Rustic Gray': 'linear-gradient(135deg, #3A3D40 0%, #1F2124 100%)',
    'White Gray': 'linear-gradient(135deg, #9BA0A3 0%, #686D70 100%)',
    'Full White': 'linear-gradient(135deg, #E6E4DF 0%, #B8B6B0 100%)'
  };

  swatchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      swatchButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const variantName = btn.getAttribute('data-variant');
      if (variantName && variantStyles[variantName]) {
        previewName.textContent = variantName;
        previewFrame.style.background = variantStyles[variantName];
        brickEnquireBtn.textContent = `ENQUIRE FOR ${variantName.toUpperCase()}`;
        brickEnquireBtn.setAttribute('data-product-title', `Brick MDF Panel (${variantName})`);
      }
    });
  });
}

/**
 * Handle Section 7 Product Enquiry Form
 */
function initContactCtaForm() {
  const form = document.getElementById('productEnquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('enquiryName');
    const phoneInput = document.getElementById('enquiryPhone');
    const categorySelect = document.getElementById('enquiryCategory');
    const messageInput = document.getElementById('enquiryMessage');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const category = categorySelect ? categorySelect.value : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !phone || !category) {
      alert('Please fill in all required fields (Name, Phone, and Product/Category).');
      return;
    }

    // Build standard format message
    const formattedMessage = `Hello The Hub Chungam Traders,\n\nI would like to enquire about:\n\nProduct/Category: ${category}\nName: ${name}\nPhone: ${phone}\n\nMessage:\n${message || 'N/A'}\n\nThank you.`;

    if (WHATSAPP_NUMBER !== "REPLACE_AFTER_CONFIRMATION" && WHATSAPP_NUMBER.trim() !== "") {
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      // Direct Email Fallback Action
      const mailtoUrl = `mailto:chungamtraders2018@gmail.com?subject=${encodeURIComponent('Product Enquiry: ' + category)}&body=${encodeURIComponent(formattedMessage)}`;
      window.location.href = mailtoUrl;
    }
  });
}

/**
 * Section 02 Hero Dynamic Material Selector & Image Switcher
 */
function initHeroMaterialSwitcher() {
  const tabs = document.querySelectorAll('.hero-material-selector .material-tab');
  const heroImg = document.getElementById('heroMaterialImage');
  const heroVisualPanel = document.getElementById('hero-visual-panel');
  const floatingCard = document.getElementById('heroFloatingCard');
  const cardTitle = document.getElementById('cardMaterialTitle');
  const cardDesc = document.getElementById('cardMaterialDesc');

  if (!tabs.length || !heroImg || !floatingCard) return;

  function selectTab(selectedTab) {
    if (selectedTab.classList.contains('active')) return;

    tabs.forEach(tab => {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    });

    selectedTab.classList.add('active');
    selectedTab.setAttribute('aria-selected', 'true');

    if (heroVisualPanel && selectedTab.id) {
      heroVisualPanel.setAttribute('aria-labelledby', selectedTab.id);
    }

    const newImgSrc = selectedTab.getAttribute('data-img');
    const newAltText = selectedTab.getAttribute('data-alt');
    const newTitle = selectedTab.getAttribute('data-title');
    const newDesc = selectedTab.getAttribute('data-desc');

    // Trigger smooth fade & scale transition
    heroImg.classList.add('switching');
    floatingCard.classList.add('switching');

    setTimeout(() => {
      if (newImgSrc) heroImg.src = newImgSrc;
      if (newAltText) heroImg.alt = newAltText;
      if (newTitle && cardTitle) cardTitle.textContent = newTitle;
      if (newDesc && cardDesc) cardDesc.textContent = newDesc;

      heroImg.classList.remove('switching');
      floatingCard.classList.remove('switching');
    }, 150);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => selectTab(tab));

    // Desktop hover preview
    tab.addEventListener('mouseenter', () => {
      if (window.matchMedia('(min-width: 1024px) and (hover: hover)').matches) {
        selectTab(tab);
      }
    });

    // Keyboard selection (Enter / Space)
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectTab(tab);
      }
    });
  });
}
