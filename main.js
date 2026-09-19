/**
 * THE HUB CHUNGAM TRADERS - SECTIONS 1 TO 7 FRONTEND LOGIC
 */

// Configurable WhatsApp parameter (Confirmed phone number for direct enquiries)
const WHATSAPP_NUMBER = "918088729972";

document.addEventListener('DOMContentLoaded', () => {
  initMobileHeaderNav();
  initDesktopDropdownNav();
  initHeaderScroll();
  initCustomCursor();
  initHeroMaterialSwitcher();
  initScrollObserver();
  initImageFallbacks();
  initEnquiryButtons();
  initBrickVariantSelector();
  initContactCtaForm();
  initFaqAccordion();
  initHardwareFilters();
  initProductModal();
});

/**
 * Standardized Contextual WhatsApp URL Generator
 */
function getWhatsAppUrl(context = 'general', details = '') {
  let msg = "Hi, I would like to enquire about building materials available at The Hub Chungam Traders.";
  if (context === 'plywood') {
    msg = "Hi, I would like to enquire about plywood available at The Hub Chungam Traders.";
  } else if (context === 'classic') {
    msg = "Hi, I would like to enquire about Classic Plywood available at The Hub Chungam Traders.";
  } else if (context === 'hardware') {
    msg = "Hi, I would like to enquire about door locks and architectural hardware available at The Hub Chungam Traders.";
  } else if (context === 'panels') {
    msg = "Hi, I would like to enquire about decorative wall panels available at The Hub Chungam Traders.";
  } else if (context === 'flooring') {
    msg = "Hi, I would like to enquire about wood and laminate flooring available at The Hub Chungam Traders.";
  } else if (details) {
    msg = `Hi, I would like to enquire about ${details} available at The Hub Chungam Traders.`;
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/**
 * Desktop Dropdown Accessibility & Navigation
 */
function initDesktopDropdownNav() {
  const dropdownContainers = document.querySelectorAll('.desktop-dropdown-container');
  
  dropdownContainers.forEach(container => {
    const trigger = container.querySelector('.nav-link-dropdown');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      // Toggle dropdown open class for click/touch accessibility
      if (window.innerWidth < 1024) return;
      e.preventDefault();
      const isExpanded = container.classList.contains('open');
      container.classList.toggle('open', !isExpanded);
      trigger.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        container.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    container.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        container.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  });
}

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
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-sub-link');
  const mobileNavActions = document.querySelectorAll('.mobile-nav-actions a');
  const accordionToggle = document.getElementById('mobileMaterialsAccordionBtn');
  const accordionItem = document.getElementById('mobileMaterialsAccordion');

  if (!menuToggle || !mobileNavPanel) return;

  function toggleMobileMenu(forceState) {
    const isCurrentlyOpen = mobileNavPanel.classList.contains('open');
    const newState = forceState !== undefined ? forceState : !isCurrentlyOpen;

    mobileNavPanel.classList.toggle('open', newState);
    menuToggle.setAttribute('aria-expanded', newState ? 'true' : 'false');
    document.body.style.overflow = newState ? 'hidden' : '';
  }

  menuToggle.addEventListener('click', () => toggleMobileMenu());

  if (accordionToggle && accordionItem) {
    accordionToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = accordionItem.classList.contains('expanded');
      accordionItem.classList.toggle('expanded', !isExpanded);
      accordionToggle.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
    });
  }

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
 * Dynamic Architectural Brick SVG Pattern Generator
 */
function createBrickSvgPattern(brick1, brick2, brick3, mortar) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="64" viewBox="0 0 140 64">
    <rect width="140" height="64" fill="${mortar}"/>
    <g>
      <rect x="2" y="2" width="64" height="26" rx="2" fill="${brick1}"/>
      <rect x="2" y="2" width="64" height="2" fill="rgba(255,255,255,0.2)"/>
      <rect x="2" y="26" width="64" height="2" fill="rgba(0,0,0,0.35)"/>
      
      <rect x="72" y="2" width="64" height="26" rx="2" fill="${brick2}"/>
      <rect x="72" y="2" width="64" height="2" fill="rgba(255,255,255,0.2)"/>
      <rect x="72" y="26" width="64" height="2" fill="rgba(0,0,0,0.35)"/>

      <rect x="-33" y="34" width="64" height="26" rx="2" fill="${brick2}"/>
      <rect x="-33" y="34" width="64" height="2" fill="rgba(255,255,255,0.2)"/>
      <rect x="-33" y="58" width="64" height="2" fill="rgba(0,0,0,0.35)"/>

      <rect x="37" y="34" width="64" height="26" rx="2" fill="${brick1}"/>
      <rect x="37" y="34" width="64" height="2" fill="rgba(255,255,255,0.2)"/>
      <rect x="37" y="58" width="64" height="2" fill="rgba(0,0,0,0.35)"/>

      <rect x="107" y="34" width="64" height="26" rx="2" fill="${brick3}"/>
      <rect x="107" y="34" width="64" height="2" fill="rgba(255,255,255,0.2)"/>
      <rect x="107" y="58" width="64" height="2" fill="rgba(0,0,0,0.35)"/>
    </g>
  </svg>`;
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
}

/**
 * Handle Section 5 Decorative MDF Brick Variant Switching
 */
function initBrickVariantSelector() {
  const swatchButtons = document.querySelectorAll('.variant-swatch-btn');
  const previewFrame = document.getElementById('brickPreviewFrame');
  const wallPattern = document.getElementById('brickWallPattern');
  const previewName = document.getElementById('brickPreviewName');
  const brickEnquireBtn = document.getElementById('brickEnquireBtn');

  if (!swatchButtons.length || !previewFrame || !previewName || !brickEnquireBtn) return;

  const variantConfigs = {
    'Red Brick': {
      bg: 'linear-gradient(135deg, #4A150E 0%, #210906 100%)',
      b1: '#A33122', b2: '#8A271B', b3: '#B23A29', mortar: '#21110E'
    },
    'Rustic Brick': {
      bg: 'linear-gradient(135deg, #381A11 0%, #170905 100%)',
      b1: '#6E3929', b2: '#54291B', b3: '#7D4331', mortar: '#1F100B'
    },
    'Rustic Gray': {
      bg: 'linear-gradient(135deg, #2D3033 0%, #131416 100%)',
      b1: '#4E5358', b2: '#3B3E42', b3: '#5C6268', mortar: '#1A1C1E'
    },
    'White Gray': {
      bg: 'linear-gradient(135deg, #8E949A 0%, #52565A 100%)',
      b1: '#D4D8DC', b2: '#C0C5C9', b3: '#E1E5E8', mortar: '#80868C'
    },
    'Full White': {
      bg: 'linear-gradient(135deg, #D5D8DF 0%, #9EA2AB 100%)',
      b1: '#F2F4F7', b2: '#E4E7EC', b3: '#FFFFFF', mortar: '#BABFC7'
    }
  };

  function updateBrickVariant(variantName) {
    const config = variantConfigs[variantName];
    if (!config) return;

    if (wallPattern) {
      wallPattern.classList.add('switching');
    }

    setTimeout(() => {
      previewName.textContent = variantName;
      previewFrame.style.background = config.bg;
      if (wallPattern) {
        wallPattern.style.backgroundImage = createBrickSvgPattern(config.b1, config.b2, config.b3, config.mortar);
        wallPattern.classList.remove('switching');
      }
      brickEnquireBtn.textContent = `ENQUIRE FOR ${variantName.toUpperCase()}`;
      brickEnquireBtn.setAttribute('data-product-title', `Brick MDF Panel (${variantName})`);
    }, 120);
  }

  // Initial load brick pattern setting
  const initialVariant = document.querySelector('.variant-swatch-btn.active');
  const defaultName = initialVariant ? initialVariant.getAttribute('data-variant') : 'Red Brick';
  if (variantConfigs[defaultName] && wallPattern) {
    const cfg = variantConfigs[defaultName];
    wallPattern.style.backgroundImage = createBrickSvgPattern(cfg.b1, cfg.b2, cfg.b3, cfg.mortar);
  }

  swatchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      swatchButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const variantName = btn.getAttribute('data-variant');
      if (variantName) {
        updateBrickVariant(variantName);
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

/**
 * Handle FAQ Accordion Item Expand / Collapse
 */
function initFaqAccordion() {
  const faqTriggers = document.querySelectorAll('.faq-trigger');

  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      if (!item) return;

      const isActive = item.classList.contains('active');
      
      // Close other active items if desired
      document.querySelectorAll('.faq-item.active').forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      item.classList.toggle('active', !isActive);
      trigger.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
    });
  });
}

/**
 * Category Filter Switcher (Desktop & Mobile)
 */
function initHardwareFilters() {
  const filterPills = document.querySelectorAll('.filter-bar .filter-pill');
  const cards = document.querySelectorAll('[data-category]');

  if (!filterPills.length || !cards.length) return;

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const targetFilter = pill.getAttribute('data-filter') || 'all';

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (targetFilter === 'all' || cardCat === targetFilter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Quick-Detail Product Modal Handler
 */
function initProductModal() {
  const modalBackdrop = document.getElementById('productModal');
  if (!modalBackdrop) return;

  const modalImg = modalBackdrop.querySelector('.modal-product-img');
  const modalBadge = modalBackdrop.querySelector('.modal-category-badge');
  const modalTitle = modalBackdrop.querySelector('.modal-product-title');
  const modalSpecList = modalBackdrop.querySelector('.modal-spec-list');
  const modalCtaBtn = modalBackdrop.querySelector('.btn-modal-whatsapp');
  const closeBtn = modalBackdrop.querySelector('.modal-close-btn');

  function closeModal() {
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) closeModal();
  });

  // Attach quick-detail openers to verified product cards
  document.querySelectorAll('.product-card[data-modal-title]').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't open if clicked direct button
      if (e.target.closest('a, button')) return;

      const title = card.getAttribute('data-modal-title') || '';
      const category = card.getAttribute('data-modal-category') || 'HARDWARE';
      const imgSrc = card.getAttribute('data-modal-img') || '';
      const specsRaw = card.getAttribute('data-modal-specs') || '';

      if (modalTitle) modalTitle.textContent = title;
      if (modalBadge) modalBadge.textContent = category;
      if (modalImg && imgSrc) modalImg.src = imgSrc;

      if (modalSpecList) {
        modalSpecList.innerHTML = '';
        if (specsRaw) {
          specsRaw.split('|').forEach(spec => {
            if (spec.trim()) {
              const li = document.createElement('li');
              li.className = 'modal-spec-item';
              li.textContent = spec.trim();
              modalSpecList.appendChild(li);
            }
          });
        }
      }

      if (modalCtaBtn) {
        modalCtaBtn.href = getWhatsAppUrl('hardware', title);
      }

      modalBackdrop.classList.add('open');
      modalBackdrop.setAttribute('aria-hidden', 'false');
    });
  });
}
