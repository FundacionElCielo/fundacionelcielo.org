import path from "node:path";
import * as esbuild from "esbuild";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import Image from "@11ty/eleventy-img";

const CONTENT_IMAGE_ROOT = "src/content";
const CONTENT_IMAGE_OUTPUT = "./_site/assets/img/content/";
const CONTENT_IMAGE_URL_PATH = "/assets/img/content/";

/**
 * Resolves the (relative) src written in a content Markdown file to a real
 * path on disk. Our documented convention is that image paths are relative
 * to src/content/, e.g. `./images/que-hacemos/foto.jpg`.
 */
function resolveContentImageSrc(src) {
  if (/^https?:\/\//.test(src)) return src;
  return path.join(CONTENT_IMAGE_ROOT, src);
}

/** Slugs de encabezado legibles (sin acentos ni % de encoding) para anclas en español. */
function slugifyHeading(text) {
  const decomposed = String(text).normalize("NFD");
  let stripped = "";
  for (const ch of decomposed) {
    const code = ch.codePointAt(0);
    // Salta las marcas diacríticas combinantes (U+0300–U+036F) que quedan
    // tras normalizar en NFD, p. ej. la tilde de "á" o la virgulilla de "ñ".
    if (code >= 0x0300 && code <= 0x036f) continue;
    stripped += ch;
  }
  return stripped
    .replace(/[¿?¡!]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function contentImageOptions() {
  return {
    widths: [480, 800, 1200, 1600],
    formats: ["avif", "webp", "auto"],
    outputDir: CONTENT_IMAGE_OUTPUT,
    urlPath: CONTENT_IMAGE_URL_PATH,
    filenameFormat: (id, src, width, format) => {
      const name = path.basename(src, path.extname(src));
      return `${name}-${width}w-${id}.${format}`;
    },
  };
}

/** Synchronous helper used inside the markdown-it `image` renderer rule. */
function contentImageShortcodeSync(rawSrc, alt) {
  const src = resolveContentImageSrc(rawSrc);
  const options = contentImageOptions();
  // Fire the (async, cached) generation off in the background…
  Image(src, options);
  // …then read back metadata synchronously so markdown-it can stay sync.
  const metadata = Image.statsSync(src, options);
  return Image.generateHTML(metadata, {
    alt,
    sizes: "(min-width: 900px) 720px, 100vw",
    loading: "lazy",
    decoding: "async",
    class: "prose-img",
  });
}

export default function (eleventyConfig) {
  // ---------------------------------------------------------------------
  // Passthrough copy
  // ---------------------------------------------------------------------
  eleventyConfig.addPassthroughCopy({ "src/assets/img": "assets/img" });
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });
  eleventyConfig.addPassthroughCopy({ "src/site.webmanifest": "site.webmanifest" });

  // CSS/JS are authored in src/assets/{css,js} but *bundled* straight into
  // the output dir by esbuild (see the eleventy.before hook below) — do not
  // passthrough-copy the raw sources, only watch them so edits retrigger a
  // rebuild + reload during `eleventy --serve`.
  eleventyConfig.addWatchTarget("src/assets/css");
  eleventyConfig.addWatchTarget("src/assets/js");

  // ---------------------------------------------------------------------
  // Markdown
  // ---------------------------------------------------------------------
  const md = markdownIt({
    html: false,
    breaks: false,
    linkify: true,
    typographer: true,
  }).use(markdownItAnchor, {
    slugify: slugifyHeading,
    // ariaHidden APPENDS a small "#" link after the heading text (the
    // heading itself stays plain, always-visible text) — headerLink()
    // wraps the *whole* heading in the link instead, which broke visibility
    // when paired with our hover-to-reveal anchor styling.
    permalink: markdownItAnchor.permalink.ariaHidden({
      symbol: "#",
      placement: "after",
    }),
  });

  // Envuelve cada bloque delimitado por "##" en <section class="prose-section">
  // — da estructura semántica real y permite numerar/decorar cada sección por
  // CSS, en vez de un único bloque de texto plano.
  md.core.ruler.push("wrap_h2_sections", (state) => {
    const tokens = state.tokens;
    const out = [];
    let sectionOpen = false;

    const openSection = () => {
      const t = new state.Token("section_open", "section", 1);
      t.attrSet("class", "prose-section");
      out.push(t);
      sectionOpen = true;
    };
    const closeSection = () => {
      if (!sectionOpen) return;
      out.push(new state.Token("section_close", "section", -1));
      sectionOpen = false;
    };

    for (const token of tokens) {
      if (token.type === "heading_open" && token.tag === "h2") {
        closeSection();
        openSection();
      }
      out.push(token);
    }
    closeSection();
    state.tokens = out;
  });

  md.renderer.rules.section_open = () => '<section class="prose-section" data-reveal="up">';
  md.renderer.rules.section_close = () => "</section>";

  const defaultImageRule =
    md.renderer.rules.image ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.image = (tokens, idx) => {
    const token = tokens[idx];
    const src = token.attrGet("src");
    const alt = token.content || "";
    const title = token.attrGet("title");

    // External images (rare, but don't break the build if someone links one)
    if (!src) return defaultImageRule([token], 0, {}, {}, md.renderer);

    let html;
    try {
      html = contentImageShortcodeSync(src, alt);
    } catch (err) {
      console.warn(`[imágenes] No se pudo optimizar "${src}": ${err.message}`);
      return defaultImageRule([token], 0, {}, {}, md.renderer);
    }

    return title ? `<figure>${html}<figcaption>${title}</figcaption></figure>` : html;
  };

  eleventyConfig.setLibrary("md", md);

  // Same optimized-image pipeline, available directly in Nunjucks templates.
  eleventyConfig.addNunjucksAsyncShortcode(
    "contentImage",
    async function (rawSrc, alt, sizes = "100vw") {
      const src = resolveContentImageSrc(rawSrc);
      const options = contentImageOptions();
      const metadata = await Image(src, options);
      return Image.generateHTML(metadata, {
        alt,
        sizes,
        loading: "lazy",
        decoding: "async",
      });
    },
  );

  // ---------------------------------------------------------------------
  // Collections
  // ---------------------------------------------------------------------
  eleventyConfig.addCollection("pages", (collectionApi) =>
    collectionApi.getFilteredByTag("page").sort((a, b) => a.data.order - b.data.order),
  );

  // ---------------------------------------------------------------------
  // Filters / shortcodes
  // ---------------------------------------------------------------------
  eleventyConfig.addFilter("excerpt", (content, length = 220) => {
    const text = String(content)
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length <= length) return text;
    return `${text.slice(0, length).replace(/\s+\S*$/, "")}…`;
  });

  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  eleventyConfig.addFilter("indexInCollection", (collection, url) =>
    (collection || []).findIndex((item) => item.url === url),
  );

  // ---------------------------------------------------------------------
  // CSS + JS bundling (esbuild) — runs before every build, dev or prod.
  // ---------------------------------------------------------------------
  async function buildAssets() {
    await esbuild.build({
      entryPoints: ["src/assets/css/main.css"],
      bundle: true,
      minify: true,
      outfile: "_site/assets/css/main.css",
      loader: { ".css": "css" },
      // Las referencias a fuentes/imágenes usan rutas absolutas (/assets/...)
      // servidas por passthrough copy — no son assets que esbuild deba resolver.
      external: ["/assets/*"],
      logLevel: "warning",
    });

    await esbuild.build({
      entryPoints: ["src/assets/js/main.js"],
      bundle: true,
      minify: true,
      format: "iife",
      target: ["es2020"],
      outfile: "_site/assets/js/main.js",
      logLevel: "warning",
    });
  }

  eleventyConfig.on("eleventy.before", buildAssets);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    pathPrefix: process.env.PATH_PREFIX || "/",
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
