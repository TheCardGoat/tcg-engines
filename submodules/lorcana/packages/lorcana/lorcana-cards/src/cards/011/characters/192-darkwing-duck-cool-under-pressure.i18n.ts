import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const darkwingDuckCoolUnderPressureI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Darkwing Duck",
    version: "Cool Under Pressure",
    text: [
      {
        title: "Shift 5 {I}",
      },
      {
        title: "TAKE THAT!",
        description:
          "During your turn, whenever an item is banished, you may pay 1 {I} to deal 2 damage to chosen character.",
      },
      {
        title: "EVILDOERS BEWARE!",
        description: "This character can challenge ready Villain characters.",
      },
    ],
  },
  de: {
    name: "Darkwing Duck",
    version: "Cool unter Druck",
    text: [
      {
        title: "Gestaltwandel 5",
      },
      {
        title: "NIMM DAS!",
        description:
          "Jedes Mal während deines Zuges, wenn ein Gegenstand verbannt wird, darfst du 1 bezahlen, um einem Charakter deiner Wahl 2 Schaden zuzufügen.",
      },
      {
        title: "BÖSEWICHTE AUFGEPASST!",
        description: "Dieser Charakter kann bereite Schurken herausfordern.",
      },
    ],
  },
  fr: {
    name: "Myster Mask",
    version: "De glace face à la pression",
    text: [
      {
        title: "Alter 5",
      },
      {
        title: "PRENDS ÇA!",
        description:
          "Durant votre tour, chaque fois qu'un objet est banni, vous pouvez payer 1 pour choisir un personnage et lui infliger 2 dommages.",
      },
      {
        title: "MALFAITEURS, PRENEZ GARDE!",
        description: "Ce personnage peut défier des personnages Méchant redressés.",
      },
    ],
  },
  it: {
    name: "Darkwing Duck",
    version: "Calmo Sotto Pressione",
    text: [
      {
        title: "Trasformazione 5",
      },
      {
        title: "PRENDI QUESTO!",
        description:
          "Durante il tuo turno, ogni volta che un oggetto viene esiliato, puoi pagare 1 per infliggere 2 danni a un personaggio a tua scelta. BADATE A VOI, MALVAGI! Questo personaggio può sfidare i personaggi Cattivo preparati.",
      },
    ],
  },
};
