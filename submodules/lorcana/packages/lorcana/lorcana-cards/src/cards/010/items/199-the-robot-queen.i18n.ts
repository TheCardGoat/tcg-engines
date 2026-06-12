import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theRobotQueenI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Robot Queen",
    text: [
      {
        title: "MAJOR MALFUNCTION",
        description:
          "Whenever you play a character, you may pay 1 {I} and banish this item to deal 2 damage to chosen character.",
      },
    ],
  },
  de: {
    name: "Die Robo-Königin",
    text: [
      {
        title: "LETZTER AKT",
        description:
          "Jedes Mal, wenn du einen Charakter ausspielst, darfst du 1 bezahlen und diesen Gegenstand verbannen, um einem Charakter deiner Wahl 2 Schaden zuzufügen.",
      },
    ],
  },
  fr: {
    name: "La Reine robot",
    text: [
      {
        title: "DYSFONCTIONNEMENT MAJEUR",
        description:
          "Chaque fois que vous jouez un personnage, vous pouvez payer 1 et bannir cet objet pour choisir un personnage et lui infliger 2 dommages.",
      },
    ],
  },
  it: {
    name: "La Regina Robot",
    text: [
      {
        title: "GRAVE MALFUNZIONAMENTO",
        description:
          "Ogni volta che giochi un personaggio, puoi pagare 1 ed esiliare questo oggetto per infliggere 2 danni a un personaggio a tua scelta.",
      },
    ],
  },
};
