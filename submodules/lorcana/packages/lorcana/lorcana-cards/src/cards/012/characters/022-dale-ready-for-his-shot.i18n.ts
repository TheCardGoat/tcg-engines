import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const daleReadyForHisShotI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dale",
    version: "Ready for His Shot",
    text: [
      {
        title: "SPIKE SUIT",
        description:
          "During challenges, your characters deal damage with their {W} instead of their {S}.",
      },
    ],
  },
  de: {
    name: "Chap",
    version: "Bereit für seinen Einsatz",
    text: [
      {
        title: "Stachelanzug",
        description:
          "Deine Charaktere fügen in Herausforderungen Schaden in Höhe ihrer {W} statt ihrer {S} zu.",
      },
    ],
  },
  fr: {
    name: "Tac",
    version: "Prêt à tenter sa chance",
    text: [
      {
        title: "Armure à pointes",
        description:
          "Durant un défi, vos personnages infligent des dommages avec leur {W} à la place de leur {S}.",
      },
    ],
  },
  it: {
    name: "Ciop",
    version: "Pronto per la Sua Occasione",
    text: [
      {
        title: "Armatura Appuntita",
        description:
          "Durante le sfide, i tuoi personaggi infliggono danno con la loro {W} invece che con la loro {S}.",
      },
    ],
  },
  es: {
    name: "Valle",
    version: "Listo para su disparo",
    text: [
      {
        title: "TRAJE DE PICO",
        description:
          "Durante los desafíos, tus personajes causan daño con su {W} en lugar de su {S}.",
      },
    ],
  },
};
