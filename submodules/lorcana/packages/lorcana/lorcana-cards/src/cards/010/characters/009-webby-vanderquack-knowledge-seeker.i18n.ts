import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const webbyVanderquackKnowledgeSeekerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Webby Vanderquack",
    version: "Knowledge Seeker",
    text: [
      {
        title: "I'VE READ ABOUT THIS",
        description:
          "While you have a character or location in play with a card under them, this character gets +1 {L}.",
      },
    ],
  },
  de: {
    name: "Nicky Vanderquack",
    version: "Wissenssucherin",
    text: [
      {
        title: "ICH HABE DAVON GELESEN",
        description:
          "Solange du einen Charakter oder Ort im Spiel hast, der eine Karte unter sich hat, erhält dieser Charakter +1.",
      },
    ],
  },
  fr: {
    name: "Zaza",
    version: "À la recherche de connaissance",
    text: [
      {
        title: "J'AI LU QUELQUE CHOSE LÀ-DESSUS",
        description:
          "Tant que vous avez un personnage ou un lieu en jeu avec une carte sous lui, ce personnage-ci gagne +1.",
      },
    ],
  },
  it: {
    name: "Gaia Vanderquack",
    version: "Cercatrice di Conoscenza",
    text: [
      {
        title: "HO LETTO QUALCOSA IN MERITO",
        description:
          "Mentre hai in gioco un personaggio o un luogo con una carta sotto di sé, questo personaggio riceve +1.",
      },
    ],
  },
};
