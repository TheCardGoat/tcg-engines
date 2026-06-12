import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const donaldDuckDistractedTravelerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Donald Duck",
    version: "Distracted Traveler",
    text: [
      {
        title: "BURNING CURIOSITY",
        description:
          "Whenever this character quests, if you played another character this turn, each opponent chooses and discards a card.",
      },
    ],
  },
  de: {
    name: "Donald Duck",
    version: "Abgelenkter Reisender",
    text: [
      {
        title: "Brennende Neugier",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, falls du in diesem Zug mindestens einen anderen Charakter ausgespielt hast, wählen alle gegnerischen Mitspielenden je 1 Karte aus ihrer Hand und werfen sie ab.",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Voyageur distrait",
    text: [
      {
        title: "Curiosité brûlante",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, si vous avez joué un autre personnage ce tour-ci, chaque adversaire défausse une carte.",
      },
    ],
  },
  it: {
    name: "Paperino",
    version: "Viaggiatore Distratto",
    text: [
      {
        title: "Curiosità Irrefrenabile",
        description:
          "Ogni volta che questo personaggio va all'avventura, se hai giocato un altro personaggio in questo turno, ogni avversario sceglie e scarta una carta.",
      },
    ],
  },
};
