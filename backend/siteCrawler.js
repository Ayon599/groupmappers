import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_ORIGIN = 'https://groupmappers.com';
const START_URL = `${SITE_ORIGIN}/`;
const PUBLIC_DIR = path.join(__dirname, 'public');
const IMAGE_DIR = path.join(PUBLIC_DIR, 'assets', 'images');
const SITE_MAP_PATH = path.join(PUBLIC_DIR, 'site-map.json');
const IMAGE_MANIFEST_PATH = path.join(IMAGE_DIR, 'manifest.json');

const http = axios.create({
  timeout: 30000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; GroupMappersFullSiteCrawler/1.0)'
  }
});

const stylesheetHttp = axios.create({
  timeout: 8000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; GroupMappersFullSiteCrawler/1.0)'
  }
});

const ignoredPathPatterns = [
  /\/wp-admin/i,
  /\/wp-json/i,
  /\/xmlrpc\.php/i,
  /\/feed\/?$/i,
  /\/comments\/feed/i,
  /\.(pdf|docx?|xlsx?|pptx?|zip|rar)$/i
];

const ignoredImagePathPatterns = [
  /\/wp-content\/themes\/consulting\/assets\/css\/images\/pattern_[34]\.png$/i,
  /\/wp-content\/images\/pattern_[34]\.png$/i
];

function normalizeUrl(rawUrl, baseUrl = START_URL) {
  if (!rawUrl) return null;
  const clean = rawUrl.trim().replace(/^['"]|['"]$/g, '').replace(/&amp;/g, '&');

  if (!clean || clean.startsWith('#') || clean.startsWith('mailto:') || clean.startsWith('tel:') || clean.startsWith('javascript:') || clean.startsWith('data:') || clean.startsWith('blob:')) {
    return null;
  }

  if (/[\s<>]/.test(clean) || clean.length < 2) {
    return null;
  }

  const protocolSafe = clean.startsWith('//') ? `https:${clean}` : clean;

  try {
    const url = new URL(protocolSafe, baseUrl);
    url.hash = '';
    return url.href;
  } catch {
    return null;
  }
}

function isLikelyImageUrl(url) {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.toLowerCase();
    if (ignoredImagePathPatterns.some((pattern) => pattern.test(pathname))) return false;
    return (
      /\.(jpe?g|png|webp|gif|svg|ico|avif)$/i.test(pathname) ||
      pathname.includes('/wp-content/uploads/') ||
      pathname.includes('/wp-content/themes/') ||
      pathname.includes('/wp-content/plugins/') ||
      pathname.includes('favicon') ||
      pathname.includes('logo')
    );
  } catch {
    return false;
  }
}

function isInternalPage(url) {
  try {
    const parsed = new URL(url);
    return parsed.origin === SITE_ORIGIN && !ignoredPathPatterns.some((pattern) => pattern.test(parsed.pathname));
  } catch {
    return false;
  }
}

function firstSrcsetUrl(srcset = '') {
  return srcset.split(',').map((item) => item.trim().split(/\s+/)[0]).find(Boolean);
}

function extractCssUrls(cssText, baseUrl) {
  const urls = [];
  const matches = cssText.matchAll(/url\((['"]?)(.*?)\1\)/gi);

  for (const match of matches) {
    const absolute = normalizeUrl(match[2], baseUrl);
    if (isLikelyImageUrl(absolute)) urls.push(absolute);
  }

  return urls;
}

function sanitize(value) {
  return value
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function extensionFor(url, contentType = '') {
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.ico', '.avif'].includes(ext)) return ext;
  if (contentType.includes('jpeg')) return '.jpg';
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('webp')) return '.webp';
  if (contentType.includes('gif')) return '.gif';
  if (contentType.includes('svg')) return '.svg';
  if (contentType.includes('icon')) return '.ico';
  if (contentType.includes('avif')) return '.avif';
  return '.jpg';
}

function uniqueFilename(media, contentType, usedNames) {
  const original = sanitize(path.basename(decodeURIComponent(new URL(media.url).pathname)));
  const label = sanitize(media.alt || media.title || media.source || '');
  const base = original || label || 'groupmappers-image';
  const ext = extensionFor(media.url, contentType);
  let filename = `${base}${ext}`;
  let counter = 2;

  while (usedNames.has(filename)) {
    filename = `${base}-${counter}${ext}`;
    counter += 1;
  }

  usedNames.add(filename);
  return filename;
}

function cleanText(text = '') {
  return text.replace(/\s+/g, ' ').trim();
}

function pageSlug(url) {
  const parsed = new URL(url);
  const slug = parsed.pathname.replace(/^\/|\/$/g, '') || 'home';
  return slug;
}

function addUniqueLink(target, link) {
  if (!link.href || target.some((item) => item.href === link.href && item.text === link.text)) return;
  target.push(link);
}

function extractNavigation($) {
  const roots = $('nav, header, .menu, .navbar, .main-menu, #menu-main-menu, ul.menu').filter((_, el) => $(el).find('a').length > 0);
  const root = roots.first().length ? roots.first() : $('body');

  function walkList($list) {
    return $list.children('li').map((_, li) => {
      const $li = $(li);
      const $anchor = $li.children('a').first();
      const children = $li.children('ul, .sub-menu, .dropdown-menu').first();

      return {
        label: cleanText($anchor.text()) || cleanText($li.clone().children('ul').remove().end().text()),
        href: normalizeUrl($anchor.attr('href')) || null,
        children: children.length ? walkList(children) : []
      };
    }).get().filter((item) => item.label || item.href);
  }

  const navLists = root.find('ul').first();
  if (navLists.length) return walkList(navLists);

  return root.find('a').map((_, anchor) => ({
    label: cleanText($(anchor).text()),
    href: normalizeUrl($(anchor).attr('href')),
    children: []
  })).get().filter((item) => item.label && item.href);
}

function flattenNavigation(items, target = []) {
  for (const item of items) {
    if (item.href && isInternalPage(item.href)) target.push(item.href);
    if (item.children?.length) flattenNavigation(item.children, target);
  }
  return [...new Set(target)];
}

async function extractMedia($, pageUrl) {
  const media = [];
  const seen = new Set();

  function add(url, meta = {}) {
    if (!url || seen.has(url) || !isLikelyImageUrl(url)) return;
    seen.add(url);
    media.push({ url, ...meta });
  }

  $('img').each((_, image) => {
    const $image = $(image);
    const raw = $image.attr('src') || $image.attr('data-src') || $image.attr('data-lazy-src') || firstSrcsetUrl($image.attr('srcset')) || firstSrcsetUrl($image.attr('data-srcset'));
    add(normalizeUrl(raw, pageUrl), {
      alt: $image.attr('alt') || '',
      title: $image.attr('title') || '',
      source: 'img'
    });
  });

  $('source').each((_, source) => {
    const $source = $(source);
    const raw = $source.attr('src') || firstSrcsetUrl($source.attr('srcset'));
    add(normalizeUrl(raw, pageUrl), { source: 'source' });
  });

  $('link[rel]').each((_, link) => {
    const $link = $(link);
    const rel = ($link.attr('rel') || '').toLowerCase();
    if (!/(icon|apple-touch-icon|shortcut icon|mask-icon|image_src)/.test(rel)) return;
    add(normalizeUrl($link.attr('href'), pageUrl), { source: 'link', title: rel });
  });

  $('meta[property], meta[name]').each((_, meta) => {
    const $meta = $(meta);
    const key = `${$meta.attr('property') || ''} ${$meta.attr('name') || ''}`.toLowerCase();
    if (!/(og:image|twitter:image|image)/.test(key)) return;
    add(normalizeUrl($meta.attr('content'), pageUrl), { source: 'meta', title: key });
  });

  $('[style]').each((_, element) => {
    for (const url of extractCssUrls($(element).attr('style') || '', pageUrl)) {
      add(url, { source: 'inline-style' });
    }
  });

  $('style').each((_, style) => {
    for (const url of extractCssUrls($(style).html() || '', pageUrl)) {
      add(url, { source: 'style-tag' });
    }
  });

  const stylesheetUrls = $('link[rel="stylesheet"]').map((_, link) => normalizeUrl($(link).attr('href'), pageUrl)).get().filter(Boolean);
  for (const stylesheetUrl of stylesheetUrls) {
    try {
      const { data: css } = await stylesheetHttp.get(stylesheetUrl);
      for (const url of extractCssUrls(css, stylesheetUrl)) {
        add(url, { source: 'stylesheet' });
      }
    } catch (error) {
      const timedOut = error.code === 'ECONNABORTED' || /timeout/i.test(error.message);
      const status = error.response?.status;
      if (!timedOut && ![403, 404, 410].includes(status)) {
        console.warn(`Stylesheet skipped ${stylesheetUrl}: ${error.message}`);
      }
    }
  }

  return media;
}

function extractContent($, pageUrl) {
  const contentRoot = $('main').length ? $('main') : $('body');
  const headings = [];
  const paragraphs = [];
  const lists = [];
  const links = [];

  contentRoot.find('h1,h2,h3,h4,h5,h6').each((_, heading) => {
    headings.push({
      level: heading.tagName.toLowerCase(),
      text: cleanText($(heading).text())
    });
  });

  contentRoot.find('p').each((_, paragraph) => {
    const text = cleanText($(paragraph).text());
    if (text) paragraphs.push(text);
  });

  contentRoot.find('ul,ol').each((_, list) => {
    const items = $(list).children('li').map((__, li) => cleanText($(li).text())).get().filter(Boolean);
    if (items.length) lists.push({ type: list.tagName.toLowerCase(), items });
  });

  contentRoot.find('a').each((_, anchor) => {
    const text = cleanText($(anchor).text());
    const href = normalizeUrl($(anchor).attr('href'), pageUrl);
    if (text && href) addUniqueLink(links, { text, href });
  });

  const footer = $('footer').text() ? cleanText($('footer').text()) : '';

  return {
    title: cleanText($('title').text()),
    metaDescription: cleanText($('meta[name="description"]').attr('content') || ''),
    headings,
    paragraphs,
    lists,
    links,
    footer,
    fullText: cleanText(contentRoot.text())
  };
}

async function downloadMedia(media, pageSlugValue, usedNames, globalManifest) {
  const localMedia = [];

  for (const item of media) {
    try {
      const response = await http.get(item.url, {
        responseType: 'arraybuffer',
        validateStatus: (status) => status >= 200 && status < 400
      });
      const contentType = response.headers['content-type'] || '';
      const isImage = contentType.startsWith('image/') || isLikelyImageUrl(item.url);
      if (!isImage) continue;

      const filename = uniqueFilename(item, contentType, usedNames);
      const localPath = `/assets/images/${filename}`;
      await fs.writeFile(path.join(IMAGE_DIR, filename), response.data);

      const entry = {
        page: pageSlugValue,
        filename,
        localPath,
        sourceUrl: item.url,
        source: item.source,
        alt: item.alt || '',
        title: item.title || ''
      };

      localMedia.push(entry);
      globalManifest.push(entry);
    } catch (error) {
      const status = error.response?.status;
      if (status && [404, 410].includes(status)) continue;
      console.warn(`Image skipped ${item.url}: ${error.message}`);
    }
  }

  return localMedia;
}

async function crawl() {
  await fs.mkdir(IMAGE_DIR, { recursive: true });

  const queue = [START_URL];
  const visited = new Set();
  const pageMap = {};
  const usedImageNames = new Set();
  const imageManifest = [];
  let navigation = [];

  while (queue.length) {
    const url = queue.shift();
    if (!url || visited.has(url) || !isInternalPage(url)) continue;
    visited.add(url);

    console.log(`Crawling ${url}`);

    try {
      const { data: html } = await http.get(url);
      const $ = cheerio.load(html);
      const slug = pageSlug(url);

      if (url === START_URL) {
        navigation = extractNavigation($);
        for (const navUrl of flattenNavigation(navigation)) {
          if (!visited.has(navUrl)) queue.push(navUrl);
        }
      }

      $('a[href]').each((_, anchor) => {
        const href = normalizeUrl($(anchor).attr('href'), url);
        if (href && isInternalPage(href) && !visited.has(href) && !queue.includes(href)) {
          queue.push(href);
        }
      });

      const mediaCandidates = await extractMedia($, url);
      const media = await downloadMedia(mediaCandidates, slug, usedImageNames, imageManifest);

      pageMap[slug] = {
        url,
        slug,
        content: extractContent($, url),
        media
      };
    } catch (error) {
      console.warn(`Page skipped ${url}: ${error.message}`);
    }
  }

  const output = {
    source: SITE_ORIGIN,
    crawledAt: new Date().toISOString(),
    navigation,
    pages: pageMap,
    images: imageManifest
  };

  await fs.writeFile(SITE_MAP_PATH, JSON.stringify(output, null, 2));
  await fs.writeFile(IMAGE_MANIFEST_PATH, JSON.stringify(imageManifest, null, 2));

  console.log(`Pages crawled: ${Object.keys(pageMap).length}`);
  console.log(`Images downloaded: ${imageManifest.length}`);
  console.log(`Site map saved: ${SITE_MAP_PATH}`);
}

crawl().catch((error) => {
  console.error(error);
  process.exit(1);
});
