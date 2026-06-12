import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const minnieMouseDrumMajorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Minnie Mouse",
    version: "Drum Major",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "PARADE ORDER",
        description:
          "When you play this character, if you used Shift to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
      },
    ],
  },
  de: {
    name: "Minnie Maus",
    version: "Tambourmajorin",
    text: [
      {
        title: "Gestaltwandel 4",
      },
      {
        title: "REIHENFOLGE DER PARADE",
        description:
          "Falls du Gestaltwandel benutzt hast, um diesen Charakter auszuspielen, darfst du dein Deck nach einer Charakterkarte durchsuchen und diese allen Mitspielenden zeigen. Mische danach dein Deck und lege die gewählte Karte als oberste Karte auf dein Deck.",
      },
    ],
  },
  fr: {
    name: "Minnie",
    version: "Tambour-major",
    text: [
      {
        title: "Alter 4",
      },
      {
        title: "CHEFFE DE LA FANFARE",
        description:
          "Si vous jouez ce personnage en utilisant sa capacité Alter, vous pouvez chercher une carte Personnage dans votre pioche et la révéler à tous les joueurs. Mélangez votre pioche puis placez la carte révélée sur le dessus.",
      },
    ],
  },
  it: {
    name: "Minni",
    version: "Capobanda",
    text: [
      {
        title: "Trasformazione 4",
      },
      {
        title: "ORDINE DI MARCIA",
        description:
          "Quando giochi questo personaggio, se hai usato Trasformazione per giocarlo, puoi cercare una carta personaggio nel tuo mazzo e rivelare quella carta a tutti i giocatori. Rimescola il tuo mazzo e metti quella carta in cima ad esso.",
      },
    ],
  },
};
