import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const merlinTurtleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Merlin",
    version: "Turtle",
    text: [
      {
        title: "GIVE ME TIME TO THINK",
        description:
          "When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      },
    ],
  },
  de: {
    name: "Merlin",
    version: "Schildkröte",
    text: [
      {
        title: "GIB MIR ZEIT ZUM DENKEN",
        description:
          "Wenn du diesen Charakter ausspielst und wenn er das Spiel verlässt, schaue dir die obersten 2 Karten deines Decks an. Lege 1 davon auf dein Deck und die andere darunter.",
      },
    ],
  },
  fr: {
    name: "Merlin",
    version: "En tortue",
    text: [
      {
        title: "LAISSEZ-MOI Y RÉFLÉCHIR",
        description:
          "Lorsque vous jouez ce personnage, et lorsqu'il quitte le jeu, regardez les 2 cartes du dessus de votre pioche. Remettez-en une sur le dessus de votre pioche et l'autre en dessous.",
      },
    ],
  },
  it: {
    name: "Merlino",
    version: "Tartaruga",
    text: [
      {
        title: "DAMMI TEMPO DI PENSARE",
        description:
          "Quando giochi questo personaggio e quando lascia il gioco, guarda le prime 2 carte del tuo mazzo. Mettine una in cima e l'altra in fondo al tuo mazzo.",
      },
    ],
  },
};
