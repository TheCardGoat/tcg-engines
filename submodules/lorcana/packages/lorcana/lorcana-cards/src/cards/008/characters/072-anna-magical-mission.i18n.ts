import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const annaMagicalMissionI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Anna",
    version: "Magical Mission",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "Support",
      },
      {
        title: "COORDINATED PLAN",
        description:
          "Whenever this character quests, if you have a character named Elsa in play, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Anna",
    version: "Magische Mission",
    text: [
      {
        title:
          "<Gestaltwandel> 4 (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Anna-Charaktere auszuspielen.)",
      },
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Koordinierter Plan",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, falls du einen Elsa-Charakter im Spiel hast, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Anna",
    version: "En mission magique",
    text: [
      {
        title:
          "<Alter> 4 (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages Anna.)",
      },
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Plan coordonné",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, si vous avez un personnage nommé Elsa en jeu, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Anna",
    version: "In Missione Magica",
    text: [
      {
        title:
          "<Trasformazione> 4 (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Anna.)",
      },
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Piano Coordinato",
        description:
          "Ogni volta che questo personaggio va all'avventura, se hai in gioco un personaggio chiamato Elsa, puoi pescare una carta.",
      },
    ],
  },
};
