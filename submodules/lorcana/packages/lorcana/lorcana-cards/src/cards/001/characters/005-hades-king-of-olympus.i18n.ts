import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hadesKingOfOlympusI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hades",
    version: "King of Olympus",
    text: [
      {
        title: "Shift 6",
      },
      {
        title: "SINISTER PLOT",
        description:
          "This character gets +1 {L} for each other Villain character you have in play.",
      },
    ],
  },
  de: {
    name: "Hades",
    version: "König des Olymps",
    text: [
      {
        title:
          "<Gestaltwandel> 6 (Du kannst 6 {I} zahlen, um diesen Charakter auf einen deiner Hades Charaktere auszuspielen.)",
      },
      {
        title: "Finstere Verschwörung",
        description:
          "Dieser Charakter erhält +1 {L} für jede weitere Schurkin und jeden weiteren Schurken, die du im Spiel hast.",
      },
    ],
  },
  fr: {
    name: "HADES",
    version: "Roi de l'Olympe",
    text: "<Alter> 6 (Vous pouvez payer 6 {I} pour jouer ce personnage sur l'un de vos personnages Hadès.)\\SINISTRE COMPLOT\\ Ce personnage a + 1 {L} pour chaque autre personnage Méchant que vous avez en jeu.",
  },
  it: {
    name: "Hades",
    version: "King of Olympus",
    text: [
      {
        title:
          "<Shift> 6 (You may pay 6 {I} to play this on top of one of your characters named Hades.)",
      },
      {
        title: "Sinister Plot",
        description:
          "This character gets +1 {L} for each other Villain character you have in play.",
      },
    ],
  },
};
