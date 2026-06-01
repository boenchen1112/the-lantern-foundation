/* ============================================================
   THE LANTERN FOUNDATION · interactive.js
   Loaded after nav.js. Progressive enhancements only.
   ============================================================ */
(function () {
  'use strict';

  /* ---- 1. SCROLL PROGRESS BAR ---- */
  (function () {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    function update() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop || window.scrollY) / max * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }());

  /* ---- 2. CURSOR-FOLLOW GLOW ON CARDS ---- */
  (function () {
    var sel = '.branch-card, .challenge-card, .path-card, .response-card, .team-card, .contact-card, .transp-card, .context-stat, .event-stat';
    var cards = document.querySelectorAll(sel);
    cards.forEach(function (c) {
      c.setAttribute('data-glow', '');
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }());

  /* ---- 3. MAGNETIC BUTTONS ---- */
  (function () {
    if (window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('.btn-gold, [data-magnetic]').forEach(function (btn) {
      var strength = 14;
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        btn.style.transform = 'translate(' + (dx * strength) + 'px,' + (dy * strength - 1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }());

  /* ---- 4. PARALLAX ---- */
  (function () {
    var els = [].slice.call(document.querySelectorAll('[data-parallax]'));
    if (!els.length) return;
    var ticking = false;
    function apply() {
      var vh = window.innerHeight;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var speed = parseFloat(el.dataset.parallax) || 0.15;
        var center = r.top + r.height / 2 - vh / 2;
        el.style.transform = 'translateY(' + (-center * speed) + 'px)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    }, { passive: true });
    apply();
  }());

  /* ---- 5. REUSABLE FLOATING-LANTERN CANVAS ---- */
  (function () {
    document.querySelectorAll('canvas.lantern-canvas').forEach(function (canvas) {
      var ctx = canvas.getContext('2d');
      var W = 0, H = 0;
      var count = parseInt(canvas.dataset.count, 10) || 18;
      function resize() {
        var dpr = window.devicePixelRatio || 1;
        W = canvas.offsetWidth; H = canvas.offsetHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      function Pt(initY) {
        var self = this;
        self.reset = function (y) {
          self.x = Math.random() * W;
          self.y = y !== undefined ? y : H + 20;
          self.r = Math.random() * 2.4 + 1;
          self.sp = Math.random() * 0.4 + 0.15;
          self.a = Math.random() * 0.26 + 0.05;
          self.dr = (Math.random() - 0.5) * 0.2;
        };
        self.reset(initY);
        self.tick = function () {
          self.y -= self.sp; self.x += self.dr;
          if (self.y < -20) self.reset();
        };
        self.draw = function () {
          var g = ctx.createRadialGradient(self.x, self.y, 0, self.x, self.y, self.r * 5);
          g.addColorStop(0, 'rgba(232,164,32,' + self.a + ')');
          g.addColorStop(1, 'rgba(232,164,32,0)');
          ctx.beginPath(); ctx.arc(self.x, self.y, self.r * 5, 0, Math.PI * 2);
          ctx.fillStyle = g; ctx.fill();
          ctx.beginPath(); ctx.arc(self.x, self.y, self.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(245,200,74,' + (self.a + 0.08) + ')'; ctx.fill();
        };
      }
      var pts = [];
      function seed() { pts = []; for (var i = 0; i < count; i++) pts.push(new Pt(Math.random() * H)); }
      function loop() {
        ctx.clearRect(0, 0, W, H);
        pts.forEach(function (p) { p.tick(); p.draw(); });
        requestAnimationFrame(loop);
      }
      window.addEventListener('resize', function () { resize(); }, { passive: true });
      resize(); seed(); loop();
    });
  }());

  /* ---- 6. LIGHTBOX ---- */
  (function () {
    var triggers = document.querySelectorAll('.lb-btn');
    if (!triggers.length) return;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML =
      '<button class="lb-close" aria-label="Close">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
      '<button class="lb-arrow lb-prev" aria-label="Previous">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg></button>' +
      '<img alt="Expanded image">' +
      '<button class="lb-arrow lb-next" aria-label="Next">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg></button>' +
      '<div class="lb-count"></div>';
    document.body.appendChild(box);

    var imgEl = box.querySelector('img');
    var countEl = box.querySelector('.lb-count');
    var prevBtn = box.querySelector('.lb-prev');
    var nextBtn = box.querySelector('.lb-next');
    var group = [];
    var idx = 0;

    function srcOf(slot) {
      if (!slot) return null;
      var im = slot.shadowRoot && slot.shadowRoot.querySelector('img[part="image"]');
      return im && im.getAttribute('src') ? im.src : null;
    }
    function show(i) {
      idx = (i + group.length) % group.length;
      var src = srcOf(group[idx]);
      if (src) imgEl.src = src;
      var multi = group.length > 1;
      prevBtn.classList.toggle('hidden', !multi);
      nextBtn.classList.toggle('hidden', !multi);
      countEl.textContent = multi ? (idx + 1) + ' / ' + group.length : '';
    }
    function open(slot) {
      var groupName = slot.closest('[data-lightbox-group]');
      group = [];
      if (groupName) {
        groupName.querySelectorAll('image-slot[data-filled]').forEach(function (s) { group.push(s); });
      }
      if (!group.length) group = [slot];
      var start = group.indexOf(slot);
      box.classList.add('open');
      document.body.style.overflow = 'hidden';
      show(start < 0 ? 0 : start);
    }
    function close() {
      box.classList.remove('open');
      document.body.style.overflow = '';
    }

    triggers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var slot = btn.parentElement.querySelector('image-slot');
        if (slot && slot.hasAttribute('data-filled')) open(slot);
      });
    });
    box.querySelector('.lb-close').addEventListener('click', close);
    prevBtn.addEventListener('click', function () { show(idx - 1); });
    nextBtn.addEventListener('click', function () { show(idx + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
  }());

  /* ---- 7. CHAPTER / SECTION SCROLLSPY ---- */
  (function () {
    var navs = document.querySelectorAll('[data-scrollspy]');
    navs.forEach(function (nav) {
      var links = [].slice.call(nav.querySelectorAll('a[href^="#"]'));
      var targets = links.map(function (l) { return document.getElementById(l.getAttribute('href').slice(1)); });
      function update() {
        var y = window.scrollY + (parseInt(nav.dataset.offset, 10) || 160);
        var current = 0;
        targets.forEach(function (t, i) { if (t && t.offsetTop <= y) current = i; });
        links.forEach(function (l, i) { l.classList.toggle('active', i === current); });
      }
      window.addEventListener('scroll', update, { passive: true });
      update();
    });
  }());

}());
