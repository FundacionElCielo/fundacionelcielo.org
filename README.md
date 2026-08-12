# Fundación El Cielo — sitio web

Sitio del **Centro de Conservación El Cielo (CCREIBEC)**, construido con [Eleventy](https://www.11ty.dev/) (Nunjucks) + CSS moderno sin frameworks + JavaScript vanilla, empaquetado con [esbuild](https://esbuild.github.io/).

## Requisitos

- Node.js 18+

## Empezar

```bash
npm install
npm run dev     # http://localhost:8080 — recarga en vivo
npm run build   # genera el sitio final en _site/
```

No hace falta ningún otro comando: `eleventy.config.js` empaqueta y minifica CSS/JS con esbuild automáticamente antes de cada build (también en `npm run dev`).

## Estructura del proyecto

```
src/
  _data/site.js          → nombre, descripción, contacto, redes (placeholders — editar aquí)
  _includes/
    layouts/              → base.njk (shell HTML) y page.njk (páginas de contenido)
    partials/              → header, footer, hero, stats, cta, iconos, decoración
    macros/                → button.njk, card.njk
  content/                 → carpeta reservada para páginas nuevas en Markdown (ver abajo) y fotos
  index.njk                → Home (a medida)
  que-hacemos.njk           → Misión, visión, contexto, ejes, fases e infraestructura (a medida)
  impacto.njk                → Impacto en la agenda global (a medida)
  contacto.njk                 → Contacto (placeholders de datos reales)
  assets/
    css/                    → tokens, reset, base, layout, components/*, animations, utilities
    js/                      → main.js + modules/*
    img/, fonts/              → logo (generado desde Assets/), tipografía autoalojada
```

`informacion.md` (raíz del proyecto) es la referencia original del contenido institucional.
El contenido del sitio vive por ahora en dos páginas "a medida" — `src/que-hacemos.njk`
(misión, visión, contexto, ejes, fases de rehabilitación e infraestructura, todo en una
sola página para no fragmentar la información) e `src/impacto.njk` — **edita ahí**
directamente si necesitas corregir o ampliar un texto; cada sección del archivo está
comentada con el encabezado de `informacion.md` al que corresponde.

El menú principal (`{{ site.nav... }}` + `collections.pages`) muestra solo estas dos
páginas más "Contáctanos" — así se evita repartir la información en muchas páginas cortas
y repetir el enlace de contacto.

## Añadir una página nueva al menú

Para páginas adicionales simples (texto ligero, sin secciones a medida), puedes seguir
usando Markdown: crea un `.md` en `src/content/` con esta cabecera —

```yaml
---
title: "Título de la página"       # <h1> del hero
navLabel: "Nombre en el menú"       # texto corto para nav/footer/breadcrumb
eyebrow: "Etiqueta pequeña"          # sobre el título del hero
lede: "Párrafo corto bajo el título"
summary: "Extracto usado en el CTA de 'siguiente página'"
icon: "target"                       # ver src/_includes/partials/icons.njk
order: 3                             # posición en el menú
---
```

Debajo de la cabecera va el contenido en Markdown normal (`##`, párrafos, listas, etc.),
que se renderiza automáticamente con un estilo elegante (ver `.prose` en
`assets/css/components/prose.css`) usando el layout `layouts/page.njk`. La página
aparece sola en el menú (`collections.pages`, ordenada por `order`).

Para una página con secciones visuales a medida (como `que-hacemos.njk`), copia ese
archivo como punto de partida en vez de usar Markdown.

## Datos de contacto y redes sociales

Todo en `src/_data/site.js` bajo `contact` y `social` es **placeholder** (marcado con
`TODO`). Reemplázalo con los datos reales de la fundación antes de publicar — se usa en
el header, footer y la página de Contacto automáticamente.

## Agregar fotos de actividades / resultados

Cuando tengas las fotos:

1. Colócalas en `src/content/images/<nombre-de-la-página>/archivo.jpg`
   (ej. `src/content/images/que-hacemos/liberacion-2025.jpg`).
2. En el Markdown de esa página, escribe:

   ```markdown
   ![Texto alternativo descriptivo](./images/que-hacemos/liberacion-2025.jpg "Leyenda opcional")
   ```

Eleventy optimiza la imagen automáticamente (AVIF/WebP + tamaños responsive, sin
recortar el layout) vía `@11ty/eleventy-img` — no hay que redimensionar nada a mano.
El `title` entre comillas se muestra como leyenda (`<figcaption>`).

## Añadir Testimonios o FAQ más adelante

No se incluyeron porque no había contenido real. Cuando lo tengas:

- **Testimonios**: reutiliza el macro `card()` (`src/_includes/macros/card.njk`) en una
  nueva sección, o duplica el patrón de `.card` en `assets/css/components/cards.css`.
- **FAQ**: un `<details>/<summary>` por pregunta dentro de una nueva sección funciona
  bien con el sistema de tipografía existente sin necesitar JS adicional.

## Despliegue (GitHub Pages)

El workflow `.github/workflows/deploy.yml` construye el sitio y lo publica en GitHub
Pages en cada push a `main`.

- `CNAME` en la raíz apunta a `fundacionelcielo.com` — **cámbialo o bórralo** si el
  dominio final es otro, o si vas a usar `usuario.github.io/repositorio` en vez de un
  dominio propio.
- Si usas un dominio propio, `eleventy.config.js` ya sirve el sitio desde la raíz (`/`).
  Si en cambio publicas sin dominio propio en `usuario.github.io/repositorio`, define
  `PATH_PREFIX=/repositorio/` como variable de entorno en el workflow antes de construir.
- Recuerda activar GitHub Pages → **Source: GitHub Actions** en la configuración del
  repositorio la primera vez.

## Paleta de marca

| Token | Color | Uso |
|---|---|---|
| `--teal-600` | `#0E6E68` | Marca primaria — botones, enlaces, iconos |
| `--green-300` | `#8FDD8A` | Acento secundario — degradados, detalles |
| `--c-black` | `#0A0F0E` | Texto fuerte, footer |

Todos los tokens están en `src/assets/css/tokens.css`.
