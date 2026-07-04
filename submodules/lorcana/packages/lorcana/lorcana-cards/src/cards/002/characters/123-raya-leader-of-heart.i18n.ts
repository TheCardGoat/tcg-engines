import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rayaLeaderOfHeartI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Raya",
    version: "Leader of Heart",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "CHAMPION OF KUMANDRA",
        description:
          "Whenever this character challenges a damaged character, she takes no damage from the challenge.",
      },
    ],
  },
  de: {
    name: "Raya",
    version: "Anführerin von Herz",
    text: [
      {
        title:
          "<Gestaltwandel> 4 (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Raya-Charaktere auszuspielen.)",
      },
      {
        title: "Champion von Kumandra",
        description:
          "Dieser Charakter erhält keinen Schaden durch Herausforderungen, während er einen beschädigten Charakter herausfordert.",
      },
    ],
  },
  fr: {
    name: "Raya",
    version: "Cheffe des Terres de Cœur",
    text: [
      {
        title:
          "<Alter> 4 (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages Raya.)",
      },
      {
        title: "Championne de Kumandra",
        description:
          "Ce personnage ne subit aucun dommage lorsque qu'il défie un personnage blessé.",
      },
    ],
  },
  it: {
    name: "Raya",
    version: "Leader of Heart",
    text: [
      {
        title:
          "<Shift> 4 (You may pay 4 {I} to play this on top of one of your characters named Raya.)",
      },
      {
        title: "Champion of Kumandra",
        description:
          "Whenever this character challenges a damaged character, she takes no damage from the challenge.",
      },
    ],
  },
};
