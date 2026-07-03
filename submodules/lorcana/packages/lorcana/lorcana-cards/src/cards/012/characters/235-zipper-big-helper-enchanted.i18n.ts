import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const zipperBigHelperEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Zipper",
    version: "Big Helper",
    text: [
      {
        title: "Shift 2 {I}",
      },
      {
        title: "BUZZING ENTHUSIASM",
        description:
          "Whenever this character quests, you may add his {W} to another chosen character's {S} this turn.",
      },
    ],
  },
  de: {
    name: "Summi",
    version: "Großer Helfer",
    text: [
      {
        title: "<Gestaltwandel> 2 {I}",
      },
      {
        title: "Summende Begeisterung",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {W} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.",
      },
    ],
  },
  fr: {
    name: "Ruzor",
    version: "Assistant majuscule",
    text: [
      {
        title: "<Alter> 2 {I}",
      },
      {
        title: "Enthousiasme bourdonnant",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {W} à la {S} d'un autre personnage de votre choix pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Zipper",
    version: "Grosso Aiutante",
    text: [
      {
        title: "<Trasformazione> 2 {I}",
      },
      {
        title: "Ronzio d'Entusiasmo",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {W} alla {S} di un altro personaggio a tua scelta per questo turno.",
      },
    ],
  },
};
