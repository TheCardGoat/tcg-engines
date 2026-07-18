import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const oneJumpAheadI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "One Jump Ahead",
    text: "Put the top card of your deck into your inkwell facedown and exerted.",
  },
  de: {
    name: "Schnell weg!",
    text: "Lege die oberste Karte deines Decks verdeckt und erschöpft in deinen Tintenvorrat.",
  },
  fr: {
    name: "JE VOLE",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Placez la première carte de votre pioche dans votre réserve d'encre, face cachée et épuisée.",
      },
    ],
  },
  it: {
    name: "One Jump Ahead",
    text: "Put the top card of your deck into your inkwell facedown and exerted.",
  },
  es: {
    name: "Un salto adelante",
    text: "Coloque la carta superior de su mazo en su tintero boca abajo y ejerza.",
  },
};
