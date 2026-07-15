import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hammPiggyBankI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hamm",
    version: "Piggy Bank",
    text: [
      {
        title: "LOOSE CHANGE",
        description: "{E} — You pay 1 {I} less for the next character you play this turn.",
      },
    ],
  },
  de: {
    name: "Specki",
    version: "Sparschwein",
    text: [
      {
        title: "Kleingeld",
        description:
          "{E} — Du zahlst 1 {I} weniger für den nächsten Charakter, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Bayonne",
    version: "Tirelire cochon",
    text: [
      {
        title: "Petite monnaie",
        description:
          "{E} — Le prochain personnage que vous jouez ce tour-ci vous coûte 1 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Hamm",
    version: "Maialino Salvadanaio",
    text: [
      {
        title: "Spiccioli",
        description:
          "{E} — Paga 1 {I} in meno per giocare il tuo prossimo personaggio per questo turno.",
      },
    ],
  },
};
