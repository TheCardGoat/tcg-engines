import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const plutoVigilantTravelerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pluto",
    version: "Vigilant Traveler",
    text: [
      {
        title: "BEWARE OF DOG",
        description:
          "Whenever this character quests, if you played another character this turn, chosen opposing character gets -1 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Pluto",
    version: "Aufmerksamer Reisender",
    text: [
      {
        title: "Vorsicht vor dem Hund",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, falls du in diesem Zug mindestens einen anderen Charakter ausgespielt hast, erhält ein gegnerischer Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -1 {S}.",
      },
    ],
  },
  fr: {
    name: "Pluto",
    version: "Voyageur vigilant",
    text: [
      {
        title: "Attention au chien",
        description:
          "Lorsque ce personnage est envoyé à l'aventure, si vous avez joué un autre personnage ce tour-ci, choisissez un personnage adverse qui subit -1 {S} jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Pluto",
    version: "Viaggiatore Attento",
    text: [
      {
        title: "Attenti al Cane",
        description:
          "Ogni volta che questo personaggio va all'avventura, se hai giocato un altro personaggio in questo turno, un personaggio avversario a tua scelta riceve -1 {S} fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
