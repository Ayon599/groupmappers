import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_ORIGIN = 'https://groupmappers.com';
const SITE_URL = `${SITE_ORIGIN}/`;
const OUTPUT_DIR = path.join(__dirname, 'public', 'assets', 'images');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest.json');

const http = axios.create({
  timeout: 30000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; GroupMappersImageDownloader/1.0)'
  }
});

const stylesheetHttp = axios.create({
  timeout: 8000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; GroupMappersImageDownloader/1.0)'
  }
});

const ignoredImagePathPatterns = [
  /\/wp-content\/themes\/consulting\/assets\/css\/images\/pattern_[34]\.png$/i,
  /\/wp-content\/images\/pattern_[34]\.png$/i
];

function toAbsoluteUrl(rawUrl, baseUrl = SITE_URL) {
  if (!rawUrl) return null;

  const clean = rawUrl
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/&amp;/g, '&');

  if (!clean || clean.startsWith('data:') || clean.startsWith('blob:') || clean.startsWith('mailto:')) {
    return null;
  }

  if (/[\s<>]/.test(clean) || clean.length < 2) {
    return null;
  }

  if (clean.startsWith('//')) return `https:${clean}`;

  try {
    return new URL(clean, baseUrl).href;
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

function firstSrcsetUrl(srcset = '') {
  return srcset
    .split(',')
    .map((item) => item.trim().split(/\s+/)[0])
    .find(Boolean);
}

function extractCssUrls(cssText, baseUrl = SITE_URL) {
  const urls = [];
  const matches = cssText.matchAll(/url\((['"]?)(.*?)\1\)/gi);

  for (const match of matches) {
    const absolute = toAbsoluteUrl(match[2], baseUrl);
    if (isLikelyImageUrl(absolute)) urls.push(absolute);
  }

  return urls;
}

function getExtension(url, contentType = '') {
  const pathname = new URL(url).pathname;
  const ext = path.extname(pathname).toLowerCase();

  if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.ico', '.avif'].includes(ext)) {
    return ext;
  }
  if (contentType.includes('jpeg')) return '.jpg';
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('webp')) return '.webp';
  if (contentType.includes('gif')) return '.gif';
  if (contentType.includes('svg')) return '.svg';
  if (contentType.includes('icon')) return '.ico';
  if (contentType.includes('avif')) return '.avif';

  return '.jpg';
}

function sanitizeName(value) {
  return value
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function guessBaseName(item, index) {
  const text = `${item.alt || ''} ${item.rel || ''} ${item.source || ''} ${item.url}`.toLowerCase();
  const urlPath = decodeURIComponent(new URL(item.url).pathname);
  const originalName = sanitizeName(path.basename(urlPath));

  if (text.includes('logo')) return 'main-logo';
  if (text.includes('favicon') || text.includes('icon')) return 'favicon';
  if (text.includes('hero')) return 'hero-volunteer';
  if (text.includes('volunteer')) return index <= 4 ? 'hero-volunteer' : `volunteer-photo-${index}`;
  if (text.includes('richard')) return 'founder-richard-maude';
  if (text.includes('ipsita')) return 'founder-ipsita-sinha';
  if (text.includes('sazid')) return 'founder-sazid-ibna-zaman';
  if (text.includes('founder')) return `founder-photo-${index}`;

  return originalName || `groupmappers-image-${index}`;
}

function uniqueFilename(item, index, contentType, usedNames) {
  const ext = getExtension(item.url, contentType);
  const base = guessBaseName(item, index);
  let filename = `${base}${ext}`;
  let counter = 2;

  while (usedNames.has(filename)) {
    filename = `${base}-${counter}${ext}`;
    counter += 1;
  }

  usedNames.add(filename);
  return filename;
}

function addImage(found, item) {
  if (!item.url || found.has(item.url) || !isLikelyImageUrl(item.url)) return;
  found.set(item.url, item);
}

async function collectImagesFromPage() {
  const { data: html } = await http.get(SITE_URL);
  const $ = cheerio.load(html);
  const found = new Map();

  $('img').each((_, image) => {
    const $image = $(image);
    const raw =
      $image.attr('src') ||
      $image.attr('data-src') ||
      $image.attr('data-lazy-src') ||
      firstSrcsetUrl($image.attr('srcset')) ||
      firstSrcsetUrl($image.attr('data-srcset'));

    const url = toAbsoluteUrl(raw);
    addImage(found, {
      url,
      alt: $image.attr('alt') || '',
      source: 'img'
    });
  });

  $('source').each((_, source) => {
    const $source = $(source);
    const raw = $source.attr('src') || firstSrcsetUrl($source.attr('srcset'));
    const url = toAbsoluteUrl(raw);
    addImage(found, {
      url,
      alt: $source.attr('media') || '',
      source: 'picture-source'
    });
  });

  $('link[rel]').each((_, link) => {
    const $link = $(link);
    const rel = ($link.attr('rel') || '').toLowerCase();
    if (!/(icon|apple-touch-icon|shortcut icon|mask-icon|image_src)/.test(rel)) return;

    const url = toAbsoluteUrl($link.attr('href'));
    addImage(found, {
      url,
      rel,
      source: 'link-rel'
    });
  });

  $('meta[property], meta[name]').each((_, meta) => {
    const $meta = $(meta);
    const key = `${$meta.attr('property') || ''} ${$meta.attr('name') || ''}`.toLowerCase();
    if (!/(og:image|twitter:image|image)/.test(key)) return;

    const url = toAbsoluteUrl($meta.attr('content'));
    addImage(found, {
      url,
      rel: key.trim(),
      source: 'meta'
    });
  });

  $('[style]').each((_, element) => {
    const style = $(element).attr('style') || '';
    for (const url of extractCssUrls(style)) {
      addImage(found, { url, source: 'inline-style' });
    }
  });

  $('style').each((_, style) => {
    const cssText = $(style).html() || '';
    for (const url of extractCssUrls(cssText)) {
      addImage(found, { url, source: 'style-tag' });
    }
  });

  const stylesheetUrls = [];
  $('link[rel="stylesheet"]').each((_, link) => {
    const href = toAbsoluteUrl($(link).attr('href'));
    if (href) stylesheetUrls.push(href);
  });

  for (const stylesheetUrl of stylesheetUrls) {
    try {
      const { data: cssText } = await stylesheetHttp.get(stylesheetUrl);
      for (const url of extractCssUrls(cssText, stylesheetUrl)) {
        addImage(found, { url, source: 'stylesheet' });
      }
    } catch (error) {
      const timedOut = error.code === 'ECONNABORTED' || /timeout/i.test(error.message);
      const status = error.response?.status;
      if (!timedOut && ![403, 404, 410].includes(status)) {
        console.warn(`Could not parse stylesheet ${stylesheetUrl}: ${error.message}`);
      }
    }
  }

  return [...found.values()];
}

async function downloadImage(item, index, usedNames) {
  const response = await http.get(item.url, {
    responseType: 'arraybuffer',
    validateStatus: (status) => status >= 200 && status < 400
  });

  const contentType = response.headers['content-type'] || '';
  const looksLikeImage = contentType.startsWith('image/') || isLikelyImageUrl(item.url);

  if (!looksLikeImage) {
    throw new Error(`Not an image response: ${contentType || 'unknown content type'}`);
  }

  const filename = uniqueFilename(item, index, contentType, usedNames);
  const outputPath = path.join(OUTPUT_DIR, filename);

  await fs.writeFile(outputPath, response.data);

  return {
    key: path.basename(filename, path.extname(filename)),
    filename,
    localPath: `/assets/images/${filename}`,
    sourceUrl: item.url,
    source: item.source,
    alt: item.alt || '',
    rel: item.rel || ''
  };
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const images = await collectImagesFromPage();
  const usedNames = new Set();
  const manifest = [];

  console.log(`Found ${images.length} image candidates.`);

  for (const [index, item] of images.entries()) {
    try {
      const saved = await downloadImage(item, index + 1, usedNames);
      manifest.push(saved);
      console.log(`Downloaded ${saved.filename}`);
    } catch (error) {
      const status = error.response?.status;
      if (status && [404, 410].includes(status)) continue;
      console.warn(`Skipped ${item.url}: ${error.message}`);
    }
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Downloaded ${manifest.length} images.`);
  console.log(`Manifest: ${MANIFEST_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
