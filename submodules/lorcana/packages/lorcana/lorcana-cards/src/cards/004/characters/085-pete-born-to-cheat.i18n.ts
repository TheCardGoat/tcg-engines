import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peteBornToCheatI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pete",
    version: "Born to Cheat",
    text: [
      {
        title: "I CLOBBER YOU!",
        description:
          "Whenever this character quests while he has 5 {S} or more, return chosen character with 2 {S} or less to their player's hand.",
      },
    ],
  },
  de: {
    name: "Kater Karlo",
    version: "Gemeiner Hund",
    text: [
      {
        title: "Ich mache dich fertig!",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, solange er 5 oder mehr {S} hat, schicke einen Charakter deiner Wahl mit 2 oder weniger {S}, auf die zugehörige Hand zurück.",
      },
    ],
  },
  fr: {
    name: "Pat",
    version: "Tricheur-né",
    text: [
      {
        title: "Je vais t'écraser!",
        description:
          "Si ce personnage a 5 {S} ou plus lorsqu'il est envoyé à l'aventure, choisissez un personnage avec 2 {S} ou moins et renvoyez-le dans la main de son propriétaire.",
      },
    ],
  },
  it: {
    name: "Gambadilegno",
    version: "Nato per Truffare",
    text: [
      {
        title: "Io ti Distruggo!",
        description:
          "Ogni volta che questo personaggio va all'avventura mentre ha 5 {S} o superiore, fai riprendere in mano al suo giocatore un personaggio a tua scelta con 2 {S} o inferiore.",
      },
    ],
  },
};
