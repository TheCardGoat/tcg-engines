import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseExperiencedTravelerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Experienced Traveler",
    text: [
      {
        title: "LIGHTING THE WAY",
        description:
          "Whenever this character quests, if you played another character this turn, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Erfahrener Reisender",
    text: [
      {
        title: "Leuchtet den Weg",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, falls du in diesem Zug mindestens einen anderen Charakter ausgespielt hast, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Voyageur expérimenté",
    text: [
      {
        title: "Éclairer le chemin",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, si vous avez joué un autre personnage ce tour-ci, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Viaggiatore Esperto",
    text: [
      {
        title: "Illuminare il Cammino",
        description:
          "Ogni volta che questo personaggio va all'avventura, se hai giocato un altro personaggio in questo turno, puoi pescare una carta.",
      },
    ],
  },
};
