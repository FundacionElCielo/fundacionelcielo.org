export default {
  name: "Fundación El Cielo",
  shortName: "El Cielo",
  legalName: "Centro de Conservación El Cielo (CCREIBEC)",
  tagline: "Fundación, reserva & centro de investigación",
  description:
    "CCREIBEC: Rehabilitación, Educación e Investigación en la Biodiversidad del Meta, Colombia.",
  url: "https://fundacionelcielo.org",
  locale: "es_CO",
  themeColor: "#0e6e68",

  // --- Placeholders de contacto -------------------------------------
  // TODO: reemplazar con los datos reales de la fundación.
  contact: {
    email: "info@fundacionelcielo.com",
    phone: "+57 300 000 0000",
    phoneHref: "+573000000000",
    whatsapp: "+57 300 000 0000",
    whatsappHref: "https://wa.me/573000000000",
    address: "Meta, Colombia",
  },

  // TODO: reemplazar por las cuentas reales o quitar las que no apliquen.
  social: [
    { label: "Instagram", key: "instagram", href: "#" },
    { label: "Facebook", key: "facebook", href: "#" },
    { label: "WhatsApp", key: "whatsapp", href: "#" },
  ],

  // Navegación principal. Las páginas de contenido (src/content/*.md) se
  // añaden automáticamente vía collections.pages, ordenadas por `order`.
  nav: {
    homeLabel: "Inicio",
    contactLabel: "Contáctanos",
  },
};
