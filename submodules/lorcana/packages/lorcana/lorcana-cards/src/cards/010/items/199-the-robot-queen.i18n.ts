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
        title: "Letzter Akt",
        description:
          "Jedes Mal, wenn du einen Charakter ausspielst, darfst du 1 {I} bezahlen und diesen Gegenstand verbannen, um einem Charakter deiner Wahl 2 Schaden zuzufügen.",
      },
    ],
  },
  fr: {
    name: "La Reine robot",
    text: [
      {
        title: "Dysfonctionnement majeur",
        description:
          "Chaque fois que vous jouez un personnage, vous pouvez payer 1 {I} et bannir cet objet pour choisir un personnage et lui infliger 2 dommages.",
      },
    ],
  },
  it: {
    name: "La Regina Robot",
    text: [
      {
        title: "Grave Malfunzionamento",
        description:
          "Ogni volta che giochi un personaggio, puoi pagare 1 {I} ed esiliare questo oggetto per infliggere 2 danni a un personaggio a tua scelta.",
      },
    ],
  },
  es: {
    name: "La reina robot",
    text: [
      {
        title: "MAL FUNCIONAMIENTO MAYOR",
        description:
          "Siempre que juegues con un personaje, puedes pagar 1 {I} y desterrar este objeto para causar 2 daños al personaje elegido.",
      },
    ],
  },
};
