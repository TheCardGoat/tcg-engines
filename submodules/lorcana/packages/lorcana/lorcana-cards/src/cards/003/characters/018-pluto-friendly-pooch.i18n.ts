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
        title: "Braver Junge",
        description:
          "{E} — Du zahlst 1 {I} weniger für den nächsten Charakter, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Pluto",
    version: "Gentil cabot",
    text: [
      {
        title: "Bon chien",
        description:
          "{E} — Le prochain personnage que vous jouez durant ce tour vous coûte 1 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Pluto",
    version: "Cane Amichevole",
    text: [
      {
        title: "Bravo Cagnolino",
        description:
          "{E} — Paga 1 {I} in meno per giocare il tuo prossimo personaggio per questo turno.",
      },
    ],
  },
};
