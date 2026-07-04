import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const helgaSinclairFemmeFataleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Helga Sinclair",
    version: "Femme Fatale",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "THIS CHANGES EVERYTHING",
        description:
          "Whenever this character quests, you may deal 3 damage to chosen damaged character.",
      },
    ],
  },
  de: {
    name: "Helga Sinclair",
    version: "Femme Fatale",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Helga-Sinclair-Charaktere auszuspielen.)",
      },
      {
        title: "Dadurch ändert sich alles",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du einem beschädigten Charakter deiner Wahl 3 Schaden zufügen.",
      },
    ],
  },
  fr: {
    name: "Helga Sinclair",
    version: "Femme fatale",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages Helga Sinclair.)",
      },
      {
        title: "Ça change beaucoup de choses",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez choisir un personnage blessé et lui infliger 3 dommages.",
      },
    ],
  },
  it: {
    name: "Helga Sinclair",
    version: "Femme Fatale",
    text: [
      {
        title:
          "<Trasformazione> 3 (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Helga Sinclair.)",
      },
      {
        title: "Questo Cambia Tutto",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi infliggere 3 danni a un personaggio danneggiato a tua scelta.",
      },
    ],
  },
};
