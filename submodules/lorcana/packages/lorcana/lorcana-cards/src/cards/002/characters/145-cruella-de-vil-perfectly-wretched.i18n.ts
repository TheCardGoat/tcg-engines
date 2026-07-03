import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cruellaDeVilPerfectlyWretchedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cruella De Vil",
    version: "Perfectly Wretched",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "OH, NO YOU DON'T",
        description:
          "Whenever this character quests, chosen opposing character gets -2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Cruella De Vil",
    version: "Fühlt sich elend",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Cruella-De-Vil-Charaktere auszuspielen.)",
      },
      {
        title: "Oh nein, das wirst du nicht!",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, gib einem gegnerischen Charakter deiner Wahl in diesem Zug -2 {S}.",
      },
    ],
  },
  fr: {
    name: "Cruella d'Enfer",
    version: "Cruellement infecte",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages Cruella d'Enfer.)",
      },
      {
        title: "Oh non, pas question!",
        description:
          "Lorsque ce personnage est envoyé à l'aventure, choisissez un personnage adverse, il subit -2 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Cruella De Vil",
    version: "Perfectly Wretched",
    text: [
      {
        title:
          "<Shift> 3 (You may pay 3 {I} to play this on top of one of your characters named Cruella De Vil.)",
      },
      {
        title: "Oh, No You Don't",
        description:
          "Whenever this character quests, chosen opposing character gets -2 {S} this turn.",
      },
    ],
  },
};
