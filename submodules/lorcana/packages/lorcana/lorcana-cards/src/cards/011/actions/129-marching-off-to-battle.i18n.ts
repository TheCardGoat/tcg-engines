import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const marchingOffToBattleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Marching Off to Battle",
    text: "If a character was banished this turn, draw 2 cards.",
  },
  de: {
    name: "Marschier'n wir für den Kaiser",
    text: "Falls in diesem Zug ein Charakter verbannt wurde, ziehe 2 Karten.",
  },
  fr: {
    name: "Vers notre champ de bataille",
    text: "Si un personnage a été banni ce tour-ci, piochez 2 cartes.",
  },
  it: {
    name: "Marciamo Verso il Fronte",
    text: "(Un personaggio con costo 4 o superiore può per cantare questa canzone gratis.) Se un personaggio è stato esiliato in questo turno, pesca 2 carte.",
  },
};
