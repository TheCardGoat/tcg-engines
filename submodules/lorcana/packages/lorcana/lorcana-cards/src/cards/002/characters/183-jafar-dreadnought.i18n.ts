import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jafarDreadnoughtI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jafar",
    version: "Dreadnought",
    text: [
      {
        title: "Shift 2",
      },
      {
        title: "NOW WHERE WERE WE?",
        description:
          "During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Dschafar",
    version: "Wüstenkreuzer",
    text: [
      {
        title:
          "<Gestaltwandel> 2 (Du kannst 2 {I} zahlen, um diesen Charakter auf einen deiner Dschafar-Charaktere auszuspielen.)",
      },
      {
        title: "Also, wo waren wir?",
        description:
          "Jedes Mal, wenn dieser Charakter in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Jafar",
    version: "Serpent cuirassé",
    text: [
      {
        title:
          "<Alter> 2 (Vous pouvez payer 2 {I} pour jouer ce personnage sur l'un de vos personnages Jafar.)",
      },
      {
        title: "Alors, où en étions-nous?",
        description:
          "Lorsque ce personnage en bannit un autre via un défi durant votre tour, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Jafar",
    version: "Dreadnought",
    text: [
      {
        title:
          "<Shift> 2 (You may pay 2 {I} to play this on top of one of your characters named Jafar.)",
      },
      {
        title: "Now Where Were We?",
        description:
          "During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
      },
    ],
  },
};
