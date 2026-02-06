let stores = [];

async function loadStores() {
  const res = await fetch("stores.json");
  stores = await res.json();

  stores = stores.map((s) => ({
    ...s,
    categories: s.categories || (s.category ? [s.category] : []),
  }));

  // after stores are loaded, build UI that depends on them
  renderCategories();
  renderStores();
}

function makeLabelIdFromName(name) {
  return (
    "text-" +
    name
      .toLowerCase()
      .replace(/&/g, "and") // & → and
      .replace(/['’]/g, "") // remove straight & curly apostrophes
      // .replace(/&#39;/, "")        // you can delete this line, it never matches
      .replace(/[^a-z0-9]+/g, "-") // non-alphanumerics → dashes
      .replace(/^-+|-+$/g, "") // trim dashes at ends
  );
}

let state = {
  activeCategory: "All",
  searchQuery: "",
  fontSize: 16,
  currentFloor: "upper",
  zoom: 1.1,
  panX: 0,
  panY: 0,
  isDragging: false,
  startX: 0,
  startY: 0,
  didDrag: false,
  suppressClickUntil: 0,
  dragThreshold: 6,
  isPinching: false,
  pinchStartDist: 0,
  pinchStartZoom: 1,
  font: "sans",
  highContrast: false,
  darkMode: false,
  language: "en",
  activeStoreName: "",
  hoverPinned: false,
};
// this object tracks
// -- which category is active (activeCategory)
// -- search text (searchQuery)
// -- current floor (currentFloor)
// -- map zoom / pan (zoom, panX, panY)
// -- font settings and contrast

const mapContainer = document.getElementById("mapContainer");
const mapViewport = document.getElementById("mapViewport");

function toggleModal(show) {
  document.getElementById("settingsModal").classList.toggle("hidden", !show);
}

function toggleAbout(show) {
  document.getElementById("aboutModal").classList.toggle("hidden", !show);
}

function changeFontSize(delta) {
  state.fontSize = Math.min(Math.max(state.fontSize + delta * 2, 12), 24);
  document.documentElement.style.fontSize = `${state.fontSize}px`;
  updateMobileMenuLayout();
}
function resetFontSize() {
  state.fontSize = 16;
  document.documentElement.style.fontSize = "16px";
  updateMobileMenuLayout();
}
function changeLanguage(lang) {
  state.language = lang;
  document.documentElement.setAttribute("lang", lang);
  updateLanguageUI();
  updatePromoText(true);
  announceStatus(`Language changed.`);
}
function updateContrastToggleUI() {
  document
    .getElementById("contrastToggle")
    .classList.toggle("bg-[#22c55e]", state.highContrast);
  document.getElementById("contrastDot").style.transform = state.highContrast
    ? "translateX(1.25rem)"
    : "translateX(0)";
  const btn = document.getElementById("contrastToggleBtn");
  if (btn) btn.setAttribute("aria-pressed", state.highContrast ? "true" : "false");
}
function updateDarkToggleUI() {
  document
    .getElementById("darkToggle")
    .classList.toggle("bg-[#22c55e]", state.darkMode);
  document.getElementById("darkDot").style.transform = state.darkMode
    ? "translateX(1.25rem)"
    : "translateX(0)";
  const btn = document.getElementById("darkToggleBtn");
  if (btn) btn.setAttribute("aria-pressed", state.darkMode ? "true" : "false");
}

function updateMobileMenuLayout() {
  document.body.classList.toggle("mobile-menu-stack", state.fontSize >= 20);
}

function translateCategory(cat, lang) {
  if (!cat || lang === "en") return cat;
  const key = cat.toLowerCase().replace(/[’']/g, "");
  const maps = {
    fr: {
      all: "Tous",
      fashion: "Mode",
      food: "Restauration",
      drink: "Boissons",
      dining: "Restauration",
      beauty: "Beauté",
      health: "Santé",
      electronics: "Électronique",
      jewelry: "Bijouterie",
      jewellery: "Bijouterie",
      accessories: "Accessoires",
      sports: "Sports",
      shoes: "Chaussures",
      footwear: "Chaussures",
      kids: "Enfants",
      home: "Maison",
      services: "Services",
      entertainment: "Divertissement",
      leisure: "Loisirs",
      hobbies: "Passe-temps",
      groceries: "Épicerie",
      gifts: "Cadeaux",
      apparel: "Mode",
      clothing: "Vêtements",
      technology: "Technologie",
      tech: "Technologie",
      toys: "Jouets",
      furniture: "Meubles",
      outdoor: "Plein air",
      pet: "Animaux",
      women: "Femme",
      men: "Homme",
      womens: "Femmes",
      mens: "Hommes",
    },
    ja: {
      all: "すべて",
      fashion: "ファッション",
      food: "フード",
      drink: "ドリンク",
      dining: "ダイニング",
      beauty: "ビューティー",
      health: "ヘルス",
      electronics: "エレクトロニクス",
      jewelry: "ジュエリー",
      jewellery: "ジュエリー",
      accessories: "アクセサリー",
      sports: "スポーツ",
      shoes: "シューズ",
      footwear: "フットウェア",
      kids: "キッズ",
      home: "ホーム",
      services: "サービス",
      entertainment: "エンタメ",
      leisure: "レジャー",
      hobbies: "ホビー",
      groceries: "グロサリー",
      gifts: "ギフト",
      apparel: "アパレル",
      clothing: "アパレル",
      technology: "テクノロジー",
      tech: "テック",
      toys: "トイ",
      furniture: "家具",
      outdoor: "アウトドア",
      pet: "ペット",
      women: "レディース",
      men: "メンズ",
      womens: "レディース",
      mens: "メンズ",
    },
  };
  const map = maps[lang] || {};
  if (map[key]) return map[key];
  const wordMaps = {
    fr: {
      fashion: "Mode",
      apparel: "Mode",
      clothing: "Vêtements",
      beauty: "Beauté",
      health: "Santé",
      wellness: "Bien-être",
      electronics: "Électronique",
      technology: "Technologie",
      accessories: "Accessoires",
      jewelry: "Bijouterie",
      jewellery: "Bijouterie",
      shoes: "Chaussures",
      sports: "Sports",
      kids: "Enfants",
      home: "Maison",
      services: "Services",
      entertainment: "Divertissement",
      leisure: "Loisirs",
      hobbies: "Passe-temps",
      groceries: "Épicerie",
      gifts: "Cadeaux",
      food: "Restauration",
      drink: "Boissons",
      dining: "Restauration",
      cafe: "Café",
      restaurant: "Restaurant",
      toys: "Jouets",
      furniture: "Meubles",
      outdoor: "Plein air",
      pet: "Animaux",
      women: "Femme",
      men: "Homme",
    },
    ja: {
      fashion: "ファッション",
      apparel: "アパレル",
      clothing: "アパレル",
      beauty: "ビューティー",
      health: "ヘルス",
      wellness: "ウェルネス",
      electronics: "エレクトロニクス",
      technology: "テクノロジー",
      tech: "テック",
      accessories: "アクセサリー",
      jewelry: "ジュエリー",
      jewellery: "ジュエリー",
      shoes: "シューズ",
      footwear: "フットウェア",
      sports: "スポーツ",
      kids: "キッズ",
      home: "ホーム",
      services: "サービス",
      entertainment: "エンタメ",
      leisure: "レジャー",
      hobbies: "ホビー",
      groceries: "グロサリー",
      gifts: "ギフト",
      food: "フード",
      drink: "ドリンク",
      dining: "ダイニング",
      cafe: "カフェ",
      restaurant: "レストラン",
      toys: "トイ",
      furniture: "家具",
      outdoor: "アウトドア",
      pet: "ペット",
      women: "レディース",
      men: "メンズ",
      womens: "レディース",
      mens: "メンズ",
    },
  };
  const wm = wordMaps[lang] || {};
  const words = cat.split(/(\s+|\/|&|,|-|•)/);
  return words
    .map((w) => {
      const keyWord = w.trim().toLowerCase().replace(/[’']/g, "");
      if (!keyWord) return w;
      return wm[keyWord] || w;
    })
    .join("");
}

function translateStoreName(name, lang) {
  if (!name || lang === "en") return name;
  const rules = {
    fr: [
      [/\bCenter\b/gi, "Centre"],
      [/\bCentre\b/gi, "Centre"],
      [/\bShop\b/gi, "Boutique"],
      [/\bStore\b/gi, "Magasin"],
      [/\bPharmacy\b/gi, "Pharmacie"],
      [/\bOptical\b/gi, "Optique"],
      [/\bJewelry\b/gi, "Bijouterie"],
      [/\bJewellery\b/gi, "Bijouterie"],
      [/\bShoes\b/gi, "Chaussures"],
      [/\bAccessories\b/gi, "Accessoires"],
      [/\bBeauty\b/gi, "Beauté"],
      [/\bSalon\b/gi, "Salon"],
      [/\bSpa\b/gi, "Spa"],
      [/\bCafe\b/gi, "Café"],
      [/\bCoffee\b/gi, "Café"],
      [/\bRestaurant\b/gi, "Restaurant"],
      [/\bKids\b/gi, "Enfants"],
      [/\bMen\b/gi, "Homme"],
      [/\bWomen\b/gi, "Femme"],
      [/\bHome\b/gi, "Maison"],
      [/\bSports\b/gi, "Sports"],
      [/\bBookstore\b/gi, "Librairie"],
    ],
    ja: [
      [/\bCenter\b/gi, "センター"],
      [/\bCentre\b/gi, "センター"],
      [/\bShop\b/gi, "ショップ"],
      [/\bStore\b/gi, "ストア"],
      [/\bPharmacy\b/gi, "薬局"],
      [/\bOptical\b/gi, "オプティカル"],
      [/\bJewelry\b/gi, "ジュエリー"],
      [/\bJewellery\b/gi, "ジュエリー"],
      [/\bShoes\b/gi, "シューズ"],
      [/\bAccessories\b/gi, "アクセサリー"],
      [/\bBeauty\b/gi, "ビューティー"],
      [/\bSalon\b/gi, "サロン"],
      [/\bSpa\b/gi, "スパ"],
      [/\bCafe\b/gi, "カフェ"],
      [/\bCoffee\b/gi, "コーヒー"],
      [/\bRestaurant\b/gi, "レストラン"],
      [/\bKids\b/gi, "キッズ"],
      [/\bMen\b/gi, "メンズ"],
      [/\bWomen\b/gi, "レディース"],
      [/\bHome\b/gi, "ホーム"],
      [/\bSports\b/gi, "スポーツ"],
      [/\bBookstore\b/gi, "書店"],
    ],
  };
  let translated = name;
  (rules[lang] || []).forEach(([re, rep]) => {
    translated = translated.replace(re, rep);
  });
  return translated;
}

function translateFloorLabel(floor, lang) {
  const dict = {
    en: { upper: "UPPER", lower: "LOWER", level: "LEVEL" },
    fr: { upper: "HAUT", lower: "BAS", level: "NIVEAU" },
    ja: { upper: "上", lower: "下", level: "階" },
  };
  const d = dict[lang] || dict.en;
  return floor === "lower" ? d.lower : d.upper;
}

function updateLanguageUI() {
  const dict = {
    en: {
      search_placeholder: "Search brands...",
      store_details: "Store Details",
      hours: "Hours",
      location: "Location",
      upper: "Upper",
      lower: "Lower",
      preferences: "Preferences",
      text_size: "Text Size",
      default: "Default",
      language: "Language",
      dark_theme: "Dark Theme",
      high_contrast: "High Contrast Mode",
      apply: "Apply",
      about_center: "About Center",
      address: "Address",
      enquiries: "Enquiries",
      close: "Close",
      stores_label: "STORES",
      open_label: "Open",
      navigate_mall: "navigate the mall",
      learn_more: "Learn More",
    },
    fr: {
      search_placeholder: "Rechercher des marques...",
      store_details: "Détails du magasin",
      hours: "Horaires",
      location: "Emplacement",
      upper: "Haut",
      lower: "Bas",
      preferences: "Préférences",
      text_size: "Taille du texte",
      default: "Par défaut",
      language: "Langue",
      dark_theme: "Thème sombre",
      high_contrast: "Contraste élevé",
      apply: "Appliquer",
      about_center: "À propos du centre",
      address: "Adresse",
      enquiries: "Renseignements",
      close: "Fermer",
      stores_label: "MAGASINS",
      open_label: "Ouvert",
      navigate_mall: "naviguer dans le centre",
      learn_more: "En savoir plus",
    },
    ja: {
      search_placeholder: "ブランドを検索...",
      store_details: "店舗詳細",
      hours: "営業時間",
      location: "場所",
      upper: "上",
      lower: "下",
      preferences: "設定",
      text_size: "文字サイズ",
      default: "デフォルト",
      language: "言語",
      dark_theme: "ダークテーマ",
      high_contrast: "ハイコントラスト",
      apply: "適用",
      about_center: "施設情報",
      address: "住所",
      enquiries: "お問い合わせ",
      close: "閉じる",
      stores_label: "店舗数",
      open_label: "営業中",
      navigate_mall: "モールをナビゲート",
      learn_more: "詳細を見る",
    },
  };
  const lang = dict[state.language] || dict.en;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (lang[key]) el.textContent = lang[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (lang[key]) el.setAttribute("placeholder", lang[key]);
  });
  if (lang.navigate_mall) {
    document.title = `cribbs causeway | ${lang.navigate_mall}`;
  }
  renderCategories();
  renderStores();
  if (document.getElementById("sidebarSlider").classList.contains("show-detail")) {
    updateSelectedStoreDetails();
  }
}
function updateLogoTheme() {
  const useDark = state.darkMode || state.highContrast;
  document.querySelectorAll(".logo-img[data-light-src]").forEach((img) => {
    const lightSrc = img.getAttribute("data-light-src");
    const darkSrc = img.getAttribute("data-dark-src") || lightSrc;
    img.src = useDark ? darkSrc : lightSrc;
  });
}
function setContrast(enabled) {
  state.highContrast = enabled;
  document.body.classList.toggle("high-contrast", state.highContrast);
  updateContrastToggleUI();
  updateLogoTheme();
  try {
    localStorage.setItem(
      "themeContrast",
      state.highContrast ? "on" : "off"
    );
  } catch (e) {}
}
function setDarkMode(enabled) {
  state.darkMode = enabled;
  document.body.classList.toggle("dark-theme", state.darkMode);
  updateDarkToggleUI();
  updateLogoTheme();
  try {
    localStorage.setItem("themeDark", state.darkMode ? "on" : "off");
  } catch (e) {}
}
function toggleContrast() {
  const next = !state.highContrast;
  setContrast(next);
  if (next && state.darkMode) {
    setDarkMode(false);
  }
}
function toggleDarkMode() {
  const next = !state.darkMode;
  setDarkMode(next);
  if (next && state.highContrast) {
    setContrast(false);
  }
}

function initThemePreference() {
  try {
    const darkPref = localStorage.getItem("themeDark");
    const contrastPref = localStorage.getItem("themeContrast");
    if (darkPref === "on") {
      setDarkMode(true);
    }
    if (contrastPref === "on") {
      setContrast(true);
      if (state.darkMode) setDarkMode(false);
    }
  } catch (e) {}
}

window.addEventListener("DOMContentLoaded", initThemePreference);

function initMobileDirectoryUI() {
  const searchInput = document.getElementById("searchInput");
  const menuBtn = document.getElementById("mobileMenuBtn");
  const shopBtn = document.getElementById("mobileShopBtn");
  if (!searchInput || !menuBtn || !shopBtn) return;

  const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
  const showList = (show) =>
    document.body.classList.toggle("mobile-show-list", show);
  const showSearch = (show) =>
    document.body.classList.toggle("mobile-search-open", show);

  menuBtn.addEventListener("click", () => {
    if (!isMobile()) return;
    document.body.classList.remove("mobile-show-list", "mobile-show-filters");
    searchInput.blur();
    showSearch(false);
  });
  shopBtn.addEventListener("click", () => {
    if (!isMobile()) return;
    showSearch(true);
    showList(true);
    document.body.classList.add("mobile-show-filters");
  });

  const revealList = () => {
    if (!isMobile()) return;
    showSearch(true);
    showList(true);
    document.body.classList.add("mobile-show-filters");
  };

  searchInput.addEventListener("focus", revealList);
  searchInput.addEventListener("input", revealList);
  searchInput.addEventListener("click", revealList);

  window.addEventListener("resize", () => {
    if (!isMobile()) {
      document.body.classList.remove(
        "mobile-show-filters",
        "mobile-show-list",
        "mobile-show-bottom-menu"
      );
      showSearch(false);
    }
  });
}

window.addEventListener("DOMContentLoaded", initMobileDirectoryUI);
window.addEventListener("DOMContentLoaded", updateLanguageUI);

const sidebarToggle = document.getElementById("sidebarToggle");
if (sidebarToggle) {
  sidebarToggle.addEventListener("click", () => {
    document.body.classList.toggle("sidebar-collapsed");
    const isCollapsed = document.body.classList.contains("sidebar-collapsed");
    sidebarToggle.setAttribute("aria-expanded", String(!isCollapsed));
  });
}

function updateTransform() {
  mapContainer.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
}

function isMobileView() {
  return window.matchMedia("(max-width: 767px)").matches;
}

mapViewport.addEventListener("mousedown", (e) => {
  e.preventDefault();
  state.isDragging = true;
  state.didDrag = false;
  state.startX = e.clientX - state.panX;
  state.startY = e.clientY - state.panY;
  document.body.classList.add("map-dragging");
});

mapViewport.addEventListener(
  "touchstart",
  (e) => {
    if (e.touches.length === 2) {
      const [a, b] = e.touches;
      const dx = a.clientX - b.clientX;
      const dy = a.clientY - b.clientY;
      state.isPinching = true;
      state.isDragging = false;
      state.didDrag = true;
      state.pinchStartDist = Math.hypot(dx, dy);
      state.pinchStartZoom = state.zoom;
      document.body.classList.add("map-dragging");
      return;
    }
    const touch = e.touches[0];
    if (!touch) return;
    state.isPinching = false;
    state.isDragging = true;
    state.didDrag = false;
    state.startX = touch.clientX - state.panX;
    state.startY = touch.clientY - state.panY;
    document.body.classList.add("map-dragging");
  },
  { passive: false }
);

mapViewport.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    if (e.ctrlKey) {
      const factor = e.deltaY < 0 ? 1.05 : 0.95;
      zoomMap(factor);
      return;
    }
    state.panX -= e.deltaX;
    state.panY -= e.deltaY;
    updateTransform();
  },
  { passive: false }
);

window.addEventListener("mousemove", (e) => {
  if (!state.isDragging) return;

  e.preventDefault();
  const newPanX = e.clientX - state.startX;
  const newPanY = e.clientY - state.startY;
  if (
    !state.didDrag &&
    (Math.abs(newPanX - state.panX) > state.dragThreshold ||
      Math.abs(newPanY - state.panY) > state.dragThreshold)
  ) {
    state.didDrag = true;
  }
  state.panX = newPanX;
  state.panY = newPanY;
  updateTransform();
});

window.addEventListener(
  "touchmove",
  (e) => {
    if (state.isPinching && e.touches.length === 2) {
      e.preventDefault();
      const [a, b] = e.touches;
      const dx = a.clientX - b.clientX;
      const dy = a.clientY - b.clientY;
      const dist = Math.hypot(dx, dy);
      const factor = dist / state.pinchStartDist;
      state.zoom = Math.min(Math.max(state.pinchStartZoom * factor, 0.4), 3);
      updateTransform();
      return;
    }
    if (!state.isDragging) return;
    const touch = e.touches[0];
    if (!touch) return;
    e.preventDefault();
    const newPanX = touch.clientX - state.startX;
    const newPanY = touch.clientY - state.startY;
    if (
      !state.didDrag &&
      (Math.abs(newPanX - state.panX) > state.dragThreshold ||
        Math.abs(newPanY - state.panY) > state.dragThreshold)
    ) {
      state.didDrag = true;
    }
    state.panX = newPanX;
    state.panY = newPanY;
    updateTransform();
  },
  { passive: false }
);

window.addEventListener("mouseup", () => {
  state.isDragging = false;
  if (state.didDrag) state.suppressClickUntil = Date.now() + 250;
  document.body.classList.remove("map-dragging");
});

window.addEventListener("touchend", () => {
  if (state.didDrag) state.suppressClickUntil = Date.now() + 300;
  state.isDragging = false;
  state.isPinching = false;
  document.body.classList.remove("map-dragging");
});

function zoomMap(factor) {
  state.zoom = Math.min(Math.max(state.zoom * factor, 0.4), 3);
  updateTransform();
}

const MAP_WIDTH = 1256;
const MAP_HEIGHT = 696;

function resetView() {
  state.zoom = 1.1;
  state.panX = (mapViewport.offsetWidth - MAP_WIDTH * state.zoom) / 2;
  state.panY = (mapViewport.offsetHeight - MAP_HEIGHT * state.zoom) / 2;
  updateTransform();
}

function switchFloor(floor) {
  state.currentFloor = floor;

  const lower = document.getElementById("lowerFloorLayer");
  if (lower) lower.classList.toggle("floor-hidden", floor !== "lower");

  const upper = document.getElementById("upperFloorLayer");
  if (upper) upper.classList.toggle("floor-hidden", floor !== "upper");

  document.getElementById(
    "btn-lower"
  ).className = `level-btn glass-panel px-6 py-2 btn-modern text-xs font-bold shadow-lg transition-all uppercase tracking-widest ${
    floor === "lower"
      ? "level-active bg-[#003A70] text-white border-[#003A70]"
      : "level-inactive bg-white text-slate-900 border-slate-200"
  }`;

  document.getElementById(
    "btn-upper"
  ).className = `level-btn glass-panel px-6 py-2 btn-modern text-xs font-bold shadow-lg transition-all uppercase tracking-widest ${
    floor === "upper"
      ? "level-active bg-[#003A70] text-white border-[#003A70]"
      : "level-inactive bg-white text-slate-900 border-slate-200"
  }`;

  const mobileUpper = document.getElementById("mobileFloorUpperBtn");
  const mobileLower = document.getElementById("mobileFloorLowerBtn");
  if (mobileUpper && mobileLower) {
    mobileUpper.classList.toggle("mobile-floor-active", floor === "upper");
    mobileLower.classList.toggle("mobile-floor-active", floor === "lower");
    mobileUpper.setAttribute("aria-pressed", floor === "upper" ? "true" : "false");
    mobileLower.setAttribute("aria-pressed", floor === "lower" ? "true" : "false");
  }
  const btnUpper = document.getElementById("btn-upper");
  const btnLower = document.getElementById("btn-lower");
  if (btnUpper && btnLower) {
    btnUpper.setAttribute("aria-pressed", floor === "upper" ? "true" : "false");
    btnLower.setAttribute("aria-pressed", floor === "lower" ? "true" : "false");
  }

  renderStores();
  announceStatus(
    `Floor changed to ${translateFloorLabel(floor, state.language)}.`
  );
}

// these are functions are why the filters and shlp list appear
function renderCategories() {
  const cats = ["All", ...new Set(stores.flatMap((s) => s.categories || []))];

  document.getElementById("categoryContainer").innerHTML = cats
    .map(
      (cat) => `
        <button data-cat="${cat}"
          class="px-2.5 py-1 btn-modern text-[0.625rem] font-semibold border tracking-wider transition-all
          ${
            state.activeCategory === cat
              ? "filter-active !font-bold"
              : "bg-white border-slate-200 text-slate-400 hover:border-[#003A70]"
          }"
          aria-pressed="${state.activeCategory === cat ? "true" : "false"}">
          ${translateCategory(cat, state.language).toUpperCase()}
        </button>
      `
    )
    .join("");
}

function filterCategory(cat) {
  state.activeCategory = cat;
  renderCategories();
  renderStores();
  announceStatus(
    `Category filter set to ${translateCategory(cat, state.language)}.`
  );
}

document.getElementById("categoryContainer").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-cat]");
  if (!btn) return;
  const cat = btn.getAttribute("data-cat");
  if (cat) filterCategory(cat);
});

function renderStores() {
  const filtered = stores.filter((s) => {
    const matchesFloor = s.floor === state.currentFloor;
    const displayName = translateStoreName(s.name, state.language);
    const query = state.searchQuery.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(query) ||
      displayName.toLowerCase().includes(query);
    const matchesCat =
      state.activeCategory === "All" ||
      (s.categories || []).includes(state.activeCategory);
    return matchesFloor && matchesSearch && matchesCat;
  });

  filtered.sort((a, b) =>
    translateStoreName(a.name, state.language).localeCompare(
      translateStoreName(b.name, state.language)
    )
  );

  document.getElementById("storeCount").textContent = filtered.length;
  document.getElementById("directoryList").innerHTML = filtered
    .map(
      (s) => `
        <button
          data-store-name="${s.name}"
          class="store-card w-full text-left p-3 btn-modern flex items-center gap-4 transition-all hover:bg-white hover:shadow-md active:scale-95 group"
          aria-label="${translateStoreName(s.name, state.language)}. ${getTranslatedLocation(
        s
      )}. ${(s.categories || [])
        .map((c) => translateCategory(c, state.language))
        .join(", ")}"
          role="listitem"
        >
          <div class="w-10 h-10 bg-slate-100 btn-modern flex items-center justify-center text-sm font-black text-slate-400 group-hover:bg-[#003A70] group-hover:text-white transition-colors uppercase">
            ${
              s.logo
                ? `<img src="${s.logo}" alt="${s.name} logo" class="w-full h-full object-cover" />`
                : s.name[0] || ""
            }
          </div>
          <div class="flex-1">
            <h4 class="text-sm font-bold text-slate-800 leading-tight">${
              translateStoreName(s.name, state.language)
            }</h4>
            <p class="text-[0.8rem] text-slate-400">
              ${(s.categories || [])
                .map((c) => translateCategory(c, state.language))
                .join(" • ")}
            </p>
          </div>
          <i class="fa-solid fa-chevron-right text-slate-200 text-sm group-hover:text-[#003A70] transition-all"></i>
        </button>
      `
    )
    .join("");
  announceStatus(`${filtered.length} stores shown.`);
}

document.getElementById("directoryList").addEventListener("click", (e) => {
  const btn = e.target.closest(".store-card");
  if (!btn) return;
  const name = btn.getAttribute("data-store-name");
  if (name) {
    selectStore(name);
    document.body.classList.remove("mobile-show-list", "mobile-show-filters");
  }
});

function selectStore(name) {
  if (document.body.classList.contains("sidebar-collapsed")) {
    document.body.classList.remove("sidebar-collapsed");
    const sidebarToggle = document.getElementById("sidebarToggle");
    if (sidebarToggle) sidebarToggle.setAttribute("aria-expanded", "true");
  }
  const learnMoreBtn = document.getElementById("learnMoreBtn");
  const store = stores.find((s) => s.name === name);
  state.activeStoreName = name;

  if (learnMoreBtn) {
    if (store.learnMore) {
      learnMoreBtn.disabled = false;
      learnMoreBtn.classList.remove("opacity-50", "cursor-not-allowed");
      learnMoreBtn.onclick = () => {
        window.open(store.learnMore, "_blank", "noopener");
      };
    } else {
      // no link disabled button
      learnMoreBtn.disabled = true;
      learnMoreBtn.classList.add("opacity-50", "cursor-not-allowed");
      learnMoreBtn.onclick = null;
    }
  }

  const aboutEl = document.getElementById("storeAboutDetail");
  if (aboutEl) {
    const aboutText =
      state.language === "ja"
        ? store.about_ja || store.about
        : state.language === "fr"
        ? store.about_fr || store.about
        : store.about;
    // If you allow <br> etc. in about text, use innerHTML; otherwise use textContent
    aboutEl.innerHTML = aboutText || "No additional information available.";
  }

  if (!store) return;

  if (store.floor !== state.currentFloor) switchFloor(store.floor);

  // 1) Clear active from all units AND labels
  document
    .querySelectorAll(".unit")
    .forEach((u) => u.classList.remove("active"));
  document
    .querySelectorAll(".text-unit")
    .forEach((t) => t.classList.remove("active"));

  // 2) Activate the rectangle (unit)
  const unit = document.querySelector(`[data-store="${name}"]`);
  if (unit) {
    unit.classList.add("active");
  }

  // 3) Activate the label for this store
  const labelId = makeLabelIdFromName(store.name);
  const label = document.getElementById(labelId);
  if (label) {
    label.classList.add("active");
  }

  updateSelectedStoreDetails();
  announceStatus(`${translateStoreName(store.name, state.language)} selected.`);

  const heroImg = document.getElementById("storeHeroImage");
  if (heroImg && store.image) {
    heroImg.src = store.image;
    heroImg.alt =
      store.imageAlt ||
      `Header image for ${translateStoreName(store.name, state.language)}`;
  }
  document.getElementById("storeLocationDetail").textContent =
    getTranslatedLocation(store);
  document.getElementById("sidebarSlider").classList.add("show-detail");
  document.body.classList.add("detail-open");
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.title = "Close";
    backBtn.innerHTML = '<i class="fa-solid fa-xmark text-sm"></i>';
  }
  const detailScroll = document.getElementById("detailScroll");
  if (detailScroll) {
    detailScroll.scrollTop = 0;
  }
  const hoursEl = document.getElementById("storeHoursDetail");
  if (hoursEl) {
    hoursEl.innerHTML = store.hours || "Hours not available";
  }
}

function showDirectory() {
  document.getElementById("sidebarSlider").classList.remove("show-detail");
  document.body.classList.remove("detail-open");
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.title = "Back";
    backBtn.innerHTML = '<i class="fa-solid fa-arrow-left text-sm"></i>';
  }
  const hoverCard = document.getElementById("storeHoverCard");
  if (hoverCard) hoverCard.classList.remove("show");
  state.hoverPinned = false;
  state.activeStoreName = "";
  document
    .querySelectorAll(".unit")
    .forEach((u) => u.classList.remove("active"));
  document
    .querySelectorAll(".text-unit")
    .forEach((t) => t.classList.remove("active"));

  if (isMobileView()) {
    const searchInput = document.getElementById("searchInput");
    const shouldShowList =
      document.body.classList.contains("mobile-search-open") ||
      (searchInput && searchInput.value.trim().length > 0);
    if (shouldShowList) {
      document.body.classList.add("mobile-show-list", "mobile-show-filters");
    }
  }
}

function updateSelectedStoreDetails() {
  if (!state.activeStoreName) return;
  const store = stores.find((s) => s.name === state.activeStoreName);
  if (!store) return;
  document.getElementById("storeNameDetail").textContent = translateStoreName(
    store.name,
    state.language
  );
  document.getElementById("storeCategoryDetail").textContent = (
    store.categories || []
  )
    .map((c) => translateCategory(c, state.language))
    .join(" • ");
  const locationEl = document.getElementById("storeLocationDetail");
  if (locationEl) {
    locationEl.textContent = getTranslatedLocation(store);
  }
}

function announceStatus(message) {
  const statusEl = document.getElementById("srStatus");
  if (!statusEl) return;
  statusEl.textContent = message;
}

function getTranslatedLocation(store) {
  const levelWord = {
    en: "LEVEL",
    fr: "NIVEAU",
    ja: "階",
  }[state.language] || "LEVEL";
  if (state.language === "ja") {
    return `${translateFloorLabel(store.floor, state.language)}${levelWord}、${store.unit}`;
  }
  return `${translateFloorLabel(store.floor, state.language)} ${levelWord}, ${
    store.unit
  }`;
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  state.searchQuery = e.target.value;
  renderStores();
  announceStatus("Search updated.");
});

function initMapInteraction() {
  const hoverCard = document.getElementById("storeHoverCard");
  const canHover = window.matchMedia("(hover: hover)").matches;

  function showHover(store, x, y) {
    if (!hoverCard || !store) return;
    const name = translateStoreName(store.name, state.language);
    const logoHtml = store.logo
      ? `<img src="${store.logo}" alt="" />`
      : (name[0] || "");
    hoverCard.innerHTML = `<div class="logo">${logoHtml}</div><div>${name}</div>`;
    hoverCard.classList.add("show");
    const rect = mapViewport.getBoundingClientRect();
    const cardRect = hoverCard.getBoundingClientRect();
    let left = x - rect.left + 12;
    let top = y - rect.top + 12;
    if (left + cardRect.width > rect.width) left = rect.width - cardRect.width - 8;
    if (top + cardRect.height > rect.height) top = rect.height - cardRect.height - 8;
    hoverCard.style.left = `${Math.max(8, left)}px`;
    hoverCard.style.top = `${Math.max(8, top)}px`;
  }

  function hideHover() {
    if (!hoverCard) return;
    if (state.hoverPinned) return;
    hoverCard.classList.remove("show");
  }

  function showHoverFromStoreName(storeName, anchor = "center", pin = false) {
    const store = stores.find((s) => s.name === storeName);
    if (!store || !hoverCard) return;
    state.hoverPinned = pin;
    const unit = document.querySelector(`[data-store="${storeName}"]`);
    if (unit && unit.getBBox) {
      const bbox = unit.getBBox();
      const svg = unit.ownerSVGElement;
      if (svg && svg.getScreenCTM) {
        const matrix = unit.getScreenCTM();
        if (matrix) {
          const cx = bbox.x + bbox.width / 2;
          const cy = bbox.y + bbox.height / 2;
          const x = matrix.a * cx + matrix.c * cy + matrix.e;
          const y = matrix.b * cx + matrix.d * cy + matrix.f;
          showHover(store, x, y);
          return;
        }
      }
    }
    const rect = mapViewport.getBoundingClientRect();
    if (anchor === "list") {
      showHover(store, rect.left + rect.width - 40, rect.top + 80);
    } else {
      showHover(store, rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  }

  document.querySelectorAll(".unit").forEach((u) => {
    u.addEventListener("click", () => {
      if (Date.now() < state.suppressClickUntil) return;
      const storeName = u.getAttribute("data-store");
      if (storeName) selectStore(storeName);
    });

    if (canHover) {
      u.addEventListener("mouseenter", (e) => {
        if (state.hoverPinned) return;
        const storeName = u.getAttribute("data-store");
        const store = stores.find((s) => s.name === storeName);
        if (store) showHover(store, e.clientX, e.clientY);
      });
      u.addEventListener("mousemove", (e) => {
        if (state.hoverPinned) return;
        if (!hoverCard || !hoverCard.classList.contains("show")) return;
        const storeName = u.getAttribute("data-store");
        const store = stores.find((s) => s.name === storeName);
        if (store) showHover(store, e.clientX, e.clientY);
      });
      u.addEventListener("mouseleave", hideHover);
    }

    u.addEventListener("focus", (e) => {
      const storeName = u.getAttribute("data-store");
      showHoverFromStoreName(storeName, "center");
    });
    u.addEventListener("blur", hideHover);
  });

  document
    .getElementById("directoryList")
    .addEventListener("click", (e) => {
      const btn = e.target.closest(".store-card");
      if (!btn) return;
      const storeName = btn.getAttribute("data-store-name");
      if (storeName) {
        showHoverFromStoreName(storeName, "list", true);
      }
    });
}

window.onload = () => {
  switchFloor("upper");
  resetView();
  loadStores();
  initMapInteraction();
  startPromoRotation();
};

window.onresize = resetView;

function startPromoRotation() {
  if (state.promoIndex == null) state.promoIndex = 0;
  updatePromoText(true);
  setInterval(() => {
    const promos = getPromosByLang();
    state.promoIndex = (state.promoIndex + 1) % promos.length;
    updatePromoText();
  }, 5000);
}

const promosByLang = {
  en: [
    "Early Valentine’s deals: 15% OFF jewelry ❤️",
    "Students: Get 20% OFF today 🎓",
    "Flash Sale: Extra 10% OFF inside ⚡",
    "Treat Yourself: 15% OFF Beauty 💄",
    "£8.99 Cinema & Meal deals 🍿",
    "Grab a FREE coffee when you spend £30 ☕",
  ],
  fr: [
    "Offres Saint-Valentin : -15 % sur les bijoux ❤️",
    "Étudiants : -20 % aujourd’hui 🎓",
    "Vente flash : -10 % supplémentaire ⚡",
    "Faites-vous plaisir : -15 % beauté 💄",
    "Offres cinéma + repas à 8,99 £ 🍿",
    "Un café offert dès 30 £ d’achat ☕",
  ],
  ja: [
    "バレンタイン先行セール：ジュエリー15%OFF ❤️",
    "学生限定：本日20%OFF 🎓",
    "フラッシュセール：さらに10%OFF ⚡",
    "ご褒美に：ビューティー15%OFF 💄",
    "映画＋食事セット £8.99 🍿",
    "£30以上でコーヒー無料 ☕",
  ],
};

function getPromosByLang() {
  return promosByLang[state.language] || promosByLang.en;
}

function updatePromoText(resetIndex = false) {
  const promoEl = document.getElementById("promoText");
  if (!promoEl) return;
  const promos = getPromosByLang();
  if (resetIndex) state.promoIndex = 0;
  const index = state.promoIndex || 0;
  promoEl.textContent = promos[index % promos.length];
}
