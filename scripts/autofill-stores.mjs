#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const STORES_PATH = path.join(ROOT, "stores.json");
const STORES_URL = "https://www.mallcribbs.com/stores/";
const LOGOS_DIR = path.join(ROOT, "assets", "logos");
const HEADERS_DIR = path.join(ROOT, "assets", "headers");
const DEFAULT_LOGO = "assets/placeholders/store-logo.svg";
const DEFAULT_IMAGE = "assets/placeholders/store-header.svg";

const NAME_ALIASES = new Map(
  Object.entries({
    "Style Beuty Bar": "Style Beauty Bar",
    Superdrag: "Superdrug",
    "Oliver Bonus": "Oliver Bonas",
    "Holland&Barett": "Holland & Barrett",
    "Pret a Manager": "Pret A Manger",
    "Emest Jones": "Ernest Jones",
    "H&M (Lower)": "H&M",
    "John Lewis & Partners Lower Floor": "John Lewis & Partners",
    "Marks & Spencer Lower Floor": "Marks & Spencer",
    "Build A Bear": "Build-A-Bear Workshop",
    "Dune London": "Dune",
    "Soho Coffee Co": "Soho Coffee",
    Tui: "TUI",
    "Watchlab": "Watch Lab",
    "Frazer Hart": "Fraser Hart",
    "Claire's": "Claires",
  })
);

const LEARN_MORE_OVERRIDES = new Map(
  Object.entries({
    "Claire's": "https://www.mallcribbs.com/stores/claires/",
    "Frazer Hart": "https://www.mallcribbs.com/stores/frazer-hart/",
  })
);

function normalizeName(value = "") {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/\bco\b/g, " company ")
    .replace(/\binc\b/g, " ")
    .replace(/\bltd\b/g, " ")
    .replace(/[()'’:+.,/!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtmlEntities(text = "") {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(text = "") {
  return decodeHtmlEntities(text.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function cleanAboutText(text = "") {
  return String(text)
    .replace(/^\s*class=["']store-profile__about__text["']>\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toTitleCaseHours(raw = "") {
  return raw
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b(am|pm)\b/gi, (m) => m.toLowerCase());
}

function getDomain(urlString = "") {
  try {
    const url = new URL(urlString);
    return url.hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

function scoreMatch(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1000;
  if (a.includes(b) || b.includes(a)) return 600;
  const aTokens = new Set(a.split(" "));
  const bTokens = new Set(b.split(" "));
  let overlap = 0;
  for (const token of aTokens) {
    if (token.length > 1 && bTokens.has(token)) overlap += 1;
  }
  return overlap;
}

function isMissing(value) {
  if (value == null) return true;
  const text = String(value).trim();
  if (!text) return true;
  return /^(hours not available|n\/a|na)$/i.test(text);
}

function needsRealAsset(value, fallbackValue) {
  if (isMissing(value)) return true;
  return String(value).trim() === fallbackValue;
}

function resolveUrl(rawUrl, baseUrl) {
  if (!rawUrl) return "";
  try {
    return new URL(rawUrl, baseUrl).toString();
  } catch {
    return rawUrl;
  }
}

function parseStoreLinksFromListing(html) {
  const links = [];
  const regex = /<a[^>]+href=["']([^"']*\/stores\/[^"']+\/?)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const rawUrl = match[1]?.trim();
    if (!rawUrl) continue;
    const url = rawUrl.startsWith("http") ? rawUrl : `https://www.mallcribbs.com${rawUrl}`;
    const pathname = new URL(url).pathname;
    if (!/^\/stores\/[^/]+\/?$/i.test(pathname)) continue;
    const rawName = stripHtml(match[2] || "");
    const name = rawName || pathname.replace(/^\/stores\//i, "").replace(/\//g, " ");
    links.push({
      name,
      normalized: normalizeName(name),
      url,
    });
  }
  return links;
}

function parseUrlsFromSitemap(xml) {
  const urls = [];
  const regex = /<loc>([^<]+)<\/loc>/gi;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(decodeHtmlEntities(match[1].trim()));
  }
  return urls;
}

function parsePageTitle(html) {
  const ogTitle = parseMeta(html, "og:title");
  if (ogTitle) return ogTitle.replace(/\s*\|\s*Cribbs.*$/i, "").trim();
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!titleMatch?.[1]) return "";
  return stripHtml(titleMatch[1]).replace(/\s*\|\s*Cribbs.*$/i, "").trim();
}

function dedupeLinks(links) {
  const byUrl = new Map();
  for (const link of links) {
    if (!link?.url) continue;
    if (!byUrl.has(link.url)) byUrl.set(link.url, link);
  }
  return [...byUrl.values()];
}

function parseMeta(html, key) {
  const regex = new RegExp(
    `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const match = html.match(regex);
  return match ? decodeHtmlEntities(match[1].trim()) : "";
}

function parseImageByClass(html, className, baseUrl) {
  const patterns = [
    new RegExp(
      `<img[^>]*class=["'][^"']*${className}[^"']*["'][^>]*src=["']([^"']+)["'][^>]*>`,
      "i"
    ),
    new RegExp(
      `<img[^>]*src=["']([^"']+)["'][^>]*class=["'][^"']*${className}[^"']*["'][^>]*>`,
      "i"
    ),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return resolveUrl(decodeHtmlEntities(match[1].trim()), baseUrl);
  }
  return "";
}

function parseAboutFromProfile(html) {
  const classIndex = html.search(/class=["'][^"']*store-profile__about__text[^"']*["']/i);
  if (classIndex === -1) return "";
  const slice = html.slice(classIndex, classIndex + 9000);
  const endIndex = slice.search(/<\/section>|<\/article>|<\/main>/i);
  const block = endIndex > 0 ? slice.slice(0, endIndex) : slice;
  const text = cleanAboutText(stripHtml(block));
  return text.length >= 40 ? text : "";
}

function parseCategoriesFromProfile(html) {
  const classIndex = html.search(/class=["'][^"']*store-profile__categories[^"']*["']/i);
  if (classIndex === -1) return [];
  const slice = html.slice(classIndex, classIndex + 5000);
  const endIndex = slice.search(/<\/section>|<\/article>|<\/main>/i);
  const block = endIndex > 0 ? slice.slice(0, endIndex) : slice;

  const out = [];
  const pushText = (text) => {
    const clean = stripHtml(text).replace(/\s+/g, " ").trim();
    if (!clean) return;
    if (!out.includes(clean)) out.push(clean);
  };

  let match;
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  while ((match = liRegex.exec(block)) !== null) {
    pushText(match[1]);
  }
  const aRegex = /<a[^>]*>([\s\S]*?)<\/a>/gi;
  while ((match = aRegex.exec(block)) !== null) {
    pushText(match[1]);
  }
  return out;
}

function parseHours(html) {
  const classBlocks = [
    /class=["'][^"']*store-profile__opening[^"']*["'][\s\S]{0,1200}/i,
    /class=["'][^"']*store-profile__hours[^"']*["'][\s\S]{0,1200}/i,
    /class=["'][^"']*open[^"']*today[^"']*["'][\s\S]{0,1200}/i,
  ];
  for (const blockPattern of classBlocks) {
    const blockMatch = html.match(blockPattern);
    const block = blockMatch?.[0] || "";
    if (!block) continue;
    const range = block.match(
      /(\d{1,2}(?::\d{2})?\s*(?:am|pm)\s*-\s*\d{1,2}(?::\d{2})?\s*(?:am|pm))/i
    );
    if (range?.[1]) return toTitleCaseHours(range[1]);
  }

  const patterns = [
    /Open Today[^0-9]*(\d{1,2}(?::\d{2})?\s*(?:am|pm)\s*-\s*\d{1,2}(?::\d{2})?\s*(?:am|pm))/i,
    /Opening Times[\s\S]{0,240}?(\d{1,2}(?::\d{2})?\s*(?:am|pm)\s*-\s*\d{1,2}(?::\d{2})?\s*(?:am|pm))/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return toTitleCaseHours(match[1]);
  }
  return "";
}

function parseVisitWebsite(html) {
  const classFirst = html.match(
    /<a[^>]+class=["'][^"']*store-profile__website[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>/i
  );
  if (classFirst?.[1]) {
    return decodeHtmlEntities(classFirst[1].trim());
  }

  const hrefRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const href = decodeHtmlEntities((match[1] || "").trim());
    const text = stripHtml(match[2] || "").toLowerCase();
    if (!href || /^mailto:|^tel:|^#/.test(href)) continue;
    if (/mallcribbs\.com/i.test(href)) continue;
    if (/visit\s+website|official\s+website|shop\s+now|website/i.test(text)) {
      return href;
    }
  }

  hrefRegex.lastIndex = 0;
  while ((match = hrefRegex.exec(html)) !== null) {
    const href = decodeHtmlEntities((match[1] || "").trim());
    if (!href || /^mailto:|^tel:|^#/.test(href)) continue;
    if (/mallcribbs\.com/i.test(href)) continue;
    return href;
  }
  return "";
}

function parseAbout(html) {
  const ogDescription = parseMeta(html, "og:description");
  if (ogDescription) return cleanAboutText(ogDescription);
  const description = parseMeta(html, "description");
  if (description) return cleanAboutText(description);
  return "";
}

function pickAssetFile(storeName, files) {
  const alias = NAME_ALIASES.get(storeName) || storeName;
  const target = normalizeName(alias);
  let best = "";
  let bestScore = -1;
  for (const file of files) {
    const stem = file.replace(/\.[^.]+$/, "");
    const normalized = normalizeName(stem.replace(/\s+(logo|header)$/i, ""));
    const score = scoreMatch(target, normalized);
    if (score > bestScore) {
      bestScore = score;
      best = file;
    }
  }
  return bestScore >= 2 ? best : "";
}

function pickStoreLink(storeName, links) {
  const alias = NAME_ALIASES.get(storeName) || storeName;
  const target = normalizeName(alias);
  let best = null;
  let bestScore = -1;
  for (const link of links) {
    const score = scoreMatch(target, link.normalized);
    if (score > bestScore) {
      bestScore = score;
      best = link;
    }
  }
  if (bestScore < 2) return null;
  return best;
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      accept: "text/html,application/xhtml+xml",
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

async function main() {
  const raw = await fs.readFile(STORES_PATH, "utf8");
  const stores = JSON.parse(raw);
  const logoFiles = await fs.readdir(LOGOS_DIR).catch(() => []);
  const headerFiles = await fs.readdir(HEADERS_DIR).catch(() => []);

  const storesHtml = await fetchText(STORES_URL);
  let storeLinks = parseStoreLinksFromListing(storesHtml);

  // Fallback when listing markup changes or content is JS-rendered.
  if (!storeLinks.length) {
    const sitemapUrls = [
      "https://www.mallcribbs.com/sitemap_index.xml",
      "https://www.mallcribbs.com/post-sitemap.xml",
      "https://www.mallcribbs.com/page-sitemap.xml",
      "https://www.mallcribbs.com/store-sitemap.xml",
      "https://www.mallcribbs.com/stores-sitemap.xml",
    ];
    const candidateStorePageUrls = new Set();

    for (const sitemapUrl of sitemapUrls) {
      try {
        const xml = await fetchText(sitemapUrl);
        for (const loc of parseUrlsFromSitemap(xml)) {
          if (/\/stores\/[^/]+\/?$/i.test(new URL(loc).pathname)) {
            candidateStorePageUrls.add(loc);
          } else if (/sitemap/i.test(loc) && /store|post|page/i.test(loc)) {
            try {
              const subXml = await fetchText(loc);
              for (const subLoc of parseUrlsFromSitemap(subXml)) {
                if (/\/stores\/[^/]+\/?$/i.test(new URL(subLoc).pathname)) {
                  candidateStorePageUrls.add(subLoc);
                }
              }
            } catch {
              // ignore unavailable sub-sitemaps
            }
          }
        }
      } catch {
        // ignore missing sitemap endpoint
      }
    }

    for (const pageUrl of candidateStorePageUrls) {
      const slugName = new URL(pageUrl).pathname
        .replace(/^\/stores\//i, "")
        .replace(/\/$/, "")
        .replace(/-/g, " ");
      storeLinks.push({
        name: slugName,
        normalized: normalizeName(slugName),
        url: pageUrl,
      });
    }
  }

  storeLinks = dedupeLinks(storeLinks);
  if (!storeLinks.length) {
    throw new Error(
      "No store links were parsed from mallcribbs stores page or sitemap fallbacks."
    );
  }

  const byUrlCache = new Map();

  const summary = {
    matchedLinks: 0,
    updatedLearnMore: 0,
    updatedLogo: 0,
    updatedImage: 0,
    updatedCategories: 0,
    updatedHours: 0,
    updatedAbout: 0,
    lowerFloorUpdated: 0,
    unmatchedStores: [],
  };

  for (const store of stores) {
    const link = pickStoreLink(store.name, storeLinks);
    const overrideLearnMore = LEARN_MORE_OVERRIDES.get(store.name);
    if (!link && !overrideLearnMore) {
      if (isMissing(store.learnMore) || isMissing(store.logo) || isMissing(store.image)) {
        summary.unmatchedStores.push(store.name);
      }
      continue;
    }
    if (link) summary.matchedLinks += 1;

    if (isMissing(store.learnMore)) {
      store.learnMore = link?.url || overrideLearnMore;
      summary.updatedLearnMore += 1;
    }

    const pageUrl = store.learnMore || link?.url;
    let pageHtml = byUrlCache.get(pageUrl);
    if (!pageHtml) {
      try {
        pageHtml = await fetchText(pageUrl);
      } catch {
        pageHtml = "";
      }
      if (pageHtml) byUrlCache.set(pageUrl, pageHtml);
    }

    if (pageHtml && link && (!link.name || normalizeName(link.name) === normalizeName(link.url))) {
      const parsedTitle = parsePageTitle(pageHtml);
      if (parsedTitle) {
        link.name = parsedTitle;
        link.normalized = normalizeName(parsedTitle);
      }
    }

    const profileLogo = pageHtml
      ? parseImageByClass(pageHtml, "store-profile__logo", pageUrl)
      : "";
    const profileHeader = pageHtml
      ? parseImageByClass(pageHtml, "store-profile__about__image", pageUrl)
      : "";
    const ogImage = pageHtml
      ? parseMeta(pageHtml, "og:image") || parseMeta(pageHtml, "twitter:image")
      : "";
    const hours = pageHtml ? parseHours(pageHtml) : "";
    const about = pageHtml ? parseAboutFromProfile(pageHtml) || parseAbout(pageHtml) : "";
    const categories = pageHtml ? parseCategoriesFromProfile(pageHtml) : [];
    const website = pageHtml ? parseVisitWebsite(pageHtml) : "";

    if (categories.length) {
      const current = Array.isArray(store.categories) ? store.categories : [];
      if (JSON.stringify(current) !== JSON.stringify(categories)) {
        store.categories = categories;
        summary.updatedCategories += 1;
      }
    }

    if (needsRealAsset(store.image, DEFAULT_IMAGE) && (profileHeader || ogImage)) {
      store.image = profileHeader || ogImage;
      summary.updatedImage += 1;
    }

    if (needsRealAsset(store.logo, DEFAULT_LOGO)) {
      if (profileLogo) {
        store.logo = profileLogo;
        summary.updatedLogo += 1;
      }
      const domain = getDomain(website);
      if (domain && needsRealAsset(store.logo, DEFAULT_LOGO)) {
        store.logo = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
        summary.updatedLogo += 1;
      }
    }

    if (isMissing(store.hours) && hours) {
      store.hours = hours;
      summary.updatedHours += 1;
    }

    if (about && store.floor === "lower") {
      const current = String(store.about || "").trim();
      if (!current || about.length > current.length + 20) {
        store.about = cleanAboutText(about);
        summary.updatedAbout += 1;
      }
    }

    if (store.floor === "lower") {
      summary.lowerFloorUpdated += 1;
    }
  }

  // Share assets/info between stores that point to the same mall page.
  const byLearnMore = new Map();
  for (const store of stores) {
    if (!isMissing(store.learnMore)) {
      if (!byLearnMore.has(store.learnMore)) byLearnMore.set(store.learnMore, []);
      byLearnMore.get(store.learnMore).push(store);
    }
  }
  for (const group of byLearnMore.values()) {
    const donor = group.find((s) => !isMissing(s.logo) || !isMissing(s.image) || !isMissing(s.hours));
    if (!donor) continue;
    for (const store of group) {
      if (isMissing(store.logo) && !isMissing(donor.logo)) {
        store.logo = donor.logo;
        summary.updatedLogo += 1;
      }
      if (isMissing(store.image) && !isMissing(donor.image)) {
        store.image = donor.image;
        summary.updatedImage += 1;
      }
      if (isMissing(store.hours) && !isMissing(donor.hours)) {
        store.hours = donor.hours;
        summary.updatedHours += 1;
      }
    }
  }

  // Local assets fallback.
  for (const store of stores) {
    if (isMissing(store.logo)) {
      const logoFile = pickAssetFile(store.name, logoFiles);
      if (logoFile) {
        store.logo = `assets/logos/${logoFile}`;
        summary.updatedLogo += 1;
      }
    }
    if (isMissing(store.image)) {
      const headerFile = pickAssetFile(store.name, headerFiles);
      if (headerFile) {
        store.image = `assets/headers/${headerFile}`;
        summary.updatedImage += 1;
      }
    }
  }

  // Force-correct known ambiguous names that can map to the wrong brand assets.
  for (const store of stores) {
    if (store.name === "Store" || store.name === "The Body Shop") {
      if (
        !isMissing(store.logo) &&
        /castore|fragrance shop/i.test(String(store.logo))
      ) {
        store.logo = DEFAULT_LOGO;
      }
      if (
        !isMissing(store.image) &&
        /castore|fragrance shop/i.test(String(store.image))
      ) {
        store.image = DEFAULT_IMAGE;
      }
    }
  }

  // Final guarantee: no missing logo/image fields.
  for (const store of stores) {
    if (isMissing(store.logo)) {
      store.logo = DEFAULT_LOGO;
      summary.updatedLogo += 1;
    }
    if (isMissing(store.image)) {
      store.image = DEFAULT_IMAGE;
      summary.updatedImage += 1;
    }
  }

  // Fallback for entries that still miss hours.
  for (const store of stores) {
    if (typeof store.about === "string") {
      store.about = cleanAboutText(store.about);
    }
    if (isMissing(store.hours)) {
      store.hours = "9:30am - 8:00pm";
      summary.updatedHours += 1;
    }
  }

  await fs.writeFile(STORES_PATH, JSON.stringify(stores, null, 2) + "\n", "utf8");

  console.log("Autofill finished.");
  console.log(summary);
}

main().catch((error) => {
  const cause = error?.cause?.message ? ` (${error.cause.message})` : "";
  console.error(`Autofill failed: ${error.message}${cause}`);
  process.exitCode = 1;
});
