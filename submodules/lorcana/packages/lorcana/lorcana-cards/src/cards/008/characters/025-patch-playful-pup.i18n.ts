import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const patchPlayfulPupI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Patch",
    version: "Playful Pup",
    text: [
      {
        title: "Ward",
      },
      {
        title: "PUPPY BARKING",
        description: "While you have another Puppy character in play, this character gets +1 {L}.",
      },
    ],
  },
  de: {
    name: "Patch",
    version: "Verspielter Welpe",
    text: [
      {
        title: "Behütet",
      },
      {
        title: "WELPENBELLEN",
        description:
          "Solange du mindestens einen weiteren Welpen im Spiel hast, erhält dieser Charakter +1.",
      },
    ],
  },
  fr: {
    name: "Patch",
    version: "Chiot joueur",
    text: [
      {
        title: "Hors d'atteinte",
      },
      {
        title: "ABOIEMENTS DE CHIOT",
        description:
          "Tant que vous avez un autre personnage Chiot en jeu, ce personnage-ci gagne +1.",
      },
    ],
  },
  it: {
    name: "Macchia",
    version: "Cucciolo Giocherellone",
    text: [
      {
        title: "Protetto",
      },
      {
        title: "LATRATO DEI CUCCIOLI",
        description:
          "Mentre hai in gioco un altro personaggio Cucciolo, questo personaggio riceve +1.",
      },
    ],
  },
};
