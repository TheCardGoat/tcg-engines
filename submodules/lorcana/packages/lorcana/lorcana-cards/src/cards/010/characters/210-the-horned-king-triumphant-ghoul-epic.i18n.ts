import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theHornedKingTriumphantGhoulEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Horned King",
    version: "Triumphant Ghoul",
    text: [
      {
        title: "GRAND MACHINATIONS",
        description:
          "During your turn, if 1 or more cards have left a player's discard this turn, this character gets +2 {L}.",
      },
    ],
  },
  de: {
    name: "Der gehörnte König",
    version: "Siegreicher Ghul",
    text: [
      {
        title: "GROSSE MACHENSCHAFTEN",
        description:
          "Solange in deinem Zug 1 oder mehr Karten einen Ablagestapel verlassen haben, erhält dieser Charakter +2.",
      },
    ],
  },
  fr: {
    name: "Le Seigneur des Ténèbres",
    version: "Goule triomphante",
    text: [
      {
        title: "MACHINATIONS GRANDIOSES",
        description:
          "Durant votre tour, si 1 carte ou plus a quitté la défausse d'un joueur ce tour-ci, ce personnage gagne +2.",
      },
    ],
  },
  it: {
    name: "Re Cornelius",
    version: "Ghoul Trionfante",
    text: [
      {
        title: "GRANDIOSI COMPLOTTI",
        description:
          "Durante il tuo turno, se 1 o più carte hanno lasciato gli scarti di un giocatore in questo turno, questo personaggio riceve +2.",
      },
    ],
  },
};
