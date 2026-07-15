import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const beastTragicHeroI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Beast",
    version: "Tragic Hero",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "IT'S BETTER THIS WAY",
        description:
          "At the start of your turn, if this character has no damage, draw a card. Otherwise, he gets +4 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Biest",
    version: "Tragischer Held",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Biest-Charaktere auszuspielen.)",
      },
      {
        title: "Vielleicht ist es so besser",
        description:
          "Ziehe zu Beginn deines Zuges 1 Karte, falls dieser Charakter unbeschädigt ist. Ist er beschädigt, erhält er in diesem Zug +4 {S}.",
      },
    ],
  },
  fr: {
    name: "La Bête",
    version: "Héros tragique",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages La Bête.)",
      },
      {
        title: "C'est peut-être mieux comme ça",
        description:
          "Si ce personnage n'a aucun jeton dommage sur lui au début de votre tour, piochez une carte. Sinon, il gagne +4 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Beast",
    version: "Tragic Hero",
    text: [
      {
        title:
          "<Shift> 3 (You may pay 3 {I} to play this on top of one of your characters named Beast.)",
      },
      {
        title: "It's Better This Way",
        description:
          "At the start of your turn, if this character has no damage, draw a card. Otherwise, he gets +4 {S} this turn.",
      },
    ],
  },
};
