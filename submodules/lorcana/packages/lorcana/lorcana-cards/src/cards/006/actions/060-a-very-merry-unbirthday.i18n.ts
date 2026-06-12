import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aVeryMerryUnbirthdayI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "A Very Merry Unbirthday",
    text: "Each opponent puts the top 2 cards of their deck into their discard.",
  },
  de: {
    name: "Viel Glück zum Nichtgeburtstag",
    text: "Alle gegnerischen Mitspielenden legen die obersten 2 Karten ihres Decks auf ihren Ablagestapel.",
  },
  fr: {
    name: "Un Joyeux non-anniversaire",
    text: "Chaque adversaire place les 2 cartes du dessus de sa pioche dans sa défausse.",
  },
  it: {
    name: "Un Buon Non Compleanno",
    text: "(Un personaggio con costo 1 o superiore può per cantare questa canzone gratis.) Ogni avversario mette le prime 2 carte del suo mazzo nei suoi scarti.",
  },
};
