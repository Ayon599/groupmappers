import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_ORIGIN = (process.env.TARGET_SITE || 'https://groupmappers.com').replace(/\/$/, '');
const OUTPUT_DIR = path.resolve(__dirname, process.env.SYNC_OUTPUT_DIR || 'public/synced-site');
const ASSET_DIR = path.join(OUTPUT_DIR, 'assets');

const PAGE_ROUTES = [
  { key: 'home', sourcePaths: ['/'], localPath: '/index.html' },
  { key: 'about', sourcePaths: ['/', '/about-us/', '/about/'], localPath: '/about/index.html' },
  { key: 'projects', sourcePaths: ['/', '/projects/', '/project/'], localPath: '/projects/index.html' },
  { key: 'contact', sourcePaths: ['/contact-us/', '/contact/'], localPath: '/contact/index.html' },
  { key: 'donate', sourcePaths: ['/fundraising/', '/donate-us/', '/donate/'], localPath: '/donate-us/index.html' }
];

const http = axios.create({
  timeout: 25000,
  responseType: 'arraybuffer',
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; LocalStaticSiteSync/1.0)'
  }
});

function sourceUrl(route) {
  return new URL(route.sourcePaths[0], TARGET_ORIGIN).href;
}

function normalizeUrl(rawUrl, baseUrl) {
  if (!rawUrl) return null;
  const clean = rawUrl.trim().replace(/&amp;/g, '&');
  if (
    !clean ||
    clean.startsWith('#') ||
    clean.startsWith('mailto:') ||
    clean.startsWith('tel:') ||
    clean.startsWith('javascript:') ||
    clean.startsWith('data:') ||
    clean.startsWith('blob:')
  ) {
    return null;
  }

  try {
    return new URL(clean.startsWith('//') ? `https:${clean}` : clean, baseUrl).href;
  } catch {
    return null;
  }
}

function isInternalUrl(url) {
  try {
    return new URL(url).origin === TARGET_ORIGIN;
  } catch {
    return false;
  }
}

function routeForUrl(url) {
  const parsed = new URL(url);
  const normalizedPath = parsed.pathname.replace(/\/$/, '') || '/';
  const route = PAGE_ROUTES.find((item) => {
    return item.sourcePaths.some((sourcePath) => {
      const candidate = sourcePath.replace(/\/$/, '') || '/';
      return candidate === normalizedPath;
    });
  });

  if (route) return route.localPath;

  const safePath = parsed.pathname
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^a-z0-9/_-]/gi, '-');

  return safePath ? `/${safePath}/index.html` : '/index.html';
}

function assetKind(url) {
  const pathname = new URL(url).pathname.toLowerCase();
  if (/\.(css)$/i.test(pathname)) return 'css';
  if (/\.(js|mjs)$/i.test(pathname)) return 'js';
  if (/\.(jpe?g|png|webp|gif|svg|ico|avif)$/i.test(pathname)) return 'images';
  if (/\.(woff2?|ttf|eot|otf)$/i.test(pathname)) return 'fonts';
  return 'files';
}

function isAssetUrl(url) {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return /\.(css|js|mjs|jpe?g|png|webp|gif|svg|ico|avif|woff2?|ttf|eot|otf)$/i.test(pathname);
  } catch {
    return false;
  }
}

function sanitizeFilename(url) {
  const parsed = new URL(url);
  const ext = path.extname(parsed.pathname) || '';
  const name = path.basename(parsed.pathname, ext) || 'asset';
  const safeName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);

  return `${safeName || 'asset'}${ext || '.bin'}`;
}

function uniqueAssetPath(url, usedAssets) {
  const kind = assetKind(url);
  const parsed = new URL(url);
  const ext = path.extname(parsed.pathname) || '.bin';
  const base = sanitizeFilename(url).replace(new RegExp(`${ext.replace('.', '\\.')}$`, 'i'), '');
  let filename = `${base}${ext}`;
  let counter = 2;

  while (usedAssets.has(`${kind}/${filename}`)) {
    filename = `${base}-${counter}${ext}`;
    counter += 1;
  }

  usedAssets.add(`${kind}/${filename}`);
  return `/assets/${kind}/${filename}`;
}

async function downloadAsset(url, localPublicPath, assetMap) {
  if (assetMap.has(url)) return assetMap.get(url);

  const localFsPath = path.join(OUTPUT_DIR, localPublicPath.replace(/^\//, ''));
  await fs.mkdir(path.dirname(localFsPath), { recursive: true });

  try {
    const response = await http.get(url);
    await fs.writeFile(localFsPath, response.data);
    assetMap.set(url, localPublicPath);
    return localPublicPath;
  } catch (error) {
    console.warn(`Asset skipped ${url}: ${error.message}`);
    return url;
  }
}

function preserveLocalizedHrefs($incomingSection, $existingSection) {
  const existingByText = new Map();
  $existingSection.find('a[href]').each((_, element) => {
    const text = cheerio.load(element).text().replace(/\s+/g, ' ').trim().toLowerCase();
    const href = $existingSection.find(element).attr('href');
    if (text && href && !/^https?:\/\//i.test(href)) existingByText.set(text, href);
  });

  $incomingSection.find('a[href]').each((index, element) => {
    const $link = $incomingSection.find(element);
    const text = $link.text().replace(/\s+/g, ' ').trim().toLowerCase();
    const preserved = existingByText.get(text);
    if (preserved) $link.attr('href', preserved);
  });
}

function selectorExists($, selector) {
  return $(selector).length > 0;
}

function syncSections(localHtml, incomingHtml) {
  const $local = cheerio.load(localHtml, { decodeEntities: false });
  const $incoming = cheerio.load(incomingHtml, { decodeEntities: false });

  const selectors = [
    'header',
    'main',
    'section[id*="donate" i]',
    'form[action*="donate" i]',
    'footer'
  ];

  for (const selector of selectors) {
    if (!selectorExists($incoming, selector)) continue;

    const $incomingSection = $incoming(selector).first();
    const $localSection = $local(selector).first();

    if ($localSection.length) {
      preserveLocalizedHrefs($incomingSection, $localSection);
      $localSection.replaceWith($incoming.html($incomingSection));
    }
  }

  return $local.html();
}

function collectAssetUrls($, baseUrl) {
  const assets = [];
  const attrs = [
    ['script[src]', 'src'],
    ['img[src]', 'src'],
    ['source[src]', 'src'],
    ['video[poster]', 'poster']
  ];

  $('link[href]').each((_, element) => {
    const rel = ($(element).attr('rel') || '').toLowerCase();
    const absolute = normalizeUrl($(element).attr('href'), baseUrl);
    if (!absolute || !isInternalUrl(absolute)) return;
    if (rel.includes('stylesheet') || rel.includes('icon') || rel.includes('preload') || isAssetUrl(absolute)) {
      assets.push({ selector: 'link[href]', attr: 'href', element, url: absolute });
    }
  });

  for (const [selector, attr] of attrs) {
    $(selector).each((_, element) => {
      const absolute = normalizeUrl($(element).attr(attr), baseUrl);
      if (absolute && isInternalUrl(absolute) && isAssetUrl(absolute)) assets.push({ selector, attr, element, url: absolute });
    });
  }

  $('[srcset]').each((_, element) => {
    const srcset = $(element).attr('srcset') || '';
    const first = srcset.split(',').map((item) => item.trim().split(/\s+/)[0]).find(Boolean);
    const absolute = normalizeUrl(first, baseUrl);
    if (absolute && isInternalUrl(absolute)) assets.push({ selector: '[srcset]', attr: 'srcset', element, url: absolute });
  });

  return assets;
}

async function localizePage(html, pageUrl, assetMap, usedAssets) {
  const $ = cheerio.load(html, { decodeEntities: false });

  $('[href], [action], [content]').each((_, element) => {
    for (const attr of ['href', 'action', 'content']) {
      const value = $(element).attr(attr);
      if (!value) continue;

      const absolute = normalizeUrl(value, pageUrl);
      if (!absolute || !isInternalUrl(absolute)) continue;

      if (isAssetUrl(absolute)) continue;

      const parsed = new URL(absolute);
      if (/\/(wp-admin|wp-json|xmlrpc\.php|feed)\b/i.test(parsed.pathname)) continue;

      $(element).attr(attr, `${routeForUrl(absolute)}${parsed.hash || ''}`);
    }
  });

  $('a[href]').each((_, element) => {
    const href = $(element).attr('href');
    const absolute = normalizeUrl(href, pageUrl);
    if (!absolute || !isInternalUrl(absolute)) return;

    const parsed = new URL(absolute);
    if (/\/(wp-admin|wp-json|xmlrpc\.php|feed)\b/i.test(parsed.pathname)) return;
    const localPath = routeForUrl(absolute);
    $(element).attr('href', `${localPath}${parsed.hash || ''}`);
  });

  const assets = collectAssetUrls($, pageUrl);
  for (const asset of assets) {
    const localPublicPath = uniqueAssetPath(asset.url, usedAssets);
    const mappedPath = await downloadAsset(asset.url, localPublicPath, assetMap);
    $(asset.element).attr(asset.attr, asset.attr === 'srcset' ? mappedPath : mappedPath);
  }

  $('[style]').each((_, element) => {
    const style = $(element).attr('style') || '';
    const updated = style.replace(/url\((['"]?)(.*?)\1\)/gi, (match, quote, rawUrl) => {
      const absolute = normalizeUrl(rawUrl, pageUrl);
      if (!absolute || !isInternalUrl(absolute)) return match;
      const localPublicPath = assetMap.get(absolute) || uniqueAssetPath(absolute, usedAssets);
      return `url(${quote || ''}${localPublicPath}${quote || ''})`;
    });
    $(element).attr('style', updated);
  });

  return $.html();
}

async function fetchPage(route) {
  const errors = [];

  for (const sourcePath of route.sourcePaths) {
    const url = new URL(sourcePath, TARGET_ORIGIN).href;
    try {
      const response = await http.get(url, { responseType: 'text' });
      return { url, html: response.data.toString('utf8') };
    } catch (error) {
      errors.push(`${sourcePath}: ${error.response?.status || error.message}`);
    }
  }

  throw new Error(errors.join('; '));
}

async function writeSyncedPage(route, incomingHtml) {
  const filePath = path.join(OUTPUT_DIR, route.localPath.replace(/^\//, ''));
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  let outputHtml = incomingHtml;
  try {
    const existingHtml = await fs.readFile(filePath, 'utf8');
    outputHtml = syncSections(existingHtml, incomingHtml);
  } catch {
    // First sync creates the full page.
  }

  await fs.writeFile(filePath, outputHtml);
}

async function syncSite() {
  const assetMap = new Map();
  const usedAssets = new Set();
  const report = [];

  await fs.mkdir(ASSET_DIR, { recursive: true });

  for (const route of PAGE_ROUTES) {
    try {
      console.log(`Syncing ${sourceUrl(route)} -> ${route.localPath}`);
      const page = await fetchPage(route);
      const localizedHtml = await localizePage(page.html, page.url, assetMap, usedAssets);
      await writeSyncedPage(route, localizedHtml);
      report.push({ route: route.key, source: page.url, output: route.localPath, ok: true });
    } catch (error) {
      console.warn(`Page skipped ${route.key}: ${error.message}`);
      report.push({ route: route.key, source: sourceUrl(route), output: route.localPath, ok: false, error: error.message });
    }
  }

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'sync-report.json'),
    JSON.stringify({ target: TARGET_ORIGIN, syncedAt: new Date().toISOString(), pages: report }, null, 2)
  );

  console.log(`Static sync complete: ${OUTPUT_DIR}`);
}

syncSite().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
