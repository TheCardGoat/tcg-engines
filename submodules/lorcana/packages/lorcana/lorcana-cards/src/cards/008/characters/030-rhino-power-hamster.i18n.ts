import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rhinoPowerHamsterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rhino",
    version: "Power Hamster",
    text: [
      {
        title: "Shift 2",
      },
      {
        title: "EPIC BALL OF AWESOME",
        description: "While this character has no damage, he gains Resist +2.",
      },
    ],
  },
  de: {
    name: "Dino",
    version: "Energiegeladener Hamster",
    text: [
      {
        title:
          "<Gestaltwandel> 2 (Du kannst 2 {I} zahlen, um diesen Charakter auf einen deiner Dino-Charaktere auszuspielen.)",
      },
      {
        title: "Epischer Ball der Grossartigkeit",
        description:
          "Solange dieser Charakter unbeschädigt ist, erhält er <Robust> +2. (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Rhino",
    version: "Hamster survolté",
    text: [
      {
        title:
          "<Alter> 2 (Vous pouvez payer 2 {I} pour jouer ce personnage sur l'un de vos personnages Rhino.)",
      },
      {
        title: "Boule super géniale",
        description: "Tant que ce personnage n'a aucun dommage sur lui, il gagne <Résistance> +2.",
      },
    ],
  },
  it: {
    name: "Rhino",
    version: "Criceto Potenziato",
    text: [
      {
        title:
          "<Trasformazione> 2 (Puoi pagare 2 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Rhino.)",
      },
      {
        title: "Palla Epica e Pazzesca",
        description: "Mentre questo personaggio non ha danno, ottiene <Resistere> +2.",
      },
    ],
  },
};
