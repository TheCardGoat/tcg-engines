import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const plutoFriendlyPoochI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pluto",
    version: "Friendly Pooch",
    text: [
      {
        title: "GOOD DOG",
        description: "{E} — You pay 1 {I} less for the next character you play this turn.",
      },
    ],
  },
  de: {
    name: "Pluto",
    version: "Freundliches Hündchen",
    text: [
      {
        title: "BRAVER JUNGE",
        description:
          "— Du zahlst 1 weniger für den nächsten Charakter, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Pluto",
    version: "Gentil cabot",
    text: [
      {
        title: "BON CHIEN",
        description:
          "— Le prochain personnage que vous jouez durant ce tour vous coûte 1 de moins.",
      },
    ],
  },
  it: {
    name: "Pluto",
    version: "Cane Amichevole",
    text: [
      {
        title: "BRAVO CAGNOLINO",
        description: "— Paga 1 in meno per giocare il tuo prossimo personaggio per questo turno.",
      },
    ],
  },
};
