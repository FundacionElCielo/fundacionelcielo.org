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

  contact: {
    email: "miguel.prieto@fundacionelcielo.org",
    phone: "+57 321 470 8240",
    phoneHref: "+573214708240",
    whatsapp: "+57 321 470 8240",
    whatsappHref: "https://wa.me/573214708240",
    address: "Meta, Colombia",
  },

  social: [
    { label: "Instagram", key: "instagram", href: "#" },
    { label: "Facebook", key: "facebook", href: "#" },
    { label: "WhatsApp", key: "whatsapp", href: "https://wa.me/573214708240" },
  ],

  // Navegación principal. Las páginas de contenido (src/content/*.md) se
  // añaden automáticamente vía collections.pages, ordenadas por `order`.
  nav: {
    homeLabel: "Inicio",
    contactLabel: "Contáctanos",
  },
};
