(() => {
  "use strict";

  const STORAGE_THEME = "doa-theme";
  const STORAGE_HISTORY = "doa-history";
  let diseases = null;

  initIcons();
  initTheme();
  initNav();
  initBackToTop();
  initRipple();
  initRevealSystem();
  initTiltCards();
  initHeroParallax();

  loadDiseases().then(() => {
    const page = document.body.dataset.page;
    if (page === "home") renderHomeDiseases();
    if (page === "diseases") initDiseasesPage();
    if (page === "diagnose") initDiagnosePage();
    if (page === "history") initHistoryPage();
  });

  function initIcons() {
    document.querySelectorAll("[data-icon]").forEach((el) => {
      el.innerHTML = getIconByName(el.dataset.icon);
    });
  }

  function getIconByName(name) {
    return window.getIcon ? window.getIcon(name || "") : "";
  }

  function initTheme() {
    const root = document.documentElement;
    const saved = localStorage.getItem(STORAGE_THEME);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));

    const toggle = byId("theme-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(STORAGE_THEME, next);
    });
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const icon = document.querySelector(".theme-icon");
    if (icon) icon.innerHTML = getIconByName(theme === "dark" ? "moon" : "sun");
  }

  function initNav() {
    const navBtn = document.querySelector(".nav-toggle");
    const nav = byId("site-nav");
    if (!navBtn || !nav) return;

    navBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      navBtn.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 900) {
          nav.classList.remove("open");
          navBtn.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  function initBackToTop() {
    const btn = byId("back-to-top");
    if (!btn) return;

    window.addEventListener("scroll", () => {
      btn.classList.toggle("show", window.scrollY > 600);
    }, { passive: true });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initRipple() {
    document.querySelectorAll(".btn").forEach((btn) => {
      if (btn.dataset.rippleBound) return;
      btn.dataset.rippleBound = "1";

      btn.addEventListener("click", (event) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 560);
      });
    });
  }

  function initRevealSystem() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = document.querySelectorAll(".reveal, .stagger");
    if (!nodes.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("in-view");

        if (el.classList.contains("stagger")) {
          Array.from(el.children).forEach((child, index) => {
            child.style.transitionDelay = `${index * 70}ms`;
          });
        }

        io.unobserve(el);
      });
    }, { threshold: 0.15 });

    nodes.forEach((n) => io.observe(n));
  }

  function initHeroParallax() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = document.querySelector(".hero-blob-a");
    const b = document.querySelector(".hero-blob-b");
    if (!a || !b) return;

    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      a.style.transform = `translate3d(${y * 0.02}px, ${y * -0.05}px, 0)`;
      b.style.transform = `translate3d(${y * -0.015}px, ${y * 0.04}px, 0)`;
    }, { passive: true });
  }

  function initTiltCards() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth < 900) return;

    document.querySelectorAll(".tilt-card").forEach((card) => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = "1";

      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * 4;
        const ry = (px - 0.5) * 4;
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  async function loadDiseases() {
    try {
      const response = await fetch("data/diseases.json");
      if (!response.ok) throw new Error("fetch failed");
      diseases = await response.json();
    } catch (_error) {
      diseases = fallbackDiseases();
    }
  }

  function allDiseases() {
    return Object.values(diseases || {});
  }

  function renderHomeDiseases() {
    const target = byId("home-diseases");
    if (!target) return;

    target.innerHTML = allDiseases().map((d) => `
      <article class="card tilt-card">
        <h3>${escapeHtml(d.name)}</h3>
        <p class="small">${escapeHtml(d.short)}</p>
        <a class="btn btn-ghost" href="diseases.html#${encodeURIComponent(d.id)}">Learn more</a>
      </article>
    `).join("");

    initRipple();
    initTiltCards();
    initRevealSystem();
  }

  function initDiseasesPage() {
    const search = byId("disease-search");
    const nav = byId("disease-nav");
    const sections = byId("disease-sections");
    if (!search || !nav || !sections) return;

    const render = (term = "") => {
      const query = term.trim().toLowerCase();
      const filtered = allDiseases().filter((d) => d.name.toLowerCase().includes(query) || d.name_ar.includes(term));

      nav.innerHTML = filtered.map((d) => `<a href="#${d.id}">${escapeHtml(d.name)}</a>`).join("");

      sections.innerHTML = filtered.map((d, i) => `
        <article id="${d.id}" class="card reveal ${i % 2 ? "reveal-right" : "reveal-left"}">
          <div class="stack">
            <h2>${escapeHtml(d.name)} - <span class="rtl" lang="ar" dir="rtl">${escapeHtml(d.name_ar)}</span></h2>
            <div class="rtl-box rtl" lang="ar" dir="rtl"><p>${escapeHtml(d.short_ar)}</p></div>
            <div class="rtl-box rtl" lang="ar" dir="rtl"><h3>الأعراض</h3><ul>${d.symptoms_ar.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul></div>
            <div class="rtl-box warning rtl" lang="ar" dir="rtl"><h3>علامات إنذار</h3><ul>${d.red_flags_ar.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul></div>
            <div class="rtl-box rtl" lang="ar" dir="rtl"><h3>نصائح آمنة</h3><ul>${d.safe_tips_ar.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}</ul></div>
            <p class="small rtl" lang="ar" dir="rtl"><strong>متى تراجع الطبيب:</strong> ${escapeHtml(d.when_to_see_doctor_ar)}</p>
            <a class="btn btn-outline" href="diagnose.html">Back to Diagnose</a>
          </div>
        </article>
      `).join("");

      initRevealSystem();
      initRipple();
    };

    search.addEventListener("input", (e) => render(e.target.value));
    render();
  }

  function initDiagnosePage() {
    const imageInput = byId("image-input");
    const dropzone = byId("dropzone");
    const preview = byId("preview-box");
    const analyzeBtn = byId("analyze-btn");
    const resetBtn = byId("reset-btn");
    const status = byId("status-indicator");
    const loadingLine = byId("loading-line");
    const skeleton = byId("result-skeleton");
    const result = byId("result-content");
    const message = byId("upload-inline-msg");
    const historyPreview = byId("history-preview");
    const lightbox = byId("lightbox");
    const lightboxImg = byId("lightbox-image");
    const lightboxClose = byId("lightbox-close");

    if (!imageInput || !dropzone || !preview || !analyzeBtn || !resetBtn || !status || !loadingLine || !skeleton || !result || !message || !historyPreview) return;

    let currentFile = null;
    let currentDataURL = "";

    renderHistoryPreview();

    const openPicker = () => imageInput.click();
    dropzone.addEventListener("click", openPicker);
    dropzone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPicker();
      }
    });

    imageInput.addEventListener("change", () => {
      const file = imageInput.files && imageInput.files[0];
      if (file) handleFile(file);
    });

    ["dragenter", "dragover"].forEach((evt) => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((evt) => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
      });
    });

    dropzone.addEventListener("drop", (e) => {
      const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) handleFile(file);
    });

    preview.addEventListener("click", openLightbox);
    preview.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox();
      }
    });

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    if (lightbox) {
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLightbox();
      });
    }

    analyzeBtn.addEventListener("click", async () => {
      if (!currentFile) return;

      setStatus(status, "loading", "Analyzing");
      loadingLine.classList.remove("hidden");
      skeleton.classList.remove("hidden");
      result.classList.add("hidden");
      toast("Analyze started", "info");

      await delay(900);

      const probs = generateProbabilities(allDiseases().map((d) => d.id));
      const sorted = [...probs].sort((a, b) => b.value - a.value);
      const top = sorted[0];
      const detail = diseases[top.id];

      result.innerHTML = renderResultContent(sorted, detail);
      skeleton.classList.add("hidden");
      result.classList.remove("hidden");
      loadingLine.classList.add("hidden");
      setStatus(status, "done", "Result ready");

      animateBars(result);
      bindAccordions(result);
      initRipple();
      toast("Result ready", "success");

      const saveBtn = byId("save-history-btn");
      if (saveBtn) {
        saveBtn.addEventListener("click", () => {
          const item = {
            id: uid(),
            thumbnail: currentDataURL,
            date: new Date().toLocaleString(),
            topClass: detail.name,
            confidence: Number((top.value * 100).toFixed(1)),
            probabilities: sorted.map((p) => ({ id: p.id, value: Number((p.value * 100).toFixed(1)) }))
          };

          const history = getHistory();
          history.unshift(item);
          localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history));
          renderHistoryPreview();
          toast("Saved to history", "success");
        });
      }
    });

    resetBtn.addEventListener("click", () => {
      currentFile = null;
      currentDataURL = "";
      imageInput.value = "";
      preview.innerHTML = "<p>No image selected.</p>";
      analyzeBtn.disabled = true;
      resetBtn.disabled = true;
      setStatus(status, "idle", "Idle");
      result.innerHTML = "<p class='small'>No analysis yet. Upload a case and run analysis.</p>";
      message.textContent = "Upload cleared.";
      message.style.color = "var(--muted)";
      toast("Case reset", "info");
    });

    function handleFile(file) {
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        setStatus(status, "error", "Invalid file type");
        message.textContent = "Invalid file type. Please upload PNG/JPG.";
        message.style.color = "var(--danger)";
        toast("Invalid file type", "error");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setStatus(status, "error", "File too large");
        message.textContent = "File exceeds 10MB limit.";
        message.style.color = "var(--danger)";
        toast("Size too big", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        currentFile = file;
        currentDataURL = String(reader.result || "");
        preview.innerHTML = `<img src="${currentDataURL}" alt="Selected eye image preview" />`;
        analyzeBtn.disabled = false;
        resetBtn.disabled = false;
        setStatus(status, "idle", "Image ready");
        message.textContent = `Selected: ${file.name}`;
        message.style.color = "var(--ok)";
      };
      reader.readAsDataURL(file);
    }

    function renderHistoryPreview() {
      const list = getHistory().slice(0, 3);
      if (!list.length) {
        historyPreview.innerHTML = "<li class='small'>No saved cases yet.</li>";
        return;
      }

      historyPreview.innerHTML = list.map((h) => `
        <li class="history-item">
          <span>${escapeHtml(h.topClass)} - ${h.confidence}%</span>
          <span class="small">${escapeHtml(h.date)}</span>
        </li>
      `).join("");
    }

    function openLightbox() {
      if (!currentDataURL || !lightbox || !lightboxImg) return;
      lightboxImg.src = currentDataURL;
      lightbox.classList.remove("hidden");
      if (lightboxClose) lightboxClose.focus();
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.add("hidden");
      preview.focus();
    }
  }

  function renderResultContent(sorted, detail) {
    const riskClass = String(detail.risk_level || "low").toLowerCase();

    return `
      <div class="result-header ltr">
        <span class="badge"><span class="icon">${getIconByName("activity")}</span>Top: ${escapeHtml(detail.name)}</span>
        <span class="badge">Confidence: ${(sorted[0].value * 100).toFixed(1)}%</span>
        <span class="badge ${riskClass}">Risk: ${escapeHtml(detail.risk_level)}</span>
      </div>

      <div class="rtl-box rtl" lang="ar" dir="rtl">
        <h3>ملخص الحالة</h3>
        <p>${escapeHtml(detail.short_ar)}</p>
      </div>

      <div class="result-grid ltr">
        <article class="card">
          <h3>What this may mean</h3>
          <p>This simulated classification suggests patterns compatible with <strong>${escapeHtml(detail.name)}</strong>. Clinical assessment remains required.</p>
        </article>
        <article class="card">
          <h3>What you can do now</h3>
          <ul>${detail.safe_tips_ar.map((tip) => `<li><div class="rtl" lang="ar" dir="rtl">${escapeHtml(tip)}</div></li>`).join("")}</ul>
        </article>
      </div>

      <div class="rtl-box warning rtl" lang="ar" dir="rtl">
        <h3>علامات إنذار</h3>
        <ul>${detail.red_flags_ar.map((flag) => `<li>${escapeHtml(flag)}</li>`).join("")}</ul>
      </div>

      <div class="rtl-box rtl" lang="ar" dir="rtl">
        <h3>متى يجب مراجعة الطبيب</h3>
        <p>${escapeHtml(detail.when_to_see_doctor_ar)}</p>
      </div>

      <div class="bars ltr">
        ${sorted.map((p, i) => `
          <div class="bar-row">
            <div class="bar-label"><span>${escapeHtml(diseases[p.id].name)}</span><span>${(p.value * 100).toFixed(1)}%</span></div>
            <div class="bar-track"><div class="bar-fill" data-target="${(p.value * 100).toFixed(1)}" style="transition-delay:${i * 90}ms"></div></div>
          </div>
        `).join("")}
      </div>

      ${accordionMarkup([
        { title: "Overview (AR)", content: `<div class="rtl" lang="ar" dir="rtl">${escapeHtml(detail.short_ar)}</div>` },
        { title: "Symptoms (AR)", content: `<div class="rtl" lang="ar" dir="rtl"><ul>${detail.symptoms_ar.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul></div>` },
        { title: "Urgent Signs (AR)", content: `<div class="rtl" lang="ar" dir="rtl"><ul>${detail.red_flags_ar.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul></div>` }
      ])}

      <div class="actions ltr">
        <button id="save-history-btn" class="btn btn-outline" type="button">Save to History</button>
      </div>
    `;
  }

  function initHistoryPage() {
    const filter = byId("history-filter");
    const container = byId("history-full");
    const clearAll = byId("clear-all-history");
    if (!filter || !container || !clearAll) return;

    const render = () => {
      const value = filter.value;
      const history = getHistory();
      const rows = value === "all" ? history : history.filter((h) => h.topClass === value);

      if (!rows.length) {
        container.innerHTML = "<p class='small'>No entries for this filter.</p>";
        return;
      }

      container.innerHTML = rows.map((row) => `
        <article class="history-entry">
          <img src="${row.thumbnail}" alt="History thumbnail" />
          <div class="stack">
            <h3>${escapeHtml(row.topClass)} (${row.confidence}%)</h3>
            <p class="small">${escapeHtml(row.date)}</p>
            <p class="small">${row.probabilities.map((p) => `${escapeHtml(diseases[p.id].name)} ${p.value}%`).join(" | ")}</p>
          </div>
          <button class="btn btn-ghost" type="button" data-remove="${row.id}">Remove</button>
        </article>
      `).join("");

      container.querySelectorAll("[data-remove]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const next = getHistory().filter((item) => item.id !== btn.getAttribute("data-remove"));
          localStorage.setItem(STORAGE_HISTORY, JSON.stringify(next));
          render();
          toast("History item removed", "info");
        });
      });

      initRipple();
    };

    filter.addEventListener("change", render);
    clearAll.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_HISTORY);
      render();
      toast("All history cleared", "info");
    });

    render();
  }

  function accordionMarkup(items) {
    return items.map((item, idx) => `
      <div class="accordion-item">
        <button class="accordion-trigger" type="button" aria-expanded="${idx === 0 ? "true" : "false"}">
          <span>${escapeHtml(item.title)}</span>
          <span class="icon">${getIconByName("chevron")}</span>
        </button>
        <div class="accordion-panel" style="max-block-size:${idx === 0 ? "320px" : "0px"}">
          <div class="accordion-panel-inner">${item.content}</div>
        </div>
      </div>
    `).join("");
  }

  function bindAccordions(scope) {
    scope.querySelectorAll(".accordion-trigger").forEach((btn) => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", () => {
        const panel = btn.nextElementSibling;
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        panel.style.maxBlockSize = open ? "0px" : `${panel.scrollHeight}px`;
      });
    });
  }

  function animateBars(scope) {
    requestAnimationFrame(() => {
      scope.querySelectorAll(".bar-fill").forEach((bar) => {
        bar.style.inlineSize = `${bar.getAttribute("data-target")}%`;
      });
    });
  }

  function setStatus(node, state, text) {
    node.className = `status ${state}`;
    node.innerHTML = `<span class="dot"></span>${escapeHtml(text)}`;
  }

  function generateProbabilities(ids) {
    const raw = ids.map(() => Math.random());
    const sum = raw.reduce((a, b) => a + b, 0);
    return raw.map((v, i) => ({ id: ids[i], value: v / sum }));
  }

  function getHistory() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (_e) {
      return [];
    }
  }

  function toast(text, type = "info") {
    const root = byId("toast-root");
    if (!root) return;
    const icon = type === "success" ? "check" : type === "error" ? "warning" : "info";
    const node = document.createElement("div");
    node.className = `toast ${type}`;
    node.innerHTML = `<span class="icon">${getIconByName(icon)}</span><span>${escapeHtml(text)}</span>`;
    root.appendChild(node);
    setTimeout(() => node.remove(), 2800);
  }

  function fallbackDiseases() {
    return {
      normal: {
        id: "normal",
        name: "Normal",
        name_ar: "طبيعي",
        short: "Healthy anterior eye appearance with no obvious inflammatory or degenerative signs.",
        short_ar: "مظهر طبيعي للجزء الأمامي من العين دون علامات واضحة لالتهاب أو تغيرات مرضية.",
        symptoms_ar: ["لا يوجد ألم", "لا يوجد احمرار ملحوظ", "رؤية مستقرة وواضحة"],
        red_flags_ar: ["انخفاض مفاجئ في الرؤية", "ألم شديد بالعين", "إصابة مباشرة أو صدمة للعين"],
        safe_tips_ar: ["استخدم نظارات واقية من الأشعة فوق البنفسجية", "تجنب فرك العين باليد", "حافظ على الفحص الدوري للعين"],
        when_to_see_doctor_ar: "راجع طبيب العيون فوراً عند ظهور ألم شديد أو احمرار مستمر أو تدهور مفاجئ في الرؤية.",
        risk_level: "Low"
      }
    };
  }

  function byId(id) { return document.getElementById(id); }
  function delay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
  function uid() { return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`; }
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
