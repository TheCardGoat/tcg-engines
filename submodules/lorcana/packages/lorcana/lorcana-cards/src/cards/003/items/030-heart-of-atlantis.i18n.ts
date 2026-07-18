import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const heartOfAtlantisI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Heart of Atlantis",
    text: [
      {
        title: "LIFE GIVER",
        description: "{E} — You pay 2 {I} less for the next character you play this turn.",
      },
    ],
  },
  de: {
    name: "Herz von Atlantis",
    text: [
      {
        title: "Lebensspender",
        description:
          "{E} — Du zahlst 2 {I} weniger für den nächsten Charakter, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Cœur de l'Atlantide",
    text: [
      {
        title: "Source de vie",
        description:
          "{E} — Le prochain personnage que vous jouez durant ce tour vous coûte 2 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Il Cuore di Atlantide",
    text: [
      {
        title: "Donare Vita",
        description:
          "{E} — Paga 2 {I} in meno per giocare il tuo prossimo personaggio per questo turno.",
      },
    ],
  },
  es: {
    name: "Corazón de la Atlántida",
    text: [
      {
        title: "DADOR DE VIDA",
        description: "{E}: pagas 2 {I} menos por el siguiente personaje que juegues en este turno.",
      },
    ],
  },
};
