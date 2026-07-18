import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scroogesTopHatI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scrooge's Top Hat",
    text: [
      {
        title: "BUSINESS EXPERTISE",
        description: "{E} — You pay 1 {I} less for the next item you play this turn.",
      },
    ],
  },
  de: {
    name: "Dagoberts Zylinder",
    text: [
      {
        title: "Wirtschaftliches Fachwissen",
        description:
          "{E} — Du zahlst 1 {I} weniger für den nächsten Gegenstand, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Haut-de-forme de Picsou",
    text: [
      {
        title: "Sens des affaires",
        description:
          "{E} — Le prochain objet que vous jouez durant ce tour vous coûte 1 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Cilindro di Paperone",
    text: [
      {
        title: "Esperienza negli Affari",
        description:
          "{E} — Paga 1 {I} in meno per giocare il tuo prossimo oggetto per questo turno.",
      },
    ],
  },
  es: {
    name: "El sombrero de copa de Scrooge",
    text: [
      {
        title: "EXPERIENCIA EMPRESARIAL",
        description: "{E}: pagas 1 {I} menos por el siguiente artículo que juegues en este turno.",
      },
    ],
  },
};
