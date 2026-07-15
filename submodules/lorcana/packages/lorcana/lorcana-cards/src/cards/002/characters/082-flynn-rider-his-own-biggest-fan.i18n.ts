import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const flynnRiderHisOwnBiggestFanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Flynn Rider",
    version: "His Own Biggest Fan",
    text: [
      {
        title: "Shift 2",
      },
      {
        title: "Evasive",
      },
      {
        title: "ONE LAST, BIG SCORE",
        description: "This character gets -1 {L} for each card in your opponents' hands.",
      },
    ],
  },
  de: {
    name: "Flynn Rider",
    version: "Sein eigener größter Fan",
    text: [
      {
        title:
          "<Gestaltwandel> 2 (Du kannst 2 {I} zahlen, um diesen Charakter auf einen deiner Flynn-Rider-Charaktere auszuspielen.)",
      },
      {
        title: "<Wendig>",
      },
      {
        title: "Ein letzter, großer Coup",
        description:
          "Dieser Charakter erhält -1 {L} für jede Handkarte aller gegnerischen Mitspielenden.",
      },
    ],
  },
  fr: {
    name: "Flynn Rider",
    version: "Son plus grand fan",
    text: [
      {
        title:
          "<Alter> 2 (Vous pouvez payer 2 {I} pour jouer ce personnage sur l'un de vos personnages Flynn Rider.)",
      },
      {
        title: "<Insaisissable>",
      },
      {
        title: "Un dernier gros coup",
        description:
          "Ce personnage subit -1 {L} pour chaque carte dans les mains de vos adversaires.",
      },
    ],
  },
  it: {
    name: "Flynn Rider",
    version: "His Own Biggest Fan",
    text: [
      {
        title:
          "<Shift> 2 (You may pay 2 {I} to play this on top of one of your characters named Flynn Rider.)",
      },
      {
        title: "<Evasive> (Only characters with Evasive can challenge this character.)",
      },
      {
        title: "One Last, Big Score",
        description: "This character gets -1 {L} for each card in your opponents' hands.",
      },
    ],
  },
};
