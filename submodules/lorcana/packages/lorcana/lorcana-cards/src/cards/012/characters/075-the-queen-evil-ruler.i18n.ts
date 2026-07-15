import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theQueenEvilRulerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Queen",
    version: "Evil Ruler",
    text: [
      {
        title: "UNEQUALED CRUELTY",
        description: "While an opposing damaged character is in play, this character gets +2 {S}.",
      },
    ],
  },
  de: {
    name: "Die Königin",
    version: "Böse Herrscherin",
    text: [
      {
        title: "Unübertroffene Grausamkeit",
        description:
          "Solange ein gegnerischer beschädigter Charakter im Spiel ist, erhält dieser Charakter +2 {S}.",
      },
    ],
  },
  fr: {
    name: "La Reine",
    version: "Souveraine malfaisante",
    text: [
      {
        title: "Cruauté sans pareil",
        description:
          "Tant qu'un personnage adverse ayant au moins un dommage est en jeu, ce personnage-ci gagne +2 {S}.",
      },
    ],
  },
  it: {
    name: "Regina",
    version: "Sovrana Malvagia",
    text: [
      {
        title: "Crudeltà Ineguagliata",
        description:
          "Mentre un personaggio avversario danneggiato è in gioco, questo personaggio riceve +2 {S}.",
      },
    ],
  },
};
