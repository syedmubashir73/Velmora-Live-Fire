/**
 * Velmora — Interactive Experience Engine
 * Production Quality Refinement
 */

'use strict';

/* ============================================================
   DATA MODEL
=============================================================*/
const MENU_DATA = {
  "Live Fire Starters": [
    { code: "F-01", name: "Charred Octopus", desc: "Grapevine char, smoked chili oil, charred lime.", price: 19, tags: ["GF", "Signature"], flavor: { color1: "#FF5500", color2: "#8a3b12", label: "Char / Citrus" } },
    { code: "F-02", name: "Smoked Beet & Burrata", desc: "Applewood-smoked beets, torn burrata, hazelnut ash.", price: 16, tags: ["V", "GF"], flavor: { color1: "#c74f6b", color2: "#5a1f2c", label: "Smoke / Sweet" } },
    { code: "F-03", name: "Embered Oysters", desc: "Half-shell over coals, brown butter, pink peppercorn.", price: 22, tags: ["Signature"], flavor: { color1: "#E5B35C", color2: "#6b5122", label: "Brine / Butter" } },
    { code: "F-04", name: "Blistered Padrón", desc: "Flash-fired peppers, sea salt, smoked lemon.", price: 12, tags: ["V", "GF", "Spicy"], flavor: { color1: "#7a9e3f", color2: "#33420f", label: "Char / Heat" } },
  ],
  "Hearth Mains": [
    { code: "M-01", name: "Dry-Aged Ribeye", desc: "45-day aged, oak-fired, bone marrow butter.", price: 58, tags: ["Signature", "GF"], flavor: { color1: "#FF5500", color2: "#411c07", label: "Oak / Umami" } },
    { code: "M-02", name: "Whole Roasted Branzino", desc: "Grapevine-fired, fennel, charred citrus.", price: 34, tags: ["GF"], flavor: { color1: "#e2c07a", color2: "#5f4a1f", label: "Citrus / Delicate" } },
    { code: "M-03", name: "Ember-Roasted Half Chicken", desc: "Applewood, calabrian honey glaze.", price: 29, tags: ["GF"], flavor: { color1: "#d97a2f", color2: "#602f0d", label: "Smoke / Sweet" } },
    { code: "M-04", name: "Charcoal Root Vegetable Board", desc: "Whole-fired roots, whipped tahini, herb oil.", price: 24, tags: ["V", "VG", "GF"], flavor: { color1: "#6f8f4a", color2: "#293815", label: "Earth / Herb" } },
  ],
  "Smoke & Char": [
    { code: "S-01", name: "Charred Broccolini", desc: "Chili crisp, preserved lemon.", price: 11, tags: ["V", "GF", "Spicy"], flavor: { color1: "#4f7a3d", color2: "#1e2f14", label: "Char / Bright" } },
    { code: "S-02", name: "Smoked Potato Ash", desc: "Fire-roasted potatoes, ash mayo.", price: 10, tags: ["V", "GF"], flavor: { color1: "#8a7a63", color2: "#382f22", label: "Smoke / Earth" } },
    { code: "S-03", name: "Grilled Corn", desc: "Chili-lime butter, cotija.", price: 9, tags: ["V", "GF", "Spicy"], flavor: { color1: "#e0b13a", color2: "#5e460f", label: "Sweet / Heat" } },
  ],
  "Embers Sweet": [
    { code: "D-01", name: "Burnt Basque Cheesecake", desc: "Deep-caramelized crust, smoked salt.", price: 13, tags: ["Signature"], flavor: { color1: "#caa25a", color2: "#4a3616", label: "Char / Cream" } },
    { code: "D-02", name: "Smoked Chocolate Tart", desc: "Applewood cacao, sea salt caramel.", price: 14, tags: [], flavor: { color1: "#a05a3a", color2: "#3c1d10", label: "Smoke / Cocoa" } },
    { code: "D-03", name: "Charred Pineapple", desc: "Rum caramel, toasted coconut.", price: 12, tags: ["GF"], flavor: { color1: "#e0c23a", color2: "#5c4c10", label: "Char / Tropical" } },
  ],
  "Cellar": [
    { code: "C-01", name: "Smoked Old Fashioned", desc: "Applewood smoke, orange oil.", price: 16, tags: [], flavor: { color1: "#b5651d", color2: "#41230a", label: "Smoke / Bitter" } },
    { code: "C-02", name: "Ember Negroni", desc: "Charred orange, slow-melt ice.", price: 15, tags: [], flavor: { color1: "#c1532a", color2: "#4a1f10", label: "Bitter / Citrus" } },
    { code: "C-03", name: "Charcoal Lemonade", desc: "Activated charcoal, fresh lemon, mint.", price: 8, tags: ["Mocktail"], flavor: { color1: "#5a5a5a", color2: "#1a1a1a", label: "Bright / Clean" } },
  ]
};

const TESTIMONIALS = [
  { quote: "An absolute masterclass in elemental fire. The dry-aged ribeye is unmatched.", author: "Eater Magazine" },
  { quote: "Velmora redefines modern high-end dining through smoke, precision, and passion.", author: "Culinary Review" },
  { quote: "The atmospheric ambient controls and hearth flavors create an unforgettable evening.", author: "Food & Wine" }
];

const RESTAURANT_WHATSAPP = "923111052034";

/* Application State */
class AppState {
  constructor() {
    this.cart = new Map();
    this.currentCategory = Object.keys(MENU_DATA)[0];
    this.activeTheme = 'night';
  }

  addToCart(item, category) {
    if (this.cart.has(item.code)) {
      this.cart.get(item.code).qty += 1;
    } else {
      this.cart.set(item.code, { item, category, qty: 1 });
    }
  }

  updateQty(code, delta) {
    if (!this.cart.has(code)) return;
    const entry = this.cart.get(code);
    entry.qty += delta;
    if (entry.qty <= 0) this.cart.delete(code);
  }

  clearCart() { this.cart.clear(); }

  get totalItems() {
    let count = 0;
    this.cart.forEach(v => count += v.qty);
    return count;
  }

  get totalPrice() {
    let total = 0;
    this.cart.forEach(v => total += v.item.price * v.qty);
    return total;
  }
}

const state = new AppState();

/* ============================================================
   INTERACTIVE CURSOR PARTICLES (OPTIMIZED & RETINA READY)
=============================================================*/
function initCursorParticles() {
  const canvas = document.getElementById('cursor-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height, dpr;

  const resize = () => {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const particles = [];
  const mouse = { x: -100, y: -100 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (particles.length < 50) {
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 6,
          y: mouse.y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -(0.8 + Math.random() * 1.8),
          size: 2 + Math.random() * 2.5,
          life: 1,
          decay: 0.025 + Math.random() * 0.02,
          color: Math.random() > 0.4 ? '#FF5500' : '#E5B35C'
        });
      }
    }
  }, { passive: true });

  let animationFrameId;

  function render() {
    // Tab visibility check: freeze render loop if tab is hidden
    if (document.hidden) {
      animationFrameId = requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}

/* ============================================================
   3D TILT & MAGNETIC HOVER EFFECTS
=============================================================*/
function initInteractiveHoverEffects() {
  // Check for reduced motion preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.tilt-card, .dish');

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      } else {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      }
    });
  }, { passive: true });

  // Magnetic Button movement
  const magnetics = document.querySelectorAll('.magnetic');
  magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    }, { passive: true });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ============================================================
   DOM INITIALIZATION & HANDLERS
=============================================================*/
document.addEventListener('DOMContentLoaded', () => {
  initCursorParticles();
  initInteractiveHoverEffects();
  initNavigation();
  initThemeSwitcher();
  renderMenuTabs();
  renderMenuGrid();
  renderEmbersGrid();
  initTestimonials();
  initReservationForm();
  initScrollObserver();
  initCartDrawer();
  initKeyboardNav();
});

let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add('show');
  
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function initNavigation() {
  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}

function initThemeSwitcher() {
  const btnNight = document.getElementById('btn-night');
  const btnDay = document.getElementById('btn-day');

  const setTheme = (mode) => {
    state.activeTheme = mode;
    document.documentElement.setAttribute('data-theme', mode);
    btnNight.classList.toggle('active', mode === 'night');
    btnNight.setAttribute('aria-checked', mode === 'night');
    btnDay.classList.toggle('active', mode === 'day');
    btnDay.setAttribute('aria-checked', mode === 'day');
    showToast(mode === 'night' ? 'Night Service Activated' : 'Day Service Activated');
  };

  btnNight.addEventListener('click', () => setTheme('night'));
  btnDay.addEventListener('click', () => setTheme('day'));
}

function renderMenuTabs() {
  const tabsContainer = document.getElementById('tabs');
  tabsContainer.innerHTML = '';

  Object.keys(MENU_DATA).forEach(category => {
    const btn = document.createElement('button');
    btn.className = `tab ${category === state.currentCategory ? 'active' : ''}`;
    btn.textContent = category;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', category === state.currentCategory);
    btn.addEventListener('click', () => {
      state.currentCategory = category;
      renderMenuTabs();
      renderMenuGrid();
    });
    tabsContainer.appendChild(btn);
  });
}

function renderMenuGrid() {
  const grid = document.getElementById('menu-grid');
  grid.style.opacity = '0';

  setTimeout(() => {
    grid.innerHTML = '';
    MENU_DATA[state.currentCategory].forEach(item => {
      const card = document.createElement('div');
      card.className = 'dish tilt-card';
      card.innerHTML = `
        <div class="glow-spot" aria-hidden="true"></div>
        <div>
          <div class="dish-code">${item.code}</div>
          <div class="dish-name">${item.name}</div>
          <div class="dish-tags">${item.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
          <p class="dish-desc">${item.desc}</p>
        </div>
        <div class="dish-bottom">
          <div class="dish-price">$${item.price}</div>
          <button class="add-btn magnetic" data-code="${item.code}">Add to ticket</button>
        </div>
      `;

      card.querySelector('.add-btn').addEventListener('click', () => {
        state.addToCart(item, state.currentCategory);
        updateCartUI();
        showToast(`${item.name} added to ticket`);
      });

      grid.appendChild(card);
    });

    grid.style.opacity = '1';
    initInteractiveHoverEffects();
  }, 120);
}

function renderEmbersGrid() {
  const grid = document.getElementById('embers-grid');
  const allDishes = Object.values(MENU_DATA).flat().slice(0, 8);

  grid.innerHTML = '';
  allDishes.forEach(dish => {
    const tile = document.createElement('div');
    tile.className = 'ember-tile';
    tile.innerHTML = `
      <canvas aria-hidden="true"></canvas>
      <div class="label">
        <b>${dish.name}</b>
        <span>${dish.flavor.label}</span>
      </div>
    `;
    grid.appendChild(tile);
    initEmberTileCanvas(tile.querySelector('canvas'), dish.flavor, tile);
  });
}

function initEmberTileCanvas(canvas, flavor, tileEl) {
  const ctx = canvas.getContext('2d');
  let w, h, particles = [], active = false, dpr = window.devicePixelRatio || 1;

  const resize = () => {
    const rect = tileEl.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const spawn = () => {
    if (particles.length < 25) {
      particles.push({
        x: w / 2 + (Math.random() - 0.5) * w * 0.6,
        y: h + 10,
        vy: -(1 + Math.random() * 2),
        vx: (Math.random() - 0.5) * 1,
        r: 2 + Math.random() * 3,
        life: 1,
        color: Math.random() > 0.5 ? flavor.color1 : flavor.color2
      });
    }
  };

  const render = () => {
    if (document.hidden) {
      requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, w, h);
    if (active && Math.random() < 0.7) spawn();

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.018;
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    particles = particles.filter(p => p.life > 0);
    requestAnimationFrame(render);
  };

  render();
  tileEl.addEventListener('mouseenter', () => active = true);
  tileEl.addEventListener('mouseleave', () => active = false);
}

function initTestimonials() {
  const track = document.getElementById('testi-track');
  const dots = document.getElementById('testi-dots');
  let current = 0;

  TESTIMONIALS.forEach((t, i) => {
    const dot = document.createElement('button');
    dot.className = `testi-dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => showSlide(i));
    dots.appendChild(dot);
  });

  const showSlide = (index) => {
    current = index;
    const t = TESTIMONIALS[current];
    track.innerHTML = `
      <div class="testi-slide">
        <p>“${t.quote}”</p>
        <div class="testi-author">— ${t.author}</div>
      </div>
    `;
    document.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  };

  showSlide(0);
  setInterval(() => {
    if (!document.hidden) showSlide((current + 1) % TESTIMONIALS.length);
  }, 6000);
}

function initReservationForm() {
  const form = document.getElementById('reserve-form');
  const fields = document.getElementById('form-fields');
  const confirm = document.getElementById('confirm-ticket');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    fields.style.display = 'none';
    confirm.classList.add('show');
    showToast('Table Reservation Transmitted');
  });
}

function initCartDrawer() {
  const cartTrigger = document.getElementById('cart-trigger');
  const closeBtn = document.getElementById('close-cart-btn');
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('overlay');
  const sendBtn = document.getElementById('btn-send-kitchen');

  const toggleCart = (open) => {
    drawer.classList.toggle('open', open);
    overlay.classList.toggle('show', open);
    drawer.setAttribute('aria-hidden', !open);
    cartTrigger.setAttribute('aria-expanded', open);
  };

  cartTrigger.addEventListener('click', () => toggleCart(true));
  closeBtn.addEventListener('click', () => toggleCart(false));
  overlay.addEventListener('click', () => toggleCart(false));

  sendBtn.addEventListener('click', () => {
    if (state.cart.size === 0) return showToast('Your ticket is empty');
    
    let msg = `New Order — Velmora\n\n`;
    state.cart.forEach(({ item, qty }) => { msg += `• ${item.name} x${qty} — $${item.price * qty}\n`; });
    msg += `\nTotal: $${state.totalPrice}`;

    window.open(`https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
    state.clearCart();
    updateCartUI();
    toggleCart(false);
  });
}

function updateCartUI() {
  document.getElementById('cart-count').textContent = state.totalItems;
  const wrap = document.getElementById('cart-items');
  
  if (state.cart.size === 0) {
    wrap.innerHTML = '<div class="cart-empty">No items fired yet.</div>';
    document.getElementById('cart-total').textContent = '$0';
    return;
  }

  wrap.innerHTML = '';
  state.cart.forEach(({ item, qty }, code) => {
    const line = document.createElement('div');
    line.className = 'cart-line';
    line.innerHTML = `
      <div>
        <div class="cart-line-name">${item.name}</div>
        <div class="cart-line-meta">${code} · $${item.price}</div>
      </div>
      <div class="qty-ctrl">
        <button class="btn-minus" data-code="${code}" aria-label="Decrease quantity">–</button>
        <span>${qty}</span>
        <button class="btn-plus" data-code="${code}" aria-label="Increase quantity">+</button>
      </div>
    `;

    line.querySelector('.btn-minus').addEventListener('click', () => { state.updateQty(code, -1); updateCartUI(); });
    line.querySelector('.btn-plus').addEventListener('click', () => { state.updateQty(code, 1); updateCartUI(); });
    wrap.appendChild(line);
  });

  document.getElementById('cart-total').textContent = `$${state.totalPrice}`;
}

function initScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const drawer = document.getElementById('cart-drawer');
      const mobileMenu = document.getElementById('mobile-menu');
      if (drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        document.getElementById('overlay').classList.remove('show');
      }
      if (mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        document.getElementById('hamburger').classList.remove('open');
      }
    }
  });
}