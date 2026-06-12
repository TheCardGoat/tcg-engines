import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const comeOutAndFightI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Come Out and Fight!",
    text: "Put all cards from under chosen character, item, or location on the bottom of their player's deck in a random order. Draw a card.",
  },
  de: {
    name: "Komm heraus und kämpfe!",
    text: "Wähle einen Charakter, Gegenstand oder Ort und lege alle Karten, welche darunter liegen, in zufälliger Reihenfolge unter das Deck der Person, die ihn im Spiel hat. Ziehe 1 Karte.",
  },
  fr: {
    name: "Viens te battre !",
    text: "Choisissez un personnage, un objet ou un lieu et placez toutes les cartes qui sont sous lui, sous la pioche de son propriétaire, dans un ordre aléatoire. Piochez une carte.",
  },
  it: {
    name: "Vieni Fuori e Combatti!",
    text: "Metti tutte le carte sotto a un personaggio, un oggetto o un luogo a tua scelta in fondo al mazzo del suo giocatore, in ordine casuale. Pesca una carta.",
  },
};
