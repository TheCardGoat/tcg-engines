import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cogsworthGrandfatherClockI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cogsworth",
    version: "Grandfather Clock",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "Ward",
      },
      {
        title: "UNWIND",
        description: "Your other characters gain Resist +1",
      },
    ],
  },
  de: {
    name: "Von Unruh",
    version: "Standuhr",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Von-Unruh-Charaktere auszuspielen.)",
      },
      {
        title: "<Behütet>",
      },
      {
        title: "Entschleunigen",
        description:
          "Deine anderen Charaktere erhalten <Robust> +1 (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Big Ben",
    version: "Grand-père Horloge",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages Big Ben.)",
      },
      {
        title: "<Hors d'atteinte>",
      },
      {
        title: "Reposé",
        description: "Vos autres personnages gagnent <Résistance> +1.",
      },
    ],
  },
  it: {
    name: "Cogsworth",
    version: "Grandfather Clock",
    text: [
      {
        title:
          "<Shift> 3 (You may pay 3 {I} to play this on top of one of your characters named Cogsworth.)",
      },
      {
        title: "<Ward> (Opponents can't choose this character except to challenge.)",
      },
      {
        title: "Unwind",
        description:
          "Your other characters gain <Resist> +1 (Damage dealt to them is reduced by 1.)",
      },
    ],
  },
};
