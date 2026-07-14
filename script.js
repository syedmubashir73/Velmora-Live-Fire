/* ============================================================
       DATA
    =============================================================*/
    const MENU = {
      "Live Fire Starters": [
        { code: "F-01", name: "Charred Octopus", desc: "Grapevine char, smoked chili oil, charred lime.", price: 19, tags: ["GF", "Signature"], flavor: { color1: "#E8793B", color2: "#8a3b12", label: "Char / Citrus" } },
        { code: "F-02", name: "Smoked Beet & Burrata", desc: "Applewood-smoked beets, torn burrata, hazelnut ash.", price: 16, tags: ["V", "GF"], flavor: { color1: "#c74f6b", color2: "#5a1f2c", label: "Smoke / Sweet" } },
        { code: "F-03", name: "Embered Oysters", desc: "Half-shell over coals, brown butter, pink peppercorn.", price: 22, tags: ["Signature"], flavor: { color1: "#d8a857", color2: "#6b5122", label: "Brine / Butter" } },
        { code: "F-04", name: "Blistered Padrón", desc: "Flash-fired peppers, sea salt, smoked lemon.", price: 12, tags: ["V", "GF", "Spicy"], flavor: { color1: "#7a9e3f", color2: "#33420f", label: "Char / Heat" } },
      ],
      "Hearth Mains": [
        { code: "M-01", name: "Dry-Aged Ribeye", desc: "45-day aged, oak-fired, bone marrow butter.", price: 58, tags: ["Signature", "GF"], flavor: { color1: "#e8793b", color2: "#411c07", label: "Oak / Umami" } },
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
      { quote: "The dry-aged ribeye tastes like it remembers the tree it came from.", who: "A. Whitfield — Table for Two Journal" },
      { quote: "I've never watched a chicken get roasted and felt genuinely moved.", who: "R. Okafor — Guest, third visit" },
      { quote: "A room that smells like a forest fire in the best possible way.", who: "M. Delacroix — Local Kitchens Weekly" },
    ];

    let cart = {}; // key: code -> {item, category, qty}
    let currentCategory = Object.keys(MENU)[0];

    /* ============================================================
       NAV / MOBILE MENU / SERVICE TOGGLE
    =============================================================*/
    function toggleMobileMenu() {
      document.getElementById('mobile-menu').classList.toggle('open');
      document.getElementById('hamburger').classList.toggle('open');
    }

    function setService(mode) {
      document.documentElement.setAttribute('data-theme', mode);
      document.getElementById('btn-night').classList.toggle('active', mode === 'night');
      document.getElementById('btn-day').classList.toggle('active', mode === 'day');
      showToast(mode === 'night' ? 'Night Service — hearth menu' : 'Day Service — weekend brunch');
    }

    /* ============================================================
       RENDER MENU
    =============================================================*/
    function renderTabs() {
      const tabsEl = document.getElementById('tabs');
      tabsEl.innerHTML = '';
      Object.keys(MENU).forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'tab' + (cat === currentCategory ? ' active' : '');
        btn.textContent = cat;
        btn.onclick = () => { currentCategory = cat; renderTabs(); renderMenu(); };
        tabsEl.appendChild(btn);
      });
    }

    function renderMenu() {
      const grid = document.getElementById('menu-grid');
      grid.style.opacity = 0;
      setTimeout(() => {
        grid.innerHTML = '';
        MENU[currentCategory].forEach(item => {
          const el = document.createElement('div');
          el.className = 'dish';
          el.innerHTML = `
        <div class="dish-top">
          <div>
            <div class="dish-code">${item.code}</div>
            <div class="dish-name">${item.name}</div>
            <div class="dish-tags">${item.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
          </div>
        </div>
        <div class="dish-desc">${item.desc}</div>
        <div class="dish-bottom">
          <div class="dish-price">$${item.price}</div>
          <button class="add-btn" data-code="${item.code}">Add to ticket</button>
        </div>`;
          el.querySelector('.add-btn').onclick = (e) => addToCart(item, currentCategory, e.target);
          grid.appendChild(el);
        });
        grid.style.opacity = 1;
      }, 180);
    }

    /* ============================================================
       CART
    =============================================================*/
    function addToCart(item, category, btnEl) {
      if (!cart[item.code]) cart[item.code] = { item, category, qty: 0 };
      cart[item.code].qty += 1;
      renderCart();
      updateCartCount();
      if (btnEl) {
        btnEl.textContent = 'Added ✓';
        btnEl.classList.add('added');
        setTimeout(() => { btnEl.textContent = 'Add to ticket'; btnEl.classList.remove('added'); }, 1100);
      }
      showToast(item.name + ' added to ticket');
    }

    function changeQty(code, delta) {
      if (!cart[code]) return;
      cart[code].qty += delta;
      if (cart[code].qty <= 0) delete cart[code];
      renderCart();
      updateCartCount();
    }

    function updateCartCount() {
      const count = Object.values(cart).reduce((a, c) => a + c.qty, 0);
      document.getElementById('cart-count').textContent = count;
    }

    function renderCart() {
      const wrap = document.getElementById('cart-items');
      const entries = Object.entries(cart);
      if (entries.length === 0) {
        wrap.innerHTML = '<div class="cart-empty">No items fired yet. Add something from the menu.</div>';
        document.getElementById('cart-total').textContent = '$0';
        return;
      }
      let total = 0;
      wrap.innerHTML = entries.map(([code, entry]) => {
        total += entry.item.price * entry.qty;
        return `
      <div class="cart-line">
        <div>
          <div class="cart-line-name">${entry.item.name}</div>
          <div class="cart-line-meta">${entry.code} · $${entry.item.price} each</div>
        </div>
        <div class="qty-ctrl">
          <button onclick="changeQty('${code}',-1)">–</button>
          <span style="font-family:var(--mono); font-size:13px;">${entry.qty}</span>
          <button onclick="changeQty('${code}',1)">+</button>
        </div>
      </div>`;
      }).join('');
      document.getElementById('cart-total').textContent = '$' + total;
    }

    function toggleCart(open) {
      document.getElementById('cart-drawer').classList.toggle('open', open);
      document.getElementById('overlay').classList.toggle('show', open);
    }

    const RESTAURANT_WHATSAPP = "923111052034";

    function openWhatsApp(number, text) {
      const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    function sendToKitchen() {
      const entries = Object.entries(cart);
      if (entries.length === 0) { showToast('Your ticket is empty'); return; }

      let total = 0;
      let msg = `New order — Velmora\n\n`;
      entries.forEach(([code, entry]) => {
        const lineTotal = entry.item.price * entry.qty;
        total += lineTotal;
        msg += `• ${entry.item.name} x${entry.qty} — $${lineTotal}\n`;
      });
      msg += `\nTotal: $${total}`;

      showToast('Ticket fired to the kitchen 🔥');
      openWhatsApp(RESTAURANT_WHATSAPP, msg);
      cart = {};
      renderCart();
      updateCartCount();
      toggleCart(false);
    }

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.add('show');
      clearTimeout(window.__toastTimer);
      window.__toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
    }

    /* ============================================================
       RESERVATION FORM
    =============================================================*/
    function submitReservation(e) {
      e.preventDefault();
      const inputs = e.target.querySelectorAll('input, select');
      const name = inputs[0].value;
      const date = inputs[2].value;
      const guests = inputs[3].value;
      const time = inputs[4].value;
      document.getElementById('form-fields').style.display = 'none';
      const confirmEl = document.getElementById('confirm-ticket');
      confirmEl.classList.add('show');
      document.getElementById('confirm-detail').textContent =
        `${name || 'Guest'} · Party of ${guests || '2'} · ${date || 'TBD'} at ${time || 'TBD'}. See you at the hearth.`;

      const msg = `New reservation — Velmora\n\nName: ${name || 'Guest'}\nParty size: ${guests || '2'}\nDate: ${date || 'TBD'}\nTime: ${time || 'TBD'}`;
      openWhatsApp(RESTAURANT_WHATSAPP, msg);
      return false;
    }

    function submitNewsletter(e) {
      e.preventDefault();
      showToast('Subscribed — first dispatch soon');
      e.target.reset();
      return false;
    }

    /* ============================================================
       TESTIMONIALS CAROUSEL
    =============================================================*/
    let testiIndex = 0;
    function renderTestimonials() {
      const track = document.getElementById('testi-track');
      const dots = document.getElementById('testi-dots');
      track.innerHTML = TESTIMONIALS.map((t, i) => `
    <div class="testi-slide ${i === 0 ? 'active' : ''}" data-i="${i}">
      <p>"${t.quote}"</p>
      <cite>${t.who}</cite>
    </div>`).join('');
      dots.innerHTML = TESTIMONIALS.map((_, i) => `<button class="${i === 0 ? 'active' : ''}" onclick="goTesti(${i})"></button>`).join('');
    }
    function goTesti(i) {
      testiIndex = i;
      document.querySelectorAll('.testi-slide').forEach((el, idx) => el.classList.toggle('active', idx === i));
      document.querySelectorAll('.testi-dots button').forEach((el, idx) => el.classList.toggle('active', idx === i));
    }
    setInterval(() => {
      testiIndex = (testiIndex + 1) % TESTIMONIALS.length;
      goTesti(testiIndex);
    }, 5000);

    /* ============================================================
       FLAVOR EMBERS — signature interactive grid
    =============================================================*/
    function renderEmbersGrid() {
      const grid = document.getElementById('embers-grid');
      const allDishes = Object.values(MENU).flat().filter(d => d.tags.includes('Signature')).concat(
        Object.values(MENU).flat().filter(d => !d.tags.includes('Signature'))
      ).slice(0, 8);
      grid.innerHTML = '';
      allDishes.forEach(dish => {
        const tile = document.createElement('div');
        tile.className = 'ember-tile';
        tile.innerHTML = `<canvas></canvas><div class="label"><b>${dish.name}</b><span>${dish.flavor.label}</span></div>`;
        grid.appendChild(tile);
        initEmberTile(tile.querySelector('canvas'), dish.flavor, tile);
      });
    }

    function initEmberTile(canvas, flavor, tileEl) {
      const ctx = canvas.getContext('2d');
      let w, h, particles = [], active = false, raf;
      function resize() {
        w = canvas.width = tileEl.clientWidth;
        h = canvas.height = tileEl.clientHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      function spawn() {
        particles.push({
          x: w / 2 + (Math.random() - 0.5) * w * 0.5,
          y: h + 10,
          vy: -(0.6 + Math.random() * 1.4),
          vx: (Math.random() - 0.5) * 0.6,
          r: 2 + Math.random() * 3,
          life: 1,
          color: Math.random() > 0.5 ? flavor.color1 : flavor.color2
        });
      }
      function loop() {
        ctx.clearRect(0, 0, w, h);
        if (active && Math.random() < 0.5) spawn();
        particles.forEach(p => {
          p.x += p.vx; p.y += p.vy; p.life -= 0.012;
          ctx.globalAlpha = Math.max(p.life, 0);
          ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;
        particles = particles.filter(p => p.life > 0 && p.y > -10);
        raf = requestAnimationFrame(loop);
      }
      loop();
      tileEl.addEventListener('mouseenter', () => active = true);
      tileEl.addEventListener('mouseleave', () => active = false);
      tileEl.addEventListener('touchstart', () => active = true, { passive: true });
      // ambient low-frequency glow even when idle
      setInterval(() => { if (!active && Math.random() < 0.15) spawn(); }, 300);
    }

    /* ============================================================
       HERO PARTICLE FIELD (canvas)
    =============================================================*/
    function initHeroParticles() {
      const canvas = document.getElementById('hero-particles');
      const ctx = canvas.getContext('2d');
      let w, h, embers = [];
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      function resize() {
        w = canvas.width = canvas.parentElement.clientWidth;
        h = canvas.height = canvas.parentElement.clientHeight;
      }
      resize();
      window.addEventListener('resize', resize);
      if (reduceMotion) return;

      for (let i = 0; i < 55; i++) {
        embers.push({
          x: Math.random() * w, y: Math.random() * h + h * 0.3,
          vy: -(0.3 + Math.random() * 0.9), vx: (Math.random() - 0.5) * 0.3,
          r: 1 + Math.random() * 2.4, life: Math.random(),
          flick: Math.random() * Math.PI * 2
        });
      }
      function loop() {
        ctx.clearRect(0, 0, w, h);
        embers.forEach(p => {
          p.y += p.vy; p.x += p.vx + Math.sin(p.flick) * 0.15; p.flick += 0.03;
          p.life -= 0.002;
          if (p.life <= 0 || p.y < -10) {
            p.y = h + 10; p.x = Math.random() * w; p.life = 1;
          }
          const isDay = document.documentElement.getAttribute('data-theme') === 'day';
          ctx.globalAlpha = Math.max(p.life * 0.8, 0);
          ctx.fillStyle = isDay ? '#C1532A' : '#E8793B';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(loop);
      }
      loop();
    }

    /* ============================================================
       SCROLL REVEAL
    =============================================================*/
    function initReveal() {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
      }, { threshold: 0.15 });
      document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    }

    /* ============================================================
       HEADER BACKGROUND ON SCROLL
    =============================================================*/
    window.addEventListener('scroll', () => {
      const header = document.getElementById('site-header');
      if (window.scrollY > 40) { header.style.background = 'var(--bg)'; }
      else { header.style.background = 'linear-gradient(to bottom, var(--bg) 0%, transparent 100%)'; }
    });

    /* ============================================================
       INIT
    =============================================================*/
    renderTabs();
    renderMenu();
    renderTestimonials();
    renderEmbersGrid();
    initHeroParticles();
    initReveal();