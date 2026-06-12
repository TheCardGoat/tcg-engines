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
        title: "LEBENSSPENDER",
        description:
          "— Du zahlst 2 weniger für den nächsten Charakter, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Cœur de l'Atlantide",
    text: [
      {
        title: "SOURCE DE VIE",
        description:
          "— Le prochain personnage que vous jouez durant ce tour vous coûte 2 de moins.",
      },
    ],
  },
  it: {
    name: "Il Cuore di Atlantide",
    text: [
      {
        title: "DONARE VITA",
        description: "— Paga 2 in meno per giocare il tuo prossimo personaggio per questo turno.",
      },
    ],
  },
};
