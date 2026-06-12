import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const youreWelcomeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "You're Welcome",
    text: "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
  },
  de: {
    name: "Voll gerne",
    text: "Mische einen Charakter, Gegenstand oder Ort deiner Wahl zurück in das zugehörige Deck. Wer jenen im Spiel hatte, zieht 2 Karten.",
  },
  fr: {
    name: "Pour les hommes",
    text: "Choisissez un personnage, un objet ou un lieu et mélangez-le dans la pioche de son propriétaire. Ce joueur pioche 2 cartes.",
  },
  it: {
    name: "Tranquilla",
    text: "(Un personaggio con costo 4 o superiore può per cantare questa canzone gratis.) Rimescola un personaggio, un oggetto o un luogo a tua scelta nel mazzo del suo giocatore. Quel giocatore pesca 2 carte.",
  },
};
