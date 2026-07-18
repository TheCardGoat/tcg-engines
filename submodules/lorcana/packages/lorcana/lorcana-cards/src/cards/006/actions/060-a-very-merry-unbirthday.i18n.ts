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
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 1 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Chaque adversaire place les 2 cartes du dessus de sa pioche dans sa défausse.",
      },
    ],
  },
  it: {
    name: "Un Buon Non Compleanno",
    text: [
      {
        title:
          "(Un personaggio con costo 1 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Ogni avversario mette le prime 2 carte del suo mazzo nei suoi scarti.",
      },
    ],
  },
  es: {
    name: "Un muy feliz cumpleaños",
    text: "Cada oponente pone las 2 primeras cartas de su mazo en su descarte.",
  },
};
