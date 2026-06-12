import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const nathanielFlintNotoriousPirateI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Nathaniel Flint",
    version: "Notorious Pirate",
    text: [
      {
        title: "PREDATORY INSTINCT",
        description:
          "You can't play this character unless an opposing character took damage this turn.",
      },
    ],
  },
  de: {
    name: "Käpt'n Flint",
    version: "Berüchtigter Pirat",
    text: [
      {
        title: "RAUBTIERINSTINKT",
        description:
          "Du kannst diesen Charakter nicht ausspielen, außer in diesem Zug wurde ein gegnerischer Charakter beschädigt.",
      },
    ],
  },
  fr: {
    name: "Nathaniel Flint",
    version: "Illustre pirate",
    text: [
      {
        title: "INSTINCT DE PRÉDATEUR",
        description:
          "Vous ne pouvez pas jouer ce personnage sauf si un personnage adverse a subi un dommage ou plus ce tour-ci.",
      },
    ],
  },
  it: {
    name: "Nathaniel Flint",
    version: "Famigerato Pirata",
    text: [
      {
        title: "ISTINTO PREDATORIO",
        description:
          "Non puoi giocare questo personaggio a meno che un personaggio avversario non sia stato danneggiato in questo turno.",
      },
    ],
  },
};
