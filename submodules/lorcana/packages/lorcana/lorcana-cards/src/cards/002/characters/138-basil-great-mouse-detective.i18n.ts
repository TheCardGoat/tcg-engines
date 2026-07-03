import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const basilGreatMouseDetectiveI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Basil",
    version: "Great Mouse Detective",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "THERE'S ALWAYS",
        description:
          "A CHANCE If you used Shift to play this character, you may draw 2 cards when he enters play.",
      },
    ],
  },
  de: {
    name: "Basil",
    version: "Der große Mäusedetektiv",
    text: [
      {
        title:
          "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Basil-Charaktere auszuspielen.)",
      },
      {
        title: "Es gibt immer eine Chance",
        description:
          "Falls du <Gestaltwandel> benutzt hast, um diesen Charakter auszuspielen, darfst du beim Ausspielen 2 Karten ziehen.",
      },
    ],
  },
  fr: {
    name: "Basil",
    version: "Détective Privé",
    text: [
      {
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages Basil.)",
      },
      {
        title: "Tant qu'il y a de la vie, il y a de l'espoir",
        description:
          "Si vous utilisez <Alter> pour jouer ce personnage, vous pouvez piocher 2 cartes lorsqu'il entre en jeu.",
      },
    ],
  },
  it: {
    name: "Basil",
    version: "Great Mouse Detective",
    text: [
      {
        title:
          "<Shift> 5 (You may pay 5 {I} to play this on top of one of your characters named Basil.)",
      },
      {
        title: "There's Always a Chance",
        description:
          "If you used <Shift> to play this character, you may draw 2 cards when he enters play.",
      },
    ],
  },
};
